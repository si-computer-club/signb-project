import React, { useState, useEffect, useRef } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { TextField } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';

// import CalendarH from '../components/CalendarH';
// import mockMensesData from '../Data/mockMensesData.json';
import SummaryTable from '../components/SummaryTable'

const Main = () => {
  const [data, setData] = useState({});
  const [show, setShow] = useState(false);
  const [token, setToken] = useState('');

  // async componentWillMount() {
  //   const response = await fetch(
  //     'https://signb-project.appspot.com/visualize/otp/activate',
  //     {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ token: '3493' }),
  //     }
  //   );
  //   const apidata = await response.json();
  //   this.setState({ daTa: apidata, isExists: 1 });
  // }

  const fetchData = () => {
    console.log('fetch data');
    console.log(token);
    fetch(
      new Request('https://signb-project.appspot.com/visualize/otp/activate', {
        method: 'POST',
        body: new URLSearchParams([['token', token]]),
      })
    ).then((res) =>
      res
        .json()
        .then((data) => {
          // console.log('data');
          // console.log(data);
          // console.log(JSON.stringify(data.menses));
          // console.log(data.menses);
          setData(data);
          setShow(true);
        })
        .catch((err) => {
          console.log('Error ' + err.name);
        })
    );
    return null;
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position='relative'>
        <Toolbar>
          <LocalHospitalIcon fontSize='large' />
          <Typography variant='h4' color='inherit' noWrap>
            &nbsp;Menses Summary
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        {/* Hero unit */}
        <div>
          <Container maxWidth='xl'>
            <div></div>
            <Typography opacity='0'>.</Typography>
            <div>
              <Grid container spacing={2} justifyContent='center'>
                <TextField
                  id='outlined-basic'
                  label='TokenID'
                  variant='outlined'
                  onChange={(e) => {
                    setShow(false);
                    setToken(e.target.value);
                  }}
                  onKeyPress={(ev) => {
                    // console.log(`Pressed keyCode ${ev.key}`);
                    if (ev.key === 'Enter') {
                      ev.preventDefault();
                      fetchData();
                    }
                  }}
                  // ref={inputTextfield}
                />
                <Grid item>
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={(ev) => {
                      ev.preventDefault();
                      fetchData();
                    }}
                  >
                    ตรวจสอบข้อมูล
                  </Button>
                </Grid>
              </Grid>
            </div>
            <p></p>
            <div></div>
            <p></p>
            {show ? (
              // <CalendarH inputData={JSON.stringify(data.menses)} />
              <SummaryTable inputData={JSON.stringify(data.menses)} />
            ) : null}
            <div>.</div>
          </Container>
        </div>
      </main>
      {/* Footer */}
      <footer>
        <Typography
          variant='subtitle1'
          align='center'
          color='textSecondary'
          component='p'
        >
          COPYRIGHT © {(new Date()).getFullYear()} SI Computer. ALL RIGHTS RESERVED
        </Typography>
      </footer>
      {/* End footer */}
    </React.Fragment>
  );
};

export default Main;
