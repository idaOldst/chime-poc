import {
    Roster,
    RosterAttendee,
    RosterGroup,
    useRosterState
} from 'amazon-chime-sdk-component-library-react';


const RosterComponent = () => {
    const { roster } = useRosterState();
    const attendees = Object.values(roster);

    const attendeeItems = attendees.map((attendee) => {
        const { chimeAttendeeId } = attendee;

        return (
            <RosterAttendee
                key={chimeAttendeeId}
                subtitle={chimeAttendeeId}
                attendeeId={chimeAttendeeId} />
        );
    });

    return (
        <Roster>
            <RosterGroup>{attendeeItems}</RosterGroup>
        </Roster>
    );
};

export default RosterComponent;