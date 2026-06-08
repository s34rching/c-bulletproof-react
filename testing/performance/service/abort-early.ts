import exec from 'k6/execution';
import http from 'k6/http';

export const abortEarly = async (apiEndpoint: string): Promise<void> => {
  const healthStatusResponse = http.get(`${apiEndpoint}/health`);
  if (healthStatusResponse.status !== 200) {
    exec.test.abort('Server is unavailable. Aborting test run...');
  }
};
