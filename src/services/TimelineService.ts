import MongoDBTimelineDatabaseConnection from "../repositories/MongoDBTimelineDatabaseConnection";
import { Message } from "../models/Message";
import { MessageForMultipleTimelinesRequest, Timeline } from "../models/Timeline";

export default class TimelineService {
    public databaseConnection;
    private DEFAULT_PAGE = 1;
    private DEFAULT_PER_PAGE = 20; 

    constructor() {
        this.databaseConnection = new MongoDBTimelineDatabaseConnection();
    }

    public createTimeLine = async (user_uuid: string): Promise<Timeline | undefined> => {
        return this.databaseConnection.createTimeLine(user_uuid);
    }

    public getAllTimelines = async (): Promise<Array<Timeline>> => {
        return this.databaseConnection.getAllTimelines();
    }

    public getTimelineByUserId = async (user_uuid: string, page: number | undefined = this.DEFAULT_PAGE, per_page: number | undefined = this.DEFAULT_PER_PAGE): Promise<Timeline | undefined> => {
        return this.databaseConnection.getTimelineByUserId(user_uuid, page, per_page);
    }

    public addMessageToTimeline = async (user_uuid: string, message: Message): Promise<Timeline | undefined> => {
        return this.databaseConnection.addMessageToTimeline(user_uuid, message);
    }

    public addMultipleMessagesToTimeline = async (user_uuid: string, messages: Array<Message>): Promise<Timeline | undefined> => {
        return this.databaseConnection.addMultipleMessagesToTimeline(user_uuid, messages);
    }

    public addMessageToMultipleTimelines = async (message_and_user_uuids: MessageForMultipleTimelinesRequest): Promise<Array<Timeline | undefined>> => {
        return this.databaseConnection.addMessageToMultipleTimelines(message_and_user_uuids);
    }

    public removeMessagesFromTimelineByMessageUserUuid = async (user_uuid: string, message_user_uuid: string): Promise<Timeline | undefined> => {
        return this.databaseConnection.removeMessagesFromTimelineByMessageUserUuid(user_uuid, message_user_uuid);
    }

    public removeMessagesFromAllTimelinesByMessageUuid = async (message_uuid: string): Promise<Timeline | undefined> => {
        return this.databaseConnection.removeMessagesFromAllTimelinesByMessageUuid(message_uuid);
    }
}
