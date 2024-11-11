/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 */

const SERVER_URL = 'http://localhost';

export function createMeetingRequest(meetingName, attendeeName) {
  return fetch('http://localhost:3000/api/chime', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        meetingId: meetingName,
        userId: attendeeName
    })
  }).then(j => j.json());
}
