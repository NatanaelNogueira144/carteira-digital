import { Container, ToggleLabel, ToggleSelector } from './styles';

interface IToggleProps {
    labelLeft: string;
    labelRight: string;
    checked: boolean;
    onChange(): void;
}

export default function Toggle({ labelLeft, labelRight, checked, onChange }: IToggleProps) {
    return (
        <Container>
            <ToggleLabel>{labelLeft}</ToggleLabel>
            <ToggleSelector
                checked={checked}
                uncheckedIcon={false}
                checkedIcon={false}
                onChange={onChange}
            />
            <ToggleLabel>{labelRight}</ToggleLabel>
        </Container>
    );
}