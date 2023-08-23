import { User } from "./user"
import type { Room } from "./room"

export type Message = {
  id: string
  type: 'sent' | 'recieved'
  content: string
  loading: boolean
  sender: Sender
}

type Sender = {
  id: string
  username: string
  avatar: string
}

export type Conversation = {
  messages: Message[]
  user: User | Room
}
