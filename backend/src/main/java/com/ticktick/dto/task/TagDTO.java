package com.ticktick.dto.task;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TagDTO {
    private Long id;
    private String name;
    private String color;
    private LocalDateTime createdAt;
}
