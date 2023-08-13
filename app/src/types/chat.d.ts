import { User } from "./user"

export type Message = {
  id: string
  type: 'sent' | 'recieved'
  content: string
  loading: boolean
}

export type Conversation = {
  messages: Message[]
  user: User
}
