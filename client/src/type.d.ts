interface IMusic {
  id: number;
  name: string;
  videoId: string;
}

interface IMusicNode {
  id: number;
  musicId: number;
  musicName: string;
  videoId: string;
  next: number;
  position: IPosition;
}

interface IPosition {
  x: number;
  y: number;
}

interface IMusicNodeInfo {
  id: string;
  musicName: string;
  videoId: string;
}

interface IPlaylist {
  id?: number;
  name?: string;
  contents: Map<number, IMusicInfo>;
}
