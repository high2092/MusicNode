package mojac.musicnode.service;

import lombok.RequiredArgsConstructor;
import mojac.musicnode.domain.MusicNode;
import mojac.musicnode.repository.MusicNodeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
}
