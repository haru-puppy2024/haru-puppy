package com.developaw.harupuppy.domain.user.application;

import com.developaw.harupuppy.domain.user.domain.UserDetail;
import com.developaw.harupuppy.domain.user.dto.TokenDto;
import com.developaw.harupuppy.domain.user.dto.request.HomeCreateRequest;
import com.developaw.harupuppy.domain.user.dto.request.UserCreateRequest;
import com.developaw.harupuppy.domain.user.dto.response.LoginResponse;
import com.developaw.harupuppy.domain.user.dto.response.OAuthLoginResponse;
import com.developaw.harupuppy.domain.user.dto.response.UserCreateResponse;
import com.developaw.harupuppy.domain.user.dto.response.UserDetailResponse;
import com.developaw.harupuppy.global.common.exception.CustomException;
import com.developaw.harupuppy.global.common.response.Response.ErrorCode;
import com.developaw.harupuppy.global.utils.JwtTokenUtils;
import java.time.Duration;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Slf4j
public class UserFacadeService {
    @Value("${jwt.refresh-expired-time-ms}")
    private Long refreshExpiredTimeMs;
    private final OAuthService oAuthService;
    private final UserService userService;
    private final JwtTokenUtils jwtTokenUtils;
    private final RedisService redisService;

    @Transactional
    public LoginResponse login(String provider, String code) {
        OAuthLoginResponse response = oAuthService.login(provider, code);
        if (response.isAlreadyRegistered()) {
            TokenDto token = createTokenAndSave(response.registeredUser());
            return new LoginResponse(response, token.accessToken(), token.refreshToken());
        }
        return LoginResponse.of(response);
    }

    @Transactional
    public UserCreateResponse create(HomeCreateRequest request) {
        UserCreateResponse userDetail = userService.create(request);
        TokenDto token = createTokenAndSave(userDetail.getUserResponse());
        userDetail.setToken(token);
        return userDetail;
    }

    @Transactional
    public UserCreateResponse create(UserCreateRequest request, String homeId) {
        UserCreateResponse userDetail = userService.create(request, homeId);
        TokenDto token = createTokenAndSave(userDetail.getUserResponse());
        userDetail.setToken(token);
        return userDetail;
    }

    @Transactional
    public TokenDto createTokenAndSave(UserDetailResponse response) {
        TokenDto token = jwtTokenUtils.generateToken(response);
        redisService.setValue(token.tokenKey(), token.refreshToken(), Duration.ofMillis(refreshExpiredTimeMs));
        return token;
    }

    @Transactional
    public void withdraw(UserDetail requestUser){
        String email = userService.withdraw(requestUser.getUserId());
        redisService.deleteValue(email);
    }

    @Transactional
    public TokenDto reissue(String refreshToken){
        final String validToken = validateToken(refreshToken);
        Long userId = jwtTokenUtils.resolveUserId(validToken);
        String key = jwtTokenUtils.resolveTokenKey(validToken);

        if(!redisService.getValues(key).map(value -> value.equals(validToken)).orElse(false)) {
            throw new CustomException(ErrorCode.INVALID_TOKEN);
        }

        UserDetail userDetail = userService.loadByUserId(userId);
        TokenDto newToken = createTokenAndSave(UserDetailResponse.of(userDetail));
        redisService.deleteValue(key);
        return newToken;
    }

    @Transactional
    public void logout(String accessToken){
        final String validToken = validateToken(accessToken);
        String key = jwtTokenUtils.resolveTokenKey(validToken);
        redisService.deleteValue(key);
    }

    private String validateToken(String refreshToken){
        if(!refreshToken.startsWith("Bearer ")){
            throw new CustomException(ErrorCode.INVALID_TOKEN);
        }

        refreshToken = refreshToken.split(" ")[1];
        if(jwtTokenUtils.isExpired(refreshToken)) {
            throw new CustomException(ErrorCode.EXPIRED_TOKEN);
        }

        return refreshToken;
    }
}