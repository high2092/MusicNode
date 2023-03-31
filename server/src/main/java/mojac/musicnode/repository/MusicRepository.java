package mojac.musicnode.repository;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import mojac.musicnode.domain.Music;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class MusicRepository {
    private final EntityManager em;

    public void save(Music music) {
        if (music.getId() == null) {
            em.persist(music);
        } else {
            em.merge(music);
        }
    }

    public Music findOne(Long id) {
        return em.find(Music.class, id);
    }

    public List<Music> findAll() {
        return em.createQuery("select m from Music m", Music.class)
                .getResultList();
    }
}
