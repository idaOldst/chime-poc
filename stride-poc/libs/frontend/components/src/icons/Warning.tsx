import IIcon from '../types/icons';

export const Warning = ({ size = 32, color = '#FFAB3B', className }: IIcon) => {
    return (
        <svg
            width={size}
            height={size}
            className={className}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g id="Warning">
                <path
                    id="Vector"
                    d="M14.5067 10.613L10.24 2.93301C9.66667 1.89967 8.87333 1.33301 8 1.33301C7.12667 1.33301 6.33333 1.89967 5.76 2.93301L1.49333 10.613C0.953334 11.593 0.893334 12.533 1.32667 13.273C1.76 14.013 2.61333 14.4197 3.73333 14.4197H12.2667C13.3867 14.4197 14.24 14.013 14.6733 13.273C15.1067 12.533 15.0467 11.5863 14.5067 10.613Z"
                    fill={color}
                />
                <path
                    id="Vector_2"
                    d="M8 9.83333C7.72667 9.83333 7.5 9.60667 7.5 9.33333V6C7.5 5.72667 7.72667 5.5 8 5.5C8.27333 5.5 8.5 5.72667 8.5 6V9.33333C8.5 9.60667 8.27333 9.83333 8 9.83333Z"
                    fill="#FFF"
                />
                <path
                    id="Vector_3"
                    d="M8 12C7.96 12 7.91333 11.9934 7.86666 11.9867C7.82666 11.98 7.78666 11.9667 7.74666 11.9467C7.70666 11.9334 7.66666 11.9134 7.62666 11.8867C7.59333 11.86 7.55999 11.8334 7.52666 11.8067C7.40666 11.68 7.33333 11.5067 7.33333 11.3334C7.33333 11.16 7.40666 10.9867 7.52666 10.86C7.55999 10.8334 7.59333 10.8067 7.62666 10.78C7.66666 10.7534 7.70666 10.7334 7.74666 10.72C7.78666 10.7 7.82666 10.6867 7.86666 10.68C7.95333 10.66 8.04666 10.66 8.12666 10.68C8.17333 10.6867 8.21333 10.7 8.25333 10.72C8.29333 10.7334 8.33333 10.7534 8.37333 10.78C8.40666 10.8067 8.44 10.8334 8.47333 10.86C8.59333 10.9867 8.66666 11.16 8.66666 11.3334C8.66666 11.5067 8.59333 11.68 8.47333 11.8067C8.44 11.8334 8.40666 11.86 8.37333 11.8867C8.33333 11.9134 8.29333 11.9334 8.25333 11.9467C8.21333 11.9667 8.17333 11.98 8.12666 11.9867C8.08666 11.9934 8.04 12 8 12Z"
                    fill="#FFF"
                />
            </g>
        </svg>
    );
};
