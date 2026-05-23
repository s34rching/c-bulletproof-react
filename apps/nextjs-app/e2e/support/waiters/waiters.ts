export const waitForComplete = async (operation: string, timeout: number): Promise<void> => {
  console.log(`Waiting ${timeout}ms for "${operation}" to complete`);
  await new Promise<void>((resolve) => setTimeout(resolve, timeout));
}
