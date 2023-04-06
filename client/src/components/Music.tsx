import * as S from './styles/Music';

interface MusicProps {
  id: number;
  name: string;
  videoId: string;
  selected: boolean;
}

class DragTransferData {
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

const DragTransferTypes = {
  MUSIC: 'dragTransferMusic',
  SEARCH_RESULT: 'dragTransferSearchResult',
};

type DragTransferType = typeof DragTransferTypes[keyof typeof DragTransferTypes];

export const Music = ({ id, name, videoId, selected }: MusicProps) => {
  const handleDragStart = (e: React.DragEvent, data: DragTransferData) => {
    e.dataTransfer.setData('application/reactflow', JSON.stringify(data));
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <S.SelectableDiv count={Number(selected) as 0 | 1} onDragStart={(e) => handleDragStart(e, new DragTransferData({ musicId: id, musicName: name, videoId, type: DragTransferTypes.MUSIC }))} draggable>
      {id} | {name} | {videoId}
    </S.SelectableDiv>
  );
};
