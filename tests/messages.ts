import MessageController from '../src/controllers/MessageController'; 
import MessageService from '../src/services/MessageService';
import { expect } from 'chai';
import Ajv, { JSONSchemaType } from 'ajv';
import { Message, MessageCreationRequest, MessageLikeRequest, MessageUndoLikeRequest } from '../src/models/Message';
import MessageSchema from '../src/schemas/MessageSchema';

describe('MessageController', () => { 
    var messageController: MessageController;

    // Setup for type validation
    const ajv = new Ajv();
    const messageSchema: JSONSchemaType<Message> = MessageSchema;
    const isValidMessage = ajv.compile(messageSchema);

    beforeEach(() => {
        messageController = new MessageController();
    });

    describe('GET /messages', () => {
        it('Should get all messages', async () => {
            const messages = await messageController.getAllMessages();
            
            expect(messages).to.be.a('array');
            if(messages.length > 0) {
                expect(isValidMessage(messages[0])).to.be.true;
            }
        });
    }); 

    describe('GET /messages/:uuid', () => {
        it('Should get message by UUID', async () => {
            const firstMessageUUID = (await messageController.getAllMessages())[0].uuid;
            const message = await messageController.getMessageById(firstMessageUUID);
            
            expect(isValidMessage(message)).to.be.true;
            expect(message?.uuid).to.equal(firstMessageUUID);
        });
        it('Should return undefined if message with UUID does not exist', async () => {
            const message = await messageController.getMessageById('invalid-uuid');
            
            expect(message).to.be.undefined;
        });
    });

    describe('GET /messages/user/:uuid', () => {
        it('Should get all messages by user with UUID', async () => {
            const firstUserUUID = (await messageController.getAllMessages())[0].user_uuid;
            const messages = await messageController.getMessagesByUserId(firstUserUUID);

            expect(messages).to.be.a('array');
            if(messages && messages.length > 0) {
                expect(isValidMessage(messages[0])).to.be.true;
                expect(messages[0].user_uuid).to.equal(firstUserUUID);
            }
        });
        it('Should return undefined if user with UUID does not exist', async () => {
            const messages = await messageController.getMessagesByUserId('invalid-uuid');

            expect(messages).to.be.undefined;
        });
    });

    describe('POST /messages', () => {
        it('Should create a new message', async () => {
            const messageCreationRequest: MessageCreationRequest = {
                user_uuid: 'user-uuid',
                username: 'username',
                firstName: 'firstName',
                lastName: 'lastName',
                avatar: 'avatar',
                content: 'content',
                timestamp: 'timestamp'
            };

            const message = await messageController.createMessage(messageCreationRequest);

            expect(isValidMessage(message)).to.be.true;
            expect(message?.user_uuid).to.equal(messageCreationRequest.user_uuid);
            expect(message?.username).to.equal(messageCreationRequest.username);
            expect(message?.firstName).to.equal(messageCreationRequest.firstName);
            expect(message?.lastName).to.equal(messageCreationRequest.lastName);
            expect(message?.avatar).to.equal(messageCreationRequest.avatar);
            expect(message?.content).to.equal(messageCreationRequest.content);
            expect(message?.timestamp).to.equal(messageCreationRequest.timestamp);
        });
    });

    describe('POST /messages/like/:uuid', () => {
        it('Should like a message', async () => {
            const messageLikeRequest: MessageLikeRequest = {
                user_uuid: 'user-uuid'
            };
            const firstMessageUUID = (await messageController.getAllMessages())[0].uuid;

            const message = await messageController.likeMessage(firstMessageUUID, messageLikeRequest);

            expect(isValidMessage(message)).to.be.true;
            expect(message?.uuid).to.equal(firstMessageUUID);
            expect(message?.liked_user_uuids).to.include(messageLikeRequest.user_uuid);

        });
        it('Should return undefined if message with UUID does not exist',async () => {
            const messageLikeRequest: MessageLikeRequest = {
                user_uuid: 'user-uuid'
            };

            const message = await messageController.likeMessage('invalid-uuid', messageLikeRequest);

            expect(message).to.be.undefined;
        })
    });

    describe('POST /messages/undo_like/:uuid', () => {
        it('Should remove the like from a message', async () => {
            const messageUndoLikeRequest: MessageUndoLikeRequest = {
                user_uuid: 'user-uuid'
            };
            const firstMessageUUID = (await messageController.getAllMessages())[0].uuid;

            const message = await messageController.undoLikeMessage(firstMessageUUID, messageUndoLikeRequest);

            expect(isValidMessage(message)).to.be.true;
            expect(message?.uuid).to.equal(firstMessageUUID);
            expect(message?.liked_user_uuids).to.not.include(messageUndoLikeRequest.user_uuid);

        });
        it('Should return undefined if message with UUID does not exist',async () => {
            const messageUndoLikeRequest: MessageUndoLikeRequest = {
                user_uuid: 'user-uuid'
            };

            const message = await messageController.undoLikeMessage('invalid-uuid', messageUndoLikeRequest);

            expect(message).to.be.undefined;
        })
    });

    describe('DELETE /messages/:uuid', () => {
        it('Should delete a message', async () => {
            const firstMessageUUID = (await messageController.getAllMessages())[0].uuid;

            const message = await messageController.deleteMessage(firstMessageUUID);

            expect(isValidMessage(message)).to.be.true;
            expect(message?.uuid).to.equal(firstMessageUUID);
            
            const messages = await messageController.getAllMessages();
            expect(messages).to.not.include(message);
        }); 
        it('Should return undefined if message with UUID does not exist', async () => {
            const message = await messageController.deleteMessage('invalid-uuid');

            expect(message).to.be.undefined;
        });
    });
});