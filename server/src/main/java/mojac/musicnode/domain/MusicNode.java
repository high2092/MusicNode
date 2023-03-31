package mojac.musicnode.domain;

import jakarta.persistence.*;

import java.awt.*;

@Entity
public class MusicNode {
    @Id @GeneratedValue
    @Column(name = "music_node_id")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    private Member member; // 흠..

    @OneToOne(fetch = FetchType.LAZY)
    private PersonalizedMusic music;

    @OneToOne(fetch = FetchType.LAZY)
    private MusicNode prev;

    @OneToOne(fetch = FetchType.LAZY)
    private MusicNode next;

    private Color color;

    MusicNode(PersonalizedMusic music) {
        this.music = music;
    }

    public static void insert(MusicNode p, MusicNode n) {
        n.next = p.next;
        n.prev = p;

        if (p.next != null) p.next.prev = n;
        p.next = n;
    }
}
