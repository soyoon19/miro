import React, { useEffect, useState } from 'react';
// Actually TeamPage uses Card from components/ui/Card.tsx. Let's verify imports or just use div styled.
// User said "Use existing project's Card/Button style".
// Let's use internal styles for now to be safe or import if confirmed. 
// User file list shows c:\miro\src\components\ui\Card.tsx exists.

interface TutorialOverlayProps {
    step: number;
    targetSelector: string | null;
    guideText: React.ReactNode;
    onNext?: () => void;
    nextLabel?: string;
    showNextButton?: boolean;
    isCompleted?: boolean;
    onComplete?: () => void;
    placement?: 'right' | 'bottom' | 'top';
}

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({
    step,
    targetSelector,
    guideText,
    onNext,
    nextLabel = "다음",
    showNextButton = true,
    isCompleted = false,
    onComplete,
    placement = 'right'
}) => {
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

    useEffect(() => {
        if (!targetSelector) {
            setTargetRect(null);
            return;
        }

        const updateRect = () => {
            const el = document.querySelector(targetSelector);
            if (el) {
                setTargetRect(el.getBoundingClientRect());
            } else {
                // If element not found yet, retry briefly or just wait.
                // In React, might need a small timeout or dependency on render.
                setTargetRect(null);
            }
        };

        // Initial check
        updateRect();

        // Retry a few times in case of animation/rendering
        const timer1 = setTimeout(updateRect, 100);
        const timer2 = setTimeout(updateRect, 500);

        // Resize observer
        const ro = new ResizeObserver(updateRect);
        const el = document.querySelector(targetSelector);
        if (el) ro.observe(el);

        window.addEventListener('scroll', updateRect, true);
        window.addEventListener('resize', updateRect);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            ro.disconnect();
            window.removeEventListener('scroll', updateRect, true);
            window.removeEventListener('resize', updateRect);
        };
    }, [targetSelector, step]); // Re-run when step or selector changes

    if (isCompleted) {
        return (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(0,0,0,0.7)',
                zIndex: 9999,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <div style={{ background: 'white', padding: '40px', borderRadius: '12px', textAlign: 'center', maxWidth: '500px' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>🎉 튜토리얼 완료!</h2>
                    <p style={{ marginBottom: '30px', fontSize: '1.2rem', lineHeight: '1.6', color: '#666' }}>
                        이제 강화학습 미로 탐험을 <br />
                        시작할 준비가 되었습니다.<br />
                        팀원들과 함께 최적의 경로를 찾아보세요!
                    </p>
                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                        {onComplete && (
                            <button
                                onClick={onComplete}
                                style={{
                                    padding: '15px 30px',
                                    fontSize: '1.2rem',
                                    fontWeight: 'bold',
                                    background: '#2196F3',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer'
                                }}
                            >
                                실습 시작하기 ▶
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    if (!targetSelector) return null;

    // Overlay style (4 rectangles)
    const overlayColor = 'rgba(0,0,0,0.5)';
    const holeRect = targetRect || { top: 0, left: 0, width: 0, height: 0, bottom: 0, right: 0 };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 9999,
            pointerEvents: 'none' // Allow pass through locally, but we block with divs
        }}>
            {/* Top Overlay */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: holeRect.top,
                background: overlayColor,
                pointerEvents: 'auto'
            }} />

            {/* Bottom Overlay */}
            <div style={{
                position: 'absolute',
                top: holeRect.bottom,
                left: 0,
                width: '100%',
                height: `calc(100vh - ${holeRect.bottom}px)`,
                background: overlayColor,
                pointerEvents: 'auto'
            }} />

            {/* Left Overlay */}
            <div style={{
                position: 'absolute',
                top: holeRect.top,
                left: 0,
                width: holeRect.left,
                height: holeRect.height,
                background: overlayColor,
                pointerEvents: 'auto'
            }} />

            {/* Right Overlay */}
            <div style={{
                position: 'absolute',
                top: holeRect.top,
                left: holeRect.right,
                width: `calc(100vw - ${holeRect.right}px)`,
                height: holeRect.height,
                background: overlayColor,
                pointerEvents: 'auto'
            }} />

            {/* Highlight Border */}
            {targetRect && (
                <div style={{
                    position: 'absolute',
                    top: targetRect.top - 4,
                    left: targetRect.left - 4,
                    width: targetRect.width + 8,
                    height: targetRect.height + 8,
                    border: '4px solid #FFC107',
                    borderRadius: '8px',
                    pointerEvents: 'none',
                    boxShadow: '0 0 15px rgba(255, 193, 7, 0.5)'
                }} />
            )}

            {/* Guide Text Card */}
            {targetRect && (
                <div style={{
                    position: 'absolute',
                    top: placement === 'bottom'
                        ? targetRect.bottom + 20
                        : placement === 'top'
                            ? targetRect.top - 20 // Move above
                            : targetRect.top + targetRect.height / 2, // Right (default)
                    left: placement === 'right' // Default
                        ? targetRect.right + 20
                        : targetRect.left + targetRect.width / 2, // Center horizontally for top/bottom
                    transform: placement === 'bottom'
                        ? 'translateX(-50%)'
                        : placement === 'top'
                            ? 'translate(-50%, -100%)' // Move up by 100% of own height + center hook
                            : 'translateY(-50%)',
                    background: 'white',
                    padding: '20px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                    minWidth: '300px',
                    maxWidth: '400px',
                    pointerEvents: 'auto', // Enable interaction with the card
                    animation: 'fadeIn 0.3s ease-out',
                    zIndex: 10000 // Ensure it's on top
                }}>
                    <div style={{ marginBottom: '15px', fontSize: '1.2rem', fontWeight: 'bold', color: '#333' }}>
                        Step {step}
                    </div>
                    <div style={{ lineHeight: '1.6', fontSize: '1rem', color: '#555', marginBottom: '20px' }}>
                        {guideText}
                    </div>
                    {showNextButton && onNext && (
                        <div style={{ textAlign: 'right' }}>
                            <button
                                onClick={onNext}
                                style={{
                                    background: '#2196F3',
                                    color: 'white',
                                    border: 'none',
                                    padding: '8px 20px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    fontWeight: 'bold'
                                }}
                            >
                                {nextLabel}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TutorialOverlay;
