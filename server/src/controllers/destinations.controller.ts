import type { Request, Response, NextFunction } from 'express';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import type { Destination } from '@freestyle/shared';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, '..', 'data', 'destinations.json');

let cachedDestinations: Destination[] | null = null;

async function loadDestinations(): Promise<Destination[]> {
  if (cachedDestinations) return cachedDestinations;
  const raw = await readFile(DATA_PATH, 'utf-8');
  cachedDestinations = JSON.parse(raw);
  return cachedDestinations!;
}

export const destinationsController = {
  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const destinations = await loadDestinations();
      res.json({ success: true, data: destinations });
    } catch (error) {
      next(error);
    }
  },

  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const destinations = await loadDestinations();
      const dest = destinations.find((d) => d.slug === req.params.slug);
      if (!dest) {
        res.status(404).json({ success: false, error: 'Направление не найдено' });
        return;
      }
      res.json({ success: true, data: dest });
    } catch (error) {
      next(error);
    }
  },
};
