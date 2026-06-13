import { type Locator, type Page } from '@playwright/test';

export class DeleteDiscussionDialog {
  readonly page: Page;
  readonly container: Locator;
  readonly submitDiscussionDeletionButton: Locator;
  readonly discardDiscussionDeletionButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.container = page.getByRole('dialog');
    this.submitDiscussionDeletionButton = page.getByRole('dialog').getByRole('button', { name: 'Delete Discussion' });
    this.discardDiscussionDeletionButton = page.getByRole('dialog').getByRole('button', { name: 'Cancel' });
  }

  async submitDiscussionDeletion(): Promise<void> {
    await this.submitDiscussionDeletionButton.click();
  }

  async discardDiscussionDeletion(): Promise<void> {
    await this.discardDiscussionDeletionButton.click();
  }
}
