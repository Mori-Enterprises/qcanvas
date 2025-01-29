import React, { useContext } from 'react';
import { useDrag } from '../util/drag.hook';
import { dist } from '../util/math';
import { useLatest } from '../util/latest.hook';
import { BaseElementData, CanvasController, DataHolder } from './controller';
import { DisplayContext } from './ScrollContainer';

const DRAG_SLOP = 5;

interface DragState {
    startScreenX: number;
    startScreenY: number;
    dragging?: boolean;
    clickable?: boolean;
}

function useElementDataFromDataController<T extends BaseElementData>(data: DataHolder<T>, id: string): T {
    const [elData, setElData] = React.useState(data.element(id));
    React.useEffect(() => {
        return data.addListener(() => {
            setElData(prevData => {
                const newData = data.element(id)!;
                if (prevData === newData) {
                    return prevData;
                } else {
                    return newData;
                }
            });
        });
    }, [data, id]);
    return elData!;
}

const ElementDataContext = React.createContext<any>(undefined);
export function useElementContext<T extends BaseElementData>(): T {
    return React.useContext(ElementDataContext);
}

export interface ElementProps<T extends BaseElementData> {
    id: string;
    controller: CanvasController<T>;
    componentFactory: (kind: string) => React.JSX.Element | null;
};

export const Element = React.memo(<T extends BaseElementData>({
    id,
    controller,
    componentFactory,
}: ElementProps<T>) => {
    const data: T = useElementDataFromDataController(controller.data, id);
    const { kind, x, y, draggable, clickable } = data;

    const dragState = React.useRef<DragState>();
    const [isDragging, setIsDragging] = React.useState(false);
    const idRef = useLatest(id);
    const xRef = useLatest(x);
    const yRef = useLatest(y);
    const displayRef = useContext(DisplayContext);

    const { onMouseDown } = useDrag({
        onMouseDown: React.useCallback((ev) => {
            dragState.current = {
                startScreenX: ev.screenX,
                startScreenY: ev.screenY,
            };
        }, [controller]),
        onMouseMove: React.useCallback((ev) => {
            if (!dragState.current) {
                return;
            }

            const { startScreenX, startScreenY } = dragState.current;

            if (!dragState.current.dragging && dist(startScreenX, startScreenY, ev.screenX, ev.screenY) >= DRAG_SLOP) {
                dragState.current.dragging = true;
                controller?.onElementDragStart(idRef.current, xRef.current, yRef.current);
                setIsDragging(true);
            }

            if (dragState.current.dragging) {
                const deltaX = (ev.screenX - startScreenX) / (displayRef?.current.zoom ?? 1);
                const deltaY = (ev.screenY - startScreenY) / (displayRef?.current.zoom ?? 1);
                controller?.onElementDrag(idRef.current, deltaX, deltaY);
            }
        }, [controller, displayRef]),
        onMouseUp: React.useCallback((props) => {
            if (dragState.current?.dragging) {
                setIsDragging(false);
                controller?.onElementDragEnd(idRef.current, {
                    cancelled: !!props.cancelled,
                });
            }
            dragState.current = undefined;
        }, [controller]),
        disabled: !draggable,
    });

    const onClick = React.useCallback((ev: React.MouseEvent) => {
        if (clickable) {
            controller.onElementClick(ev.nativeEvent, id);
        }
    }, [controller, id, clickable]);

    return <div style={{
        position: 'absolute',
        userSelect: draggable ? 'none' : undefined,
        willChange: isDragging ? 'transform' : undefined,
        transform: `translate(${x}px, ${y}px)`,
    }} onClick={onClick} onMouseDown={onMouseDown}>
        <ElementDataContext.Provider value={data}>
            {componentFactory(kind)}
        </ElementDataContext.Provider>
    </div>;
});