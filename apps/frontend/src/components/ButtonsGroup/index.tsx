import { Container } from "./styles";

export default function ButtonsGroup({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <Container>
            {children}
        </Container>
    );
}