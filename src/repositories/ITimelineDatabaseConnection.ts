import { Message } from "../models/Message";
import { Timeline, MessageForMultipleTimelinesRequest, UserUnfollowConsequenceRequest, MultipleMessagesforTimelineRequest} from "../models/Timeline";

export default interface ITimelineDatabaseConnection {
    createTimeLine(user_uuid: string): Promise<Timeline | undefined>;
    getAllTimelines(): Promise<Array<Timeline>>;
    getTimelineByUserId (user_uuid: string, page: number, per_page: number): Promise<Timeline | undefined>;
    addMessageToTimeline (user_uuid: string, message: Message): Promise<Timeline | undefined>;
    addMultipleMessagesToTimeline (userUuidAndMessages: MultipleMessagesforTimelineRequest): Promise<Timeline | undefined>;
    addMessageToMultipleTimelines(message_and_user_uuids: MessageForMultipleTimelinesRequest): Promise<Array<Timeline | undefined>>;
    // TODO: update messages in timeline based on message uuid (in case user/likes changes)
    removeMessagesFromTimelineByMessageUserUuid (userUnfollowConsequenceRequest: UserUnfollowConsequenceRequest): Promise<Timeline | undefined>;
    removeMessageFromAllTimelinesByMessageUuid (message_uuid: string): Promise<Timeline | undefined>;
}