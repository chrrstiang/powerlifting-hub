import { BadRequestException, HttpException } from "@nestjs/common";
import { ValidationError } from "class-validator";

const validationExceptionFactory = (errors: ValidationError[]) => {
  const firstError = errors[0];
  const property = firstError.property;
  const constraints = firstError.constraints || {};
  
  const constraintKey = Object.keys(constraints)[0];
  if (!constraintKey) {
    return new BadRequestException(`Validation failed for ${property}`);
  }
  
  const constraintMessage = constraints[constraintKey];
  const errorKey = `${property}.${constraintKey}`;
}