import { createRoot } from 'react-dom/client';

import { Entry } from './entry'; 

export const App = () => {
    return (
      <div>
        <h1>hello</h1>
        <Entry />
      </div>
    );
}

const el = document.getElementById('Content');

if (el) {
  createRoot(el).render(<App />);
}