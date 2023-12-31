package com.mapstone.mapstone.controllers;
import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
@Controller
public class MyErrorController implements ErrorController {
    @GetMapping("/error")
    public String handleError(HttpServletRequest request) {
        Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
        if (status != null) {
            Integer statusCode = Integer.valueOf(status.toString());
            if(statusCode == HttpStatus.NOT_FOUND.value()) {
                System.out.println("\n\n\n\n\nNot found\n\n\n\n\n");
                return "error/4xx";
            } else if (statusCode == HttpStatus.BAD_REQUEST.value()) {
                System.out.println("\n\n\n\n\nBad Request\n\n\n\n\n");
            } else if (statusCode == HttpStatus.FORBIDDEN.value()){
                System.out.println("\n\n\n\n\nforbidden\n\n\n\n\n\n");
                return "/error/403";
            } else if (statusCode == HttpStatus.METHOD_NOT_ALLOWED.value()) {
                System.out.println("\n\n\n\n\nnot working\n\n\n\n\n");
                return "error/405";
            }
        }
        return "error";
    }
    @PostMapping("/error")
    public String handlePostError(HttpServletRequest request) {
        Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
        if (status != null) {
            Integer statusCode = Integer.valueOf(status.toString());
            if(statusCode == HttpStatus.NOT_FOUND.value()) {
                System.out.println("Not found");
                return "error/4xx";
            }else if (statusCode == HttpStatus.FORBIDDEN.value()){
                System.out.println("forbidden");
                return "/error/403";
            } else if (statusCode == HttpStatus.METHOD_NOT_ALLOWED.value()) {
                System.out.println("not working");
                return "error/405";
            }
        }
        return "error";
    }
}