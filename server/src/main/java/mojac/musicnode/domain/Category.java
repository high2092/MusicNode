package mojac.musicnode.domain;

import jakarta.persistence.*;
import lombok.Getter;

import java.awt.*;

@Entity
@Getter
public class Category {
    @Id @GeneratedValue
    @Column(name = "category_id")
    private Long id;

    private String name;
    private Color color;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    protected Category() {}
    public Category(String name, Color color) {
        this.name = name;
        this.color = color;
    }

    public void rename(String name) {
        this.name = name;
    }

    public void changeColor(Color color) {
        this.color = color;
    }
}
