import React from 'react';
import { BaseElementData, type CanvasController } from './controller';
export interface CanvasProps<T extends BaseElementData> {
    controller: CanvasController<T>;
    componentFactory: (kind: string) => React.JSX.Element | null;
}
export declare const Canvas: <T extends BaseElementData>({ controller, componentFactory, }: CanvasProps<T>) => import("react/jsx-runtime").JSX.Element;
