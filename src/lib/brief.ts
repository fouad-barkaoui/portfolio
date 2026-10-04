/** Opens the "Start a project" brief from anywhere on the page. */
export function openBrief(): void {
  window.dispatchEvent(new Event('fb:brief'));
}
