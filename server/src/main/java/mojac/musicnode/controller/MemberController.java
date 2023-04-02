package mojac.musicnode.controller;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class MemberController {

    @GetMapping("/member/row")
    public GetNodeCountInARowResponse getNodeCountInAColumn() {
        // TODO: implement
        return new GetNodeCountInARowResponse(7);
    }

    @Getter
    @AllArgsConstructor
    static class GetNodeCountInARowResponse {
        private int count;
    }
}
