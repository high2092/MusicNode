package mojac.musicnode.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler
    public ResponseEntity<?> handleApiException(ApiException exception) {
        return handleExceptionInternal(exception.getErrorCode());
    }

    private ResponseEntity<Object> handleExceptionInternal(Error errorCode) {
        return ResponseEntity.status(errorCode.getHttpStatus())
                .body(new ErrorResponse(errorCode.getErrorCode(), errorCode.getMessage()));
    }
}
