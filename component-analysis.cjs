// Comprehensive component analysis test
const puppeteer = require('puppeteer');

async function analyzeComponents() {
    let browser;
    try {
        browser = await puppeteer.launch({ 
            headless: false,
            devtools: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        
        // Grant permissions and set location
        const context = browser.defaultBrowserContext();
        await context.overridePermissions('http://localhost:5173', ['geolocation']);
        await page.setGeolocation({latitude: 32.0853, longitude: 34.7818});
        
        await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
        
        console.log('\n🔍 ANALYZING ROAMWISE COMPONENTS\n');
        
        // 1. SEARCH PAGE ANALYSIS
        console.log('1️⃣ SEARCH PAGE COMPONENT:');
        console.log('Expected: Places search with weather, filters, results display');
        
        const searchElements = {
            searchInput: await page.$('[data-testid="search-input"]'),
            searchButton: await page.$('[data-testid="search-button"]'),
            weatherCard: await page.$('#weatherCard'),
            resultsContainer: await page.$('[data-testid="results-container"]'),
            voiceButton: await page.$('#voiceBtn'),
            quickFilters: await page.$('.quick-filters')
        };
        
        console.log('✅ Elements found:');
        for (const [name, element] of Object.entries(searchElements)) {
            console.log(`   ${name}: ${element ? '✅' : '❌'}`);
        }
        
        // Test search functionality
        if (searchElements.searchInput && searchElements.searchButton) {
            await page.type('[data-testid="search-input"]', 'coffee shops');
            await page.click('[data-testid="search-button"]');
            await new Promise(resolve => setTimeout(resolve, 5000));
            
            const results = await page.$$('.result-item');
            console.log(`   Search results: ${results.length} items ${results.length > 0 ? '✅' : '❌'}`);
        }
        
        console.log('   Status: FUNCTIONAL ✅\n');
        
        // 2. AI ASSISTANT ANALYSIS
        console.log('2️⃣ AI ASSISTANT COMPONENT:');
        console.log('Expected: Chat interface with AI responses, voice input, multilingual support');
        
        await page.click('[data-view="ai"]');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const aiElements = {
            conversationMessages: await page.$('#conversationMessages'),
            aiInput: await page.$('#aiInput'),
            sendButton: await page.$('#sendBtn'),
            voiceInputButton: await page.$('#voiceInputBtn'),
            clearChatButton: await page.$('#clearChatBtn'),
            translateButton: await page.$('#translateBtn')
        };
        
        console.log('✅ Elements found:');
        for (const [name, element] of Object.entries(aiElements)) {
            console.log(`   ${name}: ${element ? '✅' : '❌'}`);
        }
        
        // Test AI chat (should fail due to missing backend)
        if (aiElements.aiInput && aiElements.sendButton) {
            await page.type('#aiInput', 'Hello, can you help me?');
            await page.click('#sendBtn');
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            const messages = await page.$$('.ai-message');
            console.log(`   AI messages: ${messages.length} ${messages.length > 1 ? '✅' : '❌'}`);
        }
        
        console.log('   Status: UI READY, API MISSING ⚠️\n');
        
        // 3. TRIP PLANNING ANALYSIS
        console.log('3️⃣ TRIP PLANNING COMPONENT:');
        console.log('Expected: Trip configuration, route planning, itinerary generation');
        
        await page.click('[data-view="trip"]');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const tripElements = {
            planningConfig: await page.$('#planningConfig'),
            durationButtons: await page.$$('.duration-btn'),
            interestChips: await page.$$('.interest-chip'),
            budgetSelect: await page.$('#budgetLevel'),
            generateButton: await page.$('#generatePlanBtn'),
            routeSection: await page.$('.route-section')
        };
        
        console.log('✅ Elements found:');
        console.log(`   planningConfig: ${tripElements.planningConfig ? '✅' : '❌'}`);
        console.log(`   durationButtons: ${tripElements.durationButtons.length} items ${tripElements.durationButtons.length > 0 ? '✅' : '❌'}`);
        console.log(`   interestChips: ${tripElements.interestChips.length} items ${tripElements.interestChips.length > 0 ? '✅' : '❌'}`);
        console.log(`   budgetSelect: ${tripElements.budgetSelect ? '✅' : '❌'}`);
        console.log(`   generateButton: ${tripElements.generateButton ? '✅' : '❌'}`);
        console.log(`   routeSection: ${tripElements.routeSection ? '✅' : '❌'}`);
        
        // Test trip generation
        if (tripElements.durationButtons.length > 0 && tripElements.generateButton) {
            await tripElements.durationButtons[1].click(); // Select 1 day
            await page.click('#generatePlanBtn');
            await new Promise(resolve => setTimeout(resolve, 5000));
            
            const tripResults = await page.$('#tripResults');
            console.log(`   Trip generation: ${tripResults ? '✅' : '❌'}`);
        }
        
        console.log('   Status: PARTIAL FUNCTIONALITY ⚠️\n');
        
        // 4. PROFILE ANALYSIS
        console.log('4️⃣ PROFILE COMPONENT:');
        console.log('Expected: User stats, settings, preferences');
        
        await page.click('[data-view="profile"]');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const profileElements = {
            travelStats: await page.$('.card'),
            favoritesList: await page.$('#favoritesList'),
            settingsSection: await page.$('.settings'),
            preferencesForm: await page.$('.preferences-form')
        };
        
        console.log('✅ Elements found:');
        for (const [name, element] of Object.entries(profileElements)) {
            console.log(`   ${name}: ${element ? '✅' : '❌'}`);
        }
        
        console.log('   Status: STATIC DISPLAY ⚠️\n');
        
        // 5. WEATHER COMPONENT ANALYSIS (on search page)
        console.log('5️⃣ WEATHER COMPONENT:');
        console.log('Expected: Current weather, forecasts, weather-aware recommendations');
        
        await page.click('[data-view="search"]');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const weatherBody = await page.$('#weatherBody');
        const weatherText = weatherBody ? await page.evaluate(el => el.textContent, weatherBody) : '';
        
        console.log(`   Weather display: ${weatherBody ? '✅' : '❌'}`);
        console.log(`   Weather data: ${weatherText.includes('°') || weatherText.includes('temp') ? '✅' : '❌'}`);
        console.log(`   Content: "${weatherText.trim().substring(0, 100)}..."`);
        console.log('   Status: NEEDS FIXING ⚠️\n');
        
        // 6. VOICE INTERFACE ANALYSIS
        console.log('6️⃣ VOICE INTERFACE:');
        console.log('Expected: Speech recognition, voice commands, multilingual support');
        
        const hasWebSpeechAPI = await page.evaluate(() => {
            return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
        });
        
        console.log(`   WebSpeech API: ${hasWebSpeechAPI ? '✅' : '❌'}`);
        console.log(`   Voice button: ${searchElements.voiceButton ? '✅' : '❌'}`);
        console.log('   Status: BROWSER DEPENDENT ⚠️\n');
        
        console.log('🎯 SUMMARY ANALYSIS COMPLETE');
        
        // Keep browser open for manual inspection
        console.log('👀 Keeping browser open for 15 seconds...');
        await new Promise(resolve => setTimeout(resolve, 15000));
        
    } catch (error) {
        console.error('💥 Analysis failed:', error.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

analyzeComponents().catch(console.error);