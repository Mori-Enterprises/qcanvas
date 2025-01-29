# QCanvas

A performant infinte canvas library for React.

## Getting Started

```
yarn add @mori-enterprises/qcanvas
```

This library works by rendering elements on a canvas. An element must have at least these properties:

```
export interface BaseElementData {
    id: string;
    kind: string;
    x: number;
    y: number;
    draggable?: boolean;
    clickable?: boolean;
}
```

You provide a "canvas controller" that lets you control what happens on user interaction.

```
class ExampleCanvasController implements CanvasController<BaseElementData> {
    constructor(
        readonly dataController: DataController<BaseElementData>,
    ) { }

    onElementDragStart(id: string, x: number, y: number): void {}
    onElementDrag(id: string, deltaX: number, deltaY: number): void {}
    onElementDragEnd(id: string, props: { cancelled: boolean }): void {}
    onElementClick(ev: MouseEvent, id: string): void {}
}
```

You also provide a "component" factory that converts your data elements into React components:

```
const Content = () => {
    const data = useElementContext();

    const color = useMemo(() => {
        return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    }, []);

    return <div style={{
        width: '100px',
        height: '100px',
        backgroundColor: color,
    }}>{data.id}</div>;
};

const componentFactory = (kind: string): React.JSX.Element | null => {
    if (kind === 'content') {
        return <Content />
    } else {
        return null;
    }
}
```

Finally, you render your canvas:

```
const MyCanvasContainer = () => {
    const controller = useMemo(() => new ExampleCanvasController(new DataController({
        elements: [],
    })), []);

    return <Canvas controller={controller} componentFactory={componentFactory} />
}
```
