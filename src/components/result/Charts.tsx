import { Box } from '@chakra-ui/react';
// import Chart from 'chart.js/auto';
import { ArcElement, Chart, Legend, Title, Tooltip } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

Chart.register(ArcElement, Legend, Tooltip, Title);

const Charts = () => {
  const data = {
    labels: ['Sound', 'Exercise'],
    datasets: [
      {
        // label:'Scores',
        data: [50, 50],
        backgroundColor: ['rgba(171, 246, 190, 0.8)', 'rgba(74, 211, 115, 1)'],
      },
    ],
  };
  return (
    <Box>
      <Doughnut data={data}></Doughnut>
    </Box>
  );
};
export default Charts;
