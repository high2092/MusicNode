package mojac.musicnode.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.awt.*;

@Entity
public class Category {
    @Id @GeneratedValue
    @Column(name = "category_id")
    private Long id;

    private String name;
    private Color color;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    public Category(String name, Color color, Member member) {
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
