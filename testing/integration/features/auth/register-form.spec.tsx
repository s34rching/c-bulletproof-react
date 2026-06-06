import * as nextNavigation from 'next/navigation';
import * as React from 'react';

import { RegisterForm } from '@/features/auth/components/register-form';
import { Team } from '@/types/api';
import { renderApp, screen, userEvent, waitFor } from '@testing/integration/render';
import { createTeam as generateTeam, createUser as generateUser } from '@testing/shared/data-generators';
import { createUser } from '@testing/shared/test-utils';

const testUser = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  password: 'pass1',
  teamName: 'Test Team',
};

const ToggleWrapper = ({ teams = [] }: { teams?: Team[] }) => {
  const [chooseTeam, setChooseTeam] = React.useState(false);
  return (
    <RegisterForm
      onSuccess={vi.fn()}
      chooseTeam={chooseTeam}
      setChooseTeam={() => setChooseTeam((prev) => !prev)}
      teams={teams}
    />
  );
};

describe('RegisterForm', () => {
  describe('Rendering', () => {
    test('TC-I-001: renders all required fields and the Join Existing Team toggle', async () => {
      await renderApp(<RegisterForm onSuccess={vi.fn()} chooseTeam={false} setChooseTeam={vi.fn()} teams={[]} />, {
        user: null,
      });

      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/team name/i)).toBeInTheDocument();
      expect(screen.getByRole('switch')).toBeInTheDocument();
    });
  });

  describe('Validation', () => {
    test('TC-I-002: submitting with all fields empty shows validation errors for every required field', async () => {
      await renderApp(<RegisterForm onSuccess={vi.fn()} chooseTeam={false} setChooseTeam={vi.fn()} teams={[]} />, {
        user: null,
      });

      await userEvent.click(screen.getByRole('button', { name: /register/i }));

      const alerts = await screen.findAllByRole('alert');
      expect(alerts.length).toBeGreaterThanOrEqual(4);
    });

    test('TC-I-003: submitting with only First Name empty shows a validation error', async () => {
      await renderApp(<RegisterForm onSuccess={vi.fn()} chooseTeam={false} setChooseTeam={vi.fn()} teams={[]} />, {
        user: null,
      });

      await userEvent.type(screen.getByLabelText(/last name/i), testUser.lastName);
      await userEvent.type(screen.getByLabelText(/email address/i), testUser.email);
      await userEvent.type(screen.getByLabelText(/password/i), testUser.password);
      await userEvent.type(screen.getByLabelText(/team name/i), testUser.teamName);
      await userEvent.click(screen.getByRole('button', { name: /register/i }));

      const alerts = await screen.findAllByRole('alert');
      expect(alerts).toHaveLength(1);
    });

    test('TC-I-004: submitting with only Last Name empty shows a validation error', async () => {
      await renderApp(<RegisterForm onSuccess={vi.fn()} chooseTeam={false} setChooseTeam={vi.fn()} teams={[]} />, {
        user: null,
      });

      await userEvent.type(screen.getByLabelText(/first name/i), testUser.firstName);
      await userEvent.type(screen.getByLabelText(/email address/i), testUser.email);
      await userEvent.type(screen.getByLabelText(/password/i), testUser.password);
      await userEvent.type(screen.getByLabelText(/team name/i), testUser.teamName);
      await userEvent.click(screen.getByRole('button', { name: /register/i }));

      const alerts = await screen.findAllByRole('alert');
      expect(alerts).toHaveLength(1);
    });

    test('TC-I-005: submitting with only Email empty shows a validation error', async () => {
      await renderApp(<RegisterForm onSuccess={vi.fn()} chooseTeam={false} setChooseTeam={vi.fn()} teams={[]} />, {
        user: null,
      });

      await userEvent.type(screen.getByLabelText(/first name/i), testUser.firstName);
      await userEvent.type(screen.getByLabelText(/last name/i), testUser.lastName);
      await userEvent.type(screen.getByLabelText(/password/i), testUser.password);
      await userEvent.type(screen.getByLabelText(/team name/i), testUser.teamName);
      await userEvent.click(screen.getByRole('button', { name: /register/i }));

      const alerts = await screen.findAllByRole('alert');
      expect(alerts).toHaveLength(1);
    });

    test('TC-I-006: submitting with only Password empty shows a validation error', async () => {
      await renderApp(<RegisterForm onSuccess={vi.fn()} chooseTeam={false} setChooseTeam={vi.fn()} teams={[]} />, {
        user: null,
      });

      await userEvent.type(screen.getByLabelText(/first name/i), testUser.firstName);
      await userEvent.type(screen.getByLabelText(/last name/i), testUser.lastName);
      await userEvent.type(screen.getByLabelText(/email address/i), testUser.email);
      await userEvent.type(screen.getByLabelText(/team name/i), testUser.teamName);
      await userEvent.click(screen.getByRole('button', { name: /register/i }));

      const alerts = await screen.findAllByRole('alert');
      expect(alerts).toHaveLength(1);
    });

    test('TC-I-007: submitting with only Team Name empty shows a validation error', async () => {
      await renderApp(<RegisterForm onSuccess={vi.fn()} chooseTeam={false} setChooseTeam={vi.fn()} teams={[]} />, {
        user: null,
      });

      await userEvent.type(screen.getByLabelText(/first name/i), testUser.firstName);
      await userEvent.type(screen.getByLabelText(/last name/i), testUser.lastName);
      await userEvent.type(screen.getByLabelText(/email address/i), testUser.email);
      await userEvent.type(screen.getByLabelText(/password/i), testUser.password);
      await userEvent.click(screen.getByRole('button', { name: /register/i }));

      await screen.findByRole('alert');
    });

    test('TC-I-008: submitting with a password shorter than 5 characters shows a validation error', async () => {
      await renderApp(<RegisterForm onSuccess={vi.fn()} chooseTeam={false} setChooseTeam={vi.fn()} teams={[]} />, {
        user: null,
      });

      await userEvent.type(screen.getByLabelText(/first name/i), testUser.firstName);
      await userEvent.type(screen.getByLabelText(/last name/i), testUser.lastName);
      await userEvent.type(screen.getByLabelText(/email address/i), testUser.email);
      await userEvent.type(screen.getByLabelText(/password/i), 'abcd');
      await userEvent.type(screen.getByLabelText(/team name/i), testUser.teamName);
      await userEvent.click(screen.getByRole('button', { name: /register/i }));

      await screen.findByRole('alert');
    });

    test('TC-I-009: submitting with a password of exactly 5 characters does not show a validation error', async () => {
      const user = generateUser();
      const onSuccess = vi.fn();
      await renderApp(<RegisterForm onSuccess={onSuccess} chooseTeam={false} setChooseTeam={vi.fn()} teams={[]} />, {
        user: null,
      });

      await userEvent.type(screen.getByLabelText(/first name/i), user.firstName);
      await userEvent.type(screen.getByLabelText(/last name/i), user.lastName);
      await userEvent.type(screen.getByLabelText(/email address/i), user.email);
      await userEvent.type(screen.getByLabelText(/password/i), 'abcde');
      await userEvent.type(screen.getByLabelText(/team name/i), user.teamName);
      await userEvent.click(screen.getByRole('button', { name: /register/i }));

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1));
    });
  });

  describe('Form submission', () => {
    test('TC-I-010: filling all fields with valid data and submitting calls onSuccess after a successful API response', async () => {
      const user = generateUser();
      const onSuccess = vi.fn();
      await renderApp(<RegisterForm onSuccess={onSuccess} chooseTeam={false} setChooseTeam={vi.fn()} teams={[]} />, {
        user: null,
      });

      await userEvent.type(screen.getByLabelText(/first name/i), user.firstName);
      await userEvent.type(screen.getByLabelText(/last name/i), user.lastName);
      await userEvent.type(screen.getByLabelText(/email address/i), user.email);
      await userEvent.type(screen.getByLabelText(/password/i), user.password);
      await userEvent.type(screen.getByLabelText(/team name/i), user.teamName);
      await userEvent.click(screen.getByRole('button', { name: /register/i }));

      await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1));
    });

    test('TC-I-011: the Register button shows a loading spinner while the mutation is pending', async () => {
      const user = generateUser();
      const onSuccess = vi.fn();
      await renderApp(<RegisterForm onSuccess={onSuccess} chooseTeam={false} setChooseTeam={vi.fn()} teams={[]} />, {
        user: null,
      });

      await userEvent.type(screen.getByLabelText(/first name/i), user.firstName);
      await userEvent.type(screen.getByLabelText(/last name/i), user.lastName);
      await userEvent.type(screen.getByLabelText(/email address/i), user.email);
      await userEvent.type(screen.getByLabelText(/password/i), user.password);
      await userEvent.type(screen.getByLabelText(/team name/i), user.teamName);
      await userEvent.click(screen.getByRole('button', { name: /register/i }));

      expect(screen.getByText('Loading')).toBeInTheDocument();
      await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1));
    });

    test('TC-I-016: an API error for duplicate email triggers an error notification', async () => {
      const existingUser = await createUser();
      await renderApp(<RegisterForm onSuccess={vi.fn()} chooseTeam={false} setChooseTeam={vi.fn()} teams={[]} />, {
        user: null,
      });

      await userEvent.type(screen.getByLabelText(/first name/i), testUser.firstName);
      await userEvent.type(screen.getByLabelText(/last name/i), testUser.lastName);
      await userEvent.type(screen.getByLabelText(/email address/i), existingUser.email);
      await userEvent.type(screen.getByLabelText(/password/i), testUser.password);
      await userEvent.type(screen.getByLabelText(/team name/i), testUser.teamName);
      await userEvent.click(screen.getByRole('button', { name: /register/i }));

      await screen.findByRole('alert', { name: /error/i });
    });
  });

  describe('Team toggle', () => {
    test('TC-I-012: enabling the toggle hides the Team Name input and shows the Team dropdown', async () => {
      await renderApp(<ToggleWrapper teams={[generateTeam()]} />, { user: null });

      expect(screen.getByLabelText(/team name/i)).toBeInTheDocument();

      await userEvent.click(screen.getByRole('switch'));

      expect(screen.queryByLabelText(/team name/i)).not.toBeInTheDocument();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    test('TC-I-013: disabling the toggle hides the Team dropdown and restores the Team Name input', async () => {
      await renderApp(<ToggleWrapper teams={[generateTeam()]} />, { user: null });

      await userEvent.click(screen.getByRole('switch'));
      expect(screen.queryByLabelText(/team name/i)).not.toBeInTheDocument();

      await userEvent.click(screen.getByRole('switch'));

      expect(screen.getByLabelText(/team name/i)).toBeInTheDocument();
      expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    });

    test('TC-I-014: the Team dropdown shows a single option when only 1 team exists', async () => {
      await renderApp(<ToggleWrapper teams={[generateTeam()]} />, { user: null });

      await userEvent.click(screen.getByRole('switch'));

      expect(screen.getAllByRole('option')).toHaveLength(1);
    });

    test('TC-I-015: the Team dropdown shows all 10 options when 10 teams exist', async () => {
      const teams = Array.from({ length: 10 }, () => generateTeam());
      await renderApp(<ToggleWrapper teams={teams} />, { user: null });

      await userEvent.click(screen.getByRole('switch'));

      expect(screen.getAllByRole('option')).toHaveLength(10);
    });
  });

  describe('Login link', () => {
    test('TC-I-017: the Log In link is visible and its href points to /auth/login', async () => {
      await renderApp(<RegisterForm onSuccess={vi.fn()} chooseTeam={false} setChooseTeam={vi.fn()} teams={[]} />, {
        user: null,
      });

      const link = screen.getByRole('link', { name: /log in/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/auth/login');
    });

    test('TC-I-018: the Log In link href preserves the redirectTo query param', async () => {
      const spy = vi.spyOn(nextNavigation, 'useSearchParams').mockReturnValue({
        get: (key: string) => (key === 'redirectTo' ? '/app/dashboard' : null),
      } as any);

      await renderApp(<RegisterForm onSuccess={vi.fn()} chooseTeam={false} setChooseTeam={vi.fn()} teams={[]} />, {
        user: null,
      });

      const link = screen.getByRole('link', { name: /log in/i });
      expect(link).toHaveAttribute('href', '/auth/login?redirectTo=%2Fapp%2Fdashboard');

      spy.mockRestore();
    });
  });
});
