import { useAccessToken } from '../provider/access-token-provider';

const envToken = process.env.REACT_APP_MASA_TOOLS_USER_ACCESS_TOKEN;

export function useToken() {
  const { accessToken } = useAccessToken();

  if (envToken) return { token: envToken, isLoading: false };

  return { token: accessToken, isLoading: false };
}
