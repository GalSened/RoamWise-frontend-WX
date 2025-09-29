// Fixed Maps Test - handles location permission denial
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    permissions: [], // Deny location permission to test fallback
  });
  const page = await context.newPage();
  
  console.log('🚀 Testing RoamWise Maps Integration (Location Denied)...');
  
  // Navigate to the app
  await page.goto('https://roamwise-frontend-971999716773.us-central1.run.app');
  await page.waitForTimeout(3000); // Wait for initialization
  
  // Check if search input is ready
  const searchInput = page.locator('input[data-testid="search-input"]');
  await searchInput.waitFor({ state: 'visible', timeout: 10000 });
  
  // Type in search input
  await searchInput.fill('restaurants in tel aviv');
  
  console.log('🔍 Submitting search with location fallback...');
  
  // Click search button
  const searchButton = page.locator('[data-testid="search-button"]');
  await searchButton.click();
  
  // Wait for results with longer timeout
  try {
    await page.waitForSelector('[data-testid="results-container"]', { 
      state: 'visible',
      timeout: 20000 
    });
    console.log('✅ Search results appeared!');
    
    // Check for individual result items
    const results = page.locator('.result-item');
    const resultCount = await results.count();
    console.log(`📊 Found ${resultCount} search results`);
    
    // Check for map container
    const mapContainer = page.locator('#resultsMapContainer');
    if (await mapContainer.isVisible()) {
      console.log('✅ Maps container is visible!');
      
      // Check if map has markers
      const markers = page.locator('.gm-style-pbt'); // Google Maps markers
      const markerCount = await markers.count();
      console.log(`📍 Found ${markerCount} map markers`);
    } else {
      console.log('❌ Maps container not visible');
    }
    
    // Take success screenshot
    await page.screenshot({ path: 'test-success.png', fullPage: true });
    console.log('📸 Success screenshot saved as test-success.png');
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
    
    // Check for error messages
    const errorMessages = await page.locator('.error-message, .notification').allTextContents();
    if (errorMessages.length > 0) {
      console.log('⚠️ Error messages found:', errorMessages);
    }
    
    await page.screenshot({ path: 'test-failed.png', fullPage: true });
    console.log('📸 Failure screenshot saved as test-failed.png');
  }
  
  await browser.close();
})();