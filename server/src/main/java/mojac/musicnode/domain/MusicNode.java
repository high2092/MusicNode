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

    @OneToOne
    private MusicNode next;

    private String color;
    private Position position = new Position();

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
        p.next = n;
    }

    public static void connect(MusicNode source, MusicNode target) {
        source.next = target;
    }

    public static void disconnect(MusicNode source) {
        source.next = null;
    }
}
