// App.jsx
import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import V6 from './V6';
import V5 from './V5';
import V4 from './V4'
import V3 from './V3';
import V2 from './V2';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Load the CSV data
    d3.csv('Forest_Area.csv', d3.autoType).then((data) => {
      setData(data);
    });
  }, []);

  return (
    <div>
      {/* <h1>Forest Area vs Total Land Area</h1> */}
      {data.length > 0 ? <V6 data={data} /> : <p>Loading data...</p>}
      {data.length > 0 ? <V5 data={data} /> : <p>Loading data...</p>}
      {data.length > 0 ? <V4 data={data} /> : <p>Loading data...</p>}
      {data.length > 0 ? <V3 data={data} /> : <p>Loading data...</p>}
      {data.length > 0 ? <V2 data={data} /> : <p>Loading data...</p>}

    </div>
  );
}

export default App;
