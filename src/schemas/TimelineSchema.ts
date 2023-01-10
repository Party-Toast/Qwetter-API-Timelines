const schema = {
    "type": "object",
    "properties": {
        "user_uuid": {
            "type": "string"
        },
        "messages": {
            "type": "array",
            "items": {
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
        }
    },
    "required": [
        "messages",
        "user_uuid"
    ]
} as const;
export default schema;