export type User = {
  id: string
  username: string
  avatar: string
  email: string
  friendRequestsSent?: FrienRequest[]
  friendRequestsRecieved?: FrienRequest[]
}

export type FrienRequest = {
  id: string
  status: 'PENDING' | 'REJECTED' | 'CONFIRMED',
}
