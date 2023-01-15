export interface Message {
    uuid: string;
    user_uuid: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar: string;
    content: string;
    timestamp: string;
    liked_user_uuids: Array<string>; // Array of user UUIDs
}