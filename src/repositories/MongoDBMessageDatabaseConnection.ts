import IDatabaseConnection from "./IMessageDatabaseConnection";
import { Message, MessageLikeRequest, MessageUndoLikeRequest, MessageCreationRequest } from "../models/Message";
import { ObjectId } from "mongodb";

// const uri = process.env.MONGODB_URI as string;
const uri = "mongodb+srv://sytsewalraven:kcMBu6P5XbjYJyx@qwettermessagescluster.rbs4v6u.mongodb.net/?retryWrites=true&w=majority";
export default class MongoDBMessageDatabaseConnection implements IDatabaseConnection {
    private client;
    private collection;

    constructor() {
        const { MongoClient, ServerApiVersion } = require('mongodb');
        this.client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
        this.collection = this.client.db("Qwetter").collection("Messages");
    }

    private createMessageFromResult = (result: any): Message => {
        let message: Message = {
            uuid: result._id,
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

    public getAllMessages = async (): Promise<Array<Message>> => {
        return new Promise((resolve, reject) => {
            this.collection.find().sort({timestamp: -1}).toArray().then((results: any) => {
                let messages: Array<Message> = [];
                results.forEach((result: any) => {
                    messages.push(this.createMessageFromResult(result));
                });
                resolve(messages); 
            })
        });
    }

    public getMessageById = async (uuid: string): Promise<Message | undefined> => {
        return new Promise((resolve, reject) => {
            this.collection.findOne({
                _id: new ObjectId(uuid)
            }).then((result: any) => {
                if(result === null) {
                    resolve(undefined);
                    return;
                }
                let message = this.createMessageFromResult(result);
                resolve(message); 
            });
        });  
    }

    public getMessagesByUserId = async (user_uuid: string, page: number, per_page: number): Promise<Array<Message> | undefined> => {
        return new Promise((resolve, reject) => {
            this.collection.find({
                user_uuid: user_uuid
            }).sort({ timestamp: -1 }).skip((page - 1) * per_page).limit(per_page).toArray().then((results: any) => {
                let messages: Array<Message> = [];
                results.forEach((message: any) => {
                    messages.push(this.createMessageFromResult(message));
                });
                resolve(messages); 
            });
        });
    }

    public createMessage = async (message: MessageCreationRequest): Promise<Message> => {
        return new Promise((resolve, reject) => {
            this.collection.insertOne(message).then((result: any) => {
                let newMessage: Message = {
                    uuid: result.insertedId,
                    user_uuid: message.user_uuid,
                    username: message.username,
                    firstName: message.firstName,
                    lastName: message.lastName,
                    avatar: message.avatar,
                    content: message.content,
                    timestamp: message.timestamp,
                    liked_user_uuids: []
                }; 
                resolve(newMessage);
            });
        });
    }

    public deleteMessage = async (uuid: string): Promise<Message | undefined> => {
        let message = await this.getMessageById(uuid);
        if(message === undefined) {
            return undefined;
        }
        return new Promise((resolve, reject) => {
            this.collection.deleteOne({
                _id: new ObjectId(uuid)
            }).then((result: any) => {
                if(result.deletedCount === 0) {
                    resolve(undefined);
                    return;
                }
                resolve(message);  
            });
        }); 
    }

    public likeMessage = async (uuid: string, user: MessageLikeRequest): Promise<Message | undefined> => {
        return new Promise((resolve, reject) => {
            this.collection.updateOne({
                _id: new ObjectId(uuid)
            }, {
                $addToSet: {
                    liked_user_uuids: user.user_uuid
                }
            }).then((result: any) => {
                this.getMessageById(uuid).then((message: Message | undefined) => {
                    if(message === undefined) {
                        resolve(undefined);
                        return;
                    }
                    resolve(message);
                });
            });
        });
    }
    public undoLikeMessage = async (uuid: string, user: MessageUndoLikeRequest): Promise<Message | undefined> => {
        return new Promise((resolve, reject) => {
            this.collection.updateOne({
                _id: new ObjectId(uuid)
            }, {
                $pull: {
                    liked_user_uuids: user.user_uuid
                }
            }).then((result: any) => {
                this.getMessageById(uuid).then((message: Message | undefined) => {
                    if(message === undefined) {
                        resolve(undefined);
                        return;
                    }
                    resolve(message);
                });
            });
        }); 
    }
}