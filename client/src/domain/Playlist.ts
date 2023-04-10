import { MusicInfo } from './MusicInfo';

interface PlaylistConstructorProps {
  id: number;
  name: string;
  contents: string;
}

export class Playlist {
  id?: number;
  name?: string;
  contents: MusicInfo[];

  constructor({ id, name, contents }: PlaylistConstructorProps) {
    this.id = id;
    this.name = name;
    this.contents = Object.values(JSON.parse(contents));
  }
}
