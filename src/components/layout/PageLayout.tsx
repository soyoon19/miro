import React from 'react';

interface PageLayoutProps {
    children: React.ReactNode;
    title?: string;
    maxWidth?: string;
    className?: string;
    headerContent?: React.ReactNode;
    onBack?: () => void;
    onNext?: () => void;
    nextLabel?: string;
    nextDisabled?: boolean;
    center?: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({
    children,
    title,
    maxWidth = '1600px',
    className = '',
    headerContent,
    onBack,
    onNext,
    nextLabel,
    nextDisabled,
    center
}) => {
    return (
        <div className={`page-layout ${className}`} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {title && (
                <header className="app-header" style={{ position: 'relative' }}>
                    {onBack && (
                        <button
                            onClick={onBack}
                            style={{
                                position: 'absolute',
                                left: '20px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'white',
                                border: 'none',
                                color: '#2196F3',
                                padding: '8px 16px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: 'bold'
                            }}
                        >
                            이전
                        </button>
                    )}
                    <h1>{title}</h1>
                    {headerContent}
                    {onNext && (
                        <button
                            onClick={onNext}
                            disabled={nextDisabled}
                            style={{
                                position: 'absolute',
                                right: '20px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: nextDisabled ? 'rgba(255,255,255,0.3)' : 'white',
                                border: 'none',
                                color: nextDisabled ? 'rgba(0,0,0,0.3)' : '#2196F3',
                                padding: '8px 16px',
                                borderRadius: '4px',
                                cursor: nextDisabled ? 'not-allowed' : 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: 'bold'
                            }}
                        >
                            {nextLabel || '다음 →'}
                        </button>
                    )}
                </header>
            )}
            <main className="main-content" style={{
                maxWidth,
                width: '100%',
                margin: '0 auto',
                padding: '20px',
                display: center ? 'flex' : 'block',
                flexDirection: center ? 'column' : undefined,
                alignItems: center ? 'center' : undefined
            }}>
                {children}
            </main>
        </div>
    );
};

export default PageLayout;
