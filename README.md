# Fetch Health Check Monitor

This Node.js application performs periodic health checks on specified endpoints and logs the results. It simulates HTTP requests to each endpoint, records response times and status codes, and calculates cumulative availability percentages for each domain.

## Features

- Reads endpoint configurations from a YAML file
- Simulates health checks with randomized response times and status codes
- Logs detailed health check results to a file
- Calculates and displays cumulative availability percentages for each domain
- Runs continuously, performing checks every 15 seconds

## Prerequisites

- Node.js (version 12 or higher recommended)
- npm (Node Package Manager)

## Installation

1. Clone this repository or download the source code.
2. Navigate to the project directory in your terminal.
3. Run `npm install` to install the required dependencies.

## Configuration

Create a `config.yaml` file in the project root directory with the following structure:

```yaml
- headers:
    user-agent: fetch-synthetic-monitor
  method: GET
  name: fetch index page
  url: https://fetch.com/
- headers:
    user-agent: fetch-synthetic-monitor
  method: GET
  name: fetch careers page
  url: https://fetch.com/careers
- body: '{"foo":"bar"}'
  headers:
    content-type: application/json
    user-agent: fetch-synthetic-monitor
  method: POST
  name: fetch some fake post endpoint
  url: https://fetch.com/some/post/endpoint
- name: fetch rewards index page
  url: https://www.fetchrewards.com/
```

## Run the application

```sh
node index.js
```

