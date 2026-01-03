# Task Management App Blueprint

## Overview
Collaborative task management application with real-time updates, drag-and-drop functionality, and team workspaces.

## Tech Stack
- **Frontend**: React, TypeScript, TailwindCSS, shadcn/ui
- **Drag & Drop**: @dnd-kit/core (recommended) or react-beautiful-dnd
- **Backend**: Lovable Cloud (Supabase)
- **Real-time**: Supabase Realtime subscriptions
- **Auth**: Supabase Auth

---

## Features

### 1. Authentication
- Email/password login and signup
- User profile with avatar
- Session management

### 2. Workspace Management
- Create/join workspaces (teams)
- Invite members via email
- Workspace settings and permissions

### 3. Project Boards
- **Kanban View**: Columns with draggable cards
- **List View**: Traditional task list
- Default columns: To Do, In Progress, Review, Done
- Custom columns (add, rename, delete, reorder)

### 4. Task Cards
- **Title & Description**: Rich text support
- **Assignee**: Assign to team members
- **Due Date**: Date picker with reminders
- **Priority**: Low, Medium, High, Urgent
- **Labels/Tags**: Colored labels
- **Attachments**: File uploads (optional)
- **Comments**: Discussion thread
- **Subtasks/Checklist**: Nested tasks

### 5. Real-time Collaboration
- Live updates when teammates make changes
- Presence indicators (who's online)
- Activity feed

### 6. Filters & Search
- Filter by assignee, priority, due date, labels
- Global search across all tasks
- Saved filters

---

## Database Schema

```sql
-- Users profile (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workspaces (teams)
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workspace members
CREATE TABLE workspace_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member', -- 'owner', 'admin', 'member'
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(workspace_id, user_id)
);

-- Projects/Boards within a workspace
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#6366f1',
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Columns (Kanban columns)
CREATE TABLE columns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  column_id UUID REFERENCES columns(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
  due_date DATE,
  assignee_id UUID REFERENCES profiles(id),
  created_by UUID REFERENCES profiles(id),
  labels TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Task comments
CREATE TABLE task_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subtasks/Checklist items
CREATE TABLE subtasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  position INTEGER DEFAULT 0
);

-- Enable realtime for tasks and columns
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE columns;

-- Indexes
CREATE INDEX idx_tasks_column ON tasks(column_id);
CREATE INDEX idx_tasks_assignee ON tasks(assignee_id);
CREATE INDEX idx_columns_project ON columns(project_id);
CREATE INDEX idx_workspace_members_workspace ON workspace_members(workspace_id);
```

### RLS Policies
```sql
-- Users can only see workspaces they're members of
CREATE POLICY "Users can view their workspaces" ON workspaces
  FOR SELECT TO authenticated
  USING (
    id IN (
      SELECT workspace_id FROM workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Users can view tasks in their workspaces
CREATE POLICY "Users can view tasks in their workspaces" ON tasks
  FOR SELECT TO authenticated
  USING (
    column_id IN (
      SELECT c.id FROM columns c
      JOIN projects p ON c.project_id = p.id
      JOIN workspace_members wm ON p.workspace_id = wm.workspace_id
      WHERE wm.user_id = auth.uid()
    )
  );

-- Similar CRUD policies for insert, update, delete...
```

---

## Pages & Routes

```
/auth                    - Login/Signup
/                        - Home (workspace list)
/workspace/:id           - Workspace overview
/workspace/:id/project/:projectId - Kanban board
/workspace/:id/settings  - Workspace settings
/task/:id                - Task detail modal/page
/profile                 - User profile
/settings                - User settings
```

---

## UI Components

1. **KanbanBoard** - Main board with columns
2. **KanbanColumn** - Droppable column container
3. **TaskCard** - Draggable task card
4. **TaskModal** - Full task details and editing
5. **MemberAvatar** - User avatar with tooltip
6. **PriorityBadge** - Priority indicator
7. **LabelChip** - Colored label chips
8. **AddTaskForm** - Inline task creation
9. **FilterBar** - Filter/search controls
10. **Sidebar** - Workspace/project navigation

---

## Drag & Drop Implementation

Using @dnd-kit:

```tsx
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

// Handle drag end to update task positions
const handleDragEnd = async (event) => {
  const { active, over } = event;
  if (!over) return;
  
  // Update task's column_id and position in database
  await supabase
    .from('tasks')
    .update({ 
      column_id: newColumnId, 
      position: newPosition 
    })
    .eq('id', active.id);
};
```

---

## Real-time Subscription

```tsx
useEffect(() => {
  const channel = supabase
    .channel('board-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'tasks',
        filter: `column_id=in.(${columnIds.join(',')})`
      },
      (payload) => {
        // Update local state based on payload
        queryClient.invalidateQueries(['tasks', projectId]);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [columnIds]);
```

---

## Key Implementation Notes

1. **Install @dnd-kit/core and @dnd-kit/sortable** for drag-drop
2. **Use optimistic updates** for smooth drag-drop experience
3. **Debounce position updates** to avoid too many DB calls
4. **Use React Query** for data fetching with real-time invalidation
5. **Consider virtualization** for boards with many tasks

---

## Sample Data

```sql
-- After user signs up, create a sample workspace
INSERT INTO workspaces (name, description, owner_id) 
VALUES ('My Workspace', 'Personal task management', auth.uid());

-- Add user as owner
INSERT INTO workspace_members (workspace_id, user_id, role)
VALUES (<workspace_id>, auth.uid(), 'owner');

-- Create sample project
INSERT INTO projects (workspace_id, name, color, created_by)
VALUES (<workspace_id>, 'Website Redesign', '#6366f1', auth.uid());

-- Create default columns
INSERT INTO columns (project_id, name, position) VALUES
(<project_id>, 'To Do', 0),
(<project_id>, 'In Progress', 1),
(<project_id>, 'Review', 2),
(<project_id>, 'Done', 3);
```

---

## Estimated Build Time
- **Basic Kanban**: 3-4 hours with Lovable
- **Full Featured with Collaboration**: 6-8 hours with Lovable
