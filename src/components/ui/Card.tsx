import React from 'react';

interface CardProps {
    children: React.ReactNode;
    title?: string;
    className?: string;
    style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({
    children,
    title,
    className = '',
    style
}) => {
    return (
        <div
            className={`ui-card ${className}`}
            style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                padding: '24px',
                marginBottom: '20px',
                border: '1px solid #eee',
                ...style
            }}
        >
            {title && (
                <h3 style={{
                    marginTop: 0,
                    marginBottom: '16px',
                    fontSize: '1.25rem',
                    color: '#333',
                    borderBottom: '2px solid #2196F3',
                    paddingBottom: '8px',
                    display: 'inline-block'
                }}>
                    {title}
                </h3>
            )}
            {children}
        </div>
    );
};
