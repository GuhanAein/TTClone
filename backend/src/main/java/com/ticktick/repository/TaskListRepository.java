package com.ticktick.repository;

import com.ticktick.entity.TaskList;
import com.ticktick.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskListRepository extends JpaRepository<TaskList, Long> {
    
    List<TaskList> findByUserOrderBySortOrderAsc(User user);
    
    List<TaskList> findByUserAndFolderIdOrderBySortOrderAsc(User user, Long folderId);
    
    List<TaskList> findByUserAndFolderIsNullOrderBySortOrderAsc(User user);
    
    Optional<TaskList> findByIdAndUser(Long id, User user);
}
