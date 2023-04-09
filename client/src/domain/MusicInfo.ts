export class MusicInfo {
  name: string;
  videoId: string;
  cycle?: 'head' | 'tail';

  constructor(name: string, videoId: string, cycle?: 'head' | 'tail') {
    this.name = name;
    this.videoId = videoId;
    this.cycle = cycle;
  }
}

export type Playlist = Map<number, MusicInfo>;
