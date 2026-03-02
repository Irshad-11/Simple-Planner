// backend/spring-boot-app/src/main/java/com/simpleplanner/springbootapp/SpringBootApp.java
package com.simpleplanner.springbootapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
public class SpringBootApp {

    public static void main(String[] args) {
        SpringApplication.run(SpringBootApp.class, args);
    }
}

@RestController
class HelloController {

    @GetMapping("/api/hello")
    public String getData() {
        return "Hello from Spring Boot microservice";
    }
}