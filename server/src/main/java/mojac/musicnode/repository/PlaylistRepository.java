package mojac.musicnode.repository;

import mojac.musicnode.domain.Member;
import mojac.musicnode.domain.Playlist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PlaylistRepository extends JpaRepository<Playlist, Long> {

    Playlist findByIdAndMember(Long id, Member member);
    List<Playlist> findByMember(Member member);
}
