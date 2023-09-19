export interface Invitation {
  id: string
  byId: string
  toId: string
  type: string
  notification: Notification
  created_at: string
  updated_at: string
  inviter: Inviter
}

export interface Inviter {
  id: string
  name: string
}

export interface Notification {
  id: number,
  content: string
  link: string
}

export type InvitationType = 'ROOM' | 'FRIEND' | 'GAME';
