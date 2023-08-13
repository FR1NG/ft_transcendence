export type CreateRoomDto = {
  name: string
  type: 'PUBLIC' | 'RROTECTED' | 'PRIVATE'
  password: string
}
