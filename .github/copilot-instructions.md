# POM (Page Object Model) Architecture Guide

## Overview

This project uses a hierarchical Page Object Model pattern with Playwright, organized into base classes, page objects, and component objects.

## Base Classes

### BasePage

**Location:** pages/BasePage.ts

- **Purpose:** Encapsulates common Playwright page-level actions
- **Inherits from:** None (but wraps Playwright's `Page` object)
- **Key Methods:**
  - `waitUntilPageIsLoaded()`: Abstract pattern - overridden in each page
  - `navigate(url)`: Navigate to URL
  - `click(selector)`: Click element
  - `fill(selector, value)`: Fill form input
  - `getText(selector)`: Get element text (returns trimmed string)
  - `isVisible(selector)`: Check visibility
  - `waitForElement(selector)`: Wait for element visibility
- **Usage:** All page objects extend BasePage
- **Selector Type:** XPath (e.g., `//button[contains(@aria-label, 'items in cart')]`)

### BaseComponent

**Location:** pages/BaseComponent.ts

- **Purpose:** Encapsulates common interactions for scoped Locator elements
- **Inherits from:** None (but wraps Playwright's `Locator` object)
- **Key Methods:** Same as BasePage (click, fill, getText, isVisible, waitForElement, hover)
- **Additional Methods:**
  - `hover(selector)`: Hover over element
- **Constructor:** Takes a Locator - `constructor(element: Locator)`
- **Key Properties:**
  - `this.element` - root locator scoped for all interactions
  - `this.page` - extracted via `element.page()`
- **Usage:** Component classes extend BaseComponent when scoped to specific DOM subtree
- **Scoping:** All method queries use `this.element.locator(selector)` not `this.page.locator(selector)`

## Page Objects (Extend BasePage)

### Structure

```typescript
export default class [PageName] extends BasePage {
  async waitUntilPageIsLoaded() {
    // Wait for a unique page-specific element
    await this.waitForElement("//h2[contains(., 'Page Title')]");
  }

  async pageAction(): Promise<ReturnType> {
    // Direct page interactions
  }

  getComponentName(): ComponentClass {
    // Return component objects instantiated with scoped locators
    return new ComponentClass(
      this.page.locator("//div[contains(@class, 'component')]")
    );
  }
}
```

### Examples

- **HomePage** - extends BasePage
  - `waitUntilPageIsLoaded()` - waits for "Trending Products" heading
  - `getTrendingProductsTable()` - returns ProductsTable component
  - `getNewArrivalsProductsTable()` - returns ProductsTable component
  - `openCart()` - returns CartComponent

- **CartPage** - extends BasePage
  - `waitUntilPageIsLoaded()` - waits for Cart heading
  - `getCartItemsTable()` - returns CartItemsTable component
  - `getSubtotal()` - returns numeric price
  - `getTotal()` - returns numeric price

- **LoginPage** - extends BasePage
  - Page-specific inputs: `inputUsername()`, `inputPassword()`
  - `clickLoginButton()` - returns MyAccountPage

## Component Objects (Extend BaseComponent)

### Structure

```typescript
export class [ComponentName] extends BaseComponent {
  constructor(element: Locator) {
    super(element);
  }

  async someMethod(): Promise<ReturnType> {
    // Uses this.element.locator() for scoped queries
  }

  async getCollectionItems(): Promise<ItemClass[]> {
    // Common pattern: return arrays of domain objects
    const items = this.element.locator("//li");
    const allItems = await items.all();
    return allItems.map((item) => new ItemClass(item));
  }
}
```

### Key Characteristics

- **Scoped Locators:** All selectors are relative to `this.element`
- **Returned as Objects:** Components expose collections as arrays (e.g., `getCurrentProducts()` returns Product[])
- **Nested Interactions:** Components can return other components or pages
- **Extraction Pattern:** First wait for element, then get all, then map to objects

### Examples

- **ProductsTable** extends BaseComponent
  - `getCurrentProducts()` - returns Product[]
- **Product** extends BaseComponent
  - `getTitle()`, `getPrice()` - get product data
  - `addToCart()` - action method
  - `isAddedToCart()` - boolean assertion helper
  - `clickViewCart()` - returns CartPage
  - `isProductPurchsable()` - visibility check

- **CartItemsTable** extends BaseComponent
  - `getCartItems()` - returns CartItem[]

- **CartItem** extends BaseComponent
  - `getTitle()`, `getPrice()`, `getQuantity()`, `getTotal()` - getters
  - `increaseQuantity()`, `decreaseQuantity()`, `removeItem()` - actions

## Fixtures

**Location:** fixtures/auth.ts

```typescript
type AuthFixtures = {
  page: Page;
  user: { username: string; password: string };
};

export const test = base.extend<AuthFixtures>({
  page: async ({ page }, use) => {
    await login(page); // Pre-login before each test
    await use(page);
  },
  user: async ({}, use) => {
    const userData = { username: "students", password: "Default1!" };
    await use(userData);
  },
});
```

- **Custom `test` fixture:** Provides logged-in `page` and `user` data
- **Import in tests:** `import { test } from "fixtures/auth";`
- **Use instead of:** `import { test } from "@playwright/test";`
- **Pre-login behavior:** Every test automatically logs in before running
- **User fixture:** Provides test credentials as `{ username, password }` object

## Navigation Actions

**Location:** actions/navigation.ts

Exports helper functions that navigate and return page objects:

```typescript
const goToHomePage = async (page: Page): Promise<HomePage> => {
  await page.click("//div[@id='modal-2-content']//span[contains(., 'Shop')]");
  return new HomePage(page);
};
```

**Available Functions:**

- `goToHomePage(page)` → HomePage
- `goToCartPage(page)` → CartPage
- `goToLoginPage(page)` → LoginPage
- `goToMyAccountPage(page)` → MyAccountPage
- `goToStartPage(page)` → void (just navigates)

## Test Pattern

```typescript
import HomePage from "@pages/home/HomePage";
import { expect } from "@playwright/test";
import { goToHomePage } from "actions/navigation";
import { test } from "fixtures/auth";

test.describe("Feature", { tag: ["@smoke"] }, () => {
  test("should do something", async ({ page }) => {
    // 1. Navigate to page (returns page object)
    const homePage = await goToHomePage(page);

    // 2. Wait for page to load
    await homePage.waitUntilPageIsLoaded();

    // 3. Get component from page
    const productsTable = homePage.getTrendingProductsTable();

    // 4. Get data from component
    const products = await productsTable.getCurrentProducts();

    // 5. Interact with nested components
    const product = products[0];
    await product.addToCart();

    // 6. Get related page or component
    const cartPage = await product.clickViewCart();
    await cartPage.waitUntilPageIsLoaded();

    // 7. Assert
    expect(await cartPage.getTotal()).toBeGreaterThan(0);
  });

  test.afterEach(async ({ page }) => {
    // Cleanup in afterEach hooks
    const cartPage = await goToCartPage(page);
    await cartPage.waitUntilPageIsLoaded();
    const items = await cartPage.getCartItemsTable().getCartItems();
    for (const item of items) {
      await item.removeItem();
    }
  });
});
```

## Key Principles

1. **Hierarchical Structure:** BasePage → Page Objects; BaseComponent → Component Objects
2. **Wait for Load:** Always call `waitUntilPageIsLoaded()` immediately after navigation
3. **Component Getters:** Pages expose components via getter methods (NOT async)
4. **Component Collections:** Components return arrays of domain objects (Product[], CartItem[])
5. **XPath Selectors:** All selectors use XPath notation (`//`, `[@attr]`, `[contains()]`)
6. **Scoped Locators:** BaseComponent uses `this.element.locator()` to scope queries
7. **Return Types:**
   - Methods that navigate → return page objects (CartPage, LoginPage)
   - Methods that click elements → return components or pages
   - Getter methods → return primitives or object arrays
8. **Fixtures Over Direct:** Tests use `test` from fixtures/auth for logged-in sessions
9. **Extraction Pattern:** For collections, wait for first item, get all, then map to objects
10. **Error Handling:** Use try/catch for optional operations (e.g., parseNumeric might return null)

## Adding New Page Objects

1. Create file in `pages/[feature]/[PageName].ts`
2. Import BasePage from `@pages/BasePage`
3. Extend BasePage and implement `async waitUntilPageIsLoaded()`
4. Add page-specific methods (actions return void or other pages; getters return primitives or components)
5. Use getter methods to expose component objects
6. Import and use in tests via navigation actions

## Adding New Component Objects

1. Define class extending BaseComponent in appropriate file or create new file
2. Constructor takes `element: Locator` → call `super(element)`
3. Implement component-specific methods using `this.element.locator()` for all queries
4. For collection methods:
   - Find all items: `const items = this.element.locator("//selector")`
   - Wait for visibility: `await items.first().waitFor({ state: "visible" })`
   - Get all: `const allItems = await items.all()`
   - Map to objects: `return allItems.map((item) => new ItemClass(item))`
5. Export component class so it can be used in pages or tests

## URL Model (models/Arguments.ts)

All tests reference `BASE_URL` from the arguments model:

```typescript
import { BASE_URL } from "models/Arguments";
```

Navigation actions use this constant to ensure consistent URL handling across tests.

## Utility Functions

- **parseNumeric(text: string)** - Extracts numeric value from price strings
- **login(page: Page)** - Logs in the test user (called automatically by auth fixture)

Use these for consistent data transformation across components.
