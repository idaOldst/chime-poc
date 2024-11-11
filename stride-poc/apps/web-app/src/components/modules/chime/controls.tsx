import {
    Camera,
    ControlBar,
    ControlBarButton,
    Microphone,
    Phone,
    useLocalVideo,
    useMeetingManager
} from 'amazon-chime-sdk-component-library-react';
import { useRouter } from "next/navigation";
import { useState } from 'react';

const Controls = () => {
    const [cameraActive, setCameraActive] = useState(false);
    const [micActive, setMicActive] = useState(false);
    const router = useRouter();
    const { toggleVideo } = useLocalVideo();
    const meetingManager = useMeetingManager();

    const cameraButtonProps = {
        icon: cameraActive ? <Camera /> : <Camera disabled />,
        onClick: async () => { await toggleVideo(); setCameraActive(!cameraActive); },
        label: 'Camera'
    };

    const micButtonProps = {
        icon: micActive ? <Microphone /> : <Microphone muted />,
        onClick: async () => {
            const audioVideo = meetingManager.audioVideo;
            if (micActive) {
                await audioVideo?.realtimeMuteLocalAudio();
            } else {
                await audioVideo?.realtimeUnmuteLocalAudio();
            }
            setMicActive(!micActive);
        },
        label: 'Microphone'
    };

    const hangUpButtonProps = {
        icon: <Phone />,
        onClick: async () => {
            await meetingManager.leave();
            router.refresh();
        },
        label: 'End'
    };
    return <ControlBar showLabels layout="bottom" className="absolute">
        <ControlBarButton {...cameraButtonProps} />
        <ControlBarButton {...micButtonProps} />
        <ControlBarButton {...hangUpButtonProps} />
    </ControlBar>
}

export default Controls;
