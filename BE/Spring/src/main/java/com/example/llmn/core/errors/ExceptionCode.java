package com.example.llmn.core.errors;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@AllArgsConstructor
@Getter
public enum ExceptionCode {
    BAD_APPROACH(HttpStatus.BAD_REQUEST, "잘못된 접근입니다."),
    TOKEN_WRONG(HttpStatus.BAD_REQUEST, "잘못된 토큰 형식입니다."),
    ACCESS_TOKEN_WRONG(HttpStatus.BAD_REQUEST, "엑세스 토큰 검증에 실패하였습니다."),

    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "해당 사용자를 찾을 수 없습니다."),
    USER_EMAIL_NOT_FOUND(HttpStatus.NOT_FOUND, "해당 이메일을 찾을 수 없습니다."),
    USER_EMAIL_EXIST(HttpStatus.BAD_REQUEST, "이미 존재하는 이메일입니다."),
    USER_NICKNAME_EXIST(HttpStatus.BAD_REQUEST, "이미 존재하는 닉네임입니다."),
    USER_ACCOUNT_WRONG(HttpStatus.BAD_REQUEST, "이메일 또는 비밀번호를 다시 확인해 주세요"),
    USER_PASSWORD_WRONG(HttpStatus.BAD_REQUEST, "현재 비밀번호가 올바르지 않습니다."),
    USER_PASSWORD_MATCH_WRONG(HttpStatus.BAD_REQUEST, "비밀번호가 일치하지 않습니다."), // 두 비밀번호 일치 여부 확인
    USER_FORBIDDEN(HttpStatus.FORBIDDEN, "권한이 없습니다."),
    USER_UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "로그인이 되지 않았습니다."),
    USER_ALREADY_EXIT(HttpStatus.NOT_FOUND, "이미 탈퇴한 계정입니다."),
    ALREADY_SEND_EMAIL(HttpStatus.NOT_FOUND, "이미 이메일을 전송하였습니다. 5분 후에 다시 시도해주세요"),

    CREATE_DIR_FAIL(HttpStatus.INTERNAL_SERVER_ERROR, "디렉토리 생성을 실패했습니다."),
    ALREADY_EXIST_FILE(HttpStatus.BAD_REQUEST, "이미 존재하는 파일입니다."),
    NO_FILE_TO_UPLOAD(HttpStatus.BAD_REQUEST, "업로드할 파일이 존재하지 않습니다."),
    SAVE_FILE_FAIL(HttpStatus.INTERNAL_SERVER_ERROR, "파일 저장을 실패하였습니다."),
    UPDATE_KEY_FAIL(HttpStatus.INTERNAL_SERVER_ERROR, "API 등록을 실패했습니다."),

    SSH_INFO_EMPTY(HttpStatus.BAD_REQUEST, "SSH 정보는 적어도 하나 이상 입력해야 합니다."),
    MONITORING_SSH_NOT_SELECT(HttpStatus.BAD_REQUEST, "모니터링 할 클라우드 인스턴스 호스트명이 잘못됐습니다."),
    DUPLICATE_SSH_HOST(HttpStatus.BAD_REQUEST, "SSH 호스트 이름이 중복됩니다."),
    SSH_SESSION_CONNECT_FAIL(HttpStatus.BAD_REQUEST, "SSH 세션 연결을 실패하였습니다. 호스트, 유저, 키를 다시 확인해주세요."),
    SSH_COMMAND_FAIL(HttpStatus.INTERNAL_SERVER_ERROR, "SSH 명령어 실행에 실패하였습니다."),
    SSH_TIME_OUT(HttpStatus.INTERNAL_SERVER_ERROR, "SSH 명령어 실행 중 타임아웃이 발생하였습니다."),
    SSH_INFO_WRONG(HttpStatus.BAD_REQUEST, "현재 해당 SSH가 연결되어 있지 않으니 설정에서 다시 연결해주세요."),

    ELASTIC_SEARCH_ERROR(HttpStatus.NOT_FOUND, "ElasticSearch에 문제가 발생했습니다."),
    ELASTIC_CREATE_INDEX_FAIL(HttpStatus.INTERNAL_SERVER_ERROR, "Elasticsearch 인덱스 생성 중 오류 발생"),

    LOG_DIRECTORY_NOT_FOUND(HttpStatus.NOT_FOUND, "로그 디렉토리가 존재하지 않거나 디렉토리가 아닙니다."),
    LOG_FILE_NOT_FOUND(HttpStatus.NOT_FOUND, "해당 로그 파일이 존재하지 않습니다."),
    LOG_FILE_READ_FAIL(HttpStatus.BAD_REQUEST, "로그 파일을 읽는 중 오류 발생했습니다."),
    LOG_FILE_LIST_READ_FAIL(HttpStatus.BAD_REQUEST, "로그 파일 목록을 가져오는 중 오류 발생했습니다."),
    LOG_CONVERT_TO_FILE_FAIL(HttpStatus.INTERNAL_SERVER_ERROR, "로그를 파일로 변환하는 작업 중 오류가 발생했습니다."),

    SUMMARY_NOT_FOUND(HttpStatus.NOT_FOUND, "해당 요약이 존재하지 않습니다."),

    ALARM_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 알람입니다."),

    PROJECT_NOT_FOUND(HttpStatus.NOT_FOUND, "해당 프로젝트를 찾을 수 없습니다."),
    SSH_NOT_FOUND(HttpStatus.NOT_FOUND, "해당 SSH 정보를 찾을 수 없습니다"),

    SHELL_CONNECT_FAIL(HttpStatus.INTERNAL_SERVER_ERROR, "Shell 채널 초기화 실패");

    private final HttpStatus httpStatus;
    private final String message;
}
