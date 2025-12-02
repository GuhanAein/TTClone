package com.ticktick.controller;

import com.ticktick.dto.habit.HabitDTO;
import com.ticktick.dto.habit.HabitRequest;
import com.ticktick.security.UserPrincipal;
import com.ticktick.service.HabitService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/habits")
@RequiredArgsConstructor
public class HabitController {

    private final HabitService habitService;

    @PostMapping
    public ResponseEntity<HabitDTO> createHabit(
            @Valid @RequestBody HabitRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(habitService.createHabit(request, currentUser));
    }

    @GetMapping
    public ResponseEntity<List<HabitDTO>> getHabits(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(habitService.getHabits(currentUser));
    }

    @PostMapping("/{id}/toggle")
    public ResponseEntity<HabitDTO> toggleHabit(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(habitService.toggleHabitCompletion(id, date, currentUser));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHabit(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        habitService.deleteHabit(id, currentUser);
        return ResponseEntity.noContent().build();
    }
}
