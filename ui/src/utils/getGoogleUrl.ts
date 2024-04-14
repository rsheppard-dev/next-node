import { env } from '../../config/env';

const scopes = [
	'https://www.googleapis.com/auth/userinfo.email',
	'https://www.googleapis.com/auth/userinfo.profile',
];

export default function getGoogleOAuthUrl() {
	const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
	url.searchParams.append('client_id', env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID);
	url.searchParams.append(
		'redirect_uri',
		env.NEXT_PUBLIC_GOOGLE_OAUTH_REDIRECT_URI
	);
	url.searchParams.append('access_type', 'offline');
	url.searchParams.append('response_type', 'code');
	url.searchParams.append('prompt', 'consent');
	url.searchParams.append('scope', scopes.join(' '));
	return url.toString();
}
