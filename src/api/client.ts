/**
 * client.ts — Demo stub. Only ApiError is needed; all network logic is
 * replaced by mockService.ts for the frontend-only demo.
 */

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}
