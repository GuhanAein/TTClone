package com.ticktick.service;

import com.ticktick.dto.task.TaskListDTO;
import com.ticktick.dto.task.TaskListRequest;
import com.ticktick.entity.Folder;
import com.ticktick.entity.TaskList;
import com.ticktick.entity.User;
import com.ticktick.exception.BadRequestException;
import com.ticktick.exception.ResourceNotFoundException;
import com.ticktick.repository.FolderRepository;
import com.ticktick.repository.TaskListRepository;
import com.ticktick.repository.TaskRepository;
import com.ticktick.repository.UserRepository;
import com.ticktick.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskListService {
    
    private final TaskListRepository taskListRepository;
    private final FolderRepository folderRepository;
    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    
    @Transactional
    public TaskListDTO createTaskList(TaskListRequest request, UserPrincipal currentUser) {
        User user = getUserById(currentUser.getId());
        
        TaskList taskList = TaskList.builder()
                .name(request.getName())
                .color(request.getColor())
                .icon(request.getIcon())
                .viewType(request.getViewType() != null ? request.getViewType() : TaskList.ViewType.LIST)
                .sortOrder(request.getSortOrder() != null ? request.getSortOrder() : 0)
                .user(user)
                .build();
        
        if (request.getFolderId() != null) {
            Folder folder = folderRepository.findByIdAndUser(request.getFolderId(), user)
                    .orElseThrow(() -> new ResourceNotFoundException("Folder", "id", request.getFolderId()));
            taskList.setFolder(folder);
        }
        
        taskList = taskListRepository.save(taskList);
        return mapToTaskListDTO(taskList);
    }
    
    @Transactional
    public TaskListDTO updateTaskList(Long id, TaskListRequest request, UserPrincipal currentUser) {
        User user = getUserById(currentUser.getId());
        TaskList taskList = taskListRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("TaskList", "id", id));
        
        taskList.setName(request.getName());
        taskList.setColor(request.getColor());
        taskList.setIcon(request.getIcon());
        taskList.setViewType(request.getViewType() != null ? request.getViewType() : taskList.getViewType());
        taskList.setSortOrder(request.getSortOrder() != null ? request.getSortOrder() : taskList.getSortOrder());
        
        if (request.getFolderId() != null) {
            Folder folder = folderRepository.findByIdAndUser(request.getFolderId(), user)
                    .orElseThrow(() -> new ResourceNotFoundException("Folder", "id", request.getFolderId()));
            taskList.setFolder(folder);
        } else {
            taskList.setFolder(null);
        }
        
        taskList = taskListRepository.save(taskList);
        return mapToTaskListDTO(taskList);
    }
    
    @Transactional
    public void deleteTaskList(Long id, UserPrincipal currentUser) {
        User user = getUserById(currentUser.getId());
        TaskList taskList = taskListRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("TaskList", "id", id));
        
        taskListRepository.delete(taskList);
    }
    
    @Transactional(readOnly = true)
    public TaskListDTO getTaskList(Long id, UserPrincipal currentUser) {
        User user = getUserById(currentUser.getId());
        TaskList taskList = taskListRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("TaskList", "id", id));
        
        return mapToTaskListDTO(taskList);
    }
    
    @Transactional(readOnly = true)
    public List<TaskListDTO> getAllTaskLists(UserPrincipal currentUser) {
        User user = getUserById(currentUser.getId());
        List<TaskList> taskLists = taskListRepository.findByUserOrderBySortOrderAsc(user);
        return taskLists.stream().map(this::mapToTaskListDTO).collect(Collectors.toList());
    }
    
    private User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
    }
    
    private TaskListDTO mapToTaskListDTO(TaskList taskList) {
        Long taskCount = taskRepository.countByUserAndTaskListId(taskList.getUser(), taskList.getId());
        
        return TaskListDTO.builder()
                .id(taskList.getId())
                .name(taskList.getName())
                .color(taskList.getColor())
                .icon(taskList.getIcon())
                .viewType(taskList.getViewType())
                .sortOrder(taskList.getSortOrder())
                .isShared(taskList.getIsShared())
                .folderId(taskList.getFolder() != null ? taskList.getFolder().getId() : null)
                .folderName(taskList.getFolder() != null ? taskList.getFolder().getName() : null)
                .taskCount(taskCount.intValue())
                .createdAt(taskList.getCreatedAt())
                .updatedAt(taskList.getUpdatedAt())
                .build();
    }
}
