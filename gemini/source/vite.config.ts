import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
import fs from 'node:fs';

// Serve shared ../assets (images & audio) seamlessly during local `npm run dev`
function serveParentAssets() {
  const assetsRoot = path.resolve(__dirname, '../assets');
  const mimeTypes: Record<string, string> = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.webp': 'image/webp',
    '.mp3': 'audio/mpeg',
  };

  return {
    name: 'serve-parent-assets',
    configureServer(server: { middlewares: { use: Function } }) {
      server.middlewares.use('/assets', (req: any, res: any, next: any) => {
        const cleanUrl = (req.url || '').split('?')[0];
        const filePath = path.join(assetsRoot, cleanUrl);
        if (!filePath.startsWith(assetsRoot) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
          return next();
        }
        const ext = path.extname(filePath).toLowerCase();
        const stat = fs.statSync(filePath);
        const mime = mimeTypes[ext] || 'application/octet-stream';

        // Support HTTP Range requests for Safari/Chrome audio seeking
        const range = req.headers.range;
        if (range) {
          const match = /bytes=(\d+)-(\d*)/.exec(range);
          if (match) {
            const start = Number(match[1]);
            const end = match[2] ? Number(match[2]) : stat.size - 1;
            res.writeHead(206, {
              'Content-Range': `bytes ${start}-${end}/${stat.size}`,
              'Accept-Ranges': 'bytes',
              'Content-Length': end - start + 1,
              'Content-Type': mime,
            });
            fs.createReadStream(filePath, { start, end }).pipe(res);
            return;
          }
        }

        res.writeHead(200, {
          'Content-Type': mime,
          'Content-Length': stat.size,
          'Accept-Ranges': 'bytes',
        });
        fs.createReadStream(filePath).pipe(res);
      });
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), serveParentAssets()],
  build: {
    outDir: '../dist-preview',
    emptyOutDir: true,
  },
});
