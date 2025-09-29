// Simple Maps Test
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('🚀 Testing RoamWise Maps Integration...');
  
  // Navigate to the app
  await page.goto('https://roamwise-frontend-971999716773.us-central1.run.app');
  await page.waitForTimeout(2000);
  
  // Wait for location permission popup and handle it
  page.on('dialog', dialog => dialog.accept());
  
  // Type in search input
  const searchInput = page.locator('input[data-testid="search-input"]');
  await searchInput.fill('restaurants in tel aviv');
  
  // Click search button
  const searchButton = page.locator('[data-testid="search-button"]');
  await searchButton.click();
  
  console.log('🔍 Search submitted, waiting for results...');
  
  // Wait for results
  try {
    await page.waitForSelector('[data-testid="results-container"]', { 
      state: 'visible',
      timeout: 15000 
    });
    console.log('✅ Search results appeared!');
    
    // Check for map container
    const mapContainer = page.locator('[data-testid="results-map"]');
    if (await mapContainer.isVisible()) {
      console.log('✅ Maps container is visible!');
    } else {
      console.log('❌ Maps container not visible');
    }
    
    // Take screenshot
    await page.screenshot({ path: 'test-results.png', fullPage: true });
    console.log('📸 Screenshot saved as test-results.png');
    
  } catch (error) {
    console.log('❌ Search results did not appear:', error.message);
    await page.screenshot({ path: 'test-error.png', fullPage: true });
  }
  
  await browser.close();
})();