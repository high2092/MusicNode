package mojac.musicnode.repository;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import mojac.musicnode.domain.MusicNode;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class MusicNodeRepository {
    private final EntityManager em;

    public void save(MusicNode node) {
        if (node.getId() == null) {
            em.persist(node);
        } else {
            em.merge(node);
        }
    }

    public void delete(MusicNode node) {
        em.remove(node);
    }

    public MusicNode findOne(Long id) {
        return em.find(MusicNode.class, id);
    }

    public List<MusicNode> findAll() {
        return em.createQuery("select m from MusicNode m", MusicNode.class)
                .getResultList();
    }
}
