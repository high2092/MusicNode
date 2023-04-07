import { generateRandomHexColor } from '../utils/ReactFlow';
import { MusicNode } from './MusicNode';
import { Position } from './Position';

interface ReactFlowNodeConstructorProps {
  id: number;
  musicName: string;
  position?: Position;
  backgroundColor?: string;
  videoId: string;
}

export class ReactFlowNode {
  id: string;
  data: { label: string };
  position: Position;
  style: { backgroundColor: string };
  musicName: string;
  videoId: string;

  constructor({ id, musicName, position, backgroundColor, videoId }: ReactFlowNodeConstructorProps) {
    this.id = id.toString();
    this.data = { label: musicName };
    this.position = position ?? new Position();
    this.style = { backgroundColor: backgroundColor ?? generateRandomHexColor() };
    this.musicName = musicName;
    this.videoId = videoId;
  }
}
