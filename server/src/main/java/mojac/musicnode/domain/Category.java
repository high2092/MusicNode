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
    private String color;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    protected Category() {}
    public Category(String name, String color) {
        this.name = name;
        this.color = color;
    }

    public void rename(String name) {
        this.name = name;
    }

    public void changeColor(String color) {
        this.color = color;
    }
}
