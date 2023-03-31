package mojac.musicnode.domain.thumb;

import jakarta.persistence.*;
import mojac.musicnode.domain.Member;
import mojac.musicnode.domain.MusicList;

@Entity
@DiscriminatorValue("D")
public class Thumbsdown extends Thumbs {
    Thumbsdown(Member member, MusicList musicList) {
        super(member, musicList);
    }
}
