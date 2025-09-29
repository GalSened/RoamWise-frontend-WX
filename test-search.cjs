// Simple search functionality test
const puppeteer = require('puppeteer');

async function testSearch() {
    let browser;
    try {
        browser = await puppeteer.launch({ 
            headless: false,
            devtools: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        
        // Navigate to the app
        console.log('🚀 Navigating to app...');
        await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
        
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
        
        // Wait for either results or error
        console.log('⏳ Waiting for results...');
        await Promise.race([
            page.waitForSelector('[data-testid="results-container"] .result-item', { timeout: 10000 }),
            page.waitForSelector('[data-testid="error-message"]', { timeout: 10000 }),
            page.waitForSelector('[data-testid="empty-state"]', { timeout: 10000 })
        ]);
        
        // Check what we got
        const hasResults = await page.$('[data-testid="results-container"] .result-item');
        const hasError = await page.$('[data-testid="error-message"]');
        const isEmpty = await page.$('[data-testid="empty-state"]');
        
        if (hasResults) {
            console.log('✅ SUCCESS: Search returned results!');
            const resultCount = await page.$$eval('[data-testid="results-container"] .result-item', els => els.length);
            console.log(`📊 Found ${resultCount} results`);
        } else if (hasError) {
            const errorText = await page.$eval('[data-testid="error-message"]', el => el.textContent);
            console.log('❌ ERROR:', errorText);
        } else if (isEmpty) {
            console.log('🔍 Empty state shown');
        } else {
            console.log('⚠️ Unknown state - checking console logs');
        }
        
        // Get console logs
        const logs = await page.evaluate(() => {
            return window.console._logs || [];
        });
        if (logs.length > 0) {
            console.log('🔧 Console logs:', logs);
        }
        
        // Wait a bit to see the results
        await page.waitForTimeout(3000);
        
    } catch (error) {
        console.error('💥 Test failed:', error.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

testSearch().catch(console.error);