import {
    LocalVideo,
    useLocalVideo,
    useMeetingManager,
    useRemoteVideoTileState,
    VideoGrid,
    VideoTile
} from 'amazon-chime-sdk-component-library-react';

const SampleLocalVideo = () => {
    const remoteTiles = useRemoteVideoTileState();
    console.log("🚀 ~ SampleLocalVideo ~ tiles:", remoteTiles)
    const { tileId, isVideoEnabled, hasReachedVideoLimit, toggleVideo } = useLocalVideo();
    console.log("🚀 ~ SampleLocalVideo ~ tileId, isVideoEnabled, hasReachedVideoLimit:", tileId, isVideoEnabled, hasReachedVideoLimit)

    const meetingManager = useMeetingManager();

    const bindVideoTile = (tileId: number, videoElement: HTMLVideoElement) => {
        if (!tileId || !videoElement) {
            return;
        }

        const audioVideo = meetingManager.audioVideo;

        if (audioVideo) {
            audioVideo.bindVideoElement(tileId, videoElement);
        }
    };

    return (
        <div style={{ padding: '1rem', height: '70vh', boxSizing: 'border-box' }}>
            <VideoGrid>
                {tileId && (
                    <LocalVideo
                        id={`${tileId}`}
                        nameplate='me' />
                )}
                {remoteTiles.tiles.map(tile => (
                    <VideoTile
                        key={tile}
                        style={{
                            border: '1px solid grey',
                            gridArea: '',
                        }}
                        nameplate={'Tile ' + tile}
                        ref={(videoEl: HTMLVideoElement) => {
                            if (videoEl) {
                                bindVideoTile(tile, videoEl);
                            }
                        }}
                    />

                ))}
            </VideoGrid>
        </div>
    );
};

export default SampleLocalVideo