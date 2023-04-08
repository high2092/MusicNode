package mojac.musicnode.config.auth;

import io.jsonwebtoken.*;
import jakarta.servlet.http.Cookie;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;

@Component
@RequiredArgsConstructor
public class SecurityUtil {
    @Value("${app.auth.token-secret}") private String secret;

    public String createJwt(String subject, Long expiration, HashMap<String, Object> claim) {
        JwtBuilder jwtBuilder = Jwts.builder()
                .setHeaderParam("typ", "JWT")
                .setSubject(subject)
                .setIssuedAt(new Date())
                .signWith(SignatureAlgorithm.HS256, secret);

        if (claim != null) {
            jwtBuilder.setClaims(claim);
        }

        if (expiration != null) {
            jwtBuilder.setExpiration(new Date(new Date().getTime() + expiration));
        }

        return jwtBuilder.compact();
    }

    public Claims get(String jwt) throws JwtException {
        return Jwts
                .parser()
                .setSigningKey(secret)
                .parseClaimsJws(jwt)
                .getBody();
    }

    public Cookie generateAccessToken(Long memberId) {
        String jwt = createJwt(memberId.toString(), null, null);
        Cookie cookie = new Cookie("MN_TOKEN", jwt);
        cookie.setHttpOnly(true);
        cookie.setMaxAge(3600); // 쿠키 유효 시간 설정 (초 단위)
        cookie.setPath("/");
        return cookie;
    }
}
