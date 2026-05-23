import { expect, type Locator, type Page } from '@playwright/test';
import { generateUser } from '@/testing/data-generators';

const USER_SETTLE_TIMEOUT = 2000;

export class BasePage {
  readonly page: Page;
  readonly eventAlert: Locator;

  constructor(page: Page) {
    this.page = page;
    this.eventAlert = page.locator('div.pointer-events-auto');
  }

  async open(path: string) {
    await this.page.goto(path);
  }

  async waitUrlContains(path: string | RegExp) {
    await this.page.waitForURL(path);
  }

  async waitForComplete(operation: string, timeout: number): Promise<void> {
    setTimeout(async () => {
      return new Promise((resolve) => {
        console.log(`Waiting ${timeout}ms for "${operation}" to complete`);

        resolve();
      });
    }, USER_SETTLE_TIMEOUT);
  }

  async createRegisteredUser(userData: Partial<ReturnType<typeof generateUser>>): Promise<void> {
    const { firstName, lastName, email, password, teamName } = userData;

    const response = await this.page.request.post(`http://localhost:8080/api/auth/register`, {
      data: {
        firstName,
        lastName,
        email,
        password,
        teamName,
        teamId: null,
      },
    });
    expect(response.status()).toBe(200)

    await this.waitForComplete('User is being set in system', USER_SETTLE_TIMEOUT);
  }

  async resetPageState(): Promise<void> {
    await this.page.context().clearCookies();
  }
}
