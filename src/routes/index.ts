import { Router, Request, Response } from 'express';
import TimelineController from '../controllers/TimelineController';
import { JSONSchemaType } from 'ajv';
import SchemaValidator from '../utils/SchemaValidator';
import { MessageForMultipleTimelinesRequest, UserUnfollowConsequenceRequest } from '../models/Timeline';
import MessageForMultipleTimelinesRequestSchema from '../schemas/MessageForMultipleTimelinesRequestSchema';

const AUTH_IS_DISABLED = true;

const PATH = "/timelines"
const router = Router();
const timelineController = new TimelineController();

const validator = new SchemaValidator();

router.post(`${PATH}/:user_uuid`, async (request: Request, response: Response) => {
    const user_uuid = request.params.user_uuid;
    timelineController.createTimeline(user_uuid).then(timeline => {
        if(timeline === undefined) {
            response.status(404).send(`Timeline with user uuid ${user_uuid} already exists.`);
        }
        response.send(timeline);
    });
});

router.get(PATH, async(request: Request, response: Response) => {
    timelineController.getAllTimelines().then(timelines => {
        response.send(timelines);
    });
});

router.get(`${PATH}/:user_uuid`, async(request: Request, response: Response) => {
    const user_uuid: string = request.params.user_uuid;
    timelineController.getTimelineByUserId(user_uuid).then(timeline => {
        if(timeline === undefined) {
            response.status(404).send(`No timeline with uuid ${user_uuid} was found.`);
        }
        response.send(timeline);
    });
});

router.put(`${PATH}/:user_uuid`, async (request: Request, response: Response) => {
    // TODO: Check if request user uuid matches user_uuid
    const user_uuid = request.params.user_uuid;
    const message = request.body;
    timelineController.addMessageToTimeline(user_uuid, message).then(timeline => {
        if(timeline === undefined) {
            response.status(404).send(`No timeline with user uuid ${user_uuid} was found.`);
        }
        response.send(timeline);
    });
});

router.put(`${PATH}/:user_uuid/bulk`, async (request: Request, response: Response) => {
    // TODO: Check if request user uuid matches user_uuid
    const user_uuid = request.params.user_uuid;
    const messages = request.body;
    timelineController.addMultipleMessagesToTimeline(user_uuid, messages).then(timeline => {
        if(timeline === undefined) {
            response.status(404).send(`No timeline with user uuid ${user_uuid} was found.`);
        }
        response.send(timeline);
    });
});

// TODO: Validate body
router.put(PATH, async (request: Request, response: Response) => {
    const message_and_user_uuids: MessageForMultipleTimelinesRequest = request.body;
    timelineController.addMessageToMultipleTimelines(message_and_user_uuids).then(timelines => {
        response.send(timelines);
    });
});

// TODO: Validate body
// TODO: conflicts with other PUT operation, refactor uri and interface
router.put(`${PATH}/unfollow`, async (request: Request, response: Response) => {
    const userUnfollowConsequenceRequest: UserUnfollowConsequenceRequest = request.body;
    timelineController.removeMessagesFromTimelineByMessageUserUuid(userUnfollowConsequenceRequest).then(timeline => {
        if(timeline === undefined) {
            response.status(404).send(`No timeline with user uuid ${userUnfollowConsequenceRequest.follower_uuid} was found.`);
        }
        response.send(timeline);
    });
});

router.put(`${PATH}/remove/:message_uuid`, async (request: Request, response: Response) => {
    const message_uuid = request.params.message_uuid;
    timelineController.removeMessageFromAllTimelinesByMessageUuid(message_uuid).then(timeline => {
        if(timeline === undefined) {
            response.status(404).send(`No timeline with message uuid ${message_uuid} was found.`);
        }
        response.send(timeline);
    }); 
});

export default router;