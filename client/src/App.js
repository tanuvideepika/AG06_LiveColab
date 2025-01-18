// import React, { useState } from 'react';
// import * as XLSX from 'xlsx';
// import Dropzone from 'react-dropzone';
// import Plot from 'react-plotly.js';
// import './App.css';

// function App() {
//   const [uploadedFile, setUploadedFile] = useState(null);
//   const [filteredData, setFilteredData] = useState(null); // State to store the filtered data

//   const handleFileUpload = (acceptedFiles) => {
//     const file = acceptedFiles[0];
//     setUploadedFile(file);

//     const reader = new FileReader();
//     reader.onload = function (e) {
//       const data = new Uint8Array(e.target.result);
//       const workbook = XLSX.read(data, { type: 'array' });
//       const firstSheet = workbook.SheetNames[0];
//       const excelData = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet]);

//       // Remove columns with all null values
//       const filteredData = excelData.filter((item) => !Object.values(item).every((value) => value === null));

//       // Set the filtered data to the state
//       setFilteredData(filteredData);
//     };
//     reader.readAsArrayBuffer(file);
//   };

//   const renderCharts = () => {
//     if (filteredData && filteredData.length > 0) {
//       const columns = Object.keys(filteredData[0]);

//       const traces = columns.map((column) => ({
//         x: filteredData.map((item) => item[column]),
//         y: filteredData.map((item) => item[column]),
//         type: 'scatter',
//         mode: 'lines+markers',
//         name: column,
//       }));

//       const barTraces = columns.map((column) => ({
//         x: columns,
//         y: filteredData.map((item) => item[column]),
//         type: 'bar',
//         name: column,
//       }));

//       const lineTraces = columns.map((column) => ({
//         x: filteredData.map((item) => item[column]),
//         y: filteredData.map((item) => item[column]),
//         type: 'line',
//         name: column,
//       }));

//       const boxTraces = columns.map((column) => ({
//         y: filteredData.map((item) => item[column]),
//         type: 'box',
//         name: column,
//       }));

//       const whiskerTraces = columns.map((column) => ({
//         y: filteredData.map((item) => item[column]),
//         type: 'box',
//         boxpoints: 'all',
//         jitter: 0.3,
//         pointpos: -1.8,
//         name: column,
//       }));

//       const bubbleTraces = columns.map((column) => ({
//         x: filteredData.map((item) => item[column]),
//         y: filteredData.map((item) => item[column]),
//         mode: 'markers',
//         marker: {
//           size: filteredData.map((item) => item[column] * 5), // Adjust size based on data value
//         },
//         name: column,
//       }));

//       const surfaceTrace = {
//         type: 'surface',
//         z: filteredData.map((item) => Object.values(item).map((value) => value * 10)), // Multiply by 10 to amplify the surface plot
//       };

//       return (
//         <>
//           <h2>Line Charts</h2>
//           <div className="chart-container">
//             <Plot data={lineTraces} layout={{ title: 'Line Charts' }} config={{ responsive: true }} />
//           </div>
//           <h2>Scatter Plots</h2>
//           <div className="chart-container">
//             <Plot data={traces} layout={{ title: 'Scatter Plots' }} config={{ responsive: true }} />
//           </div>
//           <h2>Bar Charts</h2>
//           <div className="chart-container">
//             <Plot data={barTraces} layout={{ title: 'Bar Charts', barmode: 'group' }} config={{ responsive: true }} />
//           </div>
//           <h2>Box Plot</h2>
//           <div className="chart-container">
//             <Plot data={boxTraces} layout={{ title: 'Box Plot' }} config={{ responsive: true }} />
//           </div>
//           <h2>Whisker Plot</h2>
//           <div className="chart-container">
//             <Plot data={whiskerTraces} layout={{ title: 'Whisker Plot' }} config={{ responsive: true }} />
//           </div>
//           <h2>Bubble Chart</h2>
//           <div className="chart-container">
//             <Plot data={bubbleTraces} layout={{ title: 'Bubble Chart' }} config={{ responsive: true }} />
//           </div>
//           <h2>3D Surface Plot</h2>
//           <div className="chart-container">
//             <Plot data={[surfaceTrace]} layout={{ title: '3D Surface Plot' }} config={{ responsive: true }} />
//           </div>
//         </>
//       );
//     } else {
//       return <p>No data to visualize. Upload an Excel file to get started.</p>;
//     }
//   };

//   return (
//     <div className="container">
//       <h1 className="title">GET IT VISUALIZED</h1>
//       <Dropzone onDrop={handleFileUpload}>
//         {({ getRootProps, getInputProps }) => (
//           <div {...getRootProps()} className="dropzone">
//             <input {...getInputProps()} />
//             <p>Drag n drop an Excel file here, or click to select one.</p>
//             {uploadedFile && <p className="file-info">Uploaded File: {uploadedFile.name}</p>}
//           </div>
//         )}
//       </Dropzone>
//       {renderCharts()}
//     </div>
//   );
// }

// export default App;

