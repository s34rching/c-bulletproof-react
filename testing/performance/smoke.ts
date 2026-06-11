import { check } from 'k6';
import http from 'k6/http';

import { generateUserData } from '../shared/data-generators.ts';

import { u100s3d80s } from './configs/load.ts';
import { abortEarly } from './service/abort-early.ts';

const API_URL = __ENV.NEXT_PUBLIC_API_URL;
const AUTH_COOKIE = __ENV.NEXT_PUBLIC_AUTH_COOKIE;

export const options = {
  ...u100s3d80s,
  thresholds: {
    http_req_duration: ['p(95)<1000', 'p(90)<950'],
    http_req_failed: ['rate<0.1'],
    checks: ['rate>=0.99'],
  },
};

export async function setup() {
  await abortEarly(API_URL);

  const user = generateUserData();
  const res = http.post(`${API_URL}/auth/register`, JSON.stringify(user), {
    headers: { 'Content-Type': 'application/json' },
  });
  const body = res.json() as { jwt: string };
  return { jwt: body.jwt };
}

export default function (data: { jwt: string }) {
  const res = http.get(`${API_URL}/teams`, { headers: { Cookie: `${AUTH_COOKIE}=${data.jwt}` } });

  check(res, {
    'status is "200"': (res) => res.status === 200,
  });
}
