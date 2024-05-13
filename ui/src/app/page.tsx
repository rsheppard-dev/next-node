import { getSession } from '@/actions/session.actions';
import WelcomeSection from '@/components/WelcomeSection';

export default async function Home() {
	const session = await getSession();

	return <WelcomeSection session={session} />;
}
