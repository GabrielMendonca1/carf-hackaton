import type { Page } from "@playwright/test";
import { expect } from "../fixtures";

export class AuthPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async gotoLogin() {
    await this.page.goto("/login");
    await expect(this.page.getByTestId("login-heading")).toContainText("Acesse sua conta");
  }

  async gotoRegister() {
    await this.page.goto("/register");
    await expect(this.page.getByTestId("onboarding-heading")).toContainText(
      "Personalize"
    );
  }

  async register(email: string, password: string) {
    await this.gotoRegister();

    await this.page.getByLabel("Nome completo").fill("Test Usuário");
    await this.page.getByLabel("Empresa ou equipe").fill("Equipe QA");
    await this.page
      .getByLabel("Objetivo principal")
      .fill("Validar fluxos e garantir qualidade.");

    const continueButton = this.page.getByTestId("onboarding-continue");
    await expect(continueButton).toBeVisible();
    await continueButton.click();
    await this.page.waitForURL("/register/create");
    await expect(this.page.getByRole("heading")).toContainText("Criar conta");

    await this.page.getByPlaceholder("voce@empresa.com").click();
    await this.page.getByPlaceholder("voce@empresa.com").fill(email);
    await this.page.getByLabel("Senha").click();
    await this.page.getByLabel("Senha").fill(password);
    await this.page.getByRole("button", { name: "Criar conta" }).click();
  }

  async login(email: string, password: string) {
    await this.gotoLogin();
    await this.page.getByPlaceholder("voce@empresa.com").click();
    await this.page.getByPlaceholder("voce@empresa.com").fill(email);
    await this.page.getByLabel("Senha").click();
    await this.page.getByLabel("Senha").fill(password);
    await this.page.getByRole("button", { name: "Entrar" }).click();
  }

  async logout(email: string, password: string) {
    await this.login(email, password);
    await this.page.waitForURL("/");

    await this.openSidebar();

    const userNavButton = this.page.getByTestId("user-nav-button");
    await expect(userNavButton).toBeVisible();

    await userNavButton.click();
    const userNavMenu = this.page.getByTestId("user-nav-menu");
    await expect(userNavMenu).toBeVisible();

    const authMenuItem = this.page.getByTestId("user-nav-item-auth");
    await expect(authMenuItem).toContainText("Sair");

    await authMenuItem.click();
    await this.page.waitForURL(/\/login/);
    await expect(this.page.getByRole("heading")).toContainText("Entrar");
  }

  async expectToastToContain(text: string) {
    await expect(this.page.getByTestId("toast")).toContainText(text);
  }

  async openSidebar() {
    const sidebarToggleButton = this.page.getByTestId("sidebar-toggle-button");
    await sidebarToggleButton.click();
  }
}
