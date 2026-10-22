
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextRequest, NextResponse } from 'next/server';
import { limit } from '../../../lib/rate-limit';

export async function POST(request: NextRequest): Promise<NextResponse> {
    const throttled = limit(request, 'upload', 15, 60 * 60_000);
    if (throttled) return throttled;
    const body = (await request.json()) as HandleUploadBody;

    try {
        const jsonResponse = await handleUpload({
            body,
            request,
            onBeforeGenerateToken: async () => {
                // Do not issue upload tokens for active content such as SVG/HTML.
                return {
                    allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp'],
                    tokenPayload: JSON.stringify({
                        // optional payload
                    }),
                };
            },
            onUploadCompleted: async ({ blob, tokenPayload: _tokenPayload }) => {
                if (!_tokenPayload) {
                    // Token generation successful
                    console.log('blob uploaded', blob.url);
                }
            },
        });

        return NextResponse.json(jsonResponse);
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 400 },
        );
    }
}
