package mojac.musicnode.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import mojac.musicnode.domain.Member;
import mojac.musicnode.domain.Playlist;
import mojac.musicnode.service.MemberService;
import mojac.musicnode.service.PlaylistService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/playlist")
public class PlaylistController {

    private final PlaylistService playlistService;
    private final MemberService memberService;

    @GetMapping
    public List<Playlist> playlists(Authentication authentication) {
        Long memberId = (Long) authentication.getPrincipal();
        Member member = memberService.findOne(memberId).get();

        return playlistService.findAll(member);
    }

    @PostMapping
    public CreatePlaylistResponse createPlaylist(Authentication authentication, @RequestBody @Valid CreatePlaylistRequest request) {
        Long memberId = (Long) authentication.getPrincipal();
        Member member = memberService.findOne(memberId).get();
        Playlist playlist = new Playlist(request.getName(), request.getContents(), member);
        playlistService.save(playlist);

        return new CreatePlaylistResponse(playlist.getId());
    }

    @Getter
    static class CreatePlaylistRequest {
        @NotEmpty
        String name;
        String contents;
    }

    @Getter
    @AllArgsConstructor
    static class CreatePlaylistResponse {
        Long id;
    }

}
