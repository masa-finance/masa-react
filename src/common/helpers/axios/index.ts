
const env = process.env.REACT_APP_MASA_TOOLS_ENV;
const backendPort = process.env.REACT_APP_MASA_TOOLS_BACKEND_PORT;
const backendApiUrl = process.env.REACT_APP_MASA_TOOLS_BACKEND_API_URL;

export const URL = env === "local" ? `http://localhost:${backendPort ? backendPort : "4000"}/` : backendApiUrl ? backendApiUrl : 'https://middleware.masa.finance/';

export const Headers = {
  'x-api-key': 'NN7ARbtuBy68bM78xQHFy3YDmLbUIPl676COm6Qa',
  'Content-Type': 'application/json',
  'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InJwWlJleDdLVExGRFJ2QWVwYUZqWCJ9.eyJpc3MiOiJodHRwczovL2Rldi0xbTEwaW40aS51cy5hdXRoMC5jb20vIiwic3ViIjoiZ29vZ2xlLW9hdXRoMnwxMTc2NzQ1NjkxOTk4NzEzMjUxNzIiLCJhdWQiOlsiaHR0cHM6Ly9hdXRoLm1hc2EuZmluYW5jZSIsImh0dHBzOi8vZGV2LTFtMTBpbjRpLnVzLmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE2NTAyOTI1MjYsImV4cCI6MTY1MDM3ODkyNiwiYXpwIjoiWGcyQ0tZS3FKVG1EUGVyTVBiNWlKTEFSamhITzNxSU0iLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIn0.hSEv3qMp6qgm5o48l2_SJWr0LuyFOJGnrbUz8kj4nqOJMHd926FcE2YinFbE-BXqkbGbcl-4bY-TBDgF5CCs22G-EgRkrCfa4qqy1c4CR1PltxL2Uci58nPuwn2HZTumHEqJDBOzxbrhYVGq7bP7at6Yl44hpbXD6NXN_njdckb7G9VzsqDjcO6hS1fJ5F4QlBleKGDMzHPWWznsnkBqD1VJypx3e05jj7d7-Ha2A4BVAOEMBJ7xzmUj2As81fFIUGGEqO78qcEPZ8lviT0d-HAMcW0t8HY3trZUh5QXrxs5fQKwrYW7oVKhORxyYm5--Z6Zb1bxBpIqumu6xqIR4Q'
};
