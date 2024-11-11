import type { StorybookConfig } from '@storybook/react-vite';

import path from 'path';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
    stories: ['../src/**/*.@(mdx|stories.@(js|jsx|ts|tsx))'],
    addons: ['@storybook/addon-essentials', '@storybook/addon-interactions'],
    framework: {
        name: '@storybook/react-vite',
        options: {},
    },
    docs: {
        autodocs: true,
    },
    staticDirs: ['../placeholders'],
    viteFinal: async (
        config //config
    ) =>
        mergeConfig(config, {
            resolve: {
                alias: {
                    '@ui-config': path.resolve(__dirname, '../../../frontend/ui-config/src'),
                    '@components': path.resolve(__dirname, '../../../frontend/components/src'),
                    '@components-types': path.resolve(__dirname, '../../../frontend/components/src/types'),
                    '@utils': path.resolve(__dirname, '../../../utils/src')
                },
            },
            server: {
                hmr: {
                    overlay: false,
                },
            },
        }),
};

export default config;

// To customize your Vite configuration you can use the viteFinal field.
// Check https://storybook.js.org/docs/react/builders/vite#configuration
// and https://nx.dev/recipes/storybook/custom-builder-configs
