'use client';

import Head from "next/head";
import CreateOrJoin from '../../components/modules/meeting/CreateOrJoin';

import { darkTheme, MeetingProvider } from "amazon-chime-sdk-component-library-react";
import { ThemeProvider } from "styled-components";
import styles from "../../styles/Home.module.css";

export default function Home() {
    return (
        <ThemeProvider theme={darkTheme}>
            <MeetingProvider>
                <div className={styles.container}>
                    <Head>
                        <title>AWS Chime</title>
                    </Head>
                    <CreateOrJoin />
                </div>
            </MeetingProvider>
        </ThemeProvider>
    );
}
