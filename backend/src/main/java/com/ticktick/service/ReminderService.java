package com.ticktick.service;

import com.ticktick.dto.task.ReminderDTO;
import com.ticktick.entity.Reminder;
import com.ticktick.entity.Task;
import com.ticktick.entity.User;
import com.ticktick.exception.ResourceNotFoundException;
import com.ticktick.repository.ReminderRepository;
import com.ticktick.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReminderService {
    
    private final ReminderRepository reminderRepository;
    private final TaskRepository taskRepository;
    private final NotificationService notificationService;
    private final RedisTemplate<String, Object> redisTemplate;
    
    @Transactional
    public ReminderDTO createReminder(Long taskId, LocalDateTime remindAt, Reminder.ReminderType type, Long userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", taskId));
        
        if (!task.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Task", "id", taskId);
        }
        
        Reminder reminder = Reminder.builder()
                .remindAt(remindAt)
                .type(type)
                .task(task)
                .build();
        
        reminder = reminderRepository.save(reminder);
        
        // Schedule in Redis
        scheduleReminder(reminder);
        
        return mapToReminderDTO(reminder);
    }
    
    @Transactional
    public void deleteReminder(Long reminderId, Long userId) {
        Reminder reminder = reminderRepository.findById(reminderId)
                .orElseThrow(() -> new ResourceNotFoundException("Reminder", "id", reminderId));
        
        if (!reminder.getTask().getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Reminder", "id", reminderId);
        }
        
        reminderRepository.delete(reminder);
    }
    
    @Scheduled(fixedRate = 60000) // Run every minute
    @Transactional
    public void processReminders() {
        LocalDateTime now = LocalDateTime.now();
        List<Reminder> pendingReminders = reminderRepository.findPendingReminders(now);
        
        log.info("Processing {} pending reminders", pendingReminders.size());
        
        for (Reminder reminder : pendingReminders) {
            try {
                sendReminder(reminder);
                reminder.setIsSent(true);
                reminder.setSentAt(LocalDateTime.now());
                reminderRepository.save(reminder);
            } catch (Exception e) {
                log.error("Failed to send reminder {}", reminder.getId(), e);
            }
        }
    }
    
    private void sendReminder(Reminder reminder) {
        Task task = reminder.getTask();
        User user = task.getUser();
        
        String message = String.format("Reminder: %s", task.getTitle());
        
        switch (reminder.getType()) {
            case EMAIL:
                notificationService.sendEmailNotification(user.getEmail(), "Task Reminder", message);
                break;
            case NOTIFICATION:
                notificationService.sendPushNotification(user.getFcmToken(), "Task Reminder", message);
                break;
            case BOTH:
                notificationService.sendEmailNotification(user.getEmail(), "Task Reminder", message);
                notificationService.sendPushNotification(user.getFcmToken(), "Task Reminder", message);
                break;
        }
    }
    
    private void scheduleReminder(Reminder reminder) {
        String key = "reminder:" + reminder.getId();
        redisTemplate.opsForValue().set(key, reminder);
    }
    
    private ReminderDTO mapToReminderDTO(Reminder reminder) {
        return ReminderDTO.builder()
                .id(reminder.getId())
                .remindAt(reminder.getRemindAt())
                .type(reminder.getType())
                .isSent(reminder.getIsSent())
                .sentAt(reminder.getSentAt())
                .createdAt(reminder.getCreatedAt())
                .build();
    }
}
