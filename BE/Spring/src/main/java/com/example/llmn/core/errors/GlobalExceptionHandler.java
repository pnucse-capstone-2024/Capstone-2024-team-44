package com.example.llmn.core.errors;

import com.example.llmn.core.utils.ApiUtils;
import com.example.llmn.core.utils.EnumUtils;
import com.fasterxml.jackson.databind.exc.InvalidFormatException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.io.IOException;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(CustomException.class)
    public ResponseEntity<?> customError(CustomException e) {
        return new ResponseEntity<>(e.body(), e.status());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> unknownServerError(Exception e){
        String message = e.getMessage();
        ApiUtils.ApiResult<?> apiResult = ApiUtils.error(message, HttpStatus.INTERNAL_SERVER_ERROR);
        return new ResponseEntity<>(apiResult, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationExceptions(MethodArgumentNotValidException ex) {
        BindingResult result = ex.getBindingResult();
        String errorMessage = result.getFieldError().getDefaultMessage();
        return ResponseEntity.badRequest().body(ApiUtils.error(errorMessage, HttpStatus.BAD_REQUEST));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<?> handleHttpMessageNotReadableException(HttpMessageNotReadableException ex) {
        String errorMessage = "요청 데이터 형식이 올바르지 않습니다.";

        Throwable cause = ex.getCause();
        if (cause instanceof InvalidFormatException ife) {
            if (ife.getTargetType().isEnum()) {
                String enumValues = EnumUtils.getEnumValuesAsString((Class<? extends Enum<?>>) ife.getTargetType());
                errorMessage = "유효하지 않은 값입니다. 허용된 값은 " + enumValues + " 입니다.";
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiUtils.error(errorMessage, HttpStatus.BAD_REQUEST));
            }
        } else if (ex.getMessage().contains("Required request body is missing")) {
            errorMessage = "요청 본문이 누락되었습니다.";
        }

        return ResponseEntity.badRequest().body(ApiUtils.error(errorMessage, HttpStatus.BAD_REQUEST));
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<?> handleMissingServletRequestParameterException(MissingServletRequestParameterException ex) {
        String errorMessage = "요청 파라미터 " + ex.getParameterName() + "가 누락되었습니다.";
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiUtils.error(errorMessage, HttpStatus.BAD_REQUEST));
    }

    @ExceptionHandler(IOException.class)
    public ResponseEntity<?> handleIOException(IOException ex) {
        String errorMessage = "입출력 오류가 발생했습니다: " + ex.getMessage();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiUtils.error(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR));
    }
}
