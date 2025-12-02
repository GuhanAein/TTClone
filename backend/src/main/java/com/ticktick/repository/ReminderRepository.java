package com.ticktick.repository;

import com.ticktick.entity.Reminder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReminderRepository extends JpaRepository<Reminder, Long> {
    
    @Query("SELECT r FROM Reminder r WHERE r.isSent = false AND r.remindAt <= :now")
    List<Reminder> findPendingReminders(@Param("now") LocalDateTime now);
    
    List<Reminder> findByTaskId(Long taskId);
}
