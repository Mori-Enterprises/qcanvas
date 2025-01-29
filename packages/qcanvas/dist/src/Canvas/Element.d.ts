import React from 'react';
import { BaseElementData, CanvasController } from './controller';
export declare function useElementContext<T extends BaseElementData>(): T;
export interface ElementProps<T extends BaseElementData> {
    id: string;
    controller: CanvasController<T>;
    componentFactory: (kind: string) => React.JSX.Element | null;
}
export declare const Element: React.MemoExoticComponent<(<T extends BaseElementData>({ id, controller, componentFactory, }: ElementProps<T>) => import("react/jsx-runtime").JSX.Element)>;
