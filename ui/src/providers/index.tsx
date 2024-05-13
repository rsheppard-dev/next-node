import TanstackProvider from './tanstack.provider';
import ThemeProvider from './theme.provider';

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<TanstackProvider>
			<ThemeProvider>{children}</ThemeProvider>
		</TanstackProvider>
	);
}
