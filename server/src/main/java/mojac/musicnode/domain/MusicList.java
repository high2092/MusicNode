package mojac.musicnode.domain;

import jakarta.persistence.*;
import mojac.musicnode.domain.thumb.Thumbs;

import java.util.List;

@Entity
public class MusicList {
    @Id @GeneratedValue
    @Column(name = "music_list_id")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    private MusicNode head;

    private String name;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @OneToMany(mappedBy = "musicList")
    private List<Thumbs> thumbs;

    protected MusicList() {}

    public MusicList(String name, Member member) {
        this.name = name;
        this.member = member;
    }

    public void rename(String name) {
        this.name = name;
    }
}
