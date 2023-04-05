import { MusicNode } from './MusicNode';
import { Position } from './Position';

const generateRandomHexColor = () => {
  return `#${Math.floor(Math.random() * Math.pow(2, 24))
    .toString(16)
    .padStart(6, '0')}`;
};

export class ReactFlowNode {
  id: string;
  data: { label: string };
  position: Position;
  style: { backgroundColor: string };

  constructor({ id, musicName }: MusicNode, position: Position, backgroundColor?: string) {
    this.id = id.toString();
    this.data = { label: musicName };
    this.position = position;
    this.style = { backgroundColor: backgroundColor ?? generateRandomHexColor() };
  }
}
