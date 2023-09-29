import { createRoot } from 'react-dom/client';

export const App = () => {
    return (
      <h1>Hello, world.</h1>
    );
}

const el = document.getElementById('Content');

if (el) {
  createRoot(el).render(<App />);
}