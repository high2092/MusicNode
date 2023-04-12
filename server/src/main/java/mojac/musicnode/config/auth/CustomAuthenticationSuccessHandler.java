package mojac.musicnode.config.auth;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mojac.musicnode.domain.Member;
import mojac.musicnode.repository.MemberRepository;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final MemberRepository memberRepository;
    private final SecurityUtil securityUtil;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        log.info("인증 성공");

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        Long oAuthId = (Long) oAuth2User.getAttributes().get("id");

        log.info("oAuthId = {}", oAuthId);

        Member member = memberRepository.findByOauthId(oAuthId);

        ResponseCookie cookie = securityUtil.generateAccessTokenCookie(member.getId());

        response.setHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        response.setStatus(HttpStatus.OK.value());
    }

}
