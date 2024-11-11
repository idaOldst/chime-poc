import colors from '@ui-config/colors';
import cn from 'classnames';
import { Typography } from '../../data-display/typography/typography';
import { CheckboxOff, CheckboxOn } from '../../icons';
import styles from './checkbox.module.scss';

/* eslint-disable-next-line */
export interface CheckboxProps {
    isChecked?: boolean;
    onClick?: (value: boolean) => void;
    label: string;
    isDisabled?: boolean;
    color?: string;
}

export function Checkbox({
    isChecked = false,
    onClick,
    label = 'Placeholder',
    isDisabled = false,
    color,
}: CheckboxProps) {
    const handleClick = () => {
        if (!isDisabled) {
            onClick && onClick(!isChecked);
        }
    };

    return (
        <div
            className={styles['checkbox']}
            onClick={isDisabled ? undefined : handleClick}
        >
            <div>
                {isChecked ? (
                    <CheckboxOn
                        color={color || colors['Blue-500']}
                        size={20}
                        className={isDisabled ? 'opacity-10' : ''}
                    />
                ) : (
                    <CheckboxOff
                        color={color || colors['Black-200']}
                        size={20}
                        className={isDisabled ? 'opacity-10' : ''}
                    />
                )}
            </div>
            <Typography
                className={cn('whitespace-nowrap', {
                    'text-Black-500': isDisabled,
                })}
            >
                {label}
            </Typography>
        </div>
    );
}

export default Checkbox;
