import { User } from "./user"
import type { Room } from "./room"

export type Message = {
  id: string
  content: string
  loading: boolean
  user: Sender
}

type Sender = {
  id: string
  username: string
  avatar: string
}

export type Conversation = {
  messages: Message[]
  sender: User | Room
}
