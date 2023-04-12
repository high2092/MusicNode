package mojac.musicnode.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import mojac.musicnode.domain.thumb.Thumbs;

import java.util.List;

@Entity
@Getter
public class Member {
    @Id @GeneratedValue
    @Column(name = "member_id")
    private Long id;

    @Column
    @NotEmpty
    private String uid;

    @Column(nullable = false)
    private String name;

    private String password;

    @Column
    private Long oauthId;

    @OneToMany(mappedBy = "member")
    private List<Thumbs> thumbs;

    protected Member() {}

    public Member(String uid, String name, String cipher, Long oauthId) {
        this.uid = uid;
        this.name = name;
        this.password = cipher;
        this.oauthId = oauthId;
    }

    public void changeName(String name) {
        this.name = name;
    }
}
