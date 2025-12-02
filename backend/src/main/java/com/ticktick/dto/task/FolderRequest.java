package com.ticktick.dto.task;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class FolderRequest {
    
    @NotBlank(message = "Name is required")
    private String name;
    
    private String color;
    private String icon;
    private Integer sortOrder;
}
