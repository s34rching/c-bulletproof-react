import { LoginForm } from '@/features/auth/components/login-form';
import { renderApp, screen, userEvent, waitFor } from '@testing/integration/render';
import { generateUserData } from '@testing/shared/data-generators.ts';
import { seedUser } from '@testing/shared/test-utils';
import { UserRoles } from '@testing/shared/types.ts';

test('should login new user and call onSuccess cb which should navigate the user to the app', async () => {
  const newUser = await seedUser(generateUserData(UserRoles.USER));

  const onSuccess = vi.fn();

  await renderApp(<LoginForm onSuccess={onSuccess} />, { user: null });

  await userEvent.type(screen.getByLabelText(/email address/i), newUser.email);
  await userEvent.type(screen.getByLabelText(/password/i), newUser.password);

  await userEvent.click(screen.getByRole('button', { name: /log in/i }));

  await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1));
});
