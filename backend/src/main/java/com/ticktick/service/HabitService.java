package com.ticktick.service;

import com.ticktick.dto.habit.HabitDTO;
import com.ticktick.dto.habit.HabitRequest;
import com.ticktick.entity.Habit;
import com.ticktick.entity.User;
import com.ticktick.exception.BadRequestException;
import com.ticktick.exception.ResourceNotFoundException;
import com.ticktick.repository.HabitRepository;
import com.ticktick.repository.UserRepository;
import com.ticktick.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HabitService {

    private final HabitRepository habitRepository;
    private final UserRepository userRepository;

    @Transactional
    public HabitDTO createHabit(HabitRequest request, UserPrincipal currentUser) {
        User user = getUserById(currentUser.getId());

        Habit habit = Habit.builder()
                .name(request.getName())
                .color(request.getColor() != null ? request.getColor() : "bg-blue-500")
                .icon(request.getIcon() != null ? request.getIcon() : "check")
                .sortOrder(request.getSortOrder() != null ? request.getSortOrder() : 0)
                .user(user)
                .build();

        habit = habitRepository.save(habit);
        return mapToDTO(habit);
    }

    @Transactional(readOnly = true)
    public List<HabitDTO> getHabits(UserPrincipal currentUser) {
        User user = getUserById(currentUser.getId());
        return habitRepository.findByUserOrderBySortOrderAsc(user).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public HabitDTO toggleHabitCompletion(Long habitId, LocalDate date, UserPrincipal currentUser) {
        User user = getUserById(currentUser.getId());
        Habit habit = habitRepository.findById(habitId)
                .orElseThrow(() -> new ResourceNotFoundException("Habit", "id", habitId));

        if (!habit.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Habit does not belong to current user");
        }

        if (habit.getCompletedDates().contains(date)) {
            habit.getCompletedDates().remove(date);
        } else {
            habit.getCompletedDates().add(date);
        }

        habit = habitRepository.save(habit);
        return mapToDTO(habit);
    }
    
    @Transactional
    public void deleteHabit(Long habitId, UserPrincipal currentUser) {
        User user = getUserById(currentUser.getId());
        Habit habit = habitRepository.findById(habitId)
                .orElseThrow(() -> new ResourceNotFoundException("Habit", "id", habitId));

        if (!habit.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Habit does not belong to current user");
        }
        
        habitRepository.delete(habit);
    }

    private User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
    }

    private HabitDTO mapToDTO(Habit habit) {
        return HabitDTO.builder()
                .id(habit.getId())
                .name(habit.getName())
                .color(habit.getColor())
                .icon(habit.getIcon())
                .completedDates(habit.getCompletedDates())
                .sortOrder(habit.getSortOrder())
                .build();
    }
}
