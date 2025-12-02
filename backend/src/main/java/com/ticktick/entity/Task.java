package com.ticktick.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "tasks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Task {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Priority priority = Priority.NONE;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Status status = Status.TODO;
    
    @Column(name = "due_date")
    private LocalDateTime dueDate;
    
    @Column(name = "start_date")
    private LocalDateTime startDate;
    
    @Column(name = "completed_at")
    private LocalDateTime completedAt;
    
    @Column(name = "all_day")
    @Builder.Default
    private Boolean allDay = false;
    
    @Column(name = "sort_order")
    @Builder.Default
    private Integer sortOrder = 0;
    
    // Recurring task fields
    @Column(name = "is_recurring")
    @Builder.Default
    private Boolean isRecurring = false;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "recurrence_type")
    private RecurrenceType recurrenceType;
    
    @Column(name = "recurrence_interval")
    private Integer recurrenceInterval;
    
    @Column(name = "recurrence_end_date")
    private LocalDateTime recurrenceEndDate;
    
    @Column(name = "recurrence_days")
    private String recurrenceDays; // JSON array for custom days
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_list_id")
    private TaskList taskList;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_task_id")
    private Task parentTask;
    
    @OneToMany(mappedBy = "parentTask", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<Task> subtasks = new HashSet<>();
    
    @ManyToMany
    @JoinTable(
        name = "task_tags",
        joinColumns = @JoinColumn(name = "task_id"),
        inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    @Builder.Default
    private Set<Tag> tags = new HashSet<>();
    
    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<Reminder> reminders = new HashSet<>();
    
    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<Attachment> attachments = new HashSet<>();
    
    @Column(name = "pomodoro_count")
    @Builder.Default
    private Integer pomodoroCount = 0;
    
    @Column(name = "time_spent")
    @Builder.Default
    private Long timeSpent = 0L; // in seconds
    
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    public enum Priority {
        NONE, LOW, MEDIUM, HIGH
    }
    
    public enum Status {
        TODO, IN_PROGRESS, COMPLETED
    }
    
    public enum RecurrenceType {
        DAILY, WEEKLY, MONTHLY, YEARLY, CUSTOM
    }
}
