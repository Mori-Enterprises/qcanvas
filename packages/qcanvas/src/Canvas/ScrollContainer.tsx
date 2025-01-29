import React from 'react';

export interface Display {
    left: number;
    top: number;
    zoom: number;
}

export const DisplayContext = React.createContext<React.MutableRefObject<Display> | undefined>(undefined);

export interface ScrollContainerProps {
    container: HTMLDivElement | null;
}

export const ScrollContainer = ({
    container,
    children,
}: React.PropsWithChildren<ScrollContainerProps>) => {
    const [display, setDisplay] = React.useState<Display>({
        left: 0,
        top: 0,
        zoom: 1,
    });

    const [scrollContainer, setScrollContainer] = React.useState<HTMLElement | null>(null);

    React.useEffect(() => {
        if (!container || !scrollContainer) {
            return;
        }
        const wheelListener = (ev: WheelEvent) => {
            ev.preventDefault();
            if (ev.ctrlKey) {
                setDisplay(prev => {
                    if (prev.zoom < 0.1 || prev.zoom > 3) {
                        return prev;
                    }

                    const scrollRect = scrollContainer.getBoundingClientRect();
                    const scrollX = ev.pageX - scrollRect.left;
                    const scrollY = ev.pageY - scrollRect.top;
                    const containerRect = container.getBoundingClientRect();
                    const containerX = ev.pageX - containerRect.left;
                    const containerY = ev.pageY - containerRect.top;
                    const newZoom = Math.max(0.1, Math.min(3, prev.zoom + ev.deltaY * -0.01));
                    const logicalX = scrollX / prev.zoom;
                    const logicalY = scrollY / prev.zoom;
                    return {
                        ...prev,
                        left: containerX / newZoom - logicalX,
                        top: containerY / newZoom - logicalY,
                        zoom: newZoom,
                    }
                });
            } else {
                setDisplay(prev => ({
                    ...prev,
                    left: prev.left + (ev.deltaX / prev.zoom),
                    top: prev.top + (ev.deltaY / prev.zoom),
                }));
            }
        };
        container.addEventListener('wheel', wheelListener, { passive: false });
        return () => container.removeEventListener('wheel', wheelListener);
    }, [container, scrollContainer]);

    const displayRef = React.useRef<Display>(display);
    displayRef.current = display;

    return <div ref={setScrollContainer} style={{
        position: 'relative',
        minWidth: '100%',
        minHeight: '100%',
        transform: `scale(${display.zoom}) translate(${display.left}px, ${display.top}px)`,
        transformOrigin: 'top left',
    }}>
        <DisplayContext.Provider value={displayRef}>
            {children}
        </DisplayContext.Provider>
    </div>;
};
