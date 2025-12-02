package com.ticktick.repository;

import com.ticktick.entity.Task;
import com.ticktick.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long>, JpaSpecificationExecutor<Task> {
    
    List<Task> findByUserAndTaskListIdOrderBySortOrderAsc(User user, Long taskListId);
    
    List<Task> findByUserAndParentTaskIdOrderBySortOrderAsc(User user, Long parentTaskId);
    
    List<Task> findByUserAndParentTaskIsNullOrderBySortOrderAsc(User user);
    
    @Query("SELECT t FROM Task t WHERE t.user = :user AND t.dueDate BETWEEN :start AND :end")
    List<Task> findByUserAndDueDateBetween(@Param("user") User user, 
                                            @Param("start") LocalDateTime start, 
                                            @Param("end") LocalDateTime end);
    
    @Query("SELECT t FROM Task t WHERE t.user = :user AND t.status != 'COMPLETED' AND t.dueDate < :now")
    List<Task> findOverdueTasks(@Param("user") User user, @Param("now") LocalDateTime now);
    
    @Query("SELECT t FROM Task t WHERE t.user = :user AND " +
           "(LOWER(t.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(t.description) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(t.notes) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Task> searchTasks(@Param("user") User user, @Param("query") String query);
    
    @Query("SELECT t FROM Task t JOIN t.tags tag WHERE t.user = :user AND tag.id = :tagId")
    List<Task> findByUserAndTagId(@Param("user") User user, @Param("tagId") Long tagId);
    
    List<Task> findByUserAndIsRecurringTrue(User user);
    
    Long countByUserAndTaskListId(User user, Long taskListId);
}
