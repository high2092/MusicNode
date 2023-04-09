package mojac.musicnode.domain;

import jakarta.persistence.*;
import lombok.Getter;
import mojac.musicnode.domain.thumb.Thumbs;

import java.util.List;

@Entity
@Getter
public class Playlist {
    @Id @GeneratedValue
    @Column(name = "music_list_id")
    private Long id;

    private String contents; // JSON String

    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @OneToMany(mappedBy = "playlist")
    private List<Thumbs> thumbs;

    protected Playlist() {}

    public Playlist(String name, String contents, Member member) {
        this.name = name;
        this.contents = contents;
        this.member = member;
    }

    public void rename(String name) {
        this.name = name;
    }
}
