import { NextRequest, NextResponse } from "next/server";

// Basic認証はローカル開発では不要のため無効化
export const config = {
    matcher: [],
};

export function middleware(req: NextRequest) {
    return NextResponse.next();
}
