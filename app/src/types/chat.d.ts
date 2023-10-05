import { User } from "./user"
import type {  UserRoom } from "./room"

export type Message = {
  id: string
  content: string
  loading: boolean
  sender: Sender
  seen: boolean
  create_at: string
}

type Sender = {
  id: string
  username: string
  avatar: string
}

export type Conversation = {
  conversationId: string
  messages: Message[]
  messagesCount: number
  sender: User | UserRoom
}
