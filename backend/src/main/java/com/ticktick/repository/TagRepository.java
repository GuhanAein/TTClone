package com.ticktick.repository;

import com.ticktick.entity.Tag;
import com.ticktick.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {
    
    List<Tag> findByUser(User user);
    
    Optional<Tag> findByIdAndUser(Long id, User user);
    
    Optional<Tag> findByNameAndUser(String name, User user);
}
