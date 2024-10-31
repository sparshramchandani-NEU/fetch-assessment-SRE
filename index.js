// Import required modules
const fs = require('fs');
const yaml = require('yaml');

/**
 * Reads and parses the YAML configuration file
 * @param {string} filePath - Path to the YAML config file
 * @returns {Object} Parsed configuration object
 */
function readConfig(filePath) {
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return yaml.parse(fileContents);
}

/**
 * Simulates a health check for a given endpoint
 * @param {Object} endpoint - Endpoint object with name and url properties
 * @returns {Object} Health check result
 */
function simulateHealthCheck(endpoint) {
  // Simulate latency between 50ms and 649ms
  const latency = Math.floor(Math.random() * 600) + 50;
  // Simulate status code with 80% chance of 200, 20% chance of 400, 404, or 500
  const statusCode = Math.random() < 0.8 ? 200 : [400, 404, 500][Math.floor(Math.random() * 3)];
  // Determine status based on statusCode and latency
  const status = (statusCode === 200 && latency < 500) ? 'UP' : 'DOWN';
  let reason = '';
  if (status === 'DOWN') {
    reason = latency >= 500 ? '(response latency is not less than 500 ms)' : '(response code is not in range 200–299)';
  }
  return { name: endpoint.name, url: endpoint.url, status, statusCode, latency, reason };
}

/**
 * Runs health checks for all endpoints
 * @param {Array} endpoints - Array of endpoint objects
 * @returns {Array} Array of health check results
 */
function runHealthChecks(endpoints) {
  return endpoints.map(simulateHealthCheck);
}

/**
 * Logs health check results to a file
 * @param {Array} results - Array of health check results
 * @param {number} cycleNumber - Current test cycle number
 */
function logResults(results, cycleNumber) {
  const logFile = 'health_check.log';
  let logContent = `Test cycle #${cycleNumber} begins at time = ${(cycleNumber - 1) * 15} seconds:\n`;
  
  results.forEach(result => {
    logContent += `● Endpoint with name ${result.name} has HTTP response code ${result.statusCode} and response latency ${result.latency} ms => ${result.status} ${result.reason}\n`;
  });

  logContent += `Test cycle #${cycleNumber} ends. The program logs to the console:\n`;
  
  fs.appendFileSync(logFile, logContent);
}

/**
 * Calculates and logs cumulative availability for each domain
 * @param {Array} results - Array of health check results
 * @param {Object} cumulativeStats - Object to store cumulative statistics
 * @returns {Object} Updated cumulative statistics
 */
function calculateCumulativeAvailability(results, cumulativeStats) {
  results.forEach(result => {
    const domain = new URL(result.url).hostname;
    if (!cumulativeStats[domain]) {
      cumulativeStats[domain] = { up: 0, total: 0 };
    }
    cumulativeStats[domain].total++;
    if (result.status === 'UP') {
      cumulativeStats[domain].up++;
    }
  });

  let availabilityLog = '';
  Object.entries(cumulativeStats).forEach(([domain, stats]) => {
    const percentage = Math.round((stats.up / stats.total) * 100);
    availabilityLog += `${domain} has ${percentage}% availability percentage (${stats.up}/${stats.total} checks passed)\n`;
  });

  console.log(availabilityLog);
  return cumulativeStats;
}

/**
 * Main function to run the health check program
 */
async function main() {
  const configPath = 'config.yaml';
  const endpoints = readConfig(configPath);
  let cycleNumber = 1;
  let cumulativeStats = {};

  while (true) {
    // Wait for 15 seconds between each cycle
    await new Promise(resolve => setTimeout(resolve, 15000));

    const results = runHealthChecks(endpoints);
    logResults(results, cycleNumber);
    cumulativeStats = calculateCumulativeAvailability(results, cumulativeStats);
    cycleNumber++;
  }
}

// Run the main function and handle any errors
main().catch(error => {
  console.error('Error in main:', error);
  process.exit(1);
});