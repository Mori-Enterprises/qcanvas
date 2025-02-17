import React, { useEffect, useState } from 'react';

import { BaseElementData, useElementIds, type CanvasController } from './controller';
import { ScrollContainer } from './ScrollContainer';
import { Element } from './Element';

export interface CanvasProps<T extends BaseElementData> {
    controller: CanvasController<T>;
    componentFactory: (kind: string) => React.JSX.Element | null;
};

export const Canvas = <T extends BaseElementData>({
    controller,
    componentFactory,
}: CanvasProps<T>) => {
    const ids = useElementIds(controller);
    const [el, setEl] = React.useState<HTMLDivElement | null>(null);

    return <div ref={setEl} style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
    }}>
        <ScrollContainer container={el}>
            {ids.map(id => <Element key={id} id={id} controller={controller} componentFactory={componentFactory} />)}
        </ScrollContainer>
    </div >
};