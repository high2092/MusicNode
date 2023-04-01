package mojac.musicnode.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mojac.musicnode.domain.Music;
import mojac.musicnode.domain.MusicNode;
import mojac.musicnode.service.MusicNodeService;
import mojac.musicnode.service.MusicService;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Stream;

@Slf4j
@RestController
@RequiredArgsConstructor
public class MusicNodeController {

    private final MusicNodeService musicNodeService;
    private final MusicService musicService;

    @GetMapping("/node")
    public Result getNodeList() {
        Stream<MusicNodeDto> musicNodeList = musicNodeService.findAll().stream().map(m -> new MusicNodeDto(m));

        return new Result(musicNodeList);
    }

    @GetMapping("/node/{id}")
    public MusicNodeDto getNode(@PathVariable Long id) {
        MusicNode node = musicNodeService.findOne(id);
        return new MusicNodeDto(node);
    }

    @PostMapping("/node")
    public CreateNodeResponse createNode(@RequestBody @Valid CreateNodeRequest request) {
        Music music = musicService.findMusic(request.getMusicId());
        MusicNode node = new MusicNode(music);
        log.info("NODE = {}", node.getMusic().getName());

        Long id = musicNodeService.saveMusicNode(node);
        return new CreateNodeResponse(id);
    }

    @PatchMapping("/node/{sourceId}")
    public ConnectNodeResponse connectNode(@PathVariable Long sourceId, @RequestParam(value = "targetId", required = false) Long targetId) {
        MusicNode source = musicNodeService.findOne(sourceId);
        if (targetId != null) {
            MusicNode target = musicNodeService.findOne(targetId);
            musicNodeService.connect(source, target);
        } else {
            musicNodeService.disconnect(source);
        }

        return new ConnectNodeResponse(sourceId, targetId);
    }

    @DeleteMapping("/node/{id}")
    public DeleteNodeResponse deleteNode(@PathVariable Long id) {
        MusicNode node = musicNodeService.findOne(id);
        musicNodeService.deleteMusicNode(node);

        return new DeleteNodeResponse(id);
    }

    @Getter
    @AllArgsConstructor
    static class Result<T> {
        T data;
    }

    @Getter
    @AllArgsConstructor
    static class CreateNodeRequest {

        @NotNull
        private Long musicId;
        private String color;
    }

    @Getter
    @AllArgsConstructor
    static class CreateNodeResponse {
        private Long id;
    }

    @Getter
    @AllArgsConstructor
    static class ConnectNodeResponse {
        private Long source;
        private Long target;
    }

    @Getter
    @AllArgsConstructor
    static class DeleteNodeResponse {
        private Long id;
    }

    @Getter
    @AllArgsConstructor
    static class MusicNodeDto {
        private Long id;
        private Long musicId;
        private String musicName;
        private String videoId;
        private Long next;

        public MusicNodeDto(MusicNode musicNode) {

            Music music = musicNode.getMusic();

            this.id = musicNode.getId();
            this.musicId = music.getId();
            this.musicName = music.getName();
            this.videoId = music.getVideoId();
            if (musicNode.getNext() != null) this.next = musicNode.getNext().getId();
        }
    }




}
