export type User = {
  id: string
  username: string
  avatar: string
  email: string
  isOnline: boolean
  friendsCount: number
  winsCount: number
  loseCount: number
  points: number
  friendshipStatus: FriendshipStatus
  invitationId: string
  blocked: boolean
  games: Game[]
}

export type FrienRequest = {
  id: string
  status: 'PENDING' | 'REJECTED' | 'CONFIRMED',
}

type FriendshipStatus = 'FRIENDS' | 'INVITATION_SENT' | 'INVITATION_RECIEVED' | 'NONE'
type GameSatus = 'CREATED' | 'STARTED' | 'FINISHED';

export interface Game {
  id: string
  status: GameSatus
  winnerId?: string
  winnerScore?: number
  loserScore: number
  guest: Guest
  host: Host
  created_at: string
}


export interface Guest {
  id: string
  username: string
  avatar: string
}

export interface Host {
  id: string
  username: string
  avatar: string
}
