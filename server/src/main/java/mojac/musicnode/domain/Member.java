package mojac.musicnode.domain;

import jakarta.persistence.*;
import mojac.musicnode.domain.thumb.Thumbs;

import java.util.List;

@Entity
public class Member {
    @Id @GeneratedValue
    @Column(name = "member_id")
    private Long id;

    private String name;

    @OneToMany(mappedBy = "member")
    private List<Thumbs> thumbs;
}
