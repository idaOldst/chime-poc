import { useStore } from '@data-access/state-management';
import { useCallback, useEffect, useRef, useState } from 'react';

export function useEventSource(url: string) {
    const eventSource = useRef<{ connection: null | EventSource }>({ connection: null });
    const [isConnected, setIsConnected] = useState(false);

    const updateReferenceStatus = useStore(state => state.updateReferenceStatus);
    const removeEventReference = useStore(state => state.removeEventReference);
    const setFlashNotification = useStore(state => state.setFlashNotification);

    const setupEventSource = useCallback(() => {
        if (eventSource.current.connection) {
            eventSource.current.connection.close();
        }

        eventSource.current.connection = new EventSource(url);

        eventSource.current.connection.onopen = () => {
            console.log('SSE connection opened');
            setIsConnected(true);
        };

        eventSource.current.connection.onmessage = (event) => {
            let newMessage = parseMessage(event.data);

            // Heart beating...
            if (newMessage.type === 'heartbeat') return;

            if (Object.prototype.hasOwnProperty.call(newMessage, 'content')) {
                newMessage = parseMessage(newMessage.content);
            }

            const { statusCode, body } = newMessage as {
                statusCode: number,
                body: {
                    data: { errorMessage?: string },
                    referenceId: string
                }
            };

            if ([200, 201].includes(statusCode)) {
                updateReferenceStatus(body.referenceId, {
                    status: 'success',
                    data: body.data
                })
            } else {
                setFlashNotification({
                    message: body.data.errorMessage,
                    alertType: 'error',
                    duration: 5500
                })
                removeEventReference(body.referenceId);
            }

            setTimeout(() => {
                // after receving the message, delete message from in memory storage
                acknowledgeMessages(body.referenceId);
            }, 2000);
        };

        eventSource.current.connection.onerror = (error) => {
            console.error('EventSource failed:', error);
            setIsConnected(false);

            if (eventSource.current.connection) {
                eventSource.current.connection?.close();
            }
            setupEventSource();
        };
    }, [url]);

    const acknowledgeMessages = async (messageId: string) => {
        try {
            await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ messageIds: [messageId] })
            });
        } catch (error) {
            console.error('Failed to acknowledge messages:', error);
        }
    }

    useEffect(() => {
        setupEventSource();

        const handleVisibilityChange = () => {
            if (!document.hidden && eventSource.current.connection?.readyState === EventSource.CLOSED) {
                console.log('Tab is visible again. Reconnecting...');
                setupEventSource();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            if (eventSource.current.connection) {
                eventSource.current.connection?.close();
            }
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    const parseMessage = (message: string) => {
        try {
            // First, try parsing as is
            return JSON.parse(message);
        } catch (error) {
            // If that fails, try removing any potential extra quotes
            const cleanedData = message.replace(/^"|"$/g, '');
            return JSON.parse(cleanedData);
        }
    }
}