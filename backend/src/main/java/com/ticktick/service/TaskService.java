package com.ticktick.service;

import com.ticktick.dto.task.*;
import com.ticktick.entity.*;
import com.ticktick.exception.BadRequestException;
import com.ticktick.exception.ResourceNotFoundException;
import com.ticktick.repository.*;
import com.ticktick.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class TaskService {
    
    private final TaskRepository taskRepository;
    private final TaskListRepository taskListRepository;
    private final TagRepository tagRepository;
    private final UserRepository userRepository;
    private final ReminderRepository reminderRepository;
    private final SimpMessagingTemplate messagingTemplate;
    
    @Transactional
    public TaskDTO createTask(TaskRequest request, UserPrincipal currentUser) {
        User user = getUserById(currentUser.getId());
        
        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .notes(request.getNotes())
                .priority(request.getPriority() != null ? request.getPriority() : Task.Priority.NONE)
                .status(request.getStatus() != null ? request.getStatus() : Task.Status.TODO)
                .dueDate(request.getDueDate())
                .startDate(request.getStartDate())
                .allDay(request.getAllDay() != null ? request.getAllDay() : false)
                .sortOrder(request.getSortOrder() != null ? request.getSortOrder() : 0)
                .isRecurring(request.getIsRecurring() != null ? request.getIsRecurring() : false)
                .recurrenceType(request.getRecurrenceType())
                .recurrenceInterval(request.getRecurrenceInterval())
                .recurrenceEndDate(request.getRecurrenceEndDate())
                .recurrenceDays(request.getRecurrenceDays())
                .user(user)
                .build();
        
        // Set task list if provided
        if (request.getTaskListId() != null) {
            TaskList taskList = taskListRepository.findByIdAndUser(request.getTaskListId(), user)
                    .orElseThrow(() -> new ResourceNotFoundException("TaskList", "id", request.getTaskListId()));
            task.setTaskList(taskList);
        }
        
        // Set parent task if provided (for subtasks)
        if (request.getParentTaskId() != null) {
            Task parentTask = taskRepository.findById(request.getParentTaskId())
                    .orElseThrow(() -> new ResourceNotFoundException("Task", "id", request.getParentTaskId()));
            if (!parentTask.getUser().getId().equals(user.getId())) {
                throw new BadRequestException("Parent task does not belong to current user");
            }
            task.setParentTask(parentTask);
        }
        
        // Add tags
        if (request.getTagIds() != null && !request.getTagIds().isEmpty()) {
            Set<Tag> tags = new HashSet<>();
            for (Long tagId : request.getTagIds()) {
                Tag tag = tagRepository.findByIdAndUser(tagId, user)
                        .orElseThrow(() -> new ResourceNotFoundException("Tag", "id", tagId));
                tags.add(tag);
            }
            task.setTags(tags);
        }
        
        task = taskRepository.save(task);
        
        // Notify via WebSocket
        notifyTaskChange("create", task, user);
        
        return mapToTaskDTO(task);
    }
    
    @Transactional
    public TaskDTO updateTask(Long taskId, TaskRequest request, UserPrincipal currentUser) {
        User user = getUserById(currentUser.getId());
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", taskId));
        
        if (!task.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Task does not belong to current user");
        }
        
        // Update fields
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setNotes(request.getNotes());
        task.setPriority(request.getPriority() != null ? request.getPriority() : Task.Priority.NONE);
        task.setStatus(request.getStatus() != null ? request.getStatus() : task.getStatus());
        task.setDueDate(request.getDueDate());
        task.setStartDate(request.getStartDate());
        task.setAllDay(request.getAllDay() != null ? request.getAllDay() : false);
        task.setSortOrder(request.getSortOrder() != null ? request.getSortOrder() : task.getSortOrder());
        
        // Update recurring fields
        task.setIsRecurring(request.getIsRecurring() != null ? request.getIsRecurring() : false);
        task.setRecurrenceType(request.getRecurrenceType());
        task.setRecurrenceInterval(request.getRecurrenceInterval());
        task.setRecurrenceEndDate(request.getRecurrenceEndDate());
        task.setRecurrenceDays(request.getRecurrenceDays());
        
        // Update task list
        if (request.getTaskListId() != null) {
            TaskList taskList = taskListRepository.findByIdAndUser(request.getTaskListId(), user)
                    .orElseThrow(() -> new ResourceNotFoundException("TaskList", "id", request.getTaskListId()));
            task.setTaskList(taskList);
        }
        
        // Update tags
        if (request.getTagIds() != null) {
            Set<Tag> tags = new HashSet<>();
            for (Long tagId : request.getTagIds()) {
                Tag tag = tagRepository.findByIdAndUser(tagId, user)
                        .orElseThrow(() -> new ResourceNotFoundException("Tag", "id", tagId));
                tags.add(tag);
            }
            task.setTags(tags);
        }
        
        // Handle status change to COMPLETED
        if (request.getStatus() == Task.Status.COMPLETED && task.getCompletedAt() == null) {
            task.setCompletedAt(LocalDateTime.now());
            
            // Handle recurring tasks
            if (task.getIsRecurring()) {
                createNextRecurringTask(task);
            }
        } else if (request.getStatus() != Task.Status.COMPLETED) {
            task.setCompletedAt(null);
        }
        
        task = taskRepository.save(task);
        
        // Notify via WebSocket
        notifyTaskChange("update", task, user);
        
        return mapToTaskDTO(task);
    }
    
    @Transactional
    public void deleteTask(Long taskId, UserPrincipal currentUser) {
        User user = getUserById(currentUser.getId());
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", taskId));
        
        if (!task.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Task does not belong to current user");
        }
        
        taskRepository.delete(task);
        
        // Notify via WebSocket
        notifyTaskChange("delete", task, user);
    }
    
    @Transactional(readOnly = true)
    public TaskDTO getTask(Long taskId, UserPrincipal currentUser) {
        User user = getUserById(currentUser.getId());
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", taskId));
        
        if (!task.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Task does not belong to current user");
        }
        
        return mapToTaskDTO(task);
    }
    
    @Transactional(readOnly = true)
    public List<TaskDTO> getAllTasks(UserPrincipal currentUser) {
        User user = getUserById(currentUser.getId());
        List<Task> tasks = taskRepository.findByUserAndParentTaskIsNullOrderBySortOrderAsc(user);
        return tasks.stream().map(this::mapToTaskDTO).collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<TaskDTO> getTasksByList(Long listId, UserPrincipal currentUser) {
        User user = getUserById(currentUser.getId());
        List<Task> tasks = taskRepository.findByUserAndTaskListIdOrderBySortOrderAsc(user, listId);
        return tasks.stream().map(this::mapToTaskDTO).collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<TaskDTO> getTodayTasks(UserPrincipal currentUser) {
        User user = getUserById(currentUser.getId());
        LocalDateTime startOfDay = LocalDateTime.now().toLocalDate().atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1);
        
        List<Task> tasks = taskRepository.findByUserAndDueDateBetween(user, startOfDay, endOfDay);
        return tasks.stream().map(this::mapToTaskDTO).collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<TaskDTO> getOverdueTasks(UserPrincipal currentUser) {
        User user = getUserById(currentUser.getId());
        List<Task> tasks = taskRepository.findOverdueTasks(user, LocalDateTime.now());
        return tasks.stream().map(this::mapToTaskDTO).collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<TaskDTO> searchTasks(String query, UserPrincipal currentUser) {
        User user = getUserById(currentUser.getId());
        List<Task> tasks = taskRepository.searchTasks(user, query);
        return tasks.stream().map(this::mapToTaskDTO).collect(Collectors.toList());
    }
    
    private void createNextRecurringTask(Task originalTask) {
        if (originalTask.getRecurrenceType() == null) {
            return;
        }
        
        LocalDateTime nextDueDate = calculateNextDueDate(originalTask);
        
        if (nextDueDate != null) {
            Task nextTask = Task.builder()
                    .title(originalTask.getTitle())
                    .description(originalTask.getDescription())
                    .notes(originalTask.getNotes())
                    .priority(originalTask.getPriority())
                    .status(Task.Status.TODO)
                    .dueDate(nextDueDate)
                    .allDay(originalTask.getAllDay())
                    .isRecurring(true)
                    .recurrenceType(originalTask.getRecurrenceType())
                    .recurrenceInterval(originalTask.getRecurrenceInterval())
                    .recurrenceEndDate(originalTask.getRecurrenceEndDate())
                    .recurrenceDays(originalTask.getRecurrenceDays())
                    .user(originalTask.getUser())
                    .taskList(originalTask.getTaskList())
                    .tags(new HashSet<>(originalTask.getTags()))
                    .build();
            
            taskRepository.save(nextTask);
        }
    }
    
    private LocalDateTime calculateNextDueDate(Task task) {
        if (task.getDueDate() == null) {
            return null;
        }
        
        LocalDateTime nextDate = task.getDueDate();
        int interval = task.getRecurrenceInterval() != null ? task.getRecurrenceInterval() : 1;
        
        switch (task.getRecurrenceType()) {
            case DAILY:
                nextDate = nextDate.plusDays(interval);
                break;
            case WEEKLY:
                nextDate = nextDate.plusWeeks(interval);
                break;
            case MONTHLY:
                nextDate = nextDate.plusMonths(interval);
                break;
            case YEARLY:
                nextDate = nextDate.plusYears(interval);
                break;
            default:
                return null;
        }
        
        // Check if next date exceeds recurrence end date
        if (task.getRecurrenceEndDate() != null && nextDate.isAfter(task.getRecurrenceEndDate())) {
            return null;
        }
        
        return nextDate;
    }
    
    private void notifyTaskChange(String action, Task task, User user) {
        try {
            TaskDTO taskDTO = mapToTaskDTO(task);
            messagingTemplate.convertAndSendToUser(
                    user.getId().toString(),
                    "/queue/tasks",
                    new TaskUpdateMessage(action, taskDTO)
            );
        } catch (Exception e) {
            log.error("Failed to send WebSocket notification", e);
        }
    }
    
    private User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
    }
    
    private TaskDTO mapToTaskDTO(Task task) {
        Set<TagDTO> tagDTOs = task.getTags().stream()
                .map(tag -> TagDTO.builder()
                        .id(tag.getId())
                        .name(tag.getName())
                        .color(tag.getColor())
                        .createdAt(tag.getCreatedAt())
                        .build())
                .collect(Collectors.toSet());
        
        Set<ReminderDTO> reminderDTOs = task.getReminders().stream()
                .map(reminder -> ReminderDTO.builder()
                        .id(reminder.getId())
                        .remindAt(reminder.getRemindAt())
                        .type(reminder.getType())
                        .isSent(reminder.getIsSent())
                        .sentAt(reminder.getSentAt())
                        .createdAt(reminder.getCreatedAt())
                        .build())
                .collect(Collectors.toSet());
        
        Set<AttachmentDTO> attachmentDTOs = task.getAttachments().stream()
                .map(attachment -> AttachmentDTO.builder()
                        .id(attachment.getId())
                        .fileName(attachment.getFileName())
                        .fileUrl(attachment.getFileUrl())
                        .fileType(attachment.getFileType())
                        .fileSize(attachment.getFileSize())
                        .createdAt(attachment.getCreatedAt())
                        .build())
                .collect(Collectors.toSet());
        
        Set<TaskDTO> subtaskDTOs = task.getSubtasks().stream()
                .map(this::mapToTaskDTO)
                .collect(Collectors.toSet());
        
        return TaskDTO.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .notes(task.getNotes())
                .priority(task.getPriority())
                .status(task.getStatus())
                .dueDate(task.getDueDate())
                .startDate(task.getStartDate())
                .completedAt(task.getCompletedAt())
                .allDay(task.getAllDay())
                .sortOrder(task.getSortOrder())
                .isRecurring(task.getIsRecurring())
                .recurrenceType(task.getRecurrenceType())
                .recurrenceInterval(task.getRecurrenceInterval())
                .recurrenceEndDate(task.getRecurrenceEndDate())
                .recurrenceDays(task.getRecurrenceDays())
                .taskListId(task.getTaskList() != null ? task.getTaskList().getId() : null)
                .taskListName(task.getTaskList() != null ? task.getTaskList().getName() : null)
                .parentTaskId(task.getParentTask() != null ? task.getParentTask().getId() : null)
                .tags(tagDTOs)
                .subtasks(subtaskDTOs)
                .reminders(reminderDTOs)
                .attachments(attachmentDTOs)
                .pomodoroCount(task.getPomodoroCount())
                .timeSpent(task.getTimeSpent())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }
    
    // Inner class for WebSocket messages
    public record TaskUpdateMessage(String action, TaskDTO task) {}
}
