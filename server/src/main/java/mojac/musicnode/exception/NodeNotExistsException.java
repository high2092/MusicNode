package mojac.musicnode.exception;

public class NodeNotExistsException extends ApiException {
    public NodeNotExistsException() {
        this.errorCode = Error.NODE_NOT_EXISTS;
    }
}
