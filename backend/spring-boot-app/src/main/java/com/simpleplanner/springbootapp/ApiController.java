package com.simpleplanner.springbootapp;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import java.util.HashMap;
import java.util.Map;

@RestController
public class ApiController {

    @GetMapping("/api/data")
    public ResponseEntity<Object> getData() {
        // Create a map to return as JSON
        Map<String, String> response = new HashMap<>();
        response.put("data", "Hellooo from Spring Boot Flask & React ! It's all Running");
        
        // Return the map as a JSON response
        return ResponseEntity.ok(response);
    }
}