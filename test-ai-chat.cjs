// Test AI chat functionality
const puppeteer = require('puppeteer');

async function testAIChat() {
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
        
        // Listen to console for errors
        page.on('console', msg => {
            if (msg.type() === 'error') {
                console.log(`❌ BROWSER ERROR: ${msg.text()}`);
            }
        });
        
        await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
        
        console.log('🤖 Testing AI Assistant Chat...');
        
        // Navigate to AI Assistant
        await page.click('[data-view="ai"]');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Check initial state
        const messages = await page.$$('.ai-message');
        console.log(`📨 Initial messages: ${messages.length}`);
        
        // Test sending a message
        const aiInput = await page.$('#aiInput');
        const sendBtn = await page.$('#sendBtn');
        
        if (aiInput && sendBtn) {
            console.log('💬 Sending test message...');
            await page.type('#aiInput', 'Hello, can you help me find good restaurants in Tel Aviv?');
            await page.click('#sendBtn');
            
            // Wait for response
            await new Promise(resolve => setTimeout(resolve, 5000));
            
            // Check for new messages
            const newMessages = await page.$$('.ai-message');
            console.log(`📨 Messages after sending: ${newMessages.length}`);
            
            if (newMessages.length > messages.length) {
                console.log('✅ AI Assistant responded!');
                
                // Get the last message content
                const lastMessage = await page.evaluate(() => {
                    const messages = document.querySelectorAll('.ai-message');
                    const lastMsg = messages[messages.length - 1];
                    return lastMsg ? lastMsg.textContent.trim() : 'No content';
                });
                
                console.log(`📝 AI Response: "${lastMessage.substring(0, 100)}..."`);
            } else {
                console.log('❌ AI Assistant did not respond');
            }
        } else {
            console.log('❌ AI chat elements not found');
        }
        
        // Keep browser open for inspection
        console.log('🔍 Keeping browser open for 10 seconds...');
        await new Promise(resolve => setTimeout(resolve, 10000));
        
    } catch (error) {
        console.error('💥 Test failed:', error.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

testAIChat().catch(console.error);