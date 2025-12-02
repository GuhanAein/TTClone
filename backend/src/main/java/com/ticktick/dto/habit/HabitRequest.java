package com.ticktick.dto.habit;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HabitRequest {
    @NotBlank
    private String name;
    private String color;
    private String icon;
    private Integer sortOrder;
}
