package mojac.musicnode.config.auth;

import io.jsonwebtoken.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
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

    public ResponseCookie generateAccessTokenCookie(Long memberId) {
        Long 분 = 60 * 1000L;
        Long 시간 = 60 * 분;
        Long expiration = 12 * 시간;
        String jwt = createJwt(memberId.toString(), expiration, null);
        return ResponseCookie.from("MN_TOKEN", jwt)
                .httpOnly(true)
                .path("/")
                .build();
    }
}
