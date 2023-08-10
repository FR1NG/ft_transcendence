export type User = {
  id: string
  username: string
  avatar: string
  email: string
  friendRequestsSent?: FrienRequest[]
  friendRequestsRecieved?: FrienRequest[]
  isOnline: boolean
  _count: Count
}

export type FrienRequest = {
  id: string
  status: 'PENDING' | 'REJECTED' | 'CONFIRMED',
}

type Count = {
  friendOf: number
  friendWith: number
}
