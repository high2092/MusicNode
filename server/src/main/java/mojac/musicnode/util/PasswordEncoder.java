package mojac.musicnode.util;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PasswordEncoder {

    @Value("${app.password-salt}") private String salt;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public String encode(String plain) {
        return bCryptPasswordEncoder.encode(plain + salt);
    }

    public boolean matches(String plain, String cipher) {
        return bCryptPasswordEncoder.matches(plain + salt, cipher);
    }
}
