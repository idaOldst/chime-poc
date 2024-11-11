import ENV from '@data-access/config';
import { NextRequest, NextResponse } from 'next/server';
import { addClient, getClients, removeClient } from './utils';

// Disable static generation
export const dynamic = 'force-dynamic';

// Store messages in memory (consider using a more persistent solution for production)
const HEARTBEAT_INTERVAL = parseInt(ENV.HEARTBEAT_INTERVAL as string) || 60000; // Send heartbeat internval
const IS_HEARTBEAT_ENABLED = JSON.parse(ENV.ENABLE_HEARTBEAT as string) || false;

let messages: { id: string; content: string }[] = [];

// Send received final response to client
export async function GET(request: NextRequest) {
    console.log('client count', getClients().length);
    let heartbeat: NodeJS.Timeout;

    const stream = new ReadableStream({
        start(controller) {
            messages.forEach(message => {
                console.log("🚀 ~ GET ~ message:", message);
                controller.enqueue(`data: ${message}\n\n`);
            });

            // Add client to list of controllers
            addClient(controller);

            if (IS_HEARTBEAT_ENABLED) {
                // Heartbeat to keep the connection alive
                heartbeat = setInterval(() => {
                    try {
                        const clientCount = getClients().length;

                        if (clientCount > 0) {
                            console.log(`Sending heartbeat - Connected clients: ${clientCount} - ${new Date().toISOString()}`);
                            controller.enqueue('data: {"type": "heartbeat"}\n\n');
                        }
                    } catch {
                        clearInterval(heartbeat);
                    }
                }, HEARTBEAT_INTERVAL);
            }

            controller.error = () => {
                console.log('ERROR');
            }

            // Handle connection close (when client disconnects)
            controller.close = () => {
                console.log('CLOSE')

                if (IS_HEARTBEAT_ENABLED) {
                    clearInterval(heartbeat); // Stop heartbeat when connection closes
                }

                removeClient(controller);
            };
        },
    });

    return new NextResponse(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    });
}

// To received final response
export async function POST(request: NextRequest) {
    const data = await request.json();
    console.log("🚀 ~ POST ~ data:", data)
    const message = JSON.stringify(data);

    // Store the message
    messages.push({
        id: data.body.referenceId,
        content: message
    });

    // Broadcast the received message to all connected clients
    const clients = getClients();
    const failedClients: ReadableStreamDefaultController[] = [];

    for (const client of clients) {
        try {
            client.enqueue(`data: ${message}\n\n`);
        } catch (error) {
            if (error instanceof Error && error.message.includes('Controller is already closed')) {
                console.log('Detected closed client, will remove');
                failedClients.push(client);
            } else {
                console.error('Error pushing event to client:', error);
            }
        }
    }

    // Remove failed clients
    failedClients.forEach(client => removeClient(client));

    return NextResponse.json({
        success: true,
        totalClients: clients.length,
        failedClients: failedClients.length
    });
}

// endpoint to acknowledge received messages
export async function DELETE(request: NextRequest) {
    const { messageIds } = await request.json();

    messages = messages.filter(message => !messageIds.includes(message.id));

    return NextResponse.json({ success: true });
}