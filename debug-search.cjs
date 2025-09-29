// Debug search functionality with console logging
const puppeteer = require('puppeteer');

async function debugSearch() {
    let browser;
    try {
        browser = await puppeteer.launch({ 
            headless: false,
            devtools: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        
        // Listen to console events
        page.on('console', msg => {
            console.log(`🔍 BROWSER: ${msg.type()}: ${msg.text()}`);
        });
        
        page.on('pageerror', error => {
            console.log(`💥 PAGE ERROR: ${error.message}`);
        });
        
        page.on('requestfailed', request => {
            console.log(`❌ REQUEST FAILED: ${request.url()} - ${request.failure()?.errorText}`);
        });
        
        page.on('response', response => {
            if (response.url().includes('/think') || response.url().includes('/places')) {
                console.log(`📡 API RESPONSE: ${response.url()} - ${response.status()}`);
            }
        });
        
        // Navigate to the app
        console.log('🚀 Navigating to app...');
        await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
        
        // Grant geolocation permission to avoid location issues
        const context = browser.defaultBrowserContext();
        await context.overridePermissions('http://localhost:5173', ['geolocation']);
        
        // Set a mock location
        await page.setGeolocation({latitude: 32.0853, longitude: 34.7818});
        
        // Wait for search input to be available
        console.log('🔍 Waiting for search input...');
        await page.waitForSelector('[data-testid="search-input"]', { timeout: 10000 });
        
        // Type in search input
        console.log('⌨️ Typing search query...');
        await page.type('[data-testid="search-input"]', 'restaurants');
        
        // Wait for button to be enabled
        await page.waitForFunction(() => {
            const button = document.querySelector('[data-testid="search-button"]');
            return button && !button.disabled;
        });
        
        // Click search
        console.log('🔎 Clicking search button...');
        await page.click('[data-testid="search-button"]');
        
        // Wait longer to see what happens
        console.log('⏳ Waiting to see what happens...');
        await page.waitForTimeout(15000);
        
        // Check final state
        const hasResults = await page.$('[data-testid="results-container"] .result-item');
        const hasError = await page.$('[data-testid="error-message"]');
        const isEmpty = await page.$('[data-testid="empty-state"]');
        
        console.log('📊 Final state:');
        console.log(`   Results: ${hasResults ? 'YES' : 'NO'}`);
        console.log(`   Error: ${hasError ? 'YES' : 'NO'}`);
        console.log(`   Empty: ${isEmpty ? 'YES' : 'NO'}`);
        
        if (hasError) {
            const errorText = await page.$eval('[data-testid="error-message"]', el => el.textContent);
            console.log(`   Error text: "${errorText}"`);
        }
        
    } catch (error) {
        console.error('💥 Debug failed:', error.message);
    } finally {
        if (browser) {
            // Keep browser open for manual inspection
            console.log('🔍 Browser kept open for manual inspection...');
            await new Promise(resolve => setTimeout(resolve, 30000));
            await browser.close();
        }
    }
}

debugSearch().catch(console.error);