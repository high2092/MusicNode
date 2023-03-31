package mojac.musicnode.domain.thumb;

import jakarta.persistence.*;
import mojac.musicnode.domain.Member;
import mojac.musicnode.domain.MusicList;

import java.time.LocalDateTime;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn
public abstract class Thumbs {
    @Id @GeneratedValue
    @Column(name = "thumbs_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "music_list_id")
    private MusicList musicList;

    private LocalDateTime createdAt;

    Thumbs(Member member, MusicList musicList) {
        this.member = member;
        this.musicList = musicList;
        this.createdAt = LocalDateTime.now();
    }
}
