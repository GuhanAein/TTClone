package com.ticktick.repository;

import com.ticktick.entity.Habit;
import com.ticktick.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HabitRepository extends JpaRepository<Habit, Long> {
    List<Habit> findByUserOrderBySortOrderAsc(User user);
}
