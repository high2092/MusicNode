package mojac.musicnode.service;

import lombok.RequiredArgsConstructor;
import mojac.musicnode.domain.Music;
import mojac.musicnode.repository.MusicRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MusicService {

    private final MusicRepository musicRepository;

    @Transactional
    public Long saveMusic(Music music) {
        musicRepository.save(music);
        return music.getId();
    }

    public List<Music> findMusics() {
        return musicRepository.findAll();
    }
}