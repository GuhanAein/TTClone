package com.ticktick.dto.habit;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HabitDTO {
    private Long id;
    private String name;
    private String color;
    private String icon;
    private Set<LocalDate> completedDates;
    private Integer sortOrder;
}
