package mojac.musicnode.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mojac.musicnode.config.auth.SecurityUtil;
import mojac.musicnode.service.MemberService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final MemberService memberService;
    private final SecurityUtil securityUtil;

    @GetMapping("/login/oauth2/kakao")
    public void oauthLogin(HttpServletResponse response) throws IOException {
        response.sendRedirect("/oauth2/authorization/kakao");
    }

    @GetMapping("/login-info")
    public String getLoginInfo(Authentication authentication) {
        Object userId = authentication.getPrincipal();

        return userId.toString();
    }

    @PostMapping("/register")
    public MemberRegisterResponse register(@RequestBody MemberRegisterRequest request) {
        Long memberId = memberService.join(request.getUid(), request.getName(), request.getPassword(), null);

        return new MemberRegisterResponse(memberId);
    }

    @PostMapping("/login")
    public MemberLoginResponse login(@RequestBody MemberLoginRequest request, HttpServletResponse response) {
        Long memberId = memberService.login(request.getUid(), request.getPassword());

        Cookie cookie = securityUtil.generateAccessToken(memberId);
        response.addCookie(cookie);

        return new MemberLoginResponse(memberId);
    }

    @Getter
    static class MemberRegisterRequest {

        @NotEmpty private String uid;
        @NotEmpty private String name;
        @NotEmpty private String password;
    }

    @Getter
    @AllArgsConstructor
    static class MemberRegisterResponse {
        private Long id;
    }

    @Getter
    static class MemberLoginRequest {

        @NotEmpty private String uid;
        @NotEmpty private String password;
    }

    @Getter
    @AllArgsConstructor
    static class MemberLoginResponse {
        private Long id;
    }
}
