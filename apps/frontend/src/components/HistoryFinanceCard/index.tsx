import { Link } from 'react-router-dom';
import { Container, Tag }  from './styles';

interface IHistoryFinanceCardProps {
  tagColor: string;
  title: string;
  subtitle: string;
  amount: string;
  updateLink: string;
}

export default function HistoryFinanceCard({
  tagColor,
  title,
  subtitle,
  amount,
  updateLink
}: IHistoryFinanceCardProps) {
  return (
    <Link to={updateLink} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Container>
        <Tag color={tagColor} />
        <div>
          <span>{title}</span>
          <small>{subtitle}</small>
        </div>
        <h3>{amount}</h3>
      </Container>
    </Link>
  );
}