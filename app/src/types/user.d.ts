export type Me = {
  id: string
  username: string
  avatar: string
}
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
  rank: number
  achievments: Achiement[]
  leaderboard: Leaderboard
  games: Game[]
}

export interface Leaderboard {
  username: string
  avatar: string
  points: number
}

export interface Achiement {
  id: string
  name: string
  description: string
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

export interface Friend {
  id: string
  avatar: string
  username: string
  isInGame: boolean
  isOnline: boolean
  status: string
}
