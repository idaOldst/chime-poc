import { useStore } from "@data-access/state-management";
import { useEffect, useRef, useState } from "react";
import { useEventResponseTimeout } from "./useEventResponseTimeout";

interface IHandleEventReferenceId<T> {
    apiFn: (data: T) => Promise<{ referenceId: string; entity: string }>;
    onError?: (error: Error) => void;
    onSuccess?: (data: T, referenceId: string) => void;
}

const useHandleEventReferenceId = <T>({
    apiFn, onError, onSuccess
}: IHandleEventReferenceId<T>) => {
    const queueReferenceId = useRef<string>('');

    useEventResponseTimeout(queueReferenceId.current);

    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const addEventReference = useStore((state) => state.addEventReference);
    const eventReference = useStore(state => state.referenceQueue);

    useEffect(() => {
        const currentReferenceId = queueReferenceId.current;

        if (currentReferenceId && eventReference[currentReferenceId] && eventReference[currentReferenceId].status === 'success') {
            if (onSuccess) {
                onSuccess(eventReference[currentReferenceId].data as T, currentReferenceId);
            }
        }

        if (!eventReference[currentReferenceId]) {
            setIsProcessing(false);
        }
    }, [eventReference, queueReferenceId]);

    const handleSubmit = async (data: T) => {
        setIsProcessing(true);

        try {
            const { referenceId, entity } = await apiFn(data);

            queueReferenceId.current = referenceId;
            addEventReference(referenceId, {
                entity,
                status: 'pending'
            });
        } catch (err) {
            setIsProcessing(false);
            if (onError && err instanceof Error) {
                onError(err);
            }
        }
    }

    return {
        isProcessing,
        handleSubmit,
    }
}

export default useHandleEventReferenceId;