package mojac.musicnode.controller;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mojac.musicnode.domain.*;
import mojac.musicnode.exception.NextNodeNotExistsException;
import mojac.musicnode.service.MemberService;
import mojac.musicnode.service.MusicNodeService;
import mojac.musicnode.service.MusicService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Stream;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/node")
public class MusicNodeController {

    private final MusicNodeService musicNodeService;
    private final MusicService musicService;
    private final MemberService memberService;

    @GetMapping
    public Result getNodeList(Authentication authentication) {
        Member member = memberService.findOne((Long) authentication.getPrincipal()).get();

        log.info("member = {}", member);
        Stream<MusicNodeDto> musicNodeList = musicNodeService.findAll(member).stream().map(m -> new MusicNodeDto(m));

        return new Result(musicNodeList);
    }

    @GetMapping("/{id}")
    public MusicNodeDto getNode(@PathVariable Long id) {
        MusicNode node = musicNodeService.findOne(id).get();
        return new MusicNodeDto(node);
    }

    @PostMapping
    public CreateNodeResponse createNode(@RequestBody @Valid CreateNodeRequest request) {
        Music music = musicService.findMusic(request.getMusicId()).get();
        MusicNode node = new MusicNode(music);
        log.info("NODE = {}", node.getMusicInfo().getName());

        Long id = musicNodeService.saveMusicNode(node);
        return new CreateNodeResponse(id);
    }

    @PostMapping("/simple")
    public CreateNodeSimpleResponse createNodeSimple(Authentication authentication, @RequestBody CreateNodeSimpleRequest request) {

        Long memberId = (Long) authentication.getPrincipal();
        Member member = memberService.findOne(memberId).get();

        Music music = new Music(request.getMusicName(), request.getVideoId(), member);
        Long musicId = musicService.saveMusic(music);

        MusicNode node = new MusicNode(music);
        Long nodeId = musicNodeService.saveMusicNode(node);
        return new CreateNodeSimpleResponse(musicId, nodeId);
    }

    @PostMapping("/disconnect")
    public DisconnectNodesResponse disconnectNodes(@RequestBody @Valid DisconnectNodesRequest request) {
        List<Long> targets = request.getTargets();
        targets.stream().distinct().forEach(musicNodeService::disconnectWithPrevNodes);

        return new DisconnectNodesResponse(targets.size());
    }

    @PatchMapping("/{id}")
    @JsonInclude
    public PatchNodeResponse patchNode(@PathVariable Long id, @RequestBody PatchNodeRequest request) {
        MusicNode node = musicNodeService.findOne(id).get();
        Long nextId = request.getNext();
        MusicNode next;
        if (nextId != null) {
            next = musicNodeService.findOne(request.getNext()).get();
        } else {
            next = null;
        }
        String color = request.getColor();
        Position position = request.getPosition();
        musicNodeService.patchMusicNode(node, next, color, position);

        return new PatchNodeResponse(id, nextId, color, position);
    }

    @PostMapping("/delete")
    public DeleteNodesResponse deleteNodes(@RequestBody @Valid DeleteNodesRequest request) {
        List<Long> nodes = request.getNodes();
        musicNodeService.deleteMusicNodes(nodes);

        return new DeleteNodesResponse(nodes.size());
    }

    @GetMapping("/{id}/next")
    public GetNextNodeResponse getNextNode(@PathVariable Long id) {
        MusicNode node = musicNodeService.findOne(id).get();

        if (node.getNext() == null) throw new NextNodeNotExistsException();

        return new GetNextNodeResponse(node.getNext().getId());
    }

    @PostMapping("/move")
    public MoveNodesResponse moveNodes(@RequestBody @Valid MoveNodesRequest request) {
        List<MoveNodesRequest.NodeMove> nodeMoves = request.getNodeMoves();
        nodeMoves.stream().forEach(nodeMove ->
                musicNodeService.findOne(nodeMove.getId())
                    .ifPresent(node -> musicNodeService.moveNode(node, nodeMove.getPosition()))
        );

        return new MoveNodesResponse(nodeMoves.size());
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
    static class DisconnectNodesRequest {
        @NotNull
        private List<Long> targets;
    }

    @Getter
    static class DeleteNodesRequest {
        @NotNull
        private List<Long> nodes;
    }

    @Getter
    static class MoveNodesRequest {
        @NotNull
        private List<NodeMove> nodeMoves;

        @Getter
        static class NodeMove {
            private Long id;
            private Position position;
        }
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
    static class DisconnectNodesResponse {
        private int count;
    }

    @Getter
    @AllArgsConstructor
    static class DeleteNodesResponse {
        private int count;
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
    static class MoveNodesResponse {
        private int count;
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

            MusicInfo musicInfo = musicNode.getMusicInfo();

            this.id = musicNode.getId();
            this.musicName = musicInfo.getName();
            this.videoId = musicInfo.getVideoId();
            if (musicNode.getNext() != null) this.next = musicNode.getNext().getId();
            this.position = musicNode.getPosition();
        }
    }
}
