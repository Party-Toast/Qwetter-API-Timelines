import { Message, MessageCreationRequest, MessageLikeRequest, MessageUndoLikeRequest } from "../models/Message";

export default interface IDatabaseConnection {
    getAllMessages (): Promise<Array<Message>>;
    getMessageById (uuid: string): Promise<Message | undefined>;
    getMessagesByUserId (user_uuid: string, page: number, per_page: number): Promise<Array<Message> | undefined>;
    createMessage (message: MessageCreationRequest): Promise<Message>;
    likeMessage (uuid: string, user: MessageLikeRequest): Promise<Message | undefined>;
    undoLikeMessage (uuid: string, user: MessageUndoLikeRequest): Promise<Message | undefined>;
    deleteMessage (uuid: string): Promise<Message | undefined>;
}