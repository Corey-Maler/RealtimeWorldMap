# Small hobby project: small world globe

Nothing really extraordinary here.

## Usage

```js
import { Engine } from './Engine';

const contentEl = document.getElementById('Content');
const demoEngine = new Engine(contentEl, {
    clearColor: "#0096ff", // 0x9966ff,
    fgColor: '#ffffff',
});
demoEngine.start();
```

## Building and running
```sh
pnpm install
pnpm run dev
```