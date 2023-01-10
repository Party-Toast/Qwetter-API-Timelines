const schema = {
    "type": "object",
    "properties": {
        "user_uuid": {
            "type": "string"
        }
    },
    "required": [
        "user_uuid"
    ]
} as const;
export default schema;