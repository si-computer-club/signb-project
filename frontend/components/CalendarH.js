import React, { useEffect } from 'react';

import * as moment from 'moment';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CameraIcon from '@material-ui/icons/PhotoCamera';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';

import * as d3 from 'd3';
// import mockMensesData from '../Data/mockMensesData.json';

const CalendarH = ({ inputData }) => {
  useEffect(() => {
    console.log('In useEffect');
    console.log(inputData);
    console.log(JSON.parse(inputData));
    draw(JSON.parse(inputData));
  }, []);
  return (
    <>
      <div className='viz'></div>
      {/* <style jsx>{`
        .month {
          fill: none;
          stroke: #000;
          stroke-width: 2px;
        }
        .day {
          fill: #fff;
          stroke: #ccc;
        }
        text {
          font-family: sans-serif;
          font-size: 1.5em;
        }
        .dayLabel {
          fill: #aaa;
          font-size: 0.8em;
        }
        .monthLabel {
          text-anchor: middle;
          font-size: 0.8em;
          fill: #aaa;
        }
        .yearLabel {
          fill: #aaa;
          font-size: 1.2em;
        }
        .key {
          font-size: 0.5em;
        }
      `}</style> */}
    </>
  );
};

//modified from https://bl.ocks.org/alansmithy/6fd2625d3ba2b6c9ad48

const title = '';
const units = '';
// const breaks = [0, 1, 2];
const colors = ['#FFF7F2', '#D9D9D9', '#FFFF00', '#FF6600', '#C00000'];

//general layout information
const cellSize = 17;
const xOffset = 30;
const yOffset = 60;
const calY = 25;
const calX = 10; //offset of calendar in each group
const width = 163;
const height = 960;
const parseDate = d3.timeParse('%Q');
const format = d3.timeFormat('%Q');
const toolDate = d3.timeFormat('%d %b %y');

