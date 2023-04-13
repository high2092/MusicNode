package mojac.musicnode.service;

import lombok.RequiredArgsConstructor;
import mojac.musicnode.domain.Member;
import mojac.musicnode.domain.MusicNode;
import mojac.musicnode.domain.Position;
import mojac.musicnode.repository.MusicNodeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

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
    public void deleteMusicNodes(List<Long> nodes) {
        nodes.stream()
                .map(id -> musicNodeRepository.findById(id).get()) // 예외는 말그대로 예외
                .forEach(node -> {
                    musicNodeRepository.nullifyPrevNext(node);
                    musicNodeRepository.delete(node);
                });
    }

    @Transactional
    public void disconnectWithPrevNodes(Long id) {
        MusicNode node = musicNodeRepository.findById(id).get();
        musicNodeRepository.nullifyPrevNext(node);
    }

    @Transactional
    public void patchMusicNode(MusicNode node, MusicNode next, String color, Position position) {
        node.patch(next, color, position);
    }

    public Optional<MusicNode> findOne(Long id) {
        return musicNodeRepository.findById(id);
    }

    public List<MusicNode> findAll(Member member) {
        return musicNodeRepository.findAll();
    }

    @Transactional
    public void connect(MusicNode source, MusicNode target) {
        MusicNode.connect(source, target);
    }

    @Transactional
    public void moveNode(MusicNode node, Position position) {
        node.move(position);
    }
}
