import { User } from "../user";

export type UserConversation = {
  user: User,
  unseen: Array<string>
};