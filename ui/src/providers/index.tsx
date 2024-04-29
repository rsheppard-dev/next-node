import AuthProvider from './auth.provider';
import TanstackProvider from './tanstack.provider';
import ThemeProvider from './theme.provider';

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<TanstackProvider>
			<ThemeProvider>
				<AuthProvider>{children}</AuthProvider>
			</ThemeProvider>
		</TanstackProvider>
	);
}
