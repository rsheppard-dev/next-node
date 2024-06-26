import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import NavBar from '@/components/NavBar';
import Providers from '@/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Secret Gifter',
	description: 'The all year round secret santa app',
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className={inter.className}>
				<Providers>
					<main className='max-w-screen-lg mx-auto px-4 lg:px-0 py-4'>
						<NavBar />
						{children}
					</main>
				</Providers>
			</body>
		</html>
	);
}
