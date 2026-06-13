import { type Locator, type Page } from '@playwright/test';
import { DiscussionData } from '@testing/shared/types.ts';

export class CreateDiscussionDialog {
  readonly page: Page;
  readonly container: Locator;
  readonly nameInput: Locator;
  readonly bodyTextarea: Locator;
  readonly isPublicCheckbox: Locator;
  readonly submitDiscussionCreationButton: Locator;
  readonly discardDiscussionCreationButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.container = page.getByRole('dialog');
    this.nameInput = page.getByRole('textbox', { name: 'title' });
    this.bodyTextarea = page.getByRole('textbox', { name: 'body' });
    this.isPublicCheckbox = page.locator('button#public');
    this.submitDiscussionCreationButton = page.getByRole('button', { name: 'Submit' });
    this.discardDiscussionCreationButton = page.getByRole('button', { name: 'Close' });
  }

  async submitDiscussionCreation(): Promise<void> {
    await this.submitDiscussionCreationButton.click();
  }

  async discardDiscussionCreation(): Promise<void> {
    await this.discardDiscussionCreationButton.click();
  }

  async fillDiscussionForm(discussionData: DiscussionData): Promise<void> {
    await this.container.waitFor({ state: 'visible' });
    await this.nameInput.fill(discussionData.title);
    await this.bodyTextarea.fill(discussionData.body);
    await this.isPublicCheckbox.click({ clickCount: discussionData.public ? 1 : 0 });
  }
}
