package mojac.musicnode.util;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;


@SpringBootTest
@Transactional
class PasswordEncoderTest {

    @Autowired PasswordEncoder passwordEncoder;

    @Test
    public void 암호화_및_대조_통합_테스트() {
        String plain = "hello!";

        String cipher = passwordEncoder.encode(plain);

        Assertions.assertThat(cipher.length()).isEqualTo(60);
        Assertions.assertThat(passwordEncoder.matches(plain, cipher)).isEqualTo(true);
    }

}