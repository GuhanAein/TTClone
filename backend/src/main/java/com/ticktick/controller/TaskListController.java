package com.ticktick.controller;

import com.ticktick.dto.task.TaskListDTO;
import com.ticktick.dto.task.TaskListRequest;
import com.ticktick.security.UserPrincipal;
import com.ticktick.service.TaskListService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lists")
@RequiredArgsConstructor
public class TaskListController {
    
    private final TaskListService taskListService;
    
    @PostMapping
    public ResponseEntity<TaskListDTO> createTaskList(
            @Valid @RequestBody TaskListRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(taskListService.createTaskList(request, currentUser));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<TaskListDTO> updateTaskList(
            @PathVariable Long id,
            @Valid @RequestBody TaskListRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(taskListService.updateTaskList(id, request, currentUser));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTaskList(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        taskListService.deleteTaskList(id, currentUser);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<TaskListDTO> getTaskList(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(taskListService.getTaskList(id, currentUser));
    }
    
    @GetMapping
    public ResponseEntity<List<TaskListDTO>> getAllTaskLists(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(taskListService.getAllTaskLists(currentUser));
    }
}
