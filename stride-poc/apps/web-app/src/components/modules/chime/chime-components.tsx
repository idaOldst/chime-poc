
import {
    GlobalStyles,
    MeetingProvider,
    lightTheme
} from 'amazon-chime-sdk-component-library-react';
import { ThemeProvider } from 'styled-components';
import { TestChimeComponentLib } from './components';

const ChimeComponents = () => {
    return (
        <ThemeProvider theme={lightTheme}>
            <GlobalStyles />
            <MeetingProvider>
                <TestChimeComponentLib />
            </MeetingProvider>
        </ThemeProvider>
    )
}

export default ChimeComponents;