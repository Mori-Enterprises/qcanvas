import { useState, useEffect } from 'react';

export interface BaseElementData {
    id: string;
    kind: string;
    x: number;
    y: number;
    draggable?: boolean;
    clickable?: boolean;
}

export class DataHolder<T extends BaseElementData> {
    private data!: T[];
    private dataById: { [id: string]: T } = {};
    private readonly listeners: (() => void)[] = [];

    set value(value: T[]) {
        this.data = value;
        this.dataById = {};
        for (const el of value) {
            this.dataById[el.id] = el;
        }
        this.notifyListeners();
    }

    get value(): T[] {
        return this.data;
    }

    constructor(initialData: T[]) {
        this.data = initialData;
    }

    element(id: string): T | undefined {
        return this.dataById[id];
    }

    addListener(listener: () => void): () => void {
        this.listeners.push(listener);
        return () => {
            const index = this.listeners.indexOf(listener);
            if (index >= 0) {
                this.listeners.splice(index, 1);
            }
        };
    }

    private notifyListeners() {
        for (const listener of this.listeners) {
            listener();
        }
    }
}

export interface CanvasController<T extends BaseElementData> {
    readonly data: DataHolder<T>;
    onElementDragStart(id: string, x: number, y: number): void;
    onElementDrag(id: string, deltaX: number, deltaY: number): void;
    onElementDragEnd(id: string, props: { cancelled: boolean }): void;
    onElementClick(ev: MouseEvent, id: string): void;
}

export function useElementIds<T extends BaseElementData>(controller: CanvasController<T>): string[] {
    const [ids, setIds] = useState<string[]>(controller.data.value.map(el => el.id));
    useEffect(() => {
        return controller.data.addListener(() => {
            const newIds = controller.data.value.map(el => el.id);
            setIds(prevIds => {
                if (newIds.length != prevIds.length) {
                    return newIds;
                }

                for (let i = 0; i < newIds.length; i++) {
                    if (newIds[i] != prevIds[i]) {
                        return newIds;
                    }
                }

                return prevIds;
            });
        });
    }, [controller]);
    return ids;
}

export function useElementDataById<T extends BaseElementData>(controller: CanvasController<T>, id: string): T | undefined {
    const [data, setData] = useState(controller.data.element(id));
    useEffect(() => {
        return controller.data.addListener(() => {
            setData(controller.data.element(id));
        });
    }, [controller, id]);
    return data;
}
