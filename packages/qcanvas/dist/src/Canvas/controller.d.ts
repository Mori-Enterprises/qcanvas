export interface BaseElementData {
    id: string;
    kind: string;
    x: number;
    y: number;
    draggable?: boolean;
    clickable?: boolean;
}
export declare class DataHolder<T extends BaseElementData> {
    private data;
    private dataById;
    private readonly listeners;
    set value(value: T[]);
    get value(): T[];
    constructor(initialData: T[]);
    element(id: string): T | undefined;
    addListener(listener: () => void): () => void;
    private notifyListeners;
}
export interface CanvasController<T extends BaseElementData> {
    readonly data: DataHolder<T>;
    onElementDragStart(id: string, x: number, y: number): void;
    onElementDrag(id: string, deltaX: number, deltaY: number): void;
    onElementDragEnd(id: string, props: {
        cancelled: boolean;
    }): void;
    onElementClick(ev: MouseEvent, id: string): void;
}
export declare function useElementIds<T extends BaseElementData>(controller: CanvasController<T>): string[];
export declare function useElementDataById<T extends BaseElementData>(controller: CanvasController<T>, id: string): T | undefined;
