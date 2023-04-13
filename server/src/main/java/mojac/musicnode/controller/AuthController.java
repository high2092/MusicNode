package mojac.musicnode.controller;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mojac.musicnode.config.auth.SecurityUtil;
import mojac.musicnode.exception.NotAuthenticatedException;
import mojac.musicnode.service.MemberService;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
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
    public GetLoginInfoResponse getLoginInfo(Authentication authentication) {
        if (authentication == null) throw new NotAuthenticatedException();
        Long memberId = (Long) authentication.getPrincipal();
        return new GetLoginInfoResponse(memberId);
    }

    @PostMapping("/register")
    public MemberRegisterResponse register(@RequestBody MemberRegisterRequest request) {
        Long memberId = memberService.join(request.getUid(), request.getName(), request.getPassword(), null);

        return new MemberRegisterResponse(memberId);
    }

    @PostMapping("/login")
    public ResponseEntity<MemberLoginResponse> login(@RequestBody MemberLoginRequest request, HttpServletResponse response) {
        Long memberId = memberService.login(request.getUid(), request.getPassword());

        ResponseCookie responseCookie = securityUtil.generateAccessTokenCookie(memberId);

        log.info("cookie = {}", responseCookie.toString());

        return ResponseEntity
                .status(HttpStatus.OK)
                .header(HttpHeaders.SET_COOKIE, responseCookie.toString())
                .contentType(MediaType.APPLICATION_JSON)
                .body(new MemberLoginResponse(memberId));
    }

    @Getter
    static class MemberRegisterRequest {

        @NotEmpty private String uid;
        @NotEmpty private String name;
        @NotEmpty private String password;
    }

    @Getter
    @AllArgsConstructor
    static class GetLoginInfoResponse {
        private Long id;
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
