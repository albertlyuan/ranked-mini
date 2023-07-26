import { Line  } from "react-chartjs-2"
import {Chart, LinearScale, CategoryScale, PointElement, LineElement, Tooltip} from "chart.js";
Chart.register(CategoryScale,LinearScale, PointElement, LineElement, Tooltip);

var blankChartData = {
    labels: [],
    datasets: [{ //const elos
        label: "Elo",
        data: [],
        backgroundColor: "black",
        borderColor:"black",
        borderWidth: 2
    },
    {data: []}, //const timestamps 1
    {data: []}, //for elogain 2
    {data: []}, //for teammates 3
    {data: []}, //for opponents 4
    {data: []}, //for pulled
    ]
}

function EloChart({chartData}) {    
    const options = {
        scales: {
            x: {
               ticks: {
                   display: false
              }
           },
        },
        interaction: {
            intersect: false,
            mode: 'index',
        },
        plugins:{
            tooltip: {
                // enabled: true,
                callbacks: {
                    beforeTitle: (context) => {
                        return "Game ID: " + Object.values(context)[0].label 
                    },
                    title: (context) => {
                        return "Timestamp: " + chartData.datasets[1].data[Object.values(context)[0].dataIndex]
                    },
                    label: function(context){
                        const elogain = chartData.datasets[2].data[context.dataIndex]
                        return context.formattedValue + ` (${elogain > 0 ? "+" : ""}${elogain ? elogain.toFixed(2) : "-"})`
                    },
                    labelTextColor: function(context) {
                        const elogain = chartData.datasets[2].data[context.dataIndex]
                        if (elogain > 0){
                            return '#77DD77'
                        }else if (elogain < 0){
                            return '#ff6961'
                        }
                        return 'white';
                    },
                    body: (context) => {
                        return Object.values(context)[0];
                        // context.dataset.label + ": " + 

                    },

                    beforeFooter: (context) => {
                        const team = chartData.datasets[3].data[Object.values(context)[0].dataIndex]
                        if (team){
                            return "Winning team: " + team.join(", ")
                        }

                        return "Winning team: " + null
                    },
                    footer: (context) => {
                        const team = chartData.datasets[4].data[Object.values(context)[0].dataIndex]
                        if (team){
                            return "Losing team: " + team.join(", ")
                        }
                        return "Losing team: " + null
                    },
                    afterFooter: (context) => {
                        const pulled = chartData.datasets[5].data[Object.values(context)[0].dataIndex]
                        return "Winner Pulled: " + pulled
                    },
                },
            },
        }
      }

    return (
        <Line 
            data={chartData} 
            options={options} 
        />
    );

}

export {EloChart, blankChartData}