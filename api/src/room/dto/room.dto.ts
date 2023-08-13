export  class CreateRoomDto {
  name: string
  type: 'PUBLIC' | 'RROTECTED' | 'PRIVATE'
  password: string
}

