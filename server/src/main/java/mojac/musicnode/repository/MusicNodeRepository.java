package mojac.musicnode.repository;
import mojac.musicnode.domain.Member;
import mojac.musicnode.domain.MusicNode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MusicNodeRepository extends JpaRepository<MusicNode, Long> {

    List<MusicNode> findAllByMember(Member member);
    MusicNode findByNext(MusicNode node);
    @Modifying
    @Query("update MusicNode m set m.next = null where m.next = :next")
    int nullifyPrevNext(@Param("next") MusicNode node);
}
