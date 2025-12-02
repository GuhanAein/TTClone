package com.ticktick.repository;

import com.ticktick.entity.Folder;
import com.ticktick.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FolderRepository extends JpaRepository<Folder, Long> {
    
    List<Folder> findByUserOrderBySortOrderAsc(User user);
    
    Optional<Folder> findByIdAndUser(Long id, User user);
}
