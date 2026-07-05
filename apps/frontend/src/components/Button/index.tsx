import { ButtonHTMLAttributes } from 'react';
import { Container }  from './styles'

type IButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ children, ...rest }: IButtonProps) {
  return (
    <Container {...rest}>
        {children}
    </Container>
  );
}