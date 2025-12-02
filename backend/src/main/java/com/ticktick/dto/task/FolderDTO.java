package com.ticktick.dto.task;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FolderDTO {
    private Long id;
    private String name;
    private String color;
    private String icon;
    private Integer sortOrder;
    private List<TaskListDTO> taskLists;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
