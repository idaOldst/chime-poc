import IIcon from '../types/icons';

export const Attach = ({ size = 32, color, className }: IIcon) => {
    return (
        <svg
            width={size}
            height={size}
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M21.1527 10.8995L12.1371 19.9151C10.0869 21.9653 6.76275 21.9653 4.71249 19.9151C2.66224 17.8648 2.66224 14.5407 4.71249 12.4904L13.7281 3.47483C15.0949 2.108 17.311 2.108 18.6779 3.47483C20.0447 4.84167 20.0447 7.05775 18.6779 8.42458L10.0158 17.0866C9.33238 17.7701 8.22434 17.7701 7.54092 17.0866C6.8575 16.4032 6.8575 15.2952 7.54092 14.6118L15.1423 7.01037"
                stroke={color || 'currentColor'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};
