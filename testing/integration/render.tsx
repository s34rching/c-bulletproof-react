import { render as rtlRender, screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AppProvider } from '@/app/provider';
import { generateUserData } from '@testing/shared/data-generators.ts';
import { loginAsUser, seedUser } from '@testing/shared/test-utils';
import { UserData, UserRoles } from '@testing/shared/types.ts';

export const waitForLoadingToFinish = () =>
  waitForElementToBeRemoved(() => [...screen.queryAllByTestId(/loading/i), ...screen.queryAllByText(/loading/i)], {
    timeout: 4000,
  });

const initializeUser = async (user?: UserData | null) => {
  if (typeof user === 'undefined') {
    const newUser = await seedUser(generateUserData(UserRoles.ADMIN));
    return loginAsUser(newUser);
  } else if (user) {
    return loginAsUser(user);
  }
  return null;
};

export const renderApp = async (
  ui: React.JSX.Element,
  { user, ...renderOptions }: { user?: UserData | null } & Record<string, unknown> = {},
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
