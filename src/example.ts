import { Engine } from './Engine';

const contentEl = document.getElementById('Content');
if (contentEl) {
  const demoEngine = new Engine(contentEl, {
	clearColor: "#0096ff", // 0x9966ff,
	fgColor: '#ffffff',
  });
  demoEngine.start();
} else {
  throw new Error('no #Content element is found');
}
