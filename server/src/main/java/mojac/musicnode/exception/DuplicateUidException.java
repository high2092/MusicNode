package mojac.musicnode.exception;

public class DuplicateUidException extends ApiException {

    public DuplicateUidException() {
        this.errorCode = Error.DUPLICATE_UID;
    }
}
