import React from 'react';

interface PageLayoutProps {
    children: React.ReactNode;
    title?: string;
    maxWidth?: string;
    className?: string;
    headerContent?: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({
    children,
    title,
    maxWidth = '1600px',
    className = '',
    headerContent
}) => {
    return (
        <div className={`page-layout ${className}`} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {title && (
                <header className="app-header">
                    <h1>{title}</h1>
                    {headerContent}
                </header>
            )}
            <main className="main-content" style={{ maxWidth, width: '100%', margin: '0 auto', padding: '20px', flex: 1 }}>
                {children}
            </main>
        </div>
    );
};

export default PageLayout;
