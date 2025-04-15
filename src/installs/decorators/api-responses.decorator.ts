import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiOkResponse } from '@nestjs/swagger';

/**
 * Standard API responses for analytics endpoints
 * @param description Custom success response description
 */
export function ApiAnalyticsResponses(description: string) {
  return applyDecorators(
    ApiOkResponse({
      description,
    }),
    ApiBadRequestResponse({
      description: 'Bad Request: Missing or invalid request parameters.',
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal Server Error. An unexpected error occurred.',
    }),
  );
}
