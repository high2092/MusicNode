package mojac.musicnode.service;

import lombok.RequiredArgsConstructor;
import mojac.musicnode.domain.Member;
import mojac.musicnode.domain.Playlist;
import mojac.musicnode.repository.PlaylistRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PlaylistService {

    private final PlaylistRepository playlistRepository;

    @Transactional
    public void save(Playlist playlist) {
        playlistRepository.save(playlist);
    }

    @Transactional(readOnly = true)
    public Playlist findOne(Long id, Member member) {
        return playlistRepository.findByIdAndMember(id, member);
    }

    @Transactional(readOnly = true)
    public List<Playlist> findAll(Member member) {
        return playlistRepository.findByMember(member);
    }
}
