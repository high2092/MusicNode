package mojac.musicnode.repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import lombok.RequiredArgsConstructor;
import mojac.musicnode.domain.Member;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class MemberRepository {

    private final EntityManager em;

    public void save(Member member) {
        if (member.getId() == null) {
            em.persist(member);
        } else {
            em.merge(member);
        }
    }

    public Member findOneByOAuthId(Long oauthId) {
        try {
            return em.createQuery("select m from Member m where m.oauth_id = :oauth_id", Member.class)
                    .setParameter("oauth_id", oauthId)
                    .getSingleResult();
        } catch (NoResultException e) {
            return null;
        }
    }

    public Member findOneByUid(String uid) {
        try {
            return em.createQuery("select m from Member m where m.uid = :uid", Member.class)
                    .setParameter("uid", uid)
                    .getSingleResult();
        } catch (NoResultException e) {
            return null;
        }
    }

    public Member findOneByUidAndCipher(String uid, String cipher) {
        try {
            return em.createQuery("select m from Member m where m.uid = :uid and m.password = :password", Member.class)
                    .setParameter("uid", uid)
                    .setParameter("password", cipher)
                    .getSingleResult();
        } catch (NoResultException e) {
            return null;
        }
    }

}
