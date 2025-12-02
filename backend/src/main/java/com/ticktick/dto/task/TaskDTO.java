package com.ticktick.dto.task;

import com.ticktick.entity.Task;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskDTO {
    private Long id;
    private String title;
    private String description;
    private String notes;
    private Task.Priority priority;
    private Task.Status status;
    private LocalDateTime dueDate;
    private LocalDateTime startDate;
    private LocalDateTime completedAt;
    private Boolean allDay;
    private Integer sortOrder;
    
    // Recurring task fields
    private Boolean isRecurring;
    private Task.RecurrenceType recurrenceType;
    private Integer recurrenceInterval;
    private LocalDateTime recurrenceEndDate;
    private String recurrenceDays;
    
    private Long taskListId;
    private String taskListName;
    private Long parentTaskId;
    
    private Set<TagDTO> tags;
    private Set<TaskDTO> subtasks;
    private Set<ReminderDTO> reminders;
    private Set<AttachmentDTO> attachments;
    
    private Integer pomodoroCount;
    private Long timeSpent;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
