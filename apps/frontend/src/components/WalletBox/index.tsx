import CountUp from 'react-countup';
import arrowDownImg from '../../assets/arrow-down.svg';
import arrowUpImg from '../../assets/arrow-up.svg';
import dolarImg from '../../assets/dolar.svg';
import { Container }  from './styles';
import { useMemo } from 'react';

interface IWalletBoxProps {
  title: string;
  amount: number;
  footerlabel: string;
  icon: 'dolar' | 'arrowUp' | 'arrowDown';
  color: string;
}

export default function WalletBox({
  title,
  amount,
  footerlabel,
  icon,
  color
}: IWalletBoxProps) {
  const iconSelected = useMemo(() => {
    switch (icon) {
      case 'dolar':
        return dolarImg;
      case 'arrowUp': 
        return arrowUpImg;
      case 'arrowDown':
        return arrowDownImg;
      default:
        return undefined;
    }
  }, [icon]);

  return (
    <Container color={color}>
      <span>{title}</span>
      <h1>
        <strong>R$ </strong>
        <CountUp 
          end={amount}
          separator="."
          decimal=","
          decimals={2}
        />
      </h1>
      <small>{footerlabel}</small>
      <img src={iconSelected} alt={title} />
    </Container>
  );
}