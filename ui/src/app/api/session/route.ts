import { getSession } from '@/actions/session.actions';
import { NextResponse } from 'next/server';

export async function GET() {
	try {
		const session = await getSession();

		return NextResponse.json(session);
	} catch (error) {
		return new Response(
			JSON.stringify({ statusCode: 500, message: (error as Error).message })
		);
	}
}
