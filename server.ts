import express from 'express';
import path from 'path';
import { app } from './src/server/app.ts';

const PORT = Number(process.env.PORT) || 3000;
const DIST_PATH = path.resolve(process.cwd(), 'dist');

// In production, serve the built Vite SPA from dist
app.use(express.static(DIST_PATH));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(DIST_PATH, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Custom Car Mats production server listening on port ${PORT}`);
});
