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
    @JoinColumn(name = "member_id")
    private Member member;

    private MusicInfo musicInfo;

    @OneToOne
    private MusicNode next;

    private String color;
    private Position position = new Position();

    protected MusicNode() {}

    public MusicNode(Music music) {
        this.musicInfo = music.getMusicInfo();
        this.member = music.getMember();
    }

    public MusicNode(Music music, String color) {
        this.musicInfo = music.getMusicInfo();
        this.color = color;
    }

    public void patch(MusicNode next, String color, Position position) {
        if (next != null) this.next = next;
        if (color != null) this.color = color;
        if (position != null) this.position = position;
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

    public void move(Position position) {
        this.position = position;
    }
}
