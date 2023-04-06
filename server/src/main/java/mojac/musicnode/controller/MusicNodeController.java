package mojac.musicnode.controller;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mojac.musicnode.domain.Music;
import mojac.musicnode.domain.MusicNode;
import mojac.musicnode.domain.Position;
import mojac.musicnode.exception.NextNodeNotExistsException;
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

    @PostMapping("/node/simple")
    public CreateNodeSimpleResponse createNodeSimple(@RequestBody CreateNodeSimpleRequest request) {
        Music music = new Music(request.getMusicName(), request.getVideoId());
        Long musicId = musicService.saveMusic(music);

        MusicNode node = new MusicNode(music);
        Long nodeId = musicNodeService.saveMusicNode(node);
        return new CreateNodeSimpleResponse(musicId, nodeId);
    }

    @PostMapping("/node/{id}/disconnect")
    public DisconnectNodeResponse disconnectNode(@PathVariable Long id) {
        MusicNode source = musicNodeService.findOne(id);
        Long targetId = source.getNext().getId();

        musicNodeService.disconnect(source);

        return new DisconnectNodeResponse(id, targetId);
    }

    @PatchMapping("/node/{id}")
    @JsonInclude
    public PatchNodeResponse patchNode(@PathVariable Long id, @RequestBody PatchNodeRequest request) {
        MusicNode node = musicNodeService.findOne(id);
        Long nextId = request.getNext();
        MusicNode next;
        if (nextId != null) {
            next = musicNodeService.findOne(request.getNext());
        } else {
            next = null;
        }
        String color = request.getColor();
        Position position = request.getPosition();
        musicNodeService.patchMusicNode(node, next, color, position);

        return new PatchNodeResponse(id, nextId, color, position);
    }

    @DeleteMapping("/node/{id}")
    public DeleteNodeResponse deleteNode(@PathVariable Long id) {
        MusicNode node = musicNodeService.findOne(id);
        musicNodeService.deleteMusicNode(node);

        return new DeleteNodeResponse(id);
    }

    @GetMapping("/node/{id}/next")
    public GetNextNodeResponse getNextNode(@PathVariable Long id) {
        MusicNode node = musicNodeService.findOne(id);

        if (node.getNext() == null) throw new NextNodeNotExistsException();

        return new GetNextNodeResponse(node.getNext().getId());
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
    static class CreateNodeSimpleRequest {

        @NotEmpty
        private String videoId;
        @NotEmpty
        private String musicName;
    }

    @Getter
    @AllArgsConstructor
    static class CreateNodeResponse {
        private Long id;
    }

    @Getter
    @AllArgsConstructor
    static class CreateNodeSimpleResponse {

        private Long musicId;
        private Long nodeId;
    }




    @Getter
    @AllArgsConstructor
    static class DisconnectNodeResponse {
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
    static class GetNextNodeResponse {
        private Long id;
    }

    @Getter
    static class PatchNodeRequest {
        private Long next;
        private String color;
        private Position position;
    }

    @Getter
    @AllArgsConstructor
    static class PatchNodeResponse {
        private Long id;
        private Long next;
        private String color;
        private Position position;
    }

    @Getter
    @AllArgsConstructor
    static class MusicNodeDto {
        private Long id;
        private Long musicId;
        private String musicName;
        private String videoId;
        private Long next;
        private Position position;

        public MusicNodeDto(MusicNode musicNode) {

            Music music = musicNode.getMusic();

            this.id = musicNode.getId();
            this.musicId = music.getId();
            this.musicName = music.getName();
            this.videoId = music.getVideoId();
            if (musicNode.getNext() != null) this.next = musicNode.getNext().getId();
            this.position = musicNode.getPosition();
        }
    }
}
