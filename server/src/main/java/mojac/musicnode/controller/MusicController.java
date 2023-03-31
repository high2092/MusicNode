package mojac.musicnode.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import mojac.musicnode.domain.Music;
import mojac.musicnode.service.MusicService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class MusicController {

    private final MusicService musicService;

    @GetMapping("/musics")
    public Result musics() {
        return new Result(musicService.findMusics());
    }

    @PostMapping("/music")
    public CreateMusicResponse createMusic(@RequestBody @Valid CreateMusicRequest request) {
        Music music = new Music(request.getName(), request.getVideoId());
        Long id = musicService.saveMusic(music);
        return new CreateMusicResponse(id);
    }

    @Getter
    @AllArgsConstructor
    static class Result<T> {
        T data;
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
