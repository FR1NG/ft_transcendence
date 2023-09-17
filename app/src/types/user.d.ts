export type User = {
  id: string
  username: string
  avatar: string
  email: string
  isOnline: boolean
  friendsCount: number
  friendshipStatus: FriendshipStatus
  invitationId: string
  blocked: boolean
}

export type FrienRequest = {
  id: string
  status: 'PENDING' | 'REJECTED' | 'CONFIRMED',
}

type FriendshipStatus = 'FRIENDS' | 'INVITATION_SENT' | 'INVITATION_RECIEVED' | 'NONE'
