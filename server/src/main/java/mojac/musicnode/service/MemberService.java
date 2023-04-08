package mojac.musicnode.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mojac.musicnode.domain.Member;
import mojac.musicnode.exception.AuthenticationFailedException;
import mojac.musicnode.exception.DuplicateUidException;
import mojac.musicnode.repository.MemberRepository;
import mojac.musicnode.util.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public Long join(String uid, String name, String password, Long oauth_id) {

        validateUid(uid);

        String cipher = passwordEncoder.encode(password);

        log.info("login cipher = {}", cipher);
        Member member = new Member(uid, name, cipher, oauth_id);
        memberRepository.save(member);

        return member.getId();
    }

    public Long login(String uid, String password) {
        Member member = memberRepository.findOneByUid(uid);

        if (member != null && passwordEncoder.matches(password, member.getPassword())) {
            return member.getId();
        } else {
            throw new AuthenticationFailedException();
        }
    }

    private void validateUid(String uid) {
        Member member = memberRepository.findOneByUid(uid);

        if (member != null) {
            throw new DuplicateUidException();
        }
    }
}
