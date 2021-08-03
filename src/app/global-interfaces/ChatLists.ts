import { Person } from "../app-person/interfaces/person";
import { PrivateMessage } from "./private-message";

export class ChatLists {
    LastMessage: PrivateMessage;
    PersonImChattingWith: Person;
}
