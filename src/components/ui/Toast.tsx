import React, { useEffect, useState } from 'react';
import './Toast.css';

interface ToastProps {
    message: string;
    type: 'success' | 'error';
    duration?: number;
    onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, duration = 3000, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Wait for fade out animation
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div className={`toast-container ${type} ${isVisible ? 'visible' : 'hiding'}`}>
            <span className="toast-icon">{type === 'success' ? '🎉' : '❌'}</span>
            <span className="toast-message">{message}</span>
        </div>
    );
};

export default Toast;
