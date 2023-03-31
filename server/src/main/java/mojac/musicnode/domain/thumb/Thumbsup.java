package mojac.musicnode.domain.thumb;

import jakarta.persistence.*;
import mojac.musicnode.domain.Member;
import mojac.musicnode.domain.MusicList;

@Entity
@DiscriminatorValue("U")
public class Thumbsup extends Thumbs {
    Thumbsup(Member member, MusicList musicList) {
        super(member, musicList);
    }
}
