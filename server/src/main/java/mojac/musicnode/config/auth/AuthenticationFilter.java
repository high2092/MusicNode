package mojac.musicnode.config.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;

@Slf4j
@Component
@RequiredArgsConstructor
public class AuthenticationFilter extends OncePerRequestFilter {
    
    private final SecurityUtil securityUtil;
    private final String JWT_COOKIE_KEY = "MN_TOKEN";

    // TODO: 리팩토링.. depth가 너무 깊음
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {


        Cookie[] cookies = request.getCookies();

        String jwt = null;
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals(JWT_COOKIE_KEY)) {
                    jwt = cookie.getValue();
                    break;
                }
            }

            if (jwt != null) {
                try {
                    Claims claims = securityUtil.get(jwt);
                    Long userId = Long.parseLong(claims.getSubject());
                    Authentication authentication = new UsernamePasswordAuthenticationToken(userId, null, Arrays.asList(new SimpleGrantedAuthority("ROLE_USER")));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                } catch (ExpiredJwtException e) {
                    Cookie resetCookie = new Cookie(JWT_COOKIE_KEY, null);
                    resetCookie.setMaxAge(0);
                    response.addCookie(resetCookie);
                    response.setStatus(HttpStatus.UNAUTHORIZED.value());
                }
            }

        }

        filterChain.doFilter(request, response);

    }
}

