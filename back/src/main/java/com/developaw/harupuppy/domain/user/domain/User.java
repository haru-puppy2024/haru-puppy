package com.developaw.harupuppy.domain.user.domain;

import com.developaw.harupuppy.domain.dog.domain.Dog;
import com.developaw.harupuppy.domain.user.dto.UserUpdateRequest;
import com.developaw.harupuppy.global.utils.KoreanNickname;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

@Entity
@Getter
@Table(name = "USERS")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SQLDelete(sql = "UPDATE users SET is_deleted = true WHERE user_id = ?")
@Where(clause = "is_deleted = false")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Email
    @Column(unique = true)
    private String email;

    @Column(name = "img_url")
    private String imgUrl;

    @KoreanNickname
    private String nickname;

    @Enumerated(EnumType.STRING)
    @Column(name = "user_role")
    private UserRole userRole;

    @Column(name = "is_deleted", columnDefinition = "TINYINT(1)")
    private boolean isDeleted;

    @Column(name = "allow_notification", columnDefinition = "TINYINT(1)")
    private boolean allowNotification;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dog_id")
    private Dog dog;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "home_id")
    private Home home;

    @Builder
    public User(String email, String userImg, String nickname, UserRole userRole, Home home, Dog dog) {
        this.email = email;
        this.imgUrl = userImg;
        this.nickname = nickname;
        this.userRole = userRole;
        this.dog = dog;
        this.home = home;
        this.isDeleted = false;
        this.allowNotification = true;
    }

    public void update(UserUpdateRequest updateRequest) {
        this.nickname = updateRequest.nickname();
        this.userRole = updateRequest.userRole();
    }

    public void setHome(Home home) {
        this.home = home;
    }
}
