import { User } from "./user"
import type { Room } from "./room"

export type Message = {
  id: string
  type: 'sent' | 'recieved'
  content: string
  loading: boolean
}

export type Conversation = {
  messages: Message[]
  user: User | Room
}
