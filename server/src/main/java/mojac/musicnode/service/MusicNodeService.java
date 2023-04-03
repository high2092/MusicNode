package mojac.musicnode.service;

import lombok.RequiredArgsConstructor;
import mojac.musicnode.domain.MusicNode;
import mojac.musicnode.domain.Position;
import mojac.musicnode.repository.MusicNodeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MusicNodeService {

    private final MusicNodeRepository musicNodeRepository;

    @Transactional
    public Long saveMusicNode(MusicNode node) {
        musicNodeRepository.save(node);
        return node.getId();
    }

    @Transactional
    public void deleteMusicNode(MusicNode node) {
        MusicNode prev = musicNodeRepository.findPrev(node);
        if (prev != null) MusicNode.disconnect(prev);
        MusicNode.disconnect(node);

        musicNodeRepository.delete(node);
    }

    @Transactional
    public void patchMusicNode(MusicNode node, MusicNode next, String color, Position position) {
        node.patch(next, color, position);
    }

    public MusicNode findOne(Long id) {
        return musicNodeRepository.findOne(id);
    }

    public List<MusicNode> findAll() {
        return musicNodeRepository.findAll();
    }

    @Transactional
    public void connect(MusicNode source, MusicNode target) {
        MusicNode.connect(source, target);
    }

    @Transactional
    public void disconnect(MusicNode source) {
        MusicNode.disconnect(source);
    }
}
