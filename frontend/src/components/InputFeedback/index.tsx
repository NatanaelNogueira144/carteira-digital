import { Container } from "./styles";

interface IInputFeedbackProps {
    message: string
}

export default function InputFeedback({ message }: IInputFeedbackProps) {
    return <Container>{message}</Container>;
}