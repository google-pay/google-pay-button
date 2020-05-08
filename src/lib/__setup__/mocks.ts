jest.mock('../load-script', () => {
  return {
    __esModule: true,
    default: (src: string) => Promise.resolve(),
  };
});

import './google-pay-mock';
