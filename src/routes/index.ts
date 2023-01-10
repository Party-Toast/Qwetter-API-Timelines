import { Router, Request, Response } from 'express';
import MessageController from '../controllers/MessageController';
import { JSONSchemaType } from 'ajv';
import SchemaValidator from '../utils/SchemaValidator';
import { MessageCreationRequest, MessageLikeRequest, MessageUndoLikeRequest } from '../models/Message';
import MessageCreationRequestSchema from '../schemas/MessageCreationRequestSchema';
import MessageLikeRequestSchema from '../schemas/MessageLikeRequestSchema';
import MessageUndoLikeRequestSchema from '../schemas/MessageUndoLikeRequestSchema';

const AUTH_IS_DISABLED = true;

const PATH = "/messages"
const router = Router();
const messageController = new MessageController();

const validator = new SchemaValidator();
const messageCreationRequestSchema: JSONSchemaType<MessageCreationRequest> = MessageCreationRequestSchema;
const messageLikeRequestSchema: JSONSchemaType<MessageLikeRequest> = MessageLikeRequestSchema;
const messageUndoLikeRequestSchema: JSONSchemaType<MessageUndoLikeRequest> = MessageUndoLikeRequestSchema;

router.get(PATH, async(request: Request, response: Response) => {
    messageController.getAllMessages().then(messages => {
        response.send(messages);
    });
})

router.get(`${PATH}/:uuid`, async(request: Request, response: Response) => { 
    const uuid: string = request.params.uuid;
    messageController.getMessageById(uuid).then(message => {
        if(message === undefined) {
            response.status(404).send(`No message with uuid ${uuid} was found.`);
        }
        response.send(message);    
    });
});

router.get(`${PATH}/user/:user_uuid`, async(request: Request, response: Response) => {
    const user_uuid: string = request.params.user_uuid;
    
    interface Query {
        page: string;
        per_page: string;
    }
    const query = request.query as unknown as Query;
    const page = isNaN(parseInt(query.page)) ? undefined : parseInt(query.page);
    const per_page = isNaN(parseInt(query.per_page)) ? undefined : parseInt(query.per_page);
    
    messageController.getMessagesByUserId(user_uuid, page, per_page).then(messages => {
        response.send(messages);
    })
});

router.post(PATH, validator.validateBody(messageCreationRequestSchema), async(request: Request, response: Response) => {
    const messageCreationRequest: MessageCreationRequest = request.body;
    // Only the user with the uuid in the request body can create a message for that user
    if(messageCreationRequest.user_uuid !== response.locals.user_uuid && !AUTH_IS_DISABLED ) {
        response.status(401).send("Unauthorized");
        return;
    }
    messageController.createMessage(messageCreationRequest).then(message => {
        response.status(201).send(message);
    })
});

router.post(`${PATH}/like/:uuid`, validator.validateBody(messageLikeRequestSchema), async(request: Request, response: Response) => {
    const uuid: string = request.params.uuid;
    const messageLikeRequest: MessageLikeRequest = request.body;
    // Only the user with the uuid in the request body can like a message for that user
    if(messageLikeRequest.user_uuid !== response.locals.user_uuid && !AUTH_IS_DISABLED) {
        response.status(401).send("Unauthorized");
        return;
    }
    messageController.likeMessage(uuid, messageLikeRequest).then((message) => {
        if(message === undefined) {
            response.status(404).send(`No message with uuid ${uuid} was found.`);
        }
        response.send(message);
    })
})

router.post(`${PATH}/undo_like/:uuid`, validator.validateBody(messageUndoLikeRequestSchema), async(request: Request, response: Response) => {
    const uuid: string = request.params.uuid;
    const messageUndoLikeRequest: MessageUndoLikeRequest = request.body;
    // Only the user with the uuid in the request body can undo a like for that user
    if(messageUndoLikeRequest.user_uuid !== response.locals.user_uuid && !AUTH_IS_DISABLED) {
        response.status(401).send("Unauthorized");
        return;
    }
    messageController.undoLikeMessage(uuid, messageUndoLikeRequest).then((message) => {
        if(message === undefined) {
            response.status(404).send(`No message with uuid ${uuid} was found.`);
        }
        response.send(message);
    })
})

// TODO: Check if message was created by user with user uuid by cross checking with the user uuid in the request body
router.delete(`${PATH}/:uuid`, async(request: Request, response: Response) => {
    const uuid: string = request.params.uuid;
    messageController.deleteMessage(uuid).then(message => {
        if(message === undefined) {
            response.status(204);
        }
        response.send(message);
    })
})


export default router;