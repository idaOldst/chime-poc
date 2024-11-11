import clsx from 'classnames';
import { Close, Info } from '../../icons';
import { AlertType } from '../../types/alert';
import Typography from '../typography/typography';
import styles from './toast.module.scss';


export interface ToastProps {
    type?: AlertType;
    title?: string;
    description: string;
    onClick?: () => void;
}

export function Toast({
    type = 'info',
    title, description,
    onClick
}: ToastProps) {
    const color = type === 'info'
        ? 'text-Blue-500' : type === 'success'
            ? 'text-[#438965]' : type === 'error'
                ? 'text-Red-500' : 'text-Warning-500';
    return (
        <div className={clsx(styles['toast'], styles[`toast--${type}`])}>
            <div className={clsx(color, 'flex items-center gap-4 flex-1')}>
                <div>
                    <Info size={20} />
                </div>

                <div className={styles['toast__message']}>
                    <Typography
                        className='text-Black-950'
                        variant='body2-thicker'>
                        {title}
                    </Typography>

                    {description &&
                        <Typography className='text-Black-950'>
                            {description}
                        </Typography>}
                </div>
            </div>

            {onClick && (
                <div className={styles['Toast__close']} onClick={onClick}>
                    <Close size={16} className='text-600' />
                </div>
            )}
        </div>
    );
}

export default Toast;
