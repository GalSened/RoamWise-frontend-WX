// Verify search results are displayed
const puppeteer = require('puppeteer');

async function verifyResults() {
    let browser;
    try {
        browser = await puppeteer.launch({ 
            headless: false,
            devtools: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        
        // Grant geolocation permission
        const context = browser.defaultBrowserContext();
        await context.overridePermissions('http://localhost:5173', ['geolocation']);
        await page.setGeolocation({latitude: 32.0853, longitude: 34.7818});
        
        await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
        
        // Wait for search input and type
        await page.waitForSelector('[data-testid="search-input"]');
        await page.type('[data-testid="search-input"]', 'restaurants');
        
        // Click search
        await page.waitForFunction(() => {
            const button = document.querySelector('[data-testid="search-button"]');
            return button && !button.disabled;
        });
        await page.click('[data-testid="search-button"]');
        
        // Wait for API calls to complete
        await new Promise(resolve => setTimeout(resolve, 8000));
        
        // Check what we actually have in the DOM
        const searchResults = await page.$('#searchResults');
        console.log('📄 searchResults element found:', !!searchResults);
        
        const resultsContainer = await page.$('[data-testid="results-container"]');
        console.log('📄 results-container found:', !!resultsContainer);
        
        const resultItems = await page.$$('.result-item');
        console.log('📊 .result-item elements found:', resultItems.length);
        
        const testSelector = await page.$$('[data-testid="results-container"] .result-item');
        console.log('📊 Full test selector matches:', testSelector.length);
        
        // Get the actual HTML content
        const innerHTML = await page.evaluate(() => {
            const container = document.getElementById('searchResults');
            return container ? container.innerHTML.substring(0, 500) + '...' : 'NOT FOUND';
        });
        console.log('📝 Container HTML preview:', innerHTML);
        
        // Check for any visible text content
        const hasRestaurantText = await page.evaluate(() => {
            return document.body.textContent.includes('Café') || 
                   document.body.textContent.includes('Restaurant') ||
                   document.body.textContent.includes('Tel Aviv');
        });
        console.log('🍽️ Has restaurant-related text:', hasRestaurantText);
        
        // Wait to see visually
        console.log('👀 Keeping browser open for 15 seconds for visual inspection...');
        await new Promise(resolve => setTimeout(resolve, 15000));
        
    } catch (error) {
        console.error('💥 Verification failed:', error.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

verifyResults().catch(console.error);