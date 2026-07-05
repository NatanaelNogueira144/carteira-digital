import { Container }  from './styles';

interface IMessageBoxProps {
  title: string;
  description: string;
  footerText: string;
  icon: string;
}

export default function MessageBox({
  title,
  description,
  footerText,
  icon
}: IMessageBoxProps) {
	return (
		<Container>
			<header>
				<h1>
					{title}
					<img src={icon} alt={title}/> 
				</h1>
				<p>{description}</p>
			</header>

			<footer>
				<span>{footerText}</span>
			</footer>
		</Container>
	);
}