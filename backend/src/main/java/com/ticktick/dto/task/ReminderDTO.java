package com.ticktick.dto.task;

import com.ticktick.entity.Reminder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReminderDTO {
    private Long id;
    private LocalDateTime remindAt;
    private Reminder.ReminderType type;
    private Boolean isSent;
    private LocalDateTime sentAt;
    private LocalDateTime createdAt;
}
