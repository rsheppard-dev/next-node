'use client';

import { cn } from '@/lib/utils';
import { ModeToggle } from './ui/mode-toggle';
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { useSessionSelectors } from '@/stores/session.store';
import { Gift } from 'lucide-react';
import Link from 'next/link';

export default function NavBar() {
	const isAuthenticated = useSessionSelectors.use.isAuthenticated();
	const logout = useSessionSelectors.use.logout();
	return (
		<header className='flex justify-between items-center mb-16'>
			<div className='flex gap-2 items-center'>
				<Gift className='stroke-primary' />
				<span className='font-bold'>Secret Gifter</span>
			</div>

			<NavigationMenu>
				<NavigationMenuList className='space-x-6 text-sm'>
					<NavigationMenuItem>
						<Link href='/' legacyBehavior passHref>
							<NavigationMenuLink className={navigationMenuTriggerStyle()}>
								Home
							</NavigationMenuLink>
						</Link>
					</NavigationMenuItem>
					<NavigationMenuItem>
						{isAuthenticated ? (
							<NavigationMenuLink
								onClick={logout}
								className={cn(navigationMenuTriggerStyle(), 'cursor-pointer')}
							>
								Logout
							</NavigationMenuLink>
						) : (
							<Link href='/login' legacyBehavior passHref>
								<NavigationMenuLink className={navigationMenuTriggerStyle()}>
									Login
								</NavigationMenuLink>
							</Link>
						)}
					</NavigationMenuItem>
					{!isAuthenticated ? (
						<NavigationMenuItem>
							<Link href='register' legacyBehavior passHref>
								<NavigationMenuLink className={navigationMenuTriggerStyle()}>
									Register
								</NavigationMenuLink>
							</Link>
						</NavigationMenuItem>
					) : null}
				</NavigationMenuList>
			</NavigationMenu>

			<div>
				<ModeToggle />
			</div>
		</header>
	);
}
