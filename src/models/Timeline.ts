import { Message } from "./Message";

export interface Timeline {
    user_uuid: string;
    messages: Array<Message>;
}

export interface MessageForMultipleTimelinesRequest {
    user_uuids: Array<string>;
    message: Message;
}

export interface UserUnfollowConsequenceRequest {
    user_uuid: string;
    message_user_uuid: string;
}