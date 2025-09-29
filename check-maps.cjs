// Test Google Maps integration
const puppeteer = require('puppeteer');

async function checkMaps() {
    let browser;
    try {
        browser = await puppeteer.launch({ 
            headless: false,
            devtools: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        
        // Grant permissions
        const context = browser.defaultBrowserContext();
        await context.overridePermissions('https://roamwise-frontend-971999716773.us-central1.run.app', ['geolocation']);
        await page.setGeolocation({latitude: 32.0853, longitude: 34.7818});
        
        // Listen for console messages
        page.on('console', msg => {
            const text = msg.text();
            if (text.includes('Google Maps') || text.includes('Maps API') || text.includes('initMap') || text.includes('🗺️')) {
                console.log(`🗺️ MAPS: ${text}`);
            }
            if (msg.type() === 'error') {
                console.log(`❌ ERROR: ${text}`);
            }
        });
        
        console.log('🔍 TESTING GOOGLE MAPS INTEGRATION');
        
        await page.goto('https://roamwise-frontend-971999716773.us-central1.run.app', { waitUntil: 'networkidle0' });
        
        // Wait for scripts to load
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        console.log('\n🌐 GOOGLE MAPS API STATUS:');
        
        // Check if Google Maps API is loaded
        const mapsLoaded = await page.evaluate(() => {
            return typeof google !== 'undefined' && typeof google.maps !== 'undefined';
        });
        console.log(`   Google Maps API loaded: ${mapsLoaded ? '✅' : '❌'}`);
        
        // Check if initMap function exists
        const initMapExists = await page.evaluate(() => {
            return typeof window.initMap === 'function';
        });
        console.log(`   initMap function exists: ${initMapExists ? '✅' : '❌'}`);
        
        // Check for map-related DOM elements
        const mapContainers = await page.$$eval('[class*="map"], [id*="map"]', elements => elements.length);
        console.log(`   Map containers in DOM: ${mapContainers} ${mapContainers > 0 ? '✅' : '❌'}`);
        
        // Check for actual Google Maps elements (created when maps are rendered)
        const googleMapElements = await page.evaluate(() => {
            const gmElements = document.querySelectorAll('[class*="gm-"], .gmnoprint, [class*="google-map"]');
            return gmElements.length;
        });
        console.log(`   Active Google Maps elements: ${googleMapElements} ${googleMapElements > 0 ? '✅' : '❌'}`);
        
        // Try to trigger a search to see if maps appear
        console.log('\n🔍 TESTING MAP ACTIVATION:');
        
        const searchInput = await page.$('[data-testid="search-input"]');
        if (searchInput) {
            console.log('   Performing search to trigger map...');
            await page.type('[data-testid="search-input"]', 'restaurants');
            await page.click('[data-testid="search-button"]');
            
            // Wait for results and potential map loading
            await new Promise(resolve => setTimeout(resolve, 8000));
            
            // Re-check for Google Maps elements after search
            const mapsAfterSearch = await page.evaluate(() => {
                const gmElements = document.querySelectorAll('[class*="gm-"], .gmnoprint, [class*="google-map"]');
                return gmElements.length;
            });
            console.log(`   Google Maps elements after search: ${mapsAfterSearch} ${mapsAfterSearch > 0 ? '✅' : '❌'}`);
            
            // Check if any visible map areas exist
            const visibleMapAreas = await page.evaluate(() => {
                const containers = document.querySelectorAll('[class*="map-container"], [id*="map"]');
                let visibleCount = 0;
                containers.forEach(container => {
                    const rect = container.getBoundingClientRect();
                    if (rect.width > 0 && rect.height > 0) {
                        visibleCount++;
                    }
                });
                return visibleCount;
            });
            console.log(`   Visible map areas: ${visibleMapAreas} ${visibleMapAreas > 0 ? '✅' : '❌'}`);
        }
        
        console.log('\n🎯 MAPS INTEGRATION SUMMARY:');
        if (mapsLoaded && initMapExists) {
            console.log('   ✅ Google Maps API is properly integrated');
        } else {
            console.log('   ❌ Google Maps API integration has issues');
        }
        
        // Keep browser open for visual inspection
        console.log('\n👀 Keeping browser open for 15 seconds for visual inspection...');
        await new Promise(resolve => setTimeout(resolve, 15000));
        
    } catch (error) {
        console.error('💥 Maps test failed:', error.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

checkMaps().catch(console.error);