import { type MouseEventHandler } from 'react';
export declare function useDrag(props: {
    onMouseDown?: (ev: MouseEvent) => void;
    onMouseMove?: (ev: MouseEvent) => void;
    onMouseUp?: (props: {
        cancelled?: boolean;
    }) => void;
    disabled?: boolean;
}): {
    onMouseDown: MouseEventHandler<HTMLDivElement>;
};
