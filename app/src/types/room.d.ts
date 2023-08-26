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
}

export type RoomType = 'PUBLIC' | 'PROTECTED' | 'PRIVATE';

export type SearchedRoom = {
  id: string
  name: string
  type: RoomType
  joined: boolean
}
