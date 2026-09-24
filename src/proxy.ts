import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAiAgent } from "@/data/agentLobby";

/** send crawlers and assistants to the agent lobby; humans never notice */
export function proxy(request: NextRequest) {
  if (!isAiAgent(request.headers.get("user-agent"))) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/agents";
  const res = NextResponse.rewrite(url);
  res.headers.set("x-jd", "agent-lobby");
  return res;
}

export const config = {
  matcher: "/",
};