import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import Dropzone from 'react-dropzone';
import Plot from 'react-plotly.js';
import './App.css';

function App() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [chartType, setChartType] = useState('scatter'); // Default chart type
  const [xAxis, setXAxis] = useState('');
  const [yAxis, setYAxis] = useState('');
  const [colorScheme, setColorScheme] = useState('Viridis'); // Default color scheme

  const handleFileUpload = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setUploadedFile(file);

    const reader = new FileReader();
    reader.onload = function (e) {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.SheetNames[0];
      const excelData = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet]);

      // Remove columns with all null values
      const filteredData = excelData.filter((item) => !Object.values(item).every((value) => value === null));

      setFilteredData(filteredData);
      setXAxis(Object.keys(filteredData[0])[0]); // Set default x-axis
      setYAxis(Object.keys(filteredData[0])[1]); // Set default y-axis
    };
    reader.readAsArrayBuffer(file);
  };

  const renderChart = () => {
    if (filteredData && filteredData.length > 0 && xAxis && yAxis) {
      const trace = {
        x: filteredData.map((item) => item[xAxis]),
        y: filteredData.map((item) => item[yAxis]),
        type: chartType,
        mode: chartType === 'scatter' ? 'lines+markers' : undefined,
        marker: {
          color: filteredData.map((item) => item[yAxis]),
          colorscale: colorScheme,
        },
      };

      return (
        <Plot
          data={[trace]}
          layout={{
            title: `${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart`,
            xaxis: { title: xAxis },
            yaxis: { title: yAxis },
          }}
          config={{ responsive: true }}
        />
      );
    } else {
      return <p>No data to visualize. Upload an Excel file to get started.</p>;
    }
  };

  return (
    <div className="container">
      <h1 className="title">LIVE CO-LAB</h1>
      <Dropzone onDrop={handleFileUpload}>
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()} className="dropzone">
            <input {...getInputProps()} />
            <p>Drag n drop an Excel file here, or click to select one.</p>
            {uploadedFile && <p className="file-info">Uploaded File: {uploadedFile.name}</p>}
          </div>
        )}
      </Dropzone>

      {filteredData && (
        // <div className="controls">
        //   <h2>Customize Chart</h2>
        //   <label>
        //     X-Axis:
        //     <select value={xAxis} onChange={(e) => setXAxis(e.target.value)}>
        //       {Object.keys(filteredData[0]).map((key) => (
        //         <option key={key} value={key}>
        //           {key}
        //         </option>
        //       ))}
        //     </select>
        //   </label>
        //   <label>
        //     Y-Axis:
        //     <select value={yAxis} onChange={(e) => setYAxis(e.target.value)}>
        //       {Object.keys(filteredData[0]).map((key) => (
        //         <option key={key} value={key}>
        //           {key}
        //         </option>
        //       ))}
        //     </select>
        //   </label>
        //   <label>
        //     Chart Type:
        //     <select value={chartType} onChange={(e) => setChartType(e.target.value)}>
        //       <option value="scatter">Scatter</option>
        //       <option value="bar">Bar</option>
        //       <option value="line">Line</option>
        //       <option value="box">Box</option>
        //       {/* <option value="heatmap">Heatmap</option> */}
        //     </select>
        //   </label>
        //   <label>
        //     Color Scheme:
        //     <select value={colorScheme} onChange={(e) => setColorScheme(e.target.value)}>
        //       <option value="Viridis">Viridis</option>
        //       <option value="Cividis">Cividis</option>
        //       <option value="Blues">Blues</option>
        //       <option value="Greens">Greens</option>
        //       <option value="Inferno">Inferno</option>
        //     </select>
        //   </label>
        // </div>
        <div className="controls">
  <h2>Customize Chart</h2>
  <label>
    X-Axis:
    <select value={xAxis} onChange={(e) => setXAxis(e.target.value)}>
      {Object.keys(filteredData[0]).map((key) => (
        <option key={key} value={key}>
          {key}
        </option>
      ))}
    </select>
  </label>
  <label>
    Y-Axis:
    <select value={yAxis} onChange={(e) => setYAxis(e.target.value)}>
      {Object.keys(filteredData[0]).map((key) => (
        <option key={key} value={key}>
          {key}
        </option>
      ))}
    </select>
  </label>
  <label>
    Chart Type:
    <select value={chartType} onChange={(e) => setChartType(e.target.value)}>
      <option value="scatter">Scatter</option>
      <option value="bar">Bar</option>
      <option value="line">Line</option>
      <option value="box">Box</option>
    </select>
  </label>
  <label>
    Color Scheme:
    <select value={colorScheme} onChange={(e) => setColorScheme(e.target.value)}>
      <option value="Viridis">Viridis</option>
      <option value="Cividis">Cividis</option>
      <option value="Blues">Blues</option>
      <option value="Greens">Greens</option>
      <option value="Inferno">Inferno</option>
    </select>
  </label>
</div>

      )}

      <div className="chart-container">{renderChart()}</div>
    </div>
  );
}

export default App;

