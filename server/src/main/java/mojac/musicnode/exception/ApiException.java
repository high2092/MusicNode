package mojac.musicnode.exception;

import lombok.Getter;

@Getter
public abstract class ApiException extends RuntimeException {
    protected Error errorCode;
}
