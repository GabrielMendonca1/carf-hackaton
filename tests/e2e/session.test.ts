import { getMessageByErrorCode } from "@/lib/errors";
import { expect, test } from "../fixtures";
import { generateRandomTestUser } from "../helpers";
import { AuthPage } from "../pages/auth";
import { ChatPage } from "../pages/chat";

test.describe
  .serial("Login and Registration", () => {
    let authPage: AuthPage;

    const testUser = generateRandomTestUser();

    test.beforeEach(({ page }) => {
      authPage = new AuthPage(page);
    });

    test("Register new account", async () => {
      await authPage.register(testUser.email, testUser.password);
      await authPage.expectToastToContain("Conta criada com sucesso!");
    });

    test("Register new account with existing email", async () => {
      await authPage.register(testUser.email, testUser.password);
      await authPage.expectToastToContain("Uma conta com este e-mail já existe.");
    });

    test("Log into account that exists", async ({ page }) => {
      await authPage.login(testUser.email, testUser.password);

      await page.waitForURL("/");
      await expect(page.getByPlaceholder("Send a message...")).toBeVisible();
    });

    test("Display user email in user menu", async ({ page }) => {
      await authPage.login(testUser.email, testUser.password);

      await page.waitForURL("/");
      await expect(page.getByPlaceholder("Send a message...")).toBeVisible();

      const userEmail = await page.getByTestId("user-email");
      await expect(userEmail).toHaveText(testUser.email);
    });

    test("Log out", async () => {
      await authPage.logout(testUser.email, testUser.password);
    });

    test("Log out is available for authenticated users", async ({ page }) => {
      await authPage.login(testUser.email, testUser.password);
      await page.waitForURL("/");

      authPage.openSidebar();

      const userNavButton = page.getByTestId("user-nav-button");
      await expect(userNavButton).toBeVisible();

      await userNavButton.click();
      const userNavMenu = page.getByTestId("user-nav-menu");
      await expect(userNavMenu).toBeVisible();

      const authMenuItem = page.getByTestId("user-nav-item-auth");
      await expect(authMenuItem).toContainText("Sair");
    });

    test("Redirect away from /register when authenticated", async ({
      page,
    }) => {
      await authPage.login(testUser.email, testUser.password);
      await page.waitForURL("/");

      await page.goto("/register");
      await expect(page).toHaveURL("/");
    });

    test("Redirect away from /login when authenticated", async ({ page }) => {
      await authPage.login(testUser.email, testUser.password);
      await page.waitForURL("/");

      await page.goto("/login");
      await expect(page).toHaveURL("/");
    });
  });

test.describe("Entitlements", () => {
  let chatPage: ChatPage;

  test.beforeEach(({ page }) => {
    chatPage = new ChatPage(page);
  });

  test("Authenticated user cannot send more than 100 messages/day", async () => {
    test.fixme();
    await chatPage.createNewChat();

    for (let i = 0; i <= 100; i++) {
      await chatPage.sendUserMessage("Why is the sky blue?");
      await chatPage.isGenerationComplete();
    }

    await chatPage.sendUserMessage("Why is the sky blue?");
    await chatPage.expectToastToContain(
      getMessageByErrorCode("rate_limit:chat")
    );
  });
});
