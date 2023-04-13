package mojac.musicnode.exception;

public class NotAuthenticatedException extends ApiException {
    public NotAuthenticatedException() {
        this.errorCode = Error.NOT_AUTHENTICATED;
    }
}
