// Inject an external script to access the `charts` variable
const script = document.createElement("script");
script.src = chrome.runtime.getURL("inject.js"); // Load inject.js from the extension directory
script.onload = function () {
  this.remove(); // Clean up after execution
};
(document.head || document.documentElement).appendChild(script);

// Listen for the `chartsData` event to get the charts variable
document.addEventListener("chartsData", (event) => {
  console.log("Charts variable received:", event.detail);
  const csvContent = event.detail.csvContent; // Access the `charts` variable
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  // Call the export function
  exportChartsToCSV(blob);
});

// Function to export charts to CSV
function exportChartsToCSV(blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "charts_data.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

