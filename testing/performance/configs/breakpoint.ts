import { Options } from 'k6/options'

export const u100000s1d7200s: Options = {
  stages: [
    {
      target: 100000,
      duration: '2h',
    },
  ],
};
