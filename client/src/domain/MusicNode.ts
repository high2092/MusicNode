import { Position } from './Position';

export class MusicNode implements IMusicNode {
  id: number;
  musicId: number;
  musicName: string;
  videoId: string;
  next: number;
  position: Position;

  constructor({ id, musicId, musicName, videoId, next, position }: IMusicNode) {
    this.id = id;
    this.musicId = musicId;
    this.musicName = musicName;
    this.videoId = videoId;
    this.next = next;
    this.position = position;
  }
}
