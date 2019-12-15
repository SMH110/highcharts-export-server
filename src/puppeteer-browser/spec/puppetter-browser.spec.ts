import PuppeteerBrowser from "../puppeteer-browser";
describe("PuppeteerBrowser ", () => {
  let browser: PuppeteerBrowser;
  let chart: any = {
    chart: {},
    title: {
      text: "Demo of reusing but modifying default X axis label formatter"
    },

    subtitle: {
      text: "X axis labels should have thousands separators"
    },

    xAxis: {
      labels: {
        formatter: function() {
          var label = this.axis.defaultLabelFormatter.call(this);

          if (/^[0-9]{4}$/.test(label)) {
            return Math.round(this.value * 100) / 100;
          }
          return label;
        }
      }
    },

    series: [
      {
        data: [29.9, 71.5, 106.4],

        type: "column"
      }
    ]
  };
  beforeEach(() => {
    browser = new PuppeteerBrowser();
  });
  it("Should be able to get charts svg as expected", async done => {
    let svgs = await browser.getSVG([chart], {
      JsScriptsPaths: [
        "./node_modules/highcharts/highcharts.js",
        "./node_modules/highcharts/modules/exporting.js"
      ]
    });
    expect(svgs.length).toBe(1);
    expect(svgs[0].includes("Demo of reusing but modifying default X axis label formatter")).toBe(true, 'Chart title in the svg');
    done();
  });
});
