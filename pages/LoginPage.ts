import test, { expect, Locator, Page } from "@playwright/test"

export class LoginPage {
    private page: Page
    private usernameInput: Locator
    private passwordInput: Locator
    private loginButton: Locator
    private errorIcon: Locator
    private errorMessage: Locator
    private errorMessageText: Locator
    private closeErrorButton: Locator

    constructor(page: Page) {
        this.page = page
        this.usernameInput = this.page.locator("#user-name")
        this.passwordInput = this.page.locator("#password")
        this.loginButton = this.page.getByTestId('login-button')
        this.errorIcon = this.page.locator('.error_icon')
        this.errorMessage = this.page.locator('.error-message-container')
        this.errorMessageText = this.page.getByTestId('error')
        this.closeErrorButton = this.page.getByTestId('error-button')
    }

    async fillLoginForm(username: string, password: string) {
        await test.step(`Fill in login form with ${username} as username and ${password} as password`, async () => {
            await this.usernameInput.fill(username)
            await this.passwordInput.fill(password)
        })
    }

    async clickLoginButton() {
        await test.step('Click Login button', async () => {
            await this.loginButton.click({ timeout: 10000})
        })
    }

    async validateErrorIconsAttached(isAttached = true) {
        await test.step(`Validate if error icons are attached`, async () => {
            if (isAttached) {
                await expect(this.errorIcon).toBeAttached() 
            } else {
                await expect(this.errorIcon).not.toBeAttached()
            }
        })
    }

    async validateErrorMessageAttached() {
        await test.step("Validate if error message is attached", async () => {
            await expect(this.errorMessage).toBeAttached()
        })
    }

    async validateErrorMessageText(errorMessage: string) {
        await test.step("Validate error message text", async () => {
            await expect(this.errorMessageText).toHaveText(errorMessage)
        })
    }

    async validateErrorIconsNthAttached(nth: number, isAttached = true) {
        await test.step("Validate if nth error icon is attached", async () => {
            if (isAttached) {
                await expect(this.errorIcon.nth(nth)).toBeAttached() 
            } else {
                await expect(this.errorIcon.nth(nth)).not.toBeAttached()
            }
        })
    }

    async clickCloseErrorButton() {
       await test.step("Click Close Error button", async () => {
            await this.closeErrorButton.click()
        })
    }

    async validateErrorIconsVisible(isVisible = true) {
        await test.step("Validate if error icons are visible", async () => {
            if (isVisible) {
                await expect(this.errorIcon).toBeVisible() 
            } else {
                await expect(this.errorIcon).not.toBeVisible()
            }
        })
    }

    async assertLoginPageTitle(title: string) {
        await test.step("Assert login page title", async () => {
            await expect(this.page).toHaveTitle(title)
        })
    }
}
