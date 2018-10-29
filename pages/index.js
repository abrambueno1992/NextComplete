// import React from 'react';
import Head from 'next/head';
import Button from '@material-ui/core/Button';
import withLayout from '../lib/withLayout';

const Index = () => (
  <div style={{ padding: '10px 45px' }}>
    <Head>
      <title>Index Page</title>
      <meta name="description" content="This is the description of the Index Page" />
    </Head>
    <p>Content of the Index Page</p>
    <Button variant="contained">MUI button</Button>
  </div>
);

export default withLayout(Index);
