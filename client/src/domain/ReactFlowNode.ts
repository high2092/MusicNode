import { MusicNode } from './MusicNode';
import { Position } from './Position';

const generateRandomHexColor = () => {
  return `#${Math.floor(Math.random() * Math.pow(2, 24))
    .toString(16)
    .padStart(6, '0')}`;
};

interface ReactFlowNodeConstructorProps {
  id: number;
  musicName: string;
  position?: Position;
  backgroundColor?: string;
}

export class ReactFlowNode {
  id: string;
  data: { label: string };
  position: Position;
  style: { backgroundColor: string };

  constructor({ id, musicName, position, backgroundColor }: ReactFlowNodeConstructorProps) {
    this.id = id.toString();
    this.data = { label: musicName };
    this.position = position ?? new Position();
    this.style = { backgroundColor: backgroundColor ?? generateRandomHexColor() };
  }
}
