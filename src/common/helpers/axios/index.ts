const env = process.env.REACT_APP_MASA_TOOLS_ENV || 'local';
const backendPort = process.env.REACT_APP_MASA_TOOLS_BACKEND_PORT;
const backendApiUrl = process.env.REACT_APP_MASA_TOOLS_BACKEND_API_URL;

console.log('INITIALIZING API', {
  env,
  backendPort,
  backendApiUrl,
});

export const URL = (apiURL?: string) =>
  apiURL
    ? apiURL
    : env === 'local'
    ? `http://localhost:${backendPort ? backendPort : '4000'}/`
    : backendApiUrl
    ? backendApiUrl
    : 'https://beta.middleware.masa.finance/';

export const Headers = {
  'Content-Type': 'application/json',
};
