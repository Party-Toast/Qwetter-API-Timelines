import { MessageCreationRequest, MessageLikeRequest, MessageUndoLikeRequest } from '../models/Message';
import MessageService from '../services/MessageService';
import { Message } from '../models/Message';
import { Route, Get, Query, Path, Post, Body, Delete } from 'tsoa'

@Route("/messages")
export default class MessageController {
    public messageService: MessageService;

    constructor() {
        this.messageService = new MessageService();
    }
    
    /**
     * Retrieves the details of all existing messages.
     */
    @Get("")
    public async getAllMessages(): Promise<Array<Message>> {
        return await this.messageService.getAllMessages();
    }

    /**
     * Retrieves the details of a specific message.
     * @param uuid The message's UUID
     */
    @Get("/:uuid")
    public async getMessageById(
        @Path() uuid: string
    ): Promise<Message | undefined> {
        return await this.messageService.getMessageById(uuid);
    }

    /**
     * Retrieves a list a messages by a specific user
     * @param user_uuid The UUID of the user
     * @param page The page of messages
     * @param per_page The amount of messages per page
     */
    @Get("/user/:user_uuid")
    public async getMessagesByUserId(
        @Path() user_uuid: string, 
        @Query() page?: number, 
        @Query() per_page?: number
    ): Promise<Array<Message> | undefined> {
        return await this.messageService.getMessagesByUserId(user_uuid, page, per_page);
    }
    
    /**
     * Creates a new message
     * @param messageCreationRequest Required data to create a new message
     */
    @Post("")
    public async createMessage(
        @Body() messageCreationRequest: MessageCreationRequest
    ): Promise<Message> {
        return await this.messageService.createMessage(messageCreationRequest);
    }

    /**
     * Leaves a like on a message
     * @param uuid The message's UUID
     * @param messageLikeRequest Required data to like a message
     */
    @Post("/like/:uuid")
    public async likeMessage(
        @Path() uuid: string, 
        @Body() messageLikeRequest: MessageLikeRequest
    ): Promise<Message | undefined> {
        return await this.messageService.likeMessage(uuid, messageLikeRequest);
    }
    
    /**
     * Removes a like from a message
     * @param uuid The message's UUID
     * @param messageUndoLikeRequest Required data to like a message
     */
    @Post("/undo_like/:uuid")
    public async undoLikeMessage (
        @Path() uuid: string,
        @Body() messageUndoLikeRequest: MessageUndoLikeRequest
    ): Promise<Message | undefined> {
        return await this.messageService.undoLikeMessage(uuid, messageUndoLikeRequest);
    }

    /**
     * Deletes a message
     * @param uuid 
     */
    @Delete("/:uuid")
    public async deleteMessage(
        @Path() uuid: string
    ): Promise<Message | undefined> {
        return await this.messageService.deleteMessage(uuid);
    }
}