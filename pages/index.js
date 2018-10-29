// import React from 'react';
import Head from 'next/head';
import Header from '../components/Header';

const Index = () => (
  <div style={{ padding: '10px 45px' }}>
    <Head>
      <title>Index Page</title>
      <meta name="description" content="This is the description of the Index Page" />
    </Head>
    <Header />
    <p>Content of the Index Page</p>
  </div>
);

export default Index;
