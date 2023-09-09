import { User } from "./user"
import type {  UserRoom } from "./room"

export type Message = {
  id: string
  content: string
  loading: boolean
  user: Sender
  seen: boolean
}

type Sender = {
  id: string
  username: string
  avatar: string
}

export type Conversation = {
  messages: Message[]
  sender: User | UserRoom
}
