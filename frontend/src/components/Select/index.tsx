import { Container } from "./styles";
import { SelectHTMLAttributes } from "react"

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {}

export default function Select(props: SelectProps) {
    return (
        <Container {...props}>
            {props.children}
        </Container>
    );
}