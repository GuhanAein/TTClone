export interface User {
    id: number;
    email: string;
    name: string;
    profilePicture?: string;
    provider: 'LOCAL' | 'GOOGLE';
    emailVerified: boolean;
    roles: string[];
    darkMode: boolean;
    timezone: string;
    createdAt: string;
}

export interface Task {
    id: number;
    title: string;
    description?: string;
    notes?: string;
    priority: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH';
    status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
    dueDate?: string;
    startDate?: string;
    completedAt?: string;
    allDay: boolean;
    sortOrder: number;
    isRecurring: boolean;
    recurrenceType?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY' | 'CUSTOM';
    recurrenceInterval?: number;
    recurrenceEndDate?: string;
    recurrenceDays?: string;
    taskListId?: number;
    taskListName?: string;
    parentTaskId?: number;
    tags: Tag[];
    subtasks: Task[];
    reminders: Reminder[];
    attachments: Attachment[];
    pomodoroCount: number;
    timeSpent: number;
    createdAt: string;
    updatedAt: string;
}

export interface TaskList {
    id: number;
    name: string;
    color?: string;
    icon?: string;
    viewType: 'LIST' | 'KANBAN' | 'TIMELINE';
    sortOrder: number;
    isShared: boolean;
    folderId?: number;
    folderName?: string;
    taskCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface Folder {
    id: number;
    name: string;
    color?: string;
    icon?: string;
    sortOrder: number;
    taskLists: TaskList[];
    createdAt: string;
    updatedAt: string;
}

export interface Tag {
    id: number;
    name: string;
    color?: string;
    createdAt: string;
}

export interface Reminder {
    id: number;
    remindAt: string;
    type: 'NOTIFICATION' | 'EMAIL' | 'BOTH';
    isSent: boolean;
    sentAt?: string;
    createdAt: string;
}

export interface Attachment {
    id: number;
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
    createdAt: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    user: User;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface SignUpRequest {
    name: string;
    email: string;
    password: string;
}

export interface TaskRequest {
    title: string;
    description?: string;
    notes?: string;
    priority?: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH';
    status?: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
    dueDate?: string;
    startDate?: string;
    allDay?: boolean;
    taskListId?: number;
    parentTaskId?: number;
    tagIds?: number[];
    isRecurring?: boolean;
    recurrenceType?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY' | 'CUSTOM';
    recurrenceInterval?: number;
    recurrenceEndDate?: string;
    recurrenceDays?: string;
    sortOrder?: number;
}

export interface TaskListRequest {
    name: string;
    color?: string;
    icon?: string;
    viewType?: 'LIST' | 'KANBAN' | 'TIMELINE';
    sortOrder?: number;
    folderId?: number;
}
export interface Habit {
    id: number;
    name: string;
    color: string;
    icon: string;
    completedDates: string[];
    sortOrder: number;
}
