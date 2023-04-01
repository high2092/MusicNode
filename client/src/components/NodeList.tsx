import { Node } from './Node';
import * as S from './styles/NodeList';

export const NodeList = ({ musicNodeList }) => {
  return (
    <S.NodeList>
      {musicNodeList.map(({ id, prev, next }) => {
        const props = { id, prev, next };
        return <Node key={id} {...props} />;
      })}
    </S.NodeList>
  );
};
