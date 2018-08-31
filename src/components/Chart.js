import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import more from 'highcharts/highcharts-more';
// import annotations from 'highcharts/modules/annotations';

const highchartsDefaults = {
    colors: [
        '#900',
        'rgb(43, 43, 43)',
        'rgb(0, 166, 212)',
        '#d00',
        '#FA0',
        '#006800',
        '#97D3EB',
    ],

    chart: {
        backgroundColor: 'transparent',

        style: {
            width: '100%',
        },
    },

    xAxis: {
        lineColor: '#ddd',
        gridLineWidth: 0,
        minorGridLineWidth: 0,
        tickWidth: 0,
        labels: {
            style: {
                fontWeight: '600',
            },
        },

        dateTimeLabelFormats: {
            millisecond: '%H:%M:%S.%L',
            second: '%H:%M:%S',
            minute: '%H:%M',
            hour: '%H:%M',
            day: '%e. %b',
            week: '%e. %b',
            month: '%b %Y',
            year: '%Y',
        },
    },

    yAxis: {
        min: 0,
        tickPosition: 'inside',
        gridLineWidth: 1,
        gridLineColor: 'rgba(221, 221, 221, 0.6)',
        title: {
            enabled: false,
        },
        labels: {
            style: {
                fontWeight: 'normal',
                color: '#999',
            },
        },
    },

    title: {
        style: {
            color: '#111',
            font:
                'bold 16px "Roboto", Helvetica Neue", "Helvetica", Arial, sans-serif',
        },
    },

    subtitle: {
        style: {
            color: '#666',
            font:
                'light 12px "Roboto", "Helvetica Neue", "Helvetica", Arial, sans-serif',
        },
    },

    legend: {
        itemStyle: {
            font: '9pt "Roboto", "Helvetica Neue", "Helvetica", Arial, sans-serif',
            color: '#111',
        },

        itemHoverStyle: {
            color: 'gray',
        },
    },

    plotOptions: {
        area: {
            marker: {
                enabled: false,
            },
        },
    },

    credits: {
        enabled: false,
    },
};

let loaded = false;

export default class Chart extends React.PureComponent {
    render() {
        // this is silly
        if (!loaded) {
            // more(Highcharts);
            // annotations(Highcharts);
            // Highcharts.setOptions(highchartsDefaults);
            loaded = true;
        }

        return (
            <HighchartsReact
                key={'chart' + this.props.chartKey}
                options={this.props.options || {}}
                highcharts={Highcharts}
            />
        );
    }
}
