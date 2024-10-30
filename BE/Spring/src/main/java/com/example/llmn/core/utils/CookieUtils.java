package com.example.llmn.core.utils;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;

import java.util.Arrays;

public class CookieUtils {

    public static String getCookieFromRequest(String cookieKey, HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();

        if (cookies == null) {
            return null;
        }

        return Arrays.stream(cookies)
                .filter(cookie -> cookieKey.equals(cookie.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }

    public static void setCookieToResponse(String cookieKey, String cookieValue, Long maxAgeSec, boolean secureCookie, boolean isHttpOnly, HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from(cookieKey, cookieValue)
                .httpOnly(isHttpOnly)
                .secure(secureCookie)
                .path("/")
                .sameSite("Lax")
                .maxAge(maxAgeSec)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    public static HttpServletResponse syncHttpResponseCookiesFromHttpRequest(HttpServletRequest request, HttpServletResponse response, String... exceptionKeys) {
        Cookie[] cookies = request.getCookies();

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                String cookieKey = cookie.getName();

                if (Arrays.asList(exceptionKeys).contains(cookieKey)) {
                    continue;
                }

                ResponseCookie responseCookie = ResponseCookie.from(cookieKey, cookie.getValue())
                        .httpOnly(cookie.isHttpOnly())
                        .secure(cookie.getSecure())
                        .maxAge(cookie.getMaxAge())
                        .path("/")
                        .sameSite("None")
                        .build();

                response.addHeader(HttpHeaders.SET_COOKIE, responseCookie.toString());
            }
        }
        return response;
    }
}
