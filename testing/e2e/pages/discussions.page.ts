import { BasePage } from './base.page';
import { type Locator, type Page } from '@playwright/test';
import { CreateDiscussionDialog } from '@testing/e2e/components/create-discussion-dialog';

export class DiscussionsPage extends BasePage {
  readonly page: Page;
  readonly createDiscussionButton: Locator;
  readonly createDiscussionDialog: CreateDiscussionDialog
  readonly discussionsList: Locator;

  constructor(page: Page) {
    super(page);

    this.page = page;
    this.createDiscussionButton = page.getByRole('button', { name: 'Create Discussion' });
    this.createDiscussionDialog = new CreateDiscussionDialog(page);
    this.discussionsList = page.getByRole('table');
  }

  async initiateDiscussionCreation(): Promise<void> {
    await this.createDiscussionButton.click();
  }

  async getDiscussionByName(name: string): Promise<Locator> {
    return this.page.locator('tr', { has: this.page.locator('td', { hasText: name }) });
  }
}
