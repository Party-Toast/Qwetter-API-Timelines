import Ajv from 'ajv';
import { SomeJSONSchema } from 'ajv/dist/types/json-schema';
import { Request, Response } from 'express';

class SchemaValidator {
    public ajv: Ajv;

    constructor() {
      this.ajv = new Ajv();
    }
    
    public validateBody(schema: SomeJSONSchema) {
        // Compile schema
        const validate = this.ajv.compile(schema);
        // Middleware that returns error if schema does not match
        return (request: Request, response: Response, next: any) => {
          if (!validate(request.body)) return response.status(400).json(validate.errors);
          return next();
        };
    }
}

export default SchemaValidator;