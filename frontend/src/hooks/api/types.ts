export type User = {
  user_id: string
  email: string
  name?: string
  created_at: string
}

export type Group = {
  group_id: string
  name: string
  owner_user_id: string
  created_at: string
}

export type Todo = {
  todo_id: string
  group_id: string
  title: string
  description?: string
  owner_user_id: string
  due_date?: string | null
  is_completed: boolean
  created_at: string
  updated_at: string
}

export type GroupMember = {
  group_id: string
  user_id: string
  role: 'admin' | 'member'
  invited_at: string
} 