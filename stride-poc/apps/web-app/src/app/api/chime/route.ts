import AWS from 'aws-sdk';
import { CreateMeetingResponse } from 'aws-sdk/clients/chime';
import { NextRequest, NextResponse } from 'next/server';

AWS.config.update({
    // accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    // secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    // sessionToken: process.env.AWS_SESSION_TOKEN, // if using temporary credentials
    region: 'eu-west-2'
});

const chime = new AWS.ChimeSDKMeetings();
chime.endpoint = new AWS.Endpoint('https://meetings-chime.eu-west-2.amazonaws.com');

const meetings: Record<string, CreateMeetingResponse> = {};

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { meetingId, userId } = body;
    console.log("🚀 ~ POST ~ { meetingId, userId }:", { meetingId, userId })

    try {
        // Add input validation
        if (!meetingId || !userId) {
            return NextResponse.json(
                { error: 'meetingId and userId are required' },
                { status: 400 }
            );
        }

        let meetingResponse;

        if (meetings[meetingId]) {
            meetingResponse = meetings[meetingId]
        } else {
            const meetingToken = 'client_' + meetingId;
            // Create a new meeting
            meetingResponse = await chime.createMeeting({
                ClientRequestToken: meetingToken,
                MediaRegion: 'eu-west-2',
                ExternalMeetingId: meetingToken
            }).promise();

            meetings[meetingId] = meetingResponse;
        }

        console.log("🚀 ~ POST ~ meetingResponse:", meetingResponse)

        if (!meetingResponse.Meeting?.MeetingId) {
            throw new Error('Failed to create meeting - no meeting ID returned');
        }

        // Create a new attendee for this meeting
        const attendeeResponse = await chime.createAttendee({
            MeetingId: meetingResponse.Meeting.MeetingId, // Now TypeScript knows this is a string
            ExternalUserId: userId, // should be a unique identifier for the user
        }).promise();
        console.log("🚀 ~ POST ~ attendeeResponse:", attendeeResponse)

        return NextResponse.json({
            Meeting: meetingResponse.Meeting,
            Attendee: attendeeResponse.Attendee,
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message });
        }
        return NextResponse.json({ error: 'An unknown error occurred' });
    }
}

export async function DELETE(request: NextRequest) {
    const { meetingId, attendeeId } = await request.json();

    if (!attendeeId) {
        await chime.deleteMeeting({
            MeetingId: meetingId
        });
        delete meetings[meetingId];

        return NextResponse.json({
            success: true
        })
    }

    await chime.deleteAttendee({
        MeetingId: meetingId,
        AttendeeId: attendeeId
    });
    return NextResponse.json({
        success: true
    })
}