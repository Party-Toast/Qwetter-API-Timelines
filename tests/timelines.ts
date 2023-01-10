import TimelineController from '../src/controllers/TimelineController'; 
import TimelineService from '../src/services/TimelineService';
import { expect } from 'chai';
import Ajv, { JSONSchemaType } from 'ajv';
import { Message, MessageCreationRequest, MessageLikeRequest, MessageUndoLikeRequest } from '../src/models/Message';
import MessageSchema from '../src/schemas/MessageSchema';

describe('TimelineController', () => { 
    var timelineController: TimelineController;

    // Setup for type validation
    const ajv = new Ajv();
    const messageSchema: JSONSchemaType<Message> = MessageSchema;
    const isValidMessage = ajv.compile(messageSchema);

    beforeEach(() => {
        timelineController = new TimelineController();
    });

    describe('GET /timelines', () => {
        it('Should get all timelines', async () => {
            const timelines = await timelineController.getAllTimelines();
            
            expect(timelines).to.be.a('array');
            if(timelines.length > 0) {
                expect(isValidMessage(timelines[0])).to.be.true;
            }
        });
    }); 
});