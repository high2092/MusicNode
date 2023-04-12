package mojac.musicnode.repository;

import mojac.musicnode.domain.Member;
import mojac.musicnode.domain.Music;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MusicRepository extends JpaRepository<Music, Long> {

    List<Music> findAllByMember(Member member);
}
