export type CreateRoomDto = {
  name: string
  type: RoomType
  password: string
}

export type UserRoom = {
  role: string
  room: Room
}

export type Room = {
  id: string
  name: string
  type?: RoomType
}

export type RoomType = 'PUBLIC' | 'PROTECTED' | 'PRIVATE';

export type SearchedRoom = {
  id: string
  name: string
  type: RoomType
  joined: boolean
}

export type RoomDetails = {
  role: string
  room: RoomUser
}

export interface RoomUser {
  name: string
  type: string
  users: User[]
}

export interface User {
  role: string
  user: User2
}

export interface User2 {
  id: string
  username: string
  avatar: string
}
