import React, { useState } from 'react';
import Head from 'next/head';

import { Button } from 'react-bootstrap';

/* import swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const Swal = withReactContent(swal); */

class Main extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      
    }
  }
  
  render() {
    return (
      <>
        <h2>Test</h2>
      </>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <Head>
          <meta charSet="utf-8"/>
          <title>Title</title>
          <meta name="description" content=""/>
        </Head>
        <Main
          
        />
      </>
    )
  }
}

App.getInitialProps = async ({pathname, query, asPath, req, res, err}) => {
  return { teamName: query.teamName, teamId: query.teamId };
};  // https://stackoverflow.com/a/57977450/4468834

export default App;