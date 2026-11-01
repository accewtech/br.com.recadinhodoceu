import { POST as handleMessage } from "../../message/route";

export const runtime = "nodejs";

export async function POST(request: Request) {
  return handleMessage(request);
}
