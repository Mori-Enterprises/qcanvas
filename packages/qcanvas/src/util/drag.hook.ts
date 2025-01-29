import { type MouseEventHandler, useRef, useCallback } from 'react';

export function useDrag(props: {
    onMouseDown?: (ev: MouseEvent) => void,
    onMouseMove?: (ev: MouseEvent) => void,
    onMouseUp?: (props: { cancelled?: boolean }) => void;
    disabled?: boolean;
}): {
    onMouseDown: MouseEventHandler<HTMLDivElement>
} {
    const propsRef = useRef(props);
    propsRef.current = props;

    return {
        onMouseDown: useCallback((ev) => {
            const mouseMoveListener = (ev: MouseEvent) => {
                if (!propsRef.current.disabled) {
                    propsRef.current.onMouseMove?.(ev);
                }
            };

            const mouseUpListener = (ev: MouseEvent) => {
                cleanup();
                if (!propsRef.current.disabled) {
                    propsRef.current.onMouseUp?.({ cancelled: false });
                }
            };

            const keyDownListener = (ev: KeyboardEvent) => {
                if (ev.key === 'Escape') {
                    cleanup();
                    if (!propsRef.current.disabled) {
                        propsRef.current.onMouseUp?.({ cancelled: true });
                    }
                }
            };

            const cleanup = () => {
                window.removeEventListener('mousemove', mouseMoveListener);
                window.removeEventListener('mouseup', mouseUpListener);
                window.removeEventListener('keydown', keyDownListener);
            };

            window.addEventListener('mousemove', mouseMoveListener);
            window.addEventListener('mouseup', mouseUpListener);
            window.addEventListener('keydown', keyDownListener);

            if (!propsRef.current.disabled) {
                propsRef.current.onMouseDown?.(ev.nativeEvent);
                ev.stopPropagation();
            }
        }, [propsRef]),
    };
}