package com.ticktick.dto.task;

import com.ticktick.entity.TaskList;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskListDTO {
    private Long id;
    private String name;
    private String color;
    private String icon;
    private TaskList.ViewType viewType;
    private Integer sortOrder;
    private Boolean isShared;
    private Long folderId;
    private String folderName;
    private Integer taskCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
