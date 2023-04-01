package mojac.musicnode.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

import java.awt.*;

@Entity
@Getter
@Slf4j
public class MusicNode {
    @Id @GeneratedValue
    @Column(name = "music_node_id")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    private Member member; // 흠..

    @ManyToOne(fetch = FetchType.LAZY)
    private Music music;

    @OneToOne(fetch = FetchType.LAZY)
    private MusicNode prev;

    @OneToOne(fetch = FetchType.LAZY)
    private MusicNode next;

    private String color;

    protected MusicNode() {}
    public MusicNode(Music music) {
        this.music = music;
    }

    public MusicNode(Music music, String color) {
        this.music = music;
        this.color = color;
    }

    public static void insert(MusicNode p, MusicNode n) {
        n.next = p.next;
        n.prev = p;

        if (p.next != null) p.next.prev = n;
        p.next = n;
    }

    public static void connect(MusicNode source, MusicNode target) {
        if (source.next != null) {
            source.next.prev = null;
        }
        source.next = target;
        target.prev = source;
    }

    public static void disconnect(MusicNode source) {
        if (source.next != null) {
            source.next.prev = null;
            source.next = null;
        }
    }
}
