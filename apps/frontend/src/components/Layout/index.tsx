import Aside from '../Aside';
import Content from '../Content';
import MainHeader from '../MainHeader';
import React from 'react';
import { Grid } from './styles';

export default function Layout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <Grid>
      <MainHeader />
      <Aside />
      <Content>
        {children}
      </Content>
    </Grid>
  );
}