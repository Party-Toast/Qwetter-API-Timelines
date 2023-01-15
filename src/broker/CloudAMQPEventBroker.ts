import client from 'amqplib';
import { MessageForMultipleTimelinesRequest, MultipleMessagesforTimelineRequest, UserUnfollowConsequenceRequest } from '../models/Timeline';
import { User } from '../models/User';

export default class CloudAMQPEventBroker {
    private connection: any;
    private channels: any = {};
    private databaseConnection;

    constructor(databaseConnection: any) {
        this.databaseConnection = databaseConnection;
    }

    private getChannel = async (exchangeName: string) => {
        if(!this.channels[exchangeName]) {
            this.channels[exchangeName] = await this.connection.createChannel();
            this.channels[exchangeName].assertExchange(exchangeName, 'topic', {durable: false});
        }
        return this.channels[exchangeName];
    }

    public connect = async () => {
        this.connection = await client.connect(process.env.CLOUDAMQP_URL as string);
        
        this.listenToUsersExchanges();
        this.listenToMessagesExchanges();
    }

    private listenToUsersExchanges = async () => {
        const exchange = 'users';
        const channel = await this.getChannel(exchange);

        await channel.assertQueue('timelines_user-created');
        await channel.bindQueue('timelines_user-created', exchange, 'user.created');
        await channel.consume('timelines_user-created', (msg: any) => {
            if(msg.content) {
                const user: User = JSON.parse(msg.content);
                this.databaseConnection.createTimeLine(user.uuid);
            }
        }, {noAck: true});

        await channel.assertQueue('timelines_user-unfollowed');
        await channel.bindQueue('timelines_user-unfollowed', exchange, 'user.unfollowed');
        await channel.consume('timelines_user-unfollowed', (msg: any) => {
            if(msg.content) {
                const userUnfollowConsequenceRequest: UserUnfollowConsequenceRequest = JSON.parse(msg.content);
                this.databaseConnection.removeMessagesFromTimelineByMessageUserUuid(userUnfollowConsequenceRequest);
            }
        }, {noAck: true});



        await channel.assertQueue('timelines_message-created');
        await channel.bindQueue('timelines_message-created', exchange, 'message.created');
        await channel.consume('timelines_message-created', (msg: any) => {
            if(msg.content) {
                const messageAndUsers: MessageForMultipleTimelinesRequest = JSON.parse(msg.content);
                this.databaseConnection.addMessageToMultipleTimelines(messageAndUsers);
            }
        }, {noAck: true});
    }

    private listenToMessagesExchanges = async () => {
        const exchange = 'messages';
        const channel = await this.getChannel(exchange);

        await channel.assertQueue('timelines_user-followed');
        await channel.bindQueue('timelines_user-followed', exchange, 'user.followed');
        await channel.consume('timelines_user-followed', (msg: any) => {
            if(msg.content) {
                const userUuidAndMessages: MultipleMessagesforTimelineRequest = JSON.parse(msg.content);
                if(userUuidAndMessages.messages) {
                    this.databaseConnection.addMultipleMessagesToTimeline(userUuidAndMessages);
                }
            }
        }, {noAck: true});
    }

}