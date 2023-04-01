package mojac.musicnode.service;

import lombok.RequiredArgsConstructor;
import mojac.musicnode.domain.MusicNode;
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
