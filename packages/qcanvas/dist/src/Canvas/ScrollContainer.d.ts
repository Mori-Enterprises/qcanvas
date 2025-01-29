import React from 'react';
export interface Display {
    left: number;
    top: number;
    zoom: number;
}
export declare const DisplayContext: React.Context<React.MutableRefObject<Display> | undefined>;
export interface ScrollContainerProps {
    container: HTMLDivElement | null;
}
export declare const ScrollContainer: ({ container, children, }: React.PropsWithChildren<ScrollContainerProps>) => import("react/jsx-runtime").JSX.Element;
