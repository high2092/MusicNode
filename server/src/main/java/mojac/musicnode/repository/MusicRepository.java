package mojac.musicnode.repository;

import mojac.musicnode.domain.Member;
import mojac.musicnode.domain.Music;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MusicRepository extends JpaRepository<Music, Long> {

    Music findByIdAndMember(Long id, Member member);
    List<Music> findAllByMember(Member member);
}
