import { render as rtlRender, waitForElementToBeRemoved, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AppProvider } from '@/app/provider';
import { createUser, loginAsUser } from '@testing/shared/test-utils';

export const waitForLoadingToFinish = () =>
  waitForElementToBeRemoved(
    () => [
      ...screen.queryAllByTestId(/loading/i),
      ...screen.queryAllByText(/loading/i),
    ],
    { timeout: 4000 },
  );

const initializeUser = async (user: any) => {
  if (typeof user === 'undefined') {
    const newUser = await createUser();
    return loginAsUser(newUser);
  } else if (user) {
    return loginAsUser(user);
  }
  return null;
};

export const renderApp = async (
  ui: any,
  { user, ...renderOptions }: Record<string, any> = {},
) => {
  const initializedUser = await initializeUser(user);

  return {
    ...rtlRender(ui, {
      wrapper: AppProvider,
      ...renderOptions,
    }),
    user: initializedUser,
  };
};

export * from '@testing-library/react';
export { userEvent, rtlRender };
