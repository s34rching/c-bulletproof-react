import { Options } from 'k6/options';

export const u300s5d600: Options = {
  stages: [
    {
      target: 20,
      duration: '10s',
    },
    {
      target: 500,
      duration: '20s',
    },
    {
      target: 300,
      duration: '30s',
    },
    {
      target: 100,
      duration: '8m',
    },
    {
      target: 0,
      duration: '60s',
    },
  ],
};
