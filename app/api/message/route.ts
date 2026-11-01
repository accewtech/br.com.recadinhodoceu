import { POST as handleV1Message } from "../v1/message/route";

export const runtime = "nodejs";

export async function POST(request: Request) {
  return handleV1Message(request);
}
