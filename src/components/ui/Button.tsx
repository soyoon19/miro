import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    className = '',
    style,
    children,
    ...props
}) => {
    const baseStyle: React.CSSProperties = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '4px',
        border: '1px solid transparent',
        cursor: props.disabled ? 'not-allowed' : 'pointer',
        fontWeight: 'bold',
        transition: 'all 0.2s ease-in-out',
        opacity: props.disabled ? 0.6 : 1,
        fontFamily: 'inherit',
    };

    const variants = {
        primary: {
            backgroundColor: '#2196F3', // Blue 500
            color: 'white',
            borderColor: '#2196F3',
        },
        secondary: {
            backgroundColor: '#4CAF50', // Green 500
            color: 'white',
            borderColor: '#4CAF50',
        },
        outline: {
            backgroundColor: 'transparent',
            color: '#2196F3',
            borderColor: '#2196F3',
        }
    };

    const sizes = {
        sm: {
            padding: '6px 12px',
            fontSize: '14px',
        },
        md: {
            padding: '10px 20px',
            fontSize: '16px',
        },
        lg: {
            padding: '14px 28px',
            fontSize: '18px',
        }
    };

    const combinedStyle = {
        ...baseStyle,
        ...variants[variant],
        ...sizes[size],
        ...style,
    };

    return (
        <button
            style={combinedStyle}
            className={`ui-button ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};
