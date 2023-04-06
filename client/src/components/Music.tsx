import { DragTransferData } from '../domain/DragTransferData';
import { DragTransferTypes } from '../utils/ReactFlow';
import * as S from './styles/common';

interface MusicProps {
  id: number;
  name: string;
  videoId: string;
  selected: boolean;
}

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
