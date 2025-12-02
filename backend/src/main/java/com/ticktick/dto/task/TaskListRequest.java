package com.ticktick.dto.task;

import com.ticktick.entity.TaskList;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TaskListRequest {
    
    @NotBlank(message = "Name is required")
    private String name;
    
    private String color;
    private String icon;
    private TaskList.ViewType viewType;
    private Integer sortOrder;
    private Long folderId;
}
