export interface InteractivePoint {
  id: string;
  title: string;
  description: string;
  date: string;
  skills: string[];
  link?: string;
  position?: { x: number; y: number; z: number };
  color?: { r: number; g: number; b: number };
}
