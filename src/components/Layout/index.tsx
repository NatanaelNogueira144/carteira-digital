import React from 'react';
import MainHeader from '../MainHeader';
import Aside from '../Aside';
import Content from '../Content';
import { Grid } from './styles';

const Layout: React.FC<Readonly<{ children: React.ReactNode; }>> = ({ children }) => (
    <Grid>
        <MainHeader />
        <Aside />
        <Content>
            { children }
        </Content>
    </Grid>
);

export default Layout;