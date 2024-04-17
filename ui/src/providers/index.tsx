import TanstackProvider from './tanstack.provider';
import ThemeProvider from './theme.provider';
import { cookies } from 'next/headers';

export default function Providers({ children }: { children: React.ReactNode }) {
	const refreshToken = cookies().get('refreshToken')?.value;
	return (
		<TanstackProvider refreshToken={refreshToken}>
			<ThemeProvider>{children}</ThemeProvider>
		</TanstackProvider>
	);
}
