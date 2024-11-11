import IIcon from '../types/icons';

export const EyeOn = ({ size = 32, color, className }: IIcon) => {
    return (
        <svg
            width={size}
            height={size}
            className={className}
            viewBox="0 0 25 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M21.3852 10.0711C20.2224 8.17732 17.5773 5 12.9351 5C8.29278 5 5.64776 8.17732 4.48494 10.0711C4.12547 10.6525 3.93506 11.3226 3.93506 12.0062C3.93506 12.6897 4.12547 13.3598 4.48494 13.9412C5.64776 15.835 8.29278 19.0123 12.9351 19.0123C17.5773 19.0123 20.2224 15.835 21.3852 13.9412C21.7446 13.3598 21.9351 12.6897 21.9351 12.0062C21.9351 11.3226 21.7446 10.6525 21.3852 10.0711ZM20.1069 13.1562C19.1083 14.7801 16.8479 17.5129 12.9351 17.5129C9.02226 17.5129 6.76185 14.7801 5.76322 13.1562C5.54965 12.8106 5.43652 12.4124 5.43652 12.0062C5.43652 11.5999 5.54965 11.2017 5.76322 10.8561C6.76185 9.23218 9.02226 6.49944 12.9351 6.49944C16.8479 6.49944 19.1083 9.22918 20.1069 10.8561C20.3205 11.2017 20.4336 11.5999 20.4336 12.0062C20.4336 12.4124 20.3205 12.8106 20.1069 13.1562Z"
                fill={color || 'currentColor'} />
            <path
                d="M12.9354 8.25757C12.194 8.25757 11.4692 8.47742 10.8528 8.88932C10.2363 9.30123 9.75584 9.88668 9.47212 10.5716C9.18839 11.2566 9.11416 12.0103 9.2588 12.7375C9.40344 13.4647 9.76046 14.1326 10.2847 14.6568C10.809 15.1811 11.4769 15.5381 12.2041 15.6828C12.9312 15.8274 13.6849 15.7532 14.3699 15.4694C15.0549 15.1857 15.6403 14.7053 16.0522 14.0888C16.4641 13.4723 16.684 12.7476 16.684 12.0062C16.6828 11.0124 16.2875 10.0596 15.5847 9.35683C14.882 8.65408 13.9292 8.25876 12.9354 8.25757ZM12.9354 14.2553C12.4905 14.2553 12.0557 14.1234 11.6858 13.8763C11.3159 13.6292 11.0277 13.2779 10.8574 12.8669C10.6872 12.4559 10.6426 12.0037 10.7294 11.5674C10.8162 11.1311 11.0304 10.7303 11.345 10.4158C11.6595 10.1012 12.0603 9.88701 12.4966 9.80023C12.9329 9.71345 13.3851 9.75799 13.7961 9.92822C14.2071 10.0985 14.5584 10.3867 14.8055 10.7566C15.0526 11.1265 15.1845 11.5613 15.1845 12.0062C15.1845 12.6027 14.9476 13.1748 14.5258 13.5966C14.104 14.0184 13.5319 14.2553 12.9354 14.2553Z"
                fill={color || 'currentColor'} />
        </svg>
    );
};
