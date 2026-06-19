import { useParams } from 'next/navigation';

import { Discussion } from '@/app/app/discussions/[discussionId]/_components/discussion';
import { renderApp, screen, userEvent, waitFor, waitForLoadingToFinish, within } from '@testing/integration/render';
import { generateDiscussionData, generateUserData } from '@testing/shared/data-generators.ts';
import { seedDiscussion, seedUser } from '@testing/shared/test-utils';

const renderDiscussion = async () => {
  const fakeUser = await seedUser(generateUserData());
  const fakeDiscussion = await seedDiscussion(generateDiscussionData());

  vi.mocked(useParams).mockReturnValue({ discussionId: fakeDiscussion.id });

  const utils = await renderApp(<Discussion discussionId={fakeDiscussion.id} />, {
    user: fakeUser,
    path: `/app/discussions/:discussionId`,
    url: `/app/discussions/${fakeDiscussion.id}`,
  });

  await waitForLoadingToFinish();

  await screen.findByText(fakeDiscussion.title);

  return {
    ...utils,
    fakeUser,
    fakeDiscussion,
  };
};

describe('Discussion', () => {
  beforeEach(async () => {
    vi.mock('next/navigation', async () => {
      const actual = await vi.importActual('next/navigation');
      return {
        ...actual,
        useRouter: () => {
          return {
            push: vi.fn(),
            replace: vi.fn(),
          };
        },
        useParams: vi.fn(),
      };
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  test('should render discussion', async () => {
    const { fakeDiscussion } = await renderDiscussion();
    expect(screen.getByText(fakeDiscussion.body)).toBeInTheDocument();
  });

  test('should update discussion', async () => {
    const { fakeDiscussion } = await renderDiscussion();

    const titleUpdate = '-Updated';
    const bodyUpdate = '-Updated';

    await userEvent.click(screen.getByRole('button', { name: /update discussion/i }));

    const drawer = await screen.findByRole('dialog', {
      name: /update discussion/i,
    });

    const titleField = within(drawer).getByText(/title/i);
    const bodyField = within(drawer).getByText(/body/i);

    const newTitle = `${fakeDiscussion.title}${titleUpdate}`;
    const newBody = `${fakeDiscussion.body}${bodyUpdate}`;

    await userEvent.type(titleField, newTitle);
    await userEvent.type(bodyField, bodyUpdate);

    const submitButton = within(drawer).getByRole('button', {
      name: /submit/i,
    });

    await userEvent.click(submitButton);

    await waitFor(() => expect(drawer).not.toBeInTheDocument());

    expect(await screen.findByRole('heading', { name: newTitle })).toBeInTheDocument();
    expect(await screen.findByText(newBody)).toBeInTheDocument();
  });

  test(
    'should create and delete a comment on the discussion',
    async () => {
      await renderDiscussion();

      const comment = 'Hello World';

      await userEvent.click(screen.getByRole('button', { name: /create comment/i }));

      const drawer = await screen.findByRole('dialog', {
        name: /create comment/i,
      });

      const bodyField = await within(drawer).findByText(/body/i);

      await userEvent.type(bodyField, comment);

      const submitButton = await within(drawer).findByRole('button', {
        name: /submit/i,
      });

      await userEvent.click(submitButton);

      await waitFor(() => expect(drawer).not.toBeInTheDocument());

      await screen.findByText(comment);

      const commentsList = await screen.findByRole('list', {
        name: 'comments',
      });

      const commentElements = await within(commentsList).findAllByRole('listitem');

      const commentElement = commentElements[0];

      expect(commentElement).toBeInTheDocument();

      const deleteCommentButton = within(commentElement).getByRole('button', {
        name: /delete comment/i,
      });

      await userEvent.click(deleteCommentButton);

      const confirmationDialog = await screen.findByRole('dialog', {
        name: /delete comment/i,
      });

      const confirmationDeleteButton = await within(confirmationDialog).findByRole('button', {
        name: /delete/i,
      });

      await userEvent.click(confirmationDeleteButton);

      await screen.findByText(/comment deleted/i);

      await waitFor(() => {
        expect(within(commentsList).queryByText(comment)).not.toBeInTheDocument();
      });
    },
    {
      timeout: 20000,
    },
  );
});
