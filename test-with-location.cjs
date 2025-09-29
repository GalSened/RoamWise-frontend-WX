// Maps Test with Location Permission
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    permissions: ['geolocation'], // Grant location permission
    geolocation: { latitude: 32.0853, longitude: 34.7818 } // Tel Aviv coordinates
  });
  const page = await context.newPage();
  
  console.log('🚀 Testing RoamWise with Location Enabled...');
  
  // Navigate to the app
  await page.goto('https://roamwise-frontend-971999716773.us-central1.run.app');
  console.log('📍 Waiting for app to initialize with location...');
  await page.waitForTimeout(5000); // Wait for weather and location to load
  
  // Check if weather loaded successfully
  const weatherSection = page.locator('[data-testid="weather-section"]');
  if (await weatherSection.isVisible()) {
    console.log('✅ Weather section loaded successfully!');
  }
  
  // Check if search input is ready
  const searchInput = page.locator('input[data-testid="search-input"]');
  await searchInput.waitFor({ state: 'visible', timeout: 10000 });
  
  // Type in search input
  await searchInput.fill('restaurants near me');
  console.log('🔍 Searching for "restaurants near me"...');
  
  // Click search button
  const searchButton = page.locator('[data-testid="search-button"]');
  await searchButton.click();
  
  // Wait for results with longer timeout
  try {
    await page.waitForSelector('[data-testid="results-container"]', { 
      state: 'visible',
      timeout: 25000 
    });
    console.log('✅ Search results appeared!');
    
    // Check for individual result items
    const results = page.locator('.result-item');
    const resultCount = await results.count();
    console.log(`📊 Found ${resultCount} search results`);
    
    if (resultCount > 0) {
      // Check first result details
      const firstResult = results.first();
      const resultText = await firstResult.textContent();
      console.log(`🏪 First result: ${resultText?.substring(0, 100)}...`);
    }
    
    // Wait a bit for map to potentially load
    await page.waitForTimeout(3000);
    
    // Check for map container
    const mapContainer = page.locator('#resultsMapContainer');
    const mapVisible = await mapContainer.isVisible();
    console.log(`🗺️ Maps container visible: ${mapVisible}`);
    
    if (mapVisible) {
      // Check if Google Maps is actually loaded
      const mapElement = page.locator('#resultsMap');
      const mapLoaded = await mapElement.isVisible();
      console.log(`📍 Google Maps element loaded: ${mapLoaded}`);
      
      // Look for Google Maps specific elements
      const googleMapsElements = await page.locator('.gm-style').count();
      console.log(`🎯 Found ${googleMapsElements} Google Maps elements`);
    }
    
    // Take success screenshot
    await page.screenshot({ path: 'test-location-success.png', fullPage: true });
    console.log('📸 Success screenshot saved!');
    
  } catch (error) {
    console.log('❌ Search failed:', error.message);
    await page.screenshot({ path: 'test-location-failed.png', fullPage: true });
  }
  
  // Keep browser open for 10 seconds to see results
  console.log('🔍 Keeping browser open to observe results...');
  await page.waitForTimeout(10000);
  
  await browser.close();
})();