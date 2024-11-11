import cn from 'classnames';
import styles from './badge.module.scss';


export interface BadgeProps {
    children?: string,
    variant?: 'success' | 'warning' | 'danger' | 'neutral',
    isRounded?: boolean,
    size?: 'sm' | 'md' | 'lg'
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral', isRounded, size = 'md' }) => {
    return (
        <div className={cn(styles.badge, styles[variant], styles[`--${size}`], isRounded ? 'rounded-full' : 'rounded')}>
            <p className='antialiased'>
                {children}
            </p>
        </div>
    );
}

export default Badge;