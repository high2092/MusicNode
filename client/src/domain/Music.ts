export class Music implements IMusic {
  id: number;
  name: string;
  videoId: string;

  constructor({ id, name, videoId }: IMusic) {
    this.id = id;
    this.name = name;
    this.videoId = videoId;
  }
}
