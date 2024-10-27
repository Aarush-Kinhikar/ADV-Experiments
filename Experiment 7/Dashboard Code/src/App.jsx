// App.jsx
import React, { useEffect, useState } from 'react';
import { csv } from 'd3-fetch';
import V1 from './V1';
import V2 from './V2';
import V3 from './V3';
import V4 from './V4';
import V5 from './V5';

const App = () => {
  const [financialData, setFinancialData] = useState([]);

  useEffect(() => {
    // Load the CSV data when the component mounts
    csv('./Financials.csv')
      .then((data) => {
        setFinancialData(data);
        // Example: Logging to see structure of data
        console.log(data);
      })
      .catch((error) => {
        console.error('Error loading the CSV file:', error);
      });
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex' }}>
        {financialData && <V1 financialData={financialData} />}
        {financialData && <V2 financialData={financialData} />}
        {financialData && <V3 financialData={financialData} />}
      </div>
      <div style={{ display: 'flex' }}>
        {financialData && <V4 financialData={financialData} />}
        {financialData && <V5 financialData={financialData} />}
      </div>
    </div>
  );
};

export default App;
