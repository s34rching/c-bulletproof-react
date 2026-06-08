import { Options } from 'k6/options';

export const u200s3d600s: Options = {
  stages: [
    {
      target: 200,
      duration: '1m',
    },
    {
      target: 200,
      duration: '8m',
    },
    {
      target: 0,
      duration: '1m',
    },
  ],
};
