package mojac.musicnode.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import mojac.musicnode.domain.Member;
import mojac.musicnode.domain.Music;
import mojac.musicnode.service.MemberService;
import mojac.musicnode.service.MusicService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/music")
public class MusicController {

    private final MusicService musicService;
    private final MemberService memberService;

    @GetMapping
    public Result musics(Authentication authentication) {
        Long memberId = (Long) authentication.getPrincipal();
        Member member = memberService.findOne(memberId);

        return new Result(musicService.findMusics(member).stream().map(m -> new MusicDto(m)));
    }

    @PostMapping
    public CreateMusicResponse createMusic(Authentication authentication, @RequestBody @Valid CreateMusicRequest request) {

        Long memberId = (Long) authentication.getPrincipal();
        Member member = memberService.findOne(memberId);

        Music music = new Music(request.getName(), request.getVideoId(), member);
        Long id = musicService.saveMusic(music);
        return new CreateMusicResponse(id);
    }

    @Getter
    @AllArgsConstructor
    static class Result<T> {
        T data;
    }

    @Getter
    @AllArgsConstructor
    static class MusicDto {
        private Long id;
        private String name;
        private String videoId;

        public MusicDto(Music music) {
            this.id = music.getId();
            this.name = music.getMusicInfo().getName();
            this.videoId = music.getMusicInfo().getVideoId();
        }
    }

    @Getter
    static class CreateMusicRequest {
        @NotEmpty
        private String name;
        @NotEmpty
        private String videoId;

    }

    @Getter
    @AllArgsConstructor
    static class CreateMusicResponse {
        private Long id;
    }
}
