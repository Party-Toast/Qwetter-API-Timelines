const schema = {
    "type": "object",
    "properties": {
        "user_uuid": {
            "type": "string"
        },
        "message_user_uuid": {
            "type": "string"
        }
    },
    "required": [
        "message_user_uuid",
        "user_uuid"
    ]
} as const;
export default schema;