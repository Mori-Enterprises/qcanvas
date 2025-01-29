import { createRoot } from 'react-dom/client';
import { ExampleCanvas } from './ExampleCanvas';

const root = createRoot(document.getElementById('app')!);
root.render(<ExampleCanvas />);
