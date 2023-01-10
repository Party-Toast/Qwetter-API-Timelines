const schema = {
    "type": "object",
    "properties": {
        "user_uuid": {
            "type": "string"
        },
        "username": {
            "type": "string"
        },
        "firstName": {
            "type": "string"
        },
        "lastName": {
            "type": "string"
        },
        "avatar": {
            "type": "string"
        },
        "content": {
            "type": "string"
        },
        "timestamp": {
            "type": "string"
        }
    },
    "required": [
        "avatar",
        "content",
        "firstName",
        "lastName",
        "timestamp",
        "user_uuid",
        "username"
    ]
} as const;
export default schema;