package mojac.musicnode.domain.thumb;

import jakarta.persistence.*;
import mojac.musicnode.domain.Member;
import mojac.musicnode.domain.Playlist;

@Entity
@DiscriminatorValue("D")
public class Thumbsdown extends Thumbs {
    Thumbsdown(Member member, Playlist playlist) {
        super(member, playlist);
    }
}
