import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import { AlertCircle } from 'lucide-react';

type Props = {
	variant?: 'default' | 'destructive';
	title: string;
	description: string;
};
export default function StatusMessage({
	variant = 'default',
	title,
	description,
}: Props) {
	return (
		<Alert variant={variant} className='mb-10'>
			<AlertCircle className='h-4 w-4' />
			<AlertTitle>{title}</AlertTitle>
			<AlertDescription>{description}</AlertDescription>
		</Alert>
	);
}
