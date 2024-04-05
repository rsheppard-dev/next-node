'use client';

import { ModeToggle } from './ui/mode-toggle';
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuIndicator,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	NavigationMenuViewport,
} from '@/components/ui/navigation-menu';
import { Gift } from 'lucide-react';

export default function NavBar() {
	return (
		<header className='flex justify-between items-center mb-16'>
			<div className='flex gap-2 items-center'>
				<Gift className='stroke-primary' />
				<span className='font-bold'>Secret Gifter</span>
			</div>

			<NavigationMenu>
				<NavigationMenuList className='space-x-6 text-sm'>
					<NavigationMenuItem>
						<NavigationMenuLink href='/'>Home</NavigationMenuLink>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<NavigationMenuLink href='/login'>Login</NavigationMenuLink>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<NavigationMenuLink href='/register'>Register</NavigationMenuLink>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>

			<div>
				<ModeToggle />
			</div>
		</header>
	);
}
