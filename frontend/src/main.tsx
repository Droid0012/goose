import { createRoot } from 'react-dom/client';
import { SPAApp } from './app';

const container = document.getElementById('root');

if (container) {
    const root = createRoot(container);

    root.render(<SPAApp />);
}
