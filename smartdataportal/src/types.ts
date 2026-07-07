export interface Solution {
  id: string; // "01", "02", etc.
  name: string;
  mileType: 'energy' | 'mobility' | 'safety' | 'data';
  mileLabel: string;
  description: string;
  location: string;
  features: string[];
  data: string[];
  partners: string;
  videoUrl?: string;
  videoThumb?: string;
  x: number; // map % coordinates
  y: number;
}
