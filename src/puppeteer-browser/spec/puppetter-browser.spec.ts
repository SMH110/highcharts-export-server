import PuppeteerBrowser from "../puppeteer-browser";
describe("PuppeteerBrowser ", () => {
  let chart: any = beforeEach(() => {
    chart = {
      chart: {},
      title: {
        text: "Hello World"
      },

      yAxis: {
        labels: {
          formatter: function() {
            return `${this.value}__prefix__`;
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
  });

  it("Should be able to get charts svg as expected", async done => {
    let browser = new PuppeteerBrowser({debug: false});
    let svgs = await browser.getSVG([chart], {
      JsScriptsPaths: [
        "./node_modules/highcharts/highcharts.js",
        "./node_modules/highcharts/modules/exporting.js"
      ]
    });
    expect(svgs.length).toBe(1);
    expect(svgs[0].includes("Hello World")).toBe(true, "Chart title in the svg");
    expect(svgs[0].match(/__prefix__/g).length).toBeGreaterThan(4, "Label formatter function ran");

    done();
  });
  
});
