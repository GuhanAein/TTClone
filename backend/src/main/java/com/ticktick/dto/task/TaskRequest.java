package com.ticktick.dto.task;

import com.ticktick.entity.Task;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;

@Data
public class TaskRequest {
    
    @NotBlank(message = "Title is required")
    @Size(max = 500, message = "Title must not exceed 500 characters")
    private String title;
    
    private String description;
    
    private String notes;
    
    private Task.Priority priority;
    
    private Task.Status status;
    
    private LocalDateTime dueDate;
    
    private LocalDateTime startDate;
    
    private Boolean allDay;
    
    private Long taskListId;
    
    private Long parentTaskId;
    
    private Set<Long> tagIds;
    
    // Recurring task fields
    private Boolean isRecurring;
    private Task.RecurrenceType recurrenceType;
    private Integer recurrenceInterval;
    private LocalDateTime recurrenceEndDate;
    private String recurrenceDays;
    
    private Integer sortOrder;
}
