package mojac.musicnode.domain.thumb;

import jakarta.persistence.*;
import mojac.musicnode.domain.Member;
import mojac.musicnode.domain.Playlist;

@Entity
@DiscriminatorValue("U")
public class Thumbsup extends Thumbs {
    Thumbsup(Member member, Playlist playlist) {
        super(member, playlist);
    }
}
