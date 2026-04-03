# Page Object Model (POM) Implementation Guide

## Overview

This project uses Playwright with the Page Object Model pattern to organize UI interactions and test logic. Follow these guidelines consistently when creating or modifying page objects, components, and tests.

---

## Base Classes

### BasePage

- **Purpose**: Encapsulates common Playwright page actions
- **Inheritance**: Used for full page objects (e.g., `HomePage`, `LoginPage`, `CartPage`)
- **Constructor**: Takes a `Page` object
- **Location**: `pages/BasePage.ts`

**Common Methods**:

- `waitUntilPageIsLoaded()` - Wait for page-specific elements
- `navigate(url)` - Navigate to a URL
- `click(selector)` - Click an element
- `fill(selector, value)` - Fill a form field
- `getText(selector)` - Get trimmed inner text
- `isVisible(selector)` - Check if element is visible
- `waitForElement(selector)` - Wait for element visibility

### BaseComponent

- **Purpose**: Encapsulates interactions on a scoped `Locator`
- **Inheritance**: Used for components and sub-elements (e.g., `ProductsTable`, `Product`, `CartComponent`)
- **Constructor**: Takes a `Locator` object; automatically extracts `page` via `locator.page()`
- **Location**: `pages/BaseComponent.ts`

**Common Methods** (inherits from BasePage pattern):

- `click(selector)` - Click within the scoped element
- `fill(selector, value)` - Fill a form field within the scoped element
- `getText(selector)` - Get trimmed inner text within the scoped element
- `hover(selector)` - Hover over an element within the scoped element
- `isVisible(selector)` - Check visibility within the scoped element
- `waitForElement(selector, timeout?)` - Wait for element within the scoped element (default 10s timeout)

---

## Page Object Architecture

### Page Objects (Extend BasePage)

1. **Location**: `pages/{page-name}/{PageName}.ts`

2. **Structure**:

   ```typescript
   import BasePage from "@pages/BasePage";

   /**
    * {Description} Page
    * URL: /{path}
    */
   export default class {PageName}Page extends BasePage {
     async waitUntilPageIsLoaded() {
       // Wait for distinctive page elements
       await this.waitForElement("//selector");
     }

     async someAction(): Promise<ReturnType> {
       // Implement action
     }
   }
   ```

3. **Requirements**:
   - Always implement `waitUntilPageIsLoaded()` for page-specific wait logic
   - Use XPath selectors as the primary selector strategy
   - Return other page objects or components when actions lead to navigation
   - Include JSDoc comment with page title and URL
   - Page selectors scoped to the full page via `this.page.locator(selector)`

### Component Objects (Extend BaseComponent)

1. **Location**: `pages/{component-name}/` or inline in page folder (e.g., `pages/home/ProductsTable.ts`)

2. **Structure**:

   ```typescript
   import BaseComponent from "@pages/BaseComponent";

   /**
    * {ComponentName}
    *
    * Brief description of component purpose
    */
   export class {ComponentName} extends BaseComponent {
     async someMethod(): Promise<ReturnType> {
       // Selectors scoped to this.element
       await this.click("//selector");
     }
   }
   ```

3. **Requirements**:
   - Use `this.element.locator(selector)` internally (methods handle this automatically)
   - All selectors are relative to the scoped element
   - Can return other components or page objects
   - Use XPath as primary selector strategy
   - Include JSDoc with brief component description

### Nested/Extracted Components

- Extract complex components (e.g., `Product` from `ProductsTable`) as separate classes
- Maintain hierarchy: components can be children of other components
- Example: `Product extends BaseComponent` with methods like `getTitle()`, `getPrice()`, `addToCart()`

---

## Selector Strategy

1. **Primary Strategy**: XPath selectors (more robust for dynamic content)
2. **Format**: Use `//` for XPath (e.g., `"//button[contains(@aria-label, 'Add to cart')]"`)
3. **Attribute Matching**: Prefer `contains()` for partial matches and `normalize-space()` for whitespace
4. **Avoid**: Brittle CSS classes, index-based selectors, or long selector chains

---

## Navigation Patterns

### Navigation Actions

- **Location**: `actions/navigation.ts`
- **Pattern**: Functions that take a `Page` and return a page object
- **Example**:
  ```typescript
  const goToHomePage = async (page: Page): Promise<HomePage> => {
    await page.click("//selector");
    return new HomePage(page);
  };
  ```

### Returning Page Objects from Actions

- When an action triggers navigation, return the new page object
- Example: `Product.clickViewCart()` returns `CartPage`
- Example: `HomePage.openCart()` returns `CartComponent`

---

## Test File Guidelines

1. **Location**: `tests/{feature}/{test-name}.spec.ts`
2. **Fixture Usage**: Import custom fixtures from `fixtures/auth` for logged-in page context
3. **Actions**: Use navigation actions from `actions/navigation.ts`
4. **Structure**:

   ```typescript
   import { test } from "fixtures/auth";
   import { goToHomePage } from "actions/navigation";
   import { expect } from "@playwright/test";

   test("Test description", { tag: ["@regression"] }, async ({ page }) => {
     // Navigate using action
     const homePage = await goToHomePage(page);
     await homePage.waitUntilPageIsLoaded();

     // Interact with page objects/components
     const component = homePage.getComponent();
     const result = await component.someMethod();

     // Assert
     expect(result).toBeTruthy();
   });
   ```

5. **Best Practices**:
   - Always call `waitUntilPageIsLoaded()` after navigating
   - Use page/component methods instead of direct Playwright calls in tests
   - Maintain test isolation (cleanup after each test via `test.afterEach()`)
   - Keep tests focused on user workflows

---

## Fixtures and Utilities

### Custom Fixtures

- **Location**: `fixtures/auth.ts`
- **Purpose**: Provide pre-configured context (e.g., logged-in page)
- **Usage**: Import custom test as `import { test } from "fixtures/auth"`

### Helper Functions

- **Location**: `utilities/`
- **Purpose**: Reusable non-POM functions (e.g., `login()`, `parseNumeric()`)
- **Usage**: Import and call in page object methods as needed

---

## Key Implementation Principles

1. **Encapsulation**: Hide Playwright details behind page object methods
2. **Reusability**: Common operations in base classes, specific implementations in page/component objects
3. **Navigation Returns**: Methods that navigate should return the resulting page object
4. **Scoped Selectors**: Use `this.element` for components, `this.page` for pages
5. **Wait Strategies**: Always wait for page load before asserting; use `waitUntilPageIsLoaded()`
6. **No Direct Playwright in Tests**: Tests should only interact via page object methods
7. **Readable Assertions**: Use page object methods to get data, then assert in tests

---

## Example: Complete Flow

```typescript
// Test
const homePage = await goToHomePage(page);
await homePage.waitUntilPageIsLoaded();
const productsTable = homePage.getTrendingProductsTable();
const products = await productsTable.getCurrentProducts();
const product = products[0];
await product.addToCart();

// Page Structure:
// HomePage extends BasePage
//   ├─ getTrendingProductsTable() returns ProductsTable
//   └─ ProductsTable extends BaseComponent
//      ├─ getCurrentProducts() returns Product[]
//      └─ Product extends BaseComponent
//         ├─ getTitle(), getPrice(), addToCart()
//         └─ clickViewCart() returns CartPage
```
