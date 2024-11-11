import { Button } from "@components";
import { Flex, Heading, MeetingStatus, useMeetingManager, useMeetingStatus } from "amazon-chime-sdk-component-library-react";
import { MeetingSessionConfiguration } from "amazon-chime-sdk-js";
import { useEffect } from "react";
import Controls from "./controls";
import SampleLocalVideo from "./localVideo";
import Roster from "./roster";

const NoVideoRemoteView = <Flex container justifyContent="center" alignItems="center"><Heading level={4}>No one is sharing their video</Heading></Flex>;

const MeetingStatusLabels = {
    [MeetingStatus.Loading]: 'Loading',
    [MeetingStatus.Failed]: 'Failed',
    [MeetingStatus.Ended]: 'Ended',
    [MeetingStatus.Succeeded]: 'Succeeded',
}

export const TestChimeComponentLib = () => {
    const status = useMeetingStatus();
    console.log("🚀 ~ TestChimeComponentLib ~ status:", status)
    const meetingManager = useMeetingManager();

    useEffect(() => {
        return () => {
            meetingManager.leave(); // Cleanup on unmount
        }
    }, []);

    const joinMeeting = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.target as HTMLFormElement);
        const userId = formData.get('userId') as string;

        if (!userId) return;

        // Fetch the meeting and attendee data from your server application
        const response = await createMeeting(userId);

        // Initalize the `MeetingSessionConfiguration`
        const meetingSessionConfiguration = new MeetingSessionConfiguration(response.Meeting, response.Attendee);
        console.log("🚀 ~ joinMeeting ~ meetingSessionConfiguration:", meetingSessionConfiguration)

        // Create a `MeetingSession` using `join()` function with the `MeetingSessionConfiguration`
        await meetingManager.join(meetingSessionConfiguration);

        // At this point you could let users setup their devices, or by default
        // the SDK will select the first device in the list for the kind indicated
        // by `deviceLabels` (the default value is DeviceLabels.AudioAndVideo)

        // Start the `MeetingSession` to join the meeting
        await meetingManager.start();
    };

    const createMeeting = async (userId: string) => {
        const response = await fetch('/api/chime', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                meetingId: 'Chime-Oldst',
                userId
            })
        });
        return await response.json();
    }

    return (
        <>
            <div className='p-5'>
                <form onSubmit={joinMeeting} className='flex mb-2'>
                    <input name='userId' placeholder='userId' />
                    <Button label='Join' type='submit' />
                    {MeetingStatusLabels[status as keyof typeof MeetingStatusLabels]}
                </form>
            </div>

            <h3>Meeting Video</h3>
            {status === 1 && (
                <>
                    <div style={{ paddingBottom: '76px' }} className="full-space">
                        <SampleLocalVideo />
                    </div>
                    <Roster />
                    <Controls />
                </>
            )}
        </>
    )
}