import { Message } from '../models/Message';
import { MessageForMultipleTimelinesRequest, Timeline, UserUnfollowConsequenceRequest } from '../models/Timeline';
import TimelineService from '../services/TimelineService';
import { Route, Get, Put, Path, Post, Body } from 'tsoa'

@Route("/timelines")
export default class TimelineController {
    public timelineService;

    constructor() {
        this.timelineService = new TimelineService();
    }

    @Post("/:user_uuid")
    public async createTimeline(
        @Path() user_uuid: string
    ): Promise<Timeline | undefined> {
        return await this.timelineService.createTimeLine(user_uuid);
    }
    
    @Get("")
    public async getAllTimelines(): Promise<Array<Timeline>> {
        return await this.timelineService.getAllTimelines();
    }

    @Get("/:user_uuid")
    public async getTimelineByUserId(
        @Path() user_uuid: string,
    ): Promise<Timeline | undefined> {
        return await this.timelineService.getTimelineByUserId(user_uuid);
    }


    @Put("/:user_uuid")
    public async addMessageToTimeline(
        @Path() user_uuid: string,
        @Body() message: Message
    ): Promise<Timeline | undefined> {
        return await this.timelineService.addMessageToTimeline(user_uuid, message);
    }

    @Put("/:user_uuid/bulk")
    public async addMultipleMessagesToTimeline(
        @Path() user_uuid: string,
        @Body() messages: Array<Message>
    ): Promise<Timeline | undefined> {
        return await this.timelineService.addMultipleMessagesToTimeline(user_uuid, messages);
    }

    @Put("") 
    public async addMessageToMultipleTimelines(
        @Body() message_and_user_uuids: MessageForMultipleTimelinesRequest
    ): Promise<Array<Timeline | undefined>> {
        return await this.timelineService.addMessageToMultipleTimelines(message_and_user_uuids);
    }

    @Put("/unfollow")
    public async removeMessagesFromTimelineByMessageUserUuid(
        @Body() userUnfollowConsequenceRequest: UserUnfollowConsequenceRequest
    ): Promise<Timeline | undefined> {
        return await this.timelineService.removeMessagesFromTimelineByMessageUserUuid(userUnfollowConsequenceRequest);
    }

    @Put("/remove/:message_uuid") 
    public async removeMessageFromAllTimelinesByMessageUuid(
        @Path() message_uuid: string
    ): Promise<Timeline | undefined> {
        return await this.timelineService.removeMessageFromAllTimelinesByMessageUuid(message_uuid);
    }  

}