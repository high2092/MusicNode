import { MusicInfo } from './MusicInfo';

interface PlaylistConstructorProps {
  id: number;
  name: string;
  contents: string;
}

export class Playlist {
  id: number;
  name: string;
  contents: Map<number, MusicInfo>;

  constructor({ id, name, contents }: PlaylistConstructorProps) {
    this.id = id;
    this.name = name;
    this.contents = new Map(Object.entries(JSON.parse(contents))) as unknown as Map<number, MusicInfo>;
  }
}
