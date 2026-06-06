import { InputHTMLAttributes } from 'react';
import { Container }  from './styles'

type IInputProps = InputHTMLAttributes<HTMLInputElement>;

export default function Input({ ...rest }: IInputProps) {
    return <Container {...rest} />;
}