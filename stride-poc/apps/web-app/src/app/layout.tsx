import '@components/styles/index.scss';
import { NextPage } from 'next';
import FlashNotification from '../components/global/flash-notification/flash-notification';
import ReactQueryProvider from '../components/global/react-query/react-query-provder';
import { DEFAULT_METADATA } from '../config/metadata';
import { ILayout } from '../types/layout';
import './global.scss';

export const metadata = DEFAULT_METADATA;

const RootLayout: NextPage<ILayout> = async ({ children }) => {
    return (
        <html lang="en">
            <body>
                <ReactQueryProvider>{children}</ReactQueryProvider>
                <FlashNotification />
            </body>
        </html>
    );
}
export default RootLayout;