package mojac.musicnode.exception;

public class AuthenticationFailedException extends ApiException {

    public AuthenticationFailedException() {
        this.errorCode = Error.AUTHENTICATION_FAILED;
    }
}
