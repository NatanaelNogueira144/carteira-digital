import React from 'react';
import { Container }  from './styles';

const Content: React.FC<Readonly<{ children: React.ReactNode; }>> = ({ children }) => (
    <Container>
        {children}
    </Container>
);

export default Content;