const draw = (data) => {
  // d3.json("data.json").then(() => { //for json fetch

  let dates = new Array();
  let values = new Array();

  // console.log('inputData');
  // console.log(inputData);
  //parse the data
  // let data = JSON.parse(inputData);
  console.log('data');
  console.log(data);
  data.forEach(function (d) {
    d.date = moment(d.date).valueOf();
    dates.push(parseDate(d.date));
    values.push(d.grade);
    d.date = parseDate(d.date);
    // d.value = d.grade;
    d.year = d.date.getFullYear();
  });

  let yearlyData = d3
    .nest()
    .key(function (d) {
      return d.year;
    })
    .entries(data);

  console.log(yearlyData);

  let svg = d3
    .select('.viz')
    .append('svg')
    .attr('width', '90%')
    .attr('height', '100%')
    .attr('viewBox', '0 0 540 ' + (yOffset + height));

  //title
  svg.append('text').attr('x', xOffset).attr('y', 20).text(title);

  //create an SVG group for each year
  let cals = svg
    .selectAll('g')
    .data(yearlyData)
    .enter()
    .append('g')
    .attr('id', function (d) {
      return d.key;
    })
    .attr('transform', function (d, i) {
      return 'translate(' + (xOffset + i * (width + calX)) + ',0)';
    });

  let labels = cals
    .append('text')
    .attr('class', 'yearLabel')
    .style('font-size', '0.8em')
    .style('fill', '#000000')
    .attr('x', calX)
    .attr('y', yOffset)
    .text(function (d) {
      return d.key;
    });

  //create a daily rectangle for each year
  let rects = cals
    .append('g')
    .attr('id', 'alldays')
    .selectAll('.day')
    .data(function (d) {
      return d3.timeDays(
        new Date(parseInt(d.key), 0, 1),
        new Date(parseInt(d.key) + 1, 0, 1)
      );
    })
    .enter()
    .append('rect')
    .attr('id', function (d) {
      return '_' + format(d);
      //return toolDate(d.date)+":\n"+d.value+" dead or missing";
    })
    .attr('class', 'day')
    .style('fill', '#fff')
    .style('stroke', '#ccc')
    .attr('width', cellSize)
    .attr('height', cellSize)
    .attr('x', function (d) {
      return calX + d.getDay() * cellSize;
    })
    .attr('y', function (d) {
      return yOffset + calY + d3.timeWeek.count(d3.timeYear(d), d) * cellSize;
    })
    .datum(format);

  //create day labels
  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  let dayLabels = cals.append('g').attr('id', 'dayLabels');
  days.forEach(function (d, i) {
    dayLabels
      .append('text')
      .attr('class', 'dayLabel')
      .style('fill', '#212121')
      // .style('text-anchor', 'right')
      .style('font-size', '0.6em')
      .style('font-family', 'sans-serif')
      .attr('x', function (d) {
        return calX + i * cellSize;
      })
      .attr('dx', '0.2em')
      .attr('y', yOffset + 20)
      .text(d);
  });

  //let's draw the data on
  let dataRects = cals
    .append('g')
    .attr('id', 'dataDays')
    .selectAll('.dataday')
    .data(function (d) {
      return d.values;
    })
    .enter()
    .append('g')
    .append('rect')
    .attr('id', function (d) {
      return format(d.date) + ':' + d.grade;
    })
    .attr('stroke', '#ccc')
    .attr('width', cellSize)
    .attr('height', cellSize)
    .attr('x', function (d) {
      return calX + d.date.getDay() * cellSize;
    })
    .attr('y', function (d) {
      return (
        yOffset +
        calY +
        d3.timeWeek.count(d3.timeYear(d.date), d.date) * cellSize
      );
    })
    .attr('fill', function (d) {
      return colors[d.grade];
      // if (d.value < breaks[0]) {
      //   return colors[0];
      // }
      // for (let i = 0; i < breaks.length + 1; i++) {
      //   if (d.value >= breaks[i] && d.value < breaks[i + 1]) {
      //     return colors[i];
      //   }
      // }
      // if (d.value > breaks.length - 1) {
      //   return colors[breaks.length];
      // }
    })
    .attr('opacity', 0.5);

    //Pain score - red vertical line right side
    let dataRectsPain = cals
    .append('g')
    .attr('id', 'dataDaysPain')
    .selectAll('.dataday')
    .data(function (d) {
      return d.values;
    })
    .enter()
    .append('g')
    .append('rect')
    .attr('id', function (d) {
      return format(d.date) + ':' + d.pain;
    })
    // .attr('stroke', '#ccc')
    .attr('width', 1)
    .attr('height', function (d) {
      return d.pain * cellSize /10
    })
    .attr('x', function (d) {
      return calX + d.date.getDay() * cellSize + cellSize*0.9;
    })
    .attr('y', function (d) {
      return (
        yOffset +
        calY +
        d3.timeWeek.count(d3.timeYear(d.date), d.date) * cellSize
      );
    })
    .attr('fill', function (d) {
      // return colors[d.grade];
      return "#FF0000"

      // if (d.value < breaks[0]) {
      //   return colors[0];
      // }
      // for (let i = 0; i < breaks.length + 1; i++) {
      //   if (d.value >= breaks[i] && d.value < breaks[i + 1]) {
      //     return colors[i];
      //   }
      // }
      // if (d.value > breaks.length - 1) {
      //   return colors[breaks.length];
      // }
    })
    .attr('opacity', 0.8);

  //date number
  let dataRectsText = cals
    .selectAll('g')
    .data(function (d) {
      return d.values;
    })
    .append('text')
    .attr('id', 'dataDateNumber')
    .text(function (d) {
      return d.date.getDate();
    })
    .style('font', '8px times')
    .style('font-weight', '1000')
    .style('fill', '#000000')
    .attr('x', function (d) {
      return calX + 2 + d.date.getDay() * 17;
    })
    .attr('y', function (d) {
      return (
        yOffset +
        calY +
        15 +
        d3.timeWeek.count(d3.timeYear(d.date), d.date) * 17
      );
    });

  //drug text
  let dataRectsDrugText = cals
    .selectAll('g')
    .data(function (d) {
      return d.values;
    })
    .append('text')
    .text(function (d) {
      if (d.drug){
        return "o";
      }
    })
    .style('font', '8px times')
    .style('font-weight', '1000')
    .style('fill', '#000000')
    .attr('x', function (d) {
      return calX + 2 + d.date.getDay() * 17;
    })
    .attr('y', function (d) {
      return (
        yOffset +
        calY +
        cellSize/3 +
        d3.timeWeek.count(d3.timeYear(d.date), d.date) * 17
      );
    });

  //   //drug
  // let dataRectsDrug = cals
  //   .selectAll('g')
  //   .data(function (d) {
  //     return d.values;
  //   })
  //   .append('circle')
  //   .attr('id', function (d) {
  //     return format(d.date) + ':' + d.drug;
  //   })
  //   // .attr('stroke', '#ccc')
  //   .attr('width', cellSize/2)
  //   .attr('height', cellSize/2)
  //   .attr('x', function (d) {
  //     return calX + 2 + d.date.getDay() * 17;
  //   })
  //   .attr('y', function (d) {
  //     return (
  //       yOffset +
  //       calY +
  //       15 +
  //       d3.timeWeek.count(d3.timeYear(d.date), d.date) * 17
  //     );
  //   })
  //   .attr('fill', '#779ee6')
  //   .attr('opacity', function (d) {
  //     if (d.drug){
  //       return 0.5;
  //     }
  //     return 0;
  //   });;

    
  //append a title element to give basic mouseover info
  
  dataRects.append('title').text(function (d) {
    
    return toolDate(d.date) + ':\ngrade: ' + d.grade + '\npain: ' + d.pain + '\ndrug: ' + d.drug;
  });

  //add monthly outlines for calendar
  cals
    .append('g')
    .attr('id', 'monthOutlines')
    .selectAll('.month')
    .data(function (d) {
      return d3.timeMonths(
        new Date(parseInt(d.key), 0, 1),
        new Date(parseInt(d.key) + 1, 0, 1)
      );
    })
    .enter()
    .append('path')
    .attr('class', 'month')
    .style('fill', 'none')
    .style('stroke', '#000')
    .style('stroke-width', '1px')
    .attr('transform', 'translate(' + calX + ',' + (yOffset + calY) + ')')
    .attr('d', monthPathH);

  //retreive the bounding boxes of the outlines
  let BB = new Array();
  let mp = document.getElementById('monthOutlines').childNodes;
  for (let i = 0; i < mp.length; i++) {
    BB.push(mp[i].getBBox());
  }

  let monthY = new Array();
  BB.forEach(function (d, i) {
    let boxCentre = d.height / 2;
    monthY.push(yOffset + calY + d.y + boxCentre);
  });

  //create centred month labels around the bounding box of each month path
  //create month labels
  let months = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC',
  ];
  let monthLabels = cals.append('g').attr('id', 'monthLabels');
  months.forEach(function (d, i) {
    monthLabels
      .append('text')
      .attr('class', 'monthLabel')
      .style('text-anchor', 'end')
      .style('fill', '#212121')
      .style('font-size', '0.6em')
      .style('font-family', 'sans-serif')
      .attr('x', calX / 1.5)
      .attr('y', monthY[i])
      .text(d);
  });

  //create key
  const keyLabel = ['No','Spotting','Below average','Average','Above average']
  let key = svg
    .append('g')
    .attr('id', 'key')
    .attr('class', 'key')
    .attr('transform', function (d) {
      return (
        'translate(' + xOffset + ',' + (yOffset - cellSize * 1.5 - 10) + ')'
      );
    });

  key
    .selectAll('rect')
    .data(colors)
    .enter()
    .append('rect')
    .attr('width', cellSize)
    .attr('height', cellSize)
    .attr('x', function (d, i) {
      return i * 100;
    })
    .attr('fill', function (d) {
      return d;
    });

  key
    .selectAll('text')
    .data(colors)
    .enter()
    .append('text')
    .attr('x', function (d, i) {
      return cellSize + 5 + i * 100;
    })
    .attr('y', '1em')
    .text(function (d, i) {
      return keyLabel[i];
      // if (i < colors.length - 1) {
      //   return 'up to ' + breaks[i];
      // } else {
      //   return 'over ' + breaks[i - 1];
      // }
    })
    .style('font', '12px times');
  //   // }); //for json fetch
};
//pure Bostock - compute and return monthly path data for any year (Horizontal)
function monthPathH(t0) {
  let t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
    d0 = t0.getDay(),
    w0 = d3.timeWeek.count(d3.timeYear(t0), t0),
    d1 = t1.getDay(),
    w1 = d3.timeWeek.count(d3.timeYear(t1), t1);
  return (
    'M' +
    d0 * cellSize +
    ',' +
    (w0 + 1) * cellSize +
    'V' +
    w0 * cellSize +
    'H' +
    7 * cellSize +
    'V' +
    w1 * cellSize +
    'H' +
    (d1 + 1) * cellSize +
    'V' +
    (w1 + 1) * cellSize +
    'H' +
    0 +
    'V' +
    (w0 + 1) * cellSize +
    'Z'
  );
}
//pure Bostock - compute and return monthly path data for any year
/*
function monthPath(t0) {
  let t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
    d0 = t0.getDay(),
    w0 = d3.timeWeek.count(d3.timeYear(t0), t0),
    d1 = t1.getDay(),
    w1 = d3.timeWeek.count(d3.timeYear(t1), t1);
  return (
    'M' +
    (w0 + 1) * cellSize +
    ',' +
    d0 * cellSize +
    'H' +
    w0 * cellSize +
    'V' +
    7 * cellSize +
    'H' +
    w1 * cellSize +
    'V' +
    (d1 + 1) * cellSize +
    'H' +
    (w1 + 1) * cellSize +
    'V' +
    0 +
    'H' +
    (w0 + 1) * cellSize +
    'Z'
  );
}
*/

export default CalendarH;
