import PuppeteerBrowser from "./src/puppeteer-browser/puppeteer-browser";
import * as Highcharts from 'highcharts'
let chart : any= {
    chart : {},
  title: {
    text: "Combination chart"
  },
  xAxis: {
    categories: ["Apples", "Oranges", "Pears", "Bananas", "Plums"]
  },
  labels: {
    items: [
      {
        html: "Total fruit consumption",
        style: {
          left: "50px",
          top: "18px",
         
        }
      }
    ]
  },
  series: [
    {
      type: "column",
      name: "Jane",
      data: [3, 2, 1, 3, 4]
    },
    {
      type: "column",
      name: "John",
      data: [2, 3, 5, 7, 6]
    },
    {
      type: "column",
      name: "Joe",
      data: [4, 3, 3, 9, 0]
    },
    {
      type: "spline",
      name: "Average",
      data: [3, 2.67, 3, 6.33, 3.33],
      marker: {
        lineWidth: 2,
    
        fillColor: "white"
      }
    },
    {
      type: "pie",
      name: "Total consumption",
      data: [
        {
          name: "Jane",
          y: 13,
       
        },
        {
          name: "John",
          y: 23,
         
        },
        {
          name: "Joe",
          y: 19,
         
        }
      ],
      center: [100, 80],
      size: 100,
      showInLegend: false,
      dataLabels: {
        enabled: false
      }
    }
  ]
};


let chart2 = {
  chart: {},
  title: {
      text: 'Click categories to search'
  },

  xAxis: {
      categories: ['Foo', 'Bar', 'Foobar'],

      labels: {
          formatter: function () {
            let  categoryLinks  = {
              Foo: 'http://www.bing.com/search?q=foo',
              Bar: 'http://www.bing.com/search?q=foo+bar',
              Foobar: 'http://www.bing.com/serach?q=foobar'
          }
              return '<a href="' + categoryLinks[this.value] + '">' +
                  this.value + '</a>';
          }
      }
  },

  series: [{
      data: [29.9, 71.5, 106.4]
  }]
}

let chart3 = {
  chart : {},
  title: {
      text: 'Demo of reusing but modifying default X axis label formatter'
  },

  subtitle: {
      text: 'X axis labels should have thousands separators'
  },

  xAxis: {
      labels: {
          formatter: function () {
              var label = this.axis.defaultLabelFormatter.call(this);

              // Use thousands separator for four-digit numbers too
              if (/^[0-9]{4}$/.test(label)) {
                  return Highcharts.numberFormat(this.value, 0);
              }
              return label;
          }
      }
  },

  series: [{
      data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
      pointStart: 9000,
      type: 'column'
  }]

}


// async function  main (){
//   console.time('start')
  
//   let charts = [chart, chart2,chart3,chart,chart,chart,chart,chart,chart,chart,chart,chart,chart,chart,chart,chart,chart,chart,chart,chart,chart,chart,chart2,chart2,chart2,chart2,chart2];

//   let pages = [];

//   for (let i=0; i < charts.length; i = i + 20){
//     pages.push(charts.slice(i, i + 20 ));
//   }
  

//   let p = pages.map(page =>  {
//     let b = new PuppeteerBrowser();
   
//     return  b.getSVG(page,{JsScriptsPaths: [ './node_modules/highcharts/highcharts.js', './node_modules/highcharts/modules/exporting.js']} )
//   })
//  let x = await  Promise.all(p)
//  console.timeEnd('start')
// //  console.log('x',x);
 
  
// }

// main()

import {fork} from 'child_process';


let child = fork("./src/spec/helpers/convert-worker.ts", []);
child.send('message one');

child.on('message', (m)=>{
  console.log('messsssage from baby child' , m)
})

// setTimeout(() => {
//   child.disconnect()
// }, 1500);