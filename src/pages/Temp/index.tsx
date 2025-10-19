import React from 'react';
import SubstanceTrendChart from '../../components/substance-trend-chart';

const App = () => {
  // You can pass your actual data and range here
  const myBloodData = [
    { month: 'Jan', value: 3.8 },
    { month: 'Mar', value: 1.5 },
    { month: 'May', value: -0.2 },
    { month: 'Jul', value: -2.1 },
    { month: 'Sept', value: -4.5 },
    { month: 'Nov', value: -6.0 },
  ];
  const myOptimalMin = -1;
  const myOptimalMax = 1;

  return (
    <div>
      <h2>Blood Substance Report</h2>
      <SubstanceTrendChart
        data={myBloodData}
        optimalMin={myOptimalMin}
        optimalMax={myOptimalMax}
      />
    </div>
  );
};

export default App;