import { useRecoilState } from 'recoil';
import { DragTransferData } from '../domain/DragTransferData';
import { DragTransferTypes } from '../utils/ReactFlow';
import { httpDelete } from '../utils/common';
import * as S from './styles/Music';
import { SelectableDiv } from './styles/common';
import { musicMapAtom } from '../store';

interface MusicProps {
  id: number;
  name: string;
  videoId: string;
  selected: boolean;
  hovered: boolean;
}

export const MusicComponent = ({ id, name, videoId, selected, hovered }: MusicProps) => {
  const [musicMap, setMusicMap] = useRecoilState(musicMapAtom);

  const handleDragStart = (e: React.DragEvent, data: DragTransferData) => {
    e.dataTransfer.setData('application/reactflow', JSON.stringify(data));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDeleteButtonClick = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();

    const response = await httpDelete(`music/${id}`);
    if (response.ok) {
      setMusicMap((musicMap) => {
        musicMap.delete(id);
        return new Map(musicMap);
      });
    }
  };

  return (
    <SelectableDiv count={Number(selected) as 0 | 1} onDragStart={(e) => handleDragStart(e, new DragTransferData({ musicId: id, musicName: name, videoId, type: DragTransferTypes.MUSIC }))} draggable>
      <div>
        {id} | {name} | {videoId}
      </div>
      {hovered && <S.MusicDeleteButton onClick={(e) => handleDeleteButtonClick(e, id)}>X</S.MusicDeleteButton>}
    </SelectableDiv>
  );
};
