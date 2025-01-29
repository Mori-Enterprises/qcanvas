import React from 'react';
import {
    BaseElementData,
    Canvas,
    CanvasController,
    DataHolder,
    useElementContext,
    useElementIds,
} from '@mori-enterprises/qcanvas';

const Content = () => {
    const data = useElementContext();

    const color = React.useMemo(() => {
        return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    }, []);

    return <div style={{
        width: '100px',
        height: '100px',
        backgroundColor: color,
    }}>{data.id}</div>;
}

const componentFactory = (kind: string): React.JSX.Element | null => {
    if (kind === 'content') {
        return <Content />
    } else {
        return null;
    }
}

export class ExampleCanvasController implements CanvasController<BaseElementData> {
    private dragState: { [id: string]: { startX: number; startY: number } } = {};

    constructor(
        readonly data: DataHolder<BaseElementData>,
    ) { }

    onElementDragStart(id: string, x: number, y: number): void {
        this.dragState[id] = {
            startX: x,
            startY: y,
        };
    }

    onElementDrag(id: string, deltaX: number, deltaY: number): void {
        if (!this.dragState[id]) {
            return;
        }

        const { startX, startY } = this.dragState[id];
        this.move(id, startX + deltaX, startY + deltaY);
    }

    onElementDragEnd(id: string, props: { cancelled: boolean }): void {
        if (!this.dragState[id]) {
            return;
        }

        if (props.cancelled) {
            const { startX, startY } = this.dragState[id];
            this.move(id, startX, startY);
        }

        delete this.dragState[id];
    }

    onElementClick(ev: MouseEvent, id: string): void {
    }

    private move(id: string, x: number, y: number) {
        this.data.value = this.data.value.map(el => el.id === id
            ? {
                ...el,
                x,
                y,
            }
            : el);
    }
}

export const ExampleCanvas = () => {
    const controller = React.useMemo(() => new ExampleCanvasController(new DataHolder([])), []);

    const ids = useElementIds(controller);
    const [desiredElements, setDesiredElements] = React.useState(1);
    const data = controller.data.value;
    if (desiredElements < ids.length) {
        controller.data.value = data.slice(0, desiredElements);
    } else if (desiredElements > ids.length) {
        const newEls: BaseElementData[] = [];
        for (let i = ids.length; i < desiredElements; i++) {
            newEls.push({
                id: `${i}`,
                kind: 'content',
                x: i === 0 ? 10 : Math.floor((Math.random() - 0.5) * 2 * 5000),
                y: i === 0 ? 10 : Math.floor((Math.random() - 0.5) * 2 * 5000),
                draggable: true,
            })
        }
        controller.data.value = data.concat(newEls);
    }

    return <div style={{
        width: '100%',
        height: '100%',
        position: 'relative',
    }}>
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '10px',
            borderBottom: '1px solid gray',
            lineHeight: 1,
        }}>
            <label>Number of elements</label>
            <input type="range" min="1" max={10000} onChange={(ev) => {
                setDesiredElements(ev.target.valueAsNumber);
            }} />
            <span>{desiredElements}</span>
        </div>
        <Canvas controller={controller} componentFactory={componentFactory} />
    </div>;
}