import { NextResponse } from "next/server"

/**
 * Handles API responses by returning a `NextResponse` object with an appropriate status code.
 * This function is designed to return a successful response with a specified status code,
 * or handle error responses if necessary. The status code for successful responses defaults to 200.
 *
 * @param response - The response data to include in the response body.
 * @param successStatusCode - The HTTP status code to use for successful responses. Defaults to 200.
 * @returns A `NextResponse` object containing the response data and status code.
 */
export function NextResponseHandler<any>(
  response: any,
  successStatusCode: number = 200 // Default to 200 if not specified
): any {
  // Ensure the status code and response are correctly typed
  return new NextResponse(JSON.stringify(response), { status: successStatusCode });
}