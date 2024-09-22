import { NextResponse } from "next/server"

/* Handles API responses by returning a `NextResponse` object with an appropriate status code.
 * This function is designed to return a relevant HTTP status response with a specified status code,
 * The status code for successful responses defaults to 200. */
export function NextResponseHandler(
  response: any,
  httpStatusCode: number = 200 // Default to 200 if not specified
): NextResponse {
  // Ensure the status code and response are correctly typed
  return new NextResponse(JSON.stringify(response), { status: httpStatusCode });
}