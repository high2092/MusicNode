package mojac.musicnode.repository;
import mojac.musicnode.domain.Member;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Member, Long> {

    Member findByOauthId(Long oauthId);
    Member findByUid(String uid);
}
