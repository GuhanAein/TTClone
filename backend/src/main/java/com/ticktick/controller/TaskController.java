package com.ticktick.controller;

import com.ticktick.dto.task.TaskDTO;
import com.ticktick.dto.task.TaskRequest;
import com.ticktick.security.UserPrincipal;
import com.ticktick.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {
    
    private final TaskService taskService;
    
    @PostMapping
    public ResponseEntity<TaskDTO> createTask(
            @Valid @RequestBody TaskRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(taskService.createTask(request, currentUser));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<TaskDTO> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody TaskRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(taskService.updateTask(id, request, currentUser));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        taskService.deleteTask(id, currentUser);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<TaskDTO> getTask(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(taskService.getTask(id, currentUser));
    }
    
    @GetMapping
    public ResponseEntity<List<TaskDTO>> getAllTasks(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(taskService.getAllTasks(currentUser));
    }
    
    @GetMapping("/list/{listId}")
    public ResponseEntity<List<TaskDTO>> getTasksByList(
            @PathVariable Long listId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(taskService.getTasksByList(listId, currentUser));
    }
    
    @GetMapping("/today")
    public ResponseEntity<List<TaskDTO>> getTodayTasks(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(taskService.getTodayTasks(currentUser));
    }
    
    @GetMapping("/overdue")
    public ResponseEntity<List<TaskDTO>> getOverdueTasks(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(taskService.getOverdueTasks(currentUser));
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<TaskDTO>> searchTasks(
            @RequestParam String query,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(taskService.searchTasks(query, currentUser));
    }
}
