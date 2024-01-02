package com.developaw.harupuppy.domain.user.application;

import com.developaw.harupuppy.domain.user.dto.TokenDto;
import com.developaw.harupuppy.domain.user.dto.response.LoginResponse;
import com.developaw.harupuppy.domain.user.dto.response.OAuthLoginResponse;
import com.developaw.harupuppy.global.utils.JwtTokenUtils;
import java.time.Duration;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserFacadeService {
    @Value("${jwt.refresh-expired-time-ms}")
    private Long refreshExpiredTimeMs;
    private final OAuthService oAuthService;
    private final JwtTokenUtils jwtTokenUtils;
    private final RedisService redisService;

    public LoginResponse login(String provider, String code) {
        OAuthLoginResponse response = oAuthService.login(provider, code);
        String email = response.email();
        if (response.isAlreadyRegistered()) {
            TokenDto token = jwtTokenUtils.generateToken(response.registeredUser());
            redisService.setValue(token.refreshToken(), email, Duration.ofMillis(refreshExpiredTimeMs));
            return new LoginResponse(response, token.accessToken(), token.refreshToken());
        }
        return LoginResponse.of(response);
    }
}