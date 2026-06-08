import { Options } from 'k6/options';

export const u100s3d80s: Options = {
  stages: [
    {
      target: 100,
      duration: '10s',
    },
    {
      target: 100,
      duration: '60s',
    },
    {
      target: 0,
      duration: '10s',
    },
  ],
};
