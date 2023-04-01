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
}
