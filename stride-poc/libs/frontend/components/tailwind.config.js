const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');
const colors = require('./src/styles/colors');
const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        join(
            __dirname,
            '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
        ),
        ...createGlobPatternsForDependencies(__dirname),
    ],
    theme: {
        colors: {
            ...colors,
            transparent: 'transparent',
        },
        extend: {
            fontFamily: {
                proximaNova: ['Proxima Nova', ...defaultTheme.fontFamily.serif],
            },
            keyframes: {
                shimmer: {
                    '0%': {
                        backgroundColor: '#EDEFF5',
                        opacity: '30%'
                    },
                    '100%': {
                        backgroundColor: '#C1C4D6',
                        opacity: '90%'
                    }
                }
            },
            animation: {
                shimmer: 'shimmer 1s linear infinite alternate',
            }
        },
    },
    plugins: [
        require('tailwind-scrollbar-hide'),
        function ({ addUtilities }) {
            addUtilities({
                '.flex-centered': {
                    '@apply flex items-center justify-center gap-2': {},
                },
                '.flex-spaced': {
                    '@apply flex justify-between': {},
                }
            })
        }
    ],
    presets: [require('../../../tailwind-workspace-preset.js')],
};
