package mojac.musicnode.exception;

public class NextNodeNotExistsException extends ApiException {

    public NextNodeNotExistsException() {
        this.errorCode = Error.NEXT_NOD_NOT_EXISTS;
    }

}
