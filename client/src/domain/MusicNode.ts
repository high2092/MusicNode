import { Position } from './Position';

interface MusicNodeConstroctorProps {
  id: number;
  musicId: number;
  musicName: string;
  videoId: string;
  next?: number;
  position?: Position;
}

export class MusicNode implements IMusicNode {
  id: number;
  musicId: number;
  musicName: string;
  videoId: string;
  next: number;
  position: Position;

  constructor({ id, musicId, musicName, videoId, next, position }: MusicNodeConstroctorProps) {
    this.id = id;
    this.musicId = musicId;
    this.musicName = musicName;
    this.videoId = videoId;
    this.next = next ?? null;
    this.position = position ?? new Position();
  }
}
