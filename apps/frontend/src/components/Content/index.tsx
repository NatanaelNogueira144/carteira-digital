import React from 'react';
import { Container }  from './styles';

export default function Content({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <Container>
            {children}
        </Container>
    );
}