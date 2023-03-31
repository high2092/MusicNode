package mojac.musicnode.domain;

import jakarta.persistence.*;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
public class Music {
    @Id @GeneratedValue
    @Column(name = "music_id")
    private Long id;

    private String name;
    private String videoId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @OneToMany
    private List<Category> categories = new ArrayList<>();

    protected Music() {}

    public Music(String name, String videoId) {
        this.name = name;
        this.videoId = videoId;
    }

    public void addCategory(Category category) {
        categories.add(category);
    }

    public void removeCategory(Category category) {
        categories.remove(category);
    }
}
