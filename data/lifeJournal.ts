import journal from './generated/journal.json';

export type LifeEntry = {
  id: string;
  date: string | null;
  example?: boolean;
  summary: [string, string];
  image?: { src: string; alt: [string, string]; width?: number; height?: number };
};

export const lifeEntries = journal.life as LifeEntry[];
