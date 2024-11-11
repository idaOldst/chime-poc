'use client';

import { Typography } from "@components";
import CreateUser from "../../../components/modules/test-components/create-user/create-user";
import GetUser from "../../../components/modules/test-components/get-user/get-user";
import { useEventSource } from "../../../hooks/useEventSource";

const DashboardPage = () => {
    useEventSource('/api/events');

    return (
        <div className='space-y-10'>
            <Typography>
                DashboardPage
            </Typography>

            <GetUser />
            <CreateUser />
        </div>
    )
}

export default DashboardPage;