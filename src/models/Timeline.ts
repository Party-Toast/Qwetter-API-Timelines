import { Message } from "./Message";

export interface Timeline {
    user_uuid: string;
    messages: Array<Message>;
}

export interface MessageForMultipleTimelinesRequest {
    user_uuids: Array<string>;
    message: Message;
}

export interface MultipleMessagesforTimelineRequest {
    user_uuid: string;
    messages: Array<Message>;
}

export interface UserUnfollowConsequenceRequest {
    follower_uuid: string;
    followee_uuid: string;
}