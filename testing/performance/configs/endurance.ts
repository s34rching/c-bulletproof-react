import { Options } from 'k6/options';

export const u100s3d21600s: Options = {
  stages: [
    {
      target: 100,
      duration: '1m',
    },
    {
      target: 100,
      duration: '6h',
    },
    {
      target: 0,
      duration: '1m',
    },
  ],
};
