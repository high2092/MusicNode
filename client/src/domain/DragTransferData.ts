import { DragTransferTypes } from '../utils/ReactFlow';

type DragTransferType = typeof DragTransferTypes[keyof typeof DragTransferTypes];

export class DragTransferData {
  musicId?: number;
  musicName: string;
  videoId: string;
  type: DragTransferType;

  constructor({ musicId, musicName, videoId, type }: DragTransferData) {
    this.musicId = musicId;
    this.musicName = musicName;
    this.videoId = videoId;
    this.type = type;
  }
}
