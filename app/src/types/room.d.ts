export type CreateRoomDto = {
  name: string
  type: 'PUBLIC' | 'PROTECTED' | 'PRIVATE'
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
