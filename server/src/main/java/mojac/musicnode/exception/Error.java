package mojac.musicnode.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum Error {
    NEXT_NOD_NOT_EXISTS("마지막 노드입니다.", 2001, HttpStatus.NOT_FOUND),
    DUPLICATE_UID("이미 존재하는 아이디입니다.", 2002, HttpStatus.CONFLICT),
    AUTHENTICATION_FAILED("아이디 또는 비밀번호가 틀렸습니다.", 2003, HttpStatus.UNAUTHORIZED),
    NODE_NOT_EXISTS("존재하지 않는 노드입니다.", 2004, HttpStatus.NOT_FOUND);

    private final String message;
    private final int errorCode;
    private final HttpStatus httpStatus;
}
