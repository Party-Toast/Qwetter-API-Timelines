const schema = {
    "type": "object",
    "properties": {
        "user_uuids": {
            "type": "array",
            "items": {
                "type": "string"
            }
        },
        "message": {
            "type": "object",
            "properties": {
                "uuid": {
                    "type": "string"
                },
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
                },
                "liked_user_uuids": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                }
            },
            "required": [
                "avatar",
                "content",
                "firstName",
                "lastName",
                "liked_user_uuids",
                "timestamp",
                "user_uuid",
                "username",
                "uuid"
            ]
        }
    },
    "required": [
        "message",
        "user_uuids"
    ]
} as const;
export default schema;