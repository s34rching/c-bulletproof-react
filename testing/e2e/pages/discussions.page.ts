import { type Locator, type Page } from '@playwright/test';

import { CreateDiscussionDialog } from '@testing/e2e/components/create-discussion-dialog';
import { DeleteDiscussionDialog } from '@testing/e2e/components/delete-discussion-dialog';

import { BasePage } from './base.page';

export class DiscussionsPage extends BasePage {
  readonly page: Page;
  readonly createDiscussionDialog: CreateDiscussionDialog;
  readonly deleteDiscussionDialog: DeleteDiscussionDialog;
  readonly createDiscussionButton: Locator;
  readonly discussionsList: Locator;
  readonly noDiscussionsBanner: Locator;

  constructor(page: Page) {
    super(page);

    this.page = page;
    this.createDiscussionDialog = new CreateDiscussionDialog(page);
    this.deleteDiscussionDialog = new DeleteDiscussionDialog(page);
    this.createDiscussionButton = page.getByRole('button', { name: 'Create Discussion' });
    this.discussionsList = page.getByRole('table');
    this.noDiscussionsBanner = page.getByRole('heading', { name: 'No Entries Found' });
  }

  getDiscussionByName(name: string): Locator {
    return this.page.locator('tr', { has: this.page.locator('td', { hasText: name }) });
  }

  getDeleteDiscussionButtonByName(name: string): Locator {
    return this.getDiscussionByName(name).getByRole('button', { name: 'Delete Discussion' });
  }

  async initiateDiscussionCreation(): Promise<void> {
    await this.createDiscussionButton.click();
  }

  async deleteDiscussion(name: string): Promise<void> {
    await this.getDeleteDiscussionButtonByName(name).click();
    await this.deleteDiscussionDialog.submitDiscussionDeletion();
  }
}
