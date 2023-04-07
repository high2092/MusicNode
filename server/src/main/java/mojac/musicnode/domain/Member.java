package mojac.musicnode.domain;

import jakarta.persistence.*;
import lombok.Getter;
import mojac.musicnode.domain.thumb.Thumbs;

import java.util.List;

@Entity
@Getter
public class Member {
    @Id @GeneratedValue
    @Column(name = "member_id")
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Long oauth_id;

    @OneToMany(mappedBy = "member")
    private List<Thumbs> thumbs;

    protected Member() {}

    public Member(String name, Long oauth_id) {
        this.id = id;
        this.name = name;
        this.oauth_id = oauth_id;
    }

    public void changeName(String name) {
        this.name = name;
    }
}
