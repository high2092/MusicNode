package mojac.musicnode.domain;

import jakarta.persistence.Embeddable;
import lombok.Getter;

@Embeddable
@Getter
public class Position {
    private int x = 0;
    private int y = 0;
}
