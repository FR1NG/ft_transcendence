export interface Invitation {
  id: string
  byId: string
  toId: string
  type: string
  created_at: string
  updated_at: string
  inviter: Inviter
}

export interface Inviter {
  id: string
  name: string
}

export type InvitationType = 'ROOM' | 'FRIEND' | 'GAME';
