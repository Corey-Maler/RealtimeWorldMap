import { Engine } from './Engine';

const contentEl = document.getElementById('Content');
if (contentEl) {
  const demoEngine = new Engine(contentEl, {});
  demoEngine.start();
} else {
  throw new Error('no #Content element is found');
}
