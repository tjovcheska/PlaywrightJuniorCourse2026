import { expect, Locator, Page } from "@playwright/test";

export class LoginPage {
    private page: Page;
    private usernameInput: Locator;
    private passwordInput: Locator;
    private loginButton: Locator;
    private errorIcon: Locator;
    private errorMessage: Locator;
    private errorMessageText: Locator;
    private closeErrorButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameInput = this.page.locator("#user-name");
        this.passwordInput = this.page.locator("#password");
        this.loginButton = this.page.getByTestId('login-button');
        this.errorIcon = this.page.locator('.error_icon');
        this.errorMessage = this.page.locator('.error-message-container');
        this.errorMessageText = this.page.getByTestId('error');
        this.closeErrorButton = this.page.getByTestId('error-button');
    }

    async fillLoginForm(username: string, password: string) {
        await this.usernameInput.fill(username)
        await this.passwordInput.fill(password)
    }

    async clickLoginButton() {
        await this.loginButton.click()
    }

    async validateErrorIconsAttached(isAttached = true) {
        if (isAttached) {
            await expect(this.errorIcon).toBeAttached() 
        } else {
            await expect(this.errorIcon).not.toBeAttached()
        }
    }

    async validateErrorMessageAttached() {
        await expect(this.errorMessage).toBeAttached()
    }

    async validateErrorMessageText(errorMessage: string) {
        await expect(this.errorMessageText).toHaveText(errorMessage)
    }

    async validateErrorIconsNthAttached(nth: number, isAttached = true) {
        if (isAttached) {
            await expect(this.errorIcon.nth(nth)).toBeAttached() 
        } else {
            await expect(this.errorIcon.nth(nth)).not.toBeAttached()
        }
    }

    async clickCloseErrorButton() {
        await this.closeErrorButton.click();
    }

    async validateErrorIconsVisible(isVisible = true) {
        if (isVisible) {
            await expect(this.errorIcon).toBeVisible() 
        } else {
            await expect(this.errorIcon).not.toBeVisible()
        }
    }
}
