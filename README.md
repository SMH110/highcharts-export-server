# Highcharts Export Server 
Convert Highchart ChartOptions to SVG using chromium browser.


## Installation
You need to run `npm install`, then `npm run start-server` (the app requires that port 5555 is not in use by anything else).

**The app will run in secure mode by default; which mean Highchart options MUST NOT contain any functions i.e. formatters or tick positioners ...etc, You can use `npm run start-server -- --insecure` to convert charts contain functions** 


## Usage

Send JSON POST request to *http://localhost:5555/svg*  with two properties:

1. chartOptions: chartOptions array or chartOption object **as string**
2. options: (optional) Set the height and width of the browser page where the charts will be rendered `{options : {"pageWidth": 800, "pageHeight": 450}}`

### Example
```$ curl --header "Content-Type: application/json"  --request POST --data '{ "chartOptions": "[{\"chart\":{\"type\": \"column\"},\"xAxis\":{\"categories\":[\"Jan\",\"Feb\"]},\"series\":[{\"data\":[29.9,39.9]}]}]"}' http://localhost:5555/svg```

Response: 

``` 
<svg xmlns:xlink="http://www.w3.org/1999/xlink" ... 

```

 _SVG_
<dl><svg xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" class="highcharts-root" style="font-family:&quot;Lucida Grande&quot;, &quot;Lucida Sans Unicode&quot;, Arial, Helvetica, sans-serif;font-size:12px;" xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
    <desc>Created with Highcharts 8.0.0</desc>
    <defs>
        <clipPath id="highcharts-prxg2xr-7-">
            <rect x="0" y="0" width="523" height="269" fill="none"></rect>
        </clipPath>
    </defs>
    <rect fill="#ffffff" class="highcharts-background" x="0" y="0" width="600" height="400" rx="0" ry="0"></rect>
    <rect fill="none" class="highcharts-plot-background" x="67" y="53" width="523" height="269"></rect>
    <g class="highcharts-grid highcharts-xaxis-grid" data-z-index="1">
        <path fill="none" data-z-index="1" class="highcharts-grid-line" d="M 328.5 53 L 328.5 322" opacity="1"></path>
        <path fill="none" data-z-index="1" class="highcharts-grid-line" d="M 589.5 53 L 589.5 322" opacity="1"></path>
        <path fill="none" data-z-index="1" class="highcharts-grid-line" d="M 66.5 53 L 66.5 322" opacity="1"></path>
    </g>
    <g class="highcharts-grid highcharts-yaxis-grid" data-z-index="1">
        <path fill="none" stroke="#e6e6e6" stroke-width="1" data-z-index="1" class="highcharts-grid-line" d="M 67 322.5 L 590 322.5" opacity="1"></path>
        <path fill="none" stroke="#e6e6e6" stroke-width="1" data-z-index="1" class="highcharts-grid-line" d="M 67 268.5 L 590 268.5" opacity="1"></path>
        <path fill="none" stroke="#e6e6e6" stroke-width="1" data-z-index="1" class="highcharts-grid-line" d="M 67 214.5 L 590 214.5" opacity="1"></path>
        <path fill="none" stroke="#e6e6e6" stroke-width="1" data-z-index="1" class="highcharts-grid-line" d="M 67 161.5 L 590 161.5" opacity="1"></path>
        <path fill="none" stroke="#e6e6e6" stroke-width="1" data-z-index="1" class="highcharts-grid-line" d="M 67 107.5 L 590 107.5" opacity="1"></path>
        <path fill="none" stroke="#e6e6e6" stroke-width="1" data-z-index="1" class="highcharts-grid-line" d="M 67 52.5 L 590 52.5" opacity="1"></path>
    </g>
    <rect fill="none" class="highcharts-plot-border" data-z-index="1" x="67" y="53" width="523" height="269"></rect>
    <g class="highcharts-axis highcharts-xaxis" data-z-index="2">
        <path fill="none" class="highcharts-axis-line" stroke="#ccd6eb" stroke-width="1" data-z-index="7" d="M 67 322.5 L 590 322.5"></path>
    </g>
    <g class="highcharts-axis highcharts-yaxis" data-z-index="2">
        <text x="26.03125" data-z-index="7" text-anchor="middle" transform="translate(0,0) rotate(270 26.03125 187.5)" class="highcharts-axis-title" style="color:#666666;fill:#666666;" y="187.5">
            <tspan>Values</tspan>
        </text>
        <path fill="none" class="highcharts-axis-line" data-z-index="7" d="M 67 53 L 67 322"></path>
    </g>
    <g class="highcharts-series-group" data-z-index="3">
        <g data-z-index="0.1" class="highcharts-series highcharts-series-0 highcharts-column-series highcharts-color-0" transform="translate(67,53) scale(1 1)" clip-path="url(#highcharts-prxg2xr-7-)">
            <rect x="67.5" y="108.5" width="126" height="161" fill="#7cb5ec" stroke="#ffffff" stroke-width="1" opacity="1" class="highcharts-point highcharts-color-0"></rect>
            <rect x="328.5" y="54.5" width="126" height="215" fill="#7cb5ec" stroke="#ffffff" stroke-width="1" opacity="1" class="highcharts-point highcharts-color-0"></rect>
        </g>
        <g data-z-index="0.1" class="highcharts-markers highcharts-series-0 highcharts-column-series highcharts-color-0" transform="translate(67,53) scale(1 1)" clip-path="none"></g>
    </g>
    <text x="300" text-anchor="middle" class="highcharts-title" data-z-index="4" style="color:#333333;font-size:18px;fill:#333333;" y="24">
        <tspan>Chart title</tspan>
    </text>
    <text x="300" text-anchor="middle" class="highcharts-subtitle" data-z-index="4" style="color:#666666;fill:#666666;" y="52"></text>
    <text x="10" text-anchor="start" class="highcharts-caption" data-z-index="4" style="color:#666666;fill:#666666;" y="397"></text>
    <g class="highcharts-legend" data-z-index="7" transform="translate(258,356)">
        <rect fill="none" class="highcharts-legend-box" rx="0" ry="0" x="0" y="0" width="84" height="29" visibility="visible"></rect>
        <g data-z-index="1">
            <g>
                <g class="highcharts-legend-item highcharts-column-series highcharts-color-0 highcharts-series-0" data-z-index="1" transform="translate(8,3)">
                    <text x="21" style="color:#333333;cursor:pointer;font-size:12px;font-weight:bold;fill:#333333;" text-anchor="start" data-z-index="2" y="15">
                        <tspan>Series 1</tspan>
                    </text>
                    <rect x="2" y="4" width="12" height="12" fill="#7cb5ec" rx="6" ry="6" class="highcharts-point" data-z-index="3"></rect>
                </g>
            </g>
        </g>
    </g>
    <g class="highcharts-axis-labels highcharts-xaxis-labels" data-z-index="7">
        <text x="197.75" style="color:#666666;cursor:default;font-size:11px;fill:#666666;" text-anchor="middle" transform="translate(0,0)" y="341" opacity="1">Jan</text>
        <text x="459.25" style="color:#666666;cursor:default;font-size:11px;fill:#666666;" text-anchor="middle" transform="translate(0,0)" y="341" opacity="1">Feb</text>
    </g>
    <g class="highcharts-axis-labels highcharts-yaxis-labels" data-z-index="7">
        <text x="52" style="color:#666666;cursor:default;font-size:11px;fill:#666666;" text-anchor="end" transform="translate(0,0)" y="326" opacity="1">0</text>
        <text x="52" style="color:#666666;cursor:default;font-size:11px;fill:#666666;" text-anchor="end" transform="translate(0,0)" y="272" opacity="1">10</text>
        <text x="52" style="color:#666666;cursor:default;font-size:11px;fill:#666666;" text-anchor="end" transform="translate(0,0)" y="218" opacity="1">20</text>
        <text x="52" style="color:#666666;cursor:default;font-size:11px;fill:#666666;" text-anchor="end" transform="translate(0,0)" y="165" opacity="1">30</text>
        <text x="52" style="color:#666666;cursor:default;font-size:11px;fill:#666666;" text-anchor="end" transform="translate(0,0)" y="111" opacity="1">40</text>
        <text x="52" style="color:#666666;cursor:default;font-size:11px;fill:#666666;" text-anchor="end" transform="translate(0,0)" y="57" opacity="1">50</text>
    </g>
    <text x="590" class="highcharts-credits" text-anchor="end" data-z-index="8" style="cursor:pointer;color:#999999;font-size:9px;fill:#999999;" y="395">Highcharts.com</text>
</svg></dl>