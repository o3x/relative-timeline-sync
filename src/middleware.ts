import { NextRequest, NextResponse } from "next/server";

export const config = {
    matcher: ["/", "/index"],
};

export function middleware(req: NextRequest) {
    const basicAuth = req.headers.get("authorization");
    const url = req.nextUrl;

    if (basicAuth) {
        const authValue = basicAuth.split(" ")[1];
        const [user, pwd] = atob(authValue).split(":");

        const validUser = process.env.BASIC_AUTH_USER;
        const validPass = process.env.BASIC_AUTH_PASSWORD;

        // Ensure environment variables are set and match
        if (
            validUser &&
            validPass &&
            user === validUser &&
            pwd === validPass
        ) {
            return NextResponse.next();
        }
    }

    url.pathname = "/api/basicauth";

    return new NextResponse("Auth Required", {
        status: 401,
        headers: {
            "WWW-Authenticate": 'Basic realm="Secure Area"',
        },
    });
}
