import IDatabaseConnection from "./ITimelineDatabaseConnection";
import { Message } from "../models/Message";
import { MessageForMultipleTimelinesRequest, Timeline, UserUnfollowConsequenceRequest } from "../models/Timeline";
import { ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI as string;

export default class MongoDBTimelineDatabaseConnection implements IDatabaseConnection {
    private client;
    private collection;

    constructor() {
        const { MongoClient, ServerApiVersion } = require('mongodb');
        this.client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
        this.collection = this.client.db("Qwetter").collection("Timelines");
    }

    // Utils

    private createMessageFromResult = (result: any): Message => {
        let message: Message = {
            uuid: result.uuid,
            user_uuid: result.user_uuid,
            username: result.username,
            firstName: result.firstName,
            lastName: result.lastName,
            avatar: result.avatar,
            content: result.content,
            timestamp: result.timestamp,
            liked_user_uuids: result.liked_user_uuids ?? []
        };
        return message;
    }

    private createTimelineFromResult = (result: any): Timeline => {
        let timeline: Timeline = {
            user_uuid: result.user_uuid,
            messages: result.messages.map((message: any) => this.createMessageFromResult(message))
        };
        return timeline;
    }

    // Database operations

    public createTimeLine = async(user_uuid: string): Promise<Timeline | undefined> => {
        return new Promise((resolve, reject) => {
            this.collection.insertOne(
                { user_uuid: user_uuid, messages: [] }
            ).then(() => {
                const timeline: Timeline = {
                    user_uuid: user_uuid,
                    messages: []
                };
                resolve(timeline);
            }).catch(() => {
                resolve(undefined);
            });
        });
    }

    public getAllTimelines = async(): Promise<Array<Timeline>> => {
        return new Promise((resolve, reject) => {
            this.collection.find().toArray().then((results: any) => {
                let timelines = results.map((result: any) => this.createTimelineFromResult(result));
                resolve(timelines);
            });
        });
    }

    public getTimelineByUserId = async(user_uuid: string, page: number, per_page: number): Promise<Timeline | undefined> => {
        // TODO: Implement pagination support
        return new Promise((resolve, reject) => {
            this.collection.findOne(
                { user_uuid: user_uuid }
            ).then((result: any) => {
                if(result === null) {
                    resolve(undefined);
                    return;
                }
                let timeline = this.createTimelineFromResult(result);
                resolve(timeline);
            });
        });
    }

    public addMessageToTimeline (user_uuid: string, message: Message): Promise<Timeline | undefined> {
        return new Promise((resolve, reject) => {
            this.collection.findOneAndUpdate(
                { user_uuid: user_uuid },
                { $push: { messages: message } },
                { returnDocument: "after" }
            ).then((result: any) => {
                if(result.value === null) {
                    resolve(undefined);
                    return;
                }
                let timeline = this.createTimelineFromResult(result.value);
                resolve(timeline);
            });
        });
    }

    public addMultipleMessagesToTimeline (user_uuid: string, messages: Array<Message>): Promise<Timeline | undefined> {
        return new Promise((resolve, reject) => {
            this.collection.findOneAndUpdate(
                { user_uuid: user_uuid },
                { $push: { messages: { $each: messages } } },
                { returnDocument: "after" }
            ).then((result: any) => {
                if(result.value === null) {
                    resolve(undefined);
                    return;
                }
                let timeline = this.createTimelineFromResult(result.value);
                resolve(timeline);
            });
        });
    }

    public addMessageToMultipleTimelines(message_and_user_uuids: MessageForMultipleTimelinesRequest): Promise<Array<Timeline | undefined>> {
        const user_uuids = message_and_user_uuids.user_uuids;
        const message = message_and_user_uuids.message;
        
        return new Promise((resolve, reject) => {
            let promises = user_uuids.map((user_uuid: string) => this.addMessageToTimeline(user_uuid, message));
            Promise.all(promises).then((results: Array<Timeline | undefined>) => {
                resolve(results);
            });
        });
    }

    public removeMessagesFromTimelineByMessageUserUuid (userUnfollowConsequenceRequest: UserUnfollowConsequenceRequest): Promise<Timeline | undefined> {
        const user_uuid = userUnfollowConsequenceRequest.follower_uuid;
        const message_user_uuid = userUnfollowConsequenceRequest.followee_uuid;
        
        return new Promise((resolve, reject) => {
            this.collection.findOneAndUpdate(
                { user_uuid: user_uuid },
                { $pull: { messages: { user_uuid: message_user_uuid } } },
                { returnDocument: "after" }
            ).then((result: any) => {
                if(result.value === null) {
                    resolve(undefined);
                    return;
                }
                let timeline = this.createTimelineFromResult(result.value);
                resolve(timeline);
            });
        }); 
    }

    // Loop through all timelines and remove messages from all timelines that have the given message_uuid
    public removeMessageFromAllTimelinesByMessageUuid (message_uuid: string): Promise<Timeline | undefined> {
        return new Promise((resolve, reject) => {
            this.collection.updateMany(
                {},
                { $pull: { messages: { uuid: message_uuid } } },
                { returnDocument: "after" }
            ).then((result: any) => {
                if(result.value === null) {
                    resolve(undefined);
                    return;
                }
                let timeline = this.createTimelineFromResult(result.value);
                resolve(timeline);
            });
        });
    }  
}