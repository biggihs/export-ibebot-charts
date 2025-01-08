(function () {
  if (window.charts) {

    let csvContent = "";

    const headerRow = [];
    const dataMap = new Map();

    function convertTimestampToExcelFormat(timestamp) {
      const date = new Date(timestamp);
      return date.toISOString().replace("T", " ").slice(0, 19);
    }

    window.charts.forEach((chartContainer, chartIndex) => {
      const chart = chartContainer.elm
      const seriesNames = chart.w.globals.seriesNames;
      const chartID = chart.w.globals.chartID;
      const xValues = chart.w.globals.seriesX;
      const yValues = chart.w.globals.series;

      seriesNames.forEach((name, seriesIndex) => {
        const unit = chartID.toLowerCase().includes("temperature")
          ? " [°C]"
          : chartID.toLowerCase().includes("humidity")
          ? " [g/m³]"
          : "";
        headerRow.push(`timestamp${chartIndex + 1}`, `${name}${unit}`);
      });

      for (let seriesIndex = 0; seriesIndex < seriesNames.length; seriesIndex++) {
        for (let pointIndex = 0; pointIndex < xValues[seriesIndex].length; pointIndex++) {
          const timestamp = xValues[seriesIndex][pointIndex];
          const value = yValues[seriesIndex][pointIndex];

          if (!dataMap.has(timestamp)) {
            dataMap.set(timestamp, new Array(headerRow.length).fill(""));
          }

          const dataRow = dataMap.get(timestamp);
          const columnOffset = chartIndex * seriesNames.length * 2 + seriesIndex * 2;
          dataRow[columnOffset] = convertTimestampToExcelFormat(timestamp) || "";
          dataRow[columnOffset + 1] = value || "";
        }
      }
    });

    csvContent += headerRow.join(";") + "\n";
    [...dataMap.keys()]
      .sort((a, b) => a - b)
      .forEach((timestamp) => {
        csvContent += dataMap.get(timestamp).join(";") + "\n";
      });

    const customEvent = new CustomEvent("chartsData",
                                        { 
                                           "detail": {
                                             "csvContent": csvContent
                                           }
                                        })
    document.dispatchEvent(customEvent);
  } else {
    console.error("No 'charts' variable found on the page.");
  }
})();

