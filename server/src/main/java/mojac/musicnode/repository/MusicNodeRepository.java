package mojac.musicnode.repository;
import mojac.musicnode.domain.Member;
import mojac.musicnode.domain.MusicNode;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MusicNodeRepository extends JpaRepository<MusicNode, Long> {

    List<MusicNode> findAllByMember(Member member);
    MusicNode findByNext(MusicNode node);

}
