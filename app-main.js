// Simple JavaScript implementation to ensure navigation works
console.log('Simple app starting...');

class SimpleNavigation {
  constructor() {
    this.currentView = 'search';
    this.init();
  }

  init() {
    console.log('Initializing navigation...');
    this.setupNavigation();
    this.setupThemeToggle();
    this.setupFormInteractions(); // Add this to ensure search works
    this.setupMap(); // Initialize map
    this.showView('search');
  }

  setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const views = document.querySelectorAll('.app-view');

    console.log('Found nav buttons:', navButtons.length);
    console.log('Found views:', views.length);

    navButtons.forEach(button => {
      button.addEventListener('click', () => {
        const targetView = button.getAttribute('data-view');
        console.log('Navigation clicked:', targetView);
        this.showView(targetView);
      });
    });
  }

  showView(viewName) {
    console.log('Showing view:', viewName);
    
    // Hide all views
    const views = document.querySelectorAll('.app-view');
    views.forEach(view => {
      view.classList.remove('active');
    });

    // Show target view
    const targetView = document.querySelector(`[data-view="${viewName}"]`);
    if (targetView) {
      targetView.classList.add('active');
      console.log('View activated:', viewName);
    } else {
      console.error('View not found:', viewName);
    }

    // Update navigation buttons
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(button => {
      button.classList.remove('active');
      if (button.getAttribute('data-view') === viewName) {
        button.classList.add('active');
      }
    });

    this.currentView = viewName;
  }

  setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('app-theme', newTheme);
        console.log('Theme changed to:', newTheme);
      });
    }

    // Load saved theme
    const savedTheme = localStorage.getItem('app-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  setupFormInteractions() {
    console.log('Setting up form interactions...');
    
    // Budget slider
    const budgetSlider = document.getElementById('budgetRange');
    const budgetAmount = document.getElementById('budgetAmount');
    if (budgetSlider && budgetAmount) {
      budgetSlider.addEventListener('input', () => {
        budgetAmount.textContent = budgetSlider.value;
      });
    }

    // Duration options
    document.querySelectorAll('.duration-btn').forEach(option => {
      option.addEventListener('click', () => {
        document.querySelectorAll('.duration-btn').forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
      });
    });

    // Interest options
    document.querySelectorAll('.interest-btn').forEach(option => {
      option.addEventListener('click', () => {
        const selected = document.querySelectorAll('.interest-btn.selected');
        if (option.classList.contains('selected')) {
          option.classList.remove('selected');
        } else if (selected.length < 4) {
          option.classList.add('selected');
        } else {
          alert('Maximum 4 interests allowed');
        }
      });
    });

    this.setupSearch();
    this.setupTripGeneration();
    this.setupVoiceButton();
    this.setupQuickActions();
  }

  setupSearch() {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('freeText');
    console.log('Setting up search - Button:', !!searchBtn, 'Input:', !!searchInput);

    // Category buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        // Toggle selected state
        document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Get category and search
        const category = btn.getAttribute('data-category');
        const categoryText = btn.textContent.trim();
        searchInput.value = categoryText;
        searchBtn.click();
      });
    });

    if (searchBtn && searchInput) {
      searchBtn.addEventListener('click', async () => {
        const query = searchInput.value.trim();
        if (query) {
          console.log('Searching with Personal AI for:', query);
          searchBtn.textContent = 'AI Searching...';
          searchBtn.disabled = true;
          
          try {
            // Use Personal AI for intelligent search
            const response = await fetch('https://premium-hybrid-473405-g7.uc.r.appspot.com/api/intelligence/search', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                query: query,
                location: 'Current Location',
                preferences: {
                  budgetCategory: 'mid_range',
                  destinationTypes: ['urban', 'cultural'],
                  activityPreferences: ['food', 'sightseeing']
                }
              })
            });

            const data = await response.json();
            const resultsList = document.getElementById('list');
            resultsList.style.display = 'block'; // Show results

            if (data.results && data.results.length > 0) {
              resultsList.innerHTML = data.results.map(result => `
                <div class="search-result ai-powered">
                  <h3>🤖 ${result.name}</h3>
                  <p>${result.description}</p>
                  <div class="result-rating">⭐ ${result.rating?.toFixed(1) || 'N/A'} • AI Score: ${result.personalizedScore?.toFixed(1) || 'N/A'}</div>
                  <div class="ai-reason">${result.personalizedReason}</div>
                  <div class="ai-tags">${result.personalizedTags?.join(', ') || ''}</div>
                </div>
              `).join('');
            } else {
              resultsList.innerHTML = `
                <div class="search-result">
                  <h3>🧠 AI Analysis for "${query}"</h3>
                  <p>Your Personal AI processed this search. Results: ${data.personalizedNote || 'No specific results found'}</p>
                  <div class="result-rating">🤖 Powered by o3-mini</div>
                </div>
              `;
            }
          } catch (error) {
            console.error('AI Search error:', error);
            const resultsList = document.getElementById('list');
            resultsList.style.display = 'block'; // Show results even on error
            resultsList.innerHTML = `
              <div class="search-result">
                <h3>🔄 AI Learning Mode</h3>
                <p>Your Personal AI is initializing. This powerful backend with o3-mini reasoning will provide amazing results soon!</p>
                <div class="result-rating">🧠 Personal AI Backend Active</div>
              </div>
            `;
          }
          
          searchBtn.textContent = 'Search';
          searchBtn.disabled = false;
        }
      });
    } else {
      console.error('Search elements not found - Button:', !!searchBtn, 'Input:', !!searchInput);
    }
  }

  setupTripGeneration() {
    const generateBtn = document.getElementById('generateTripBtn');
    if (generateBtn) {
      generateBtn.addEventListener('click', async () => {
        console.log('Generating AI-powered trip...');

        // Collect user preferences
        const selectedDuration = document.querySelector('.duration-btn.selected')?.textContent || 'Full day';
        const selectedInterests = Array.from(document.querySelectorAll('.interest-btn.selected')).map(el => el.textContent);
        const budget = document.getElementById('budgetAmount')?.textContent || '300';

        // Validate that at least one interest is selected
        const tripDisplay = document.getElementById('enhancedTripDisplay');
        if (selectedInterests.length === 0) {
          tripDisplay.innerHTML = `
            <div class="trip-result" style="background: var(--warning-bg, #fff3cd); border-left: 4px solid var(--warning, #ffc107); padding: 20px; border-radius: 8px;">
              <h3>📝 Please Select Your Interests</h3>
              <p>Choose at least one interest from the options above to generate a personalized trip!</p>
              <p style="margin-top: 10px; font-size: 0.9em; opacity: 0.8;">💡 Tip: You can select up to 4 interests for the best recommendations.</p>
            </div>
          `;
          return;
        }

        generateBtn.textContent = '🧠 AI Thinking...';
        generateBtn.disabled = true;
          
          // Call Personal AI for recommendations
          const response = await fetch('https://premium-hybrid-473405-g7.uc.r.appspot.com/api/ai/recommend', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              preferences: {
                duration: selectedDuration,
                interests: selectedInterests,
                budget: parseInt(budget),
                destinationType: 'mixed',
                activities: selectedInterests
              },
              context: {
                userId: 'personal',
                location: 'Current Location',
                requestType: 'trip_planning'
              }
            })
          });
          
          const data = await response.json();
          const tripDisplay = document.getElementById('enhancedTripDisplay');
          
          if (data.recommendations) {
            tripDisplay.innerHTML = `
              <div class="trip-result ai-powered">
                <h3>🧠 Your o3-mini AI Generated Trip!</h3>
                <div class="trip-summary">
                  <div class="trip-stat">
                    <span class="stat-label">Duration:</span>
                    <span class="stat-value">${selectedDuration}</span>
                  </div>
                  <div class="trip-stat">
                    <span class="stat-label">Budget:</span>
                    <span class="stat-value">$${budget}</span>
                  </div>
                  <div class="trip-stat">
                    <span class="stat-label">AI Confidence:</span>
                    <span class="stat-value">${data.confidence || 85}%</span>
                  </div>
                </div>
                <div class="ai-insight">
                  <strong>Personal Insight:</strong> ${data.personalizedInsight || 'Your AI is learning your preferences!'}
                </div>
                <div class="learning-note">
                  <strong>Learning:</strong> ${data.learningNote || 'Each interaction makes your AI smarter!'}
                </div>
                <div class="trip-content">
                  <strong>AI Recommendations:</strong>
                  <pre style="white-space: pre-wrap; font-family: inherit;">${data.recommendations.rawResponse || 'AI-powered recommendations generated!'}</pre>
                </div>
                <p><strong>🤖 Powered by o3-mini reasoning</strong> - Your Personal AI is analyzing your preferences and creating the perfect trip just for you!</p>
              </div>
            `;
          } else {
            throw new Error('No recommendations received');
          }
          
        } catch (error) {
          console.error('AI Trip generation error:', error);
          const tripDisplay = document.getElementById('enhancedTripDisplay');
          tripDisplay.innerHTML = `
            <div class="trip-result ai-learning">
              <h3>🧠 AI Learning Your Preferences</h3>
              <div class="trip-summary">
                <div class="trip-stat">
                  <span class="stat-label">Duration:</span>
                  <span class="stat-value">${document.querySelector('.duration-btn.selected')?.textContent || 'Full day'}</span>
                </div>
                <div class="trip-stat">
                  <span class="stat-label">Budget:</span>
                  <span class="stat-value">$${document.getElementById('budgetAmount')?.textContent || '300'}</span>
                </div>
                <div class="trip-stat">
                  <span class="stat-label">AI Status:</span>
                  <span class="stat-value">Learning Mode</span>
                </div>
              </div>
              <p><strong>🚀 Your Personal AI (o3-mini) is initializing!</strong> Your travel intelligence system is setting up and will provide amazing personalized recommendations soon. Each interaction helps it learn your unique travel style!</p>
            </div>
          `;
        }
        
        generateBtn.textContent = '🤖 Generate Smart Trip';
        generateBtn.disabled = false;
      });
    }
  }

  setupVoiceButton() {
    const voiceBtn = document.getElementById('voiceBtn');
    if (!voiceBtn) return;

    // Check for Web Speech API support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('Speech recognition not supported in this browser');
      voiceBtn.disabled = true;
      voiceBtn.title = 'Voice recognition not supported in this browser. Try Chrome or Edge.';
      voiceBtn.querySelector('.voice-text').textContent = 'Not Supported';
      return;
    }

    // Initialize speech recognition
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    let isListening = false;

    // Handle recognition results
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const confidence = event.results[0][0].confidence;

      console.log('Voice input:', transcript, 'Confidence:', confidence);

      const statusEl = document.getElementById('voiceStatus');
      const responseEl = document.getElementById('voiceResponse');

      if (statusEl) {
        statusEl.textContent = '🤖 Processing your command...';
      }

      // Process the voice command
      this.processVoiceCommand(transcript);

      setTimeout(() => {
        if (statusEl) statusEl.textContent = '';
        if (responseEl) {
          responseEl.textContent = `✅ Heard: "${transcript}"`;
          responseEl.style.display = 'block';
        }
      }, 500);
    };

    // Handle recognition errors
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);

      isListening = false;
      voiceBtn.classList.remove('listening');
      voiceBtn.querySelector('.voice-text').textContent = 'Press & Hold to Speak';

      const statusEl = document.getElementById('voiceStatus');
      const responseEl = document.getElementById('voiceResponse');

      let errorMessage = '';
      switch(event.error) {
        case 'no-speech':
          errorMessage = '❌ No speech detected. Please try again.';
          break;
        case 'audio-capture':
          errorMessage = '❌ Microphone not found. Please check your device.';
          break;
        case 'not-allowed':
          errorMessage = '❌ Microphone permission denied. Please enable it in settings.';
          break;
        case 'network':
          errorMessage = '❌ Network error. Please check your connection.';
          break;
        default:
          errorMessage = `❌ Error: ${event.error}`;
      }

      if (statusEl) {
        statusEl.textContent = errorMessage;
        setTimeout(() => {
          statusEl.textContent = '';
        }, 3000);
      }
      if (responseEl) {
        responseEl.textContent = errorMessage;
        responseEl.style.display = 'block';
      }
    };

    // Handle recognition end
    recognition.onend = () => {
      isListening = false;
      voiceBtn.classList.remove('listening');
      voiceBtn.querySelector('.voice-text').textContent = 'Press & Hold to Speak';
    };

    // Mouse down - start listening
    voiceBtn.addEventListener('mousedown', () => {
      if (!isListening) {
        try {
          recognition.start();
          isListening = true;
          voiceBtn.classList.add('listening');
          voiceBtn.querySelector('.voice-text').textContent = 'Listening... Release to stop';

          const statusEl = document.getElementById('voiceStatus');
          if (statusEl) {
            statusEl.textContent = '🎤 Listening for your voice command...';
          }

          const responseEl = document.getElementById('voiceResponse');
          if (responseEl) {
            responseEl.style.display = 'none';
          }
        } catch (error) {
          console.error('Recognition start error:', error);
        }
      }
    });

    // Mouse up - stop listening
    voiceBtn.addEventListener('mouseup', () => {
      if (isListening) {
        recognition.stop();
      }
    });

    // Mouse leave - stop listening if active
    voiceBtn.addEventListener('mouseleave', () => {
      if (isListening) {
        recognition.stop();
      }
    });
  }

  processVoiceCommand(transcript) {
    const lowerTranscript = transcript.toLowerCase();
    console.log('Processing command:', lowerTranscript);

    // Parse voice commands and execute actions
    if (lowerTranscript.includes('search for') || lowerTranscript.includes('find') || lowerTranscript.includes('look for')) {
      // Extract search query
      let query = lowerTranscript
        .replace('search for', '')
        .replace('find', '')
        .replace('look for', '')
        .replace('me', '')
        .trim();

      if (query) {
        this.showView('search');
        setTimeout(() => {
          const searchInput = document.getElementById('freeText');
          const searchBtn = document.getElementById('searchBtn');
          if (searchInput && searchBtn) {
            searchInput.value = query;
            searchBtn.click();
          }
        }, 300);
      }
    } else if (lowerTranscript.includes('food') || lowerTranscript.includes('restaurant') || lowerTranscript.includes('eat')) {
      this.showView('search');
      setTimeout(() => {
        const searchInput = document.getElementById('freeText');
        const searchBtn = document.getElementById('searchBtn');
        if (searchInput && searchBtn) {
          searchInput.value = 'restaurants';
          searchBtn.click();
        }
      }, 300);
    } else if (lowerTranscript.includes('plan') && (lowerTranscript.includes('trip') || lowerTranscript.includes('vacation'))) {
      this.showView('trip');
    } else if (lowerTranscript.includes('generate') && lowerTranscript.includes('trip')) {
      this.showView('trip');
      setTimeout(() => {
        const generateBtn = document.getElementById('generateTripBtn');
        if (generateBtn) {
          generateBtn.click();
        }
      }, 500);
    } else if (lowerTranscript.includes('map') || lowerTranscript.includes('navigation') || lowerTranscript.includes('location')) {
      this.showView('map');
    } else if (lowerTranscript.includes('weather')) {
      this.showView('map');
    } else if (lowerTranscript.includes('profile') || lowerTranscript.includes('setting')) {
      this.showView('profile');
    } else if (lowerTranscript.includes('go to') || lowerTranscript.includes('open')) {
      // Try to extract page name
      if (lowerTranscript.includes('search')) {
        this.showView('search');
      } else if (lowerTranscript.includes('ai') || lowerTranscript.includes('assistant')) {
        this.showView('ai');
      } else if (lowerTranscript.includes('trip')) {
        this.showView('trip');
      } else if (lowerTranscript.includes('map')) {
        this.showView('map');
      } else if (lowerTranscript.includes('profile')) {
        this.showView('profile');
      }
    } else {
      // Default: treat as search query
      this.showView('search');
      setTimeout(() => {
        const searchInput = document.getElementById('freeText');
        const searchBtn = document.getElementById('searchBtn');
        if (searchInput && searchBtn) {
          searchInput.value = transcript;
          searchBtn.click();
        }
      }, 300);
    }
  }

  setupQuickActions() {
    document.querySelectorAll('.action-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.getAttribute('data-action');

        // Switch to appropriate view and trigger action
        switch(action) {
          case 'find-food':
            // Go to search view and search for food
            this.showView('search');
            setTimeout(() => {
              const searchInput = document.getElementById('freeText');
              const searchBtn = document.getElementById('searchBtn');
              if (searchInput && searchBtn) {
                searchInput.value = '🍽️ Food';
                searchBtn.click();
              }
            }, 100);
            break;

          case 'weather':
            // Show weather info - scroll to map view where weather is displayed
            this.showView('map');
            break;

          case 'navigate':
            // Go to map view for directions
            this.showView('map');
            break;

          case 'recommend':
            // Go to trip planning view
            this.showView('trip');
            break;
        }
      });
    });
  }

  setupMap() {
    // Wait for Leaflet to be loaded
    if (typeof L === 'undefined') {
      console.log('Waiting for Leaflet to load...');
      setTimeout(() => this.setupMap(), 100);
      return;
    }

    console.log('Initializing map...');

    try {
      // Initialize Leaflet map
      this.map = L.map('map', { zoomControl: true }).setView([32.0853, 34.7818], 13); // Tel Aviv coordinates

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);

      // Add a marker for current location
      this.userMarker = L.marker([32.0853, 34.7818]).addTo(this.map)
        .bindPopup('Your Location')
        .openPopup();

      console.log('Map initialized successfully');

      // Setup location button
      const locationBtn = document.getElementById('locationBtn');
      if (locationBtn) {
        locationBtn.addEventListener('click', () => {
          console.log('Location button clicked');
          locationBtn.classList.add('active');

          // Try to get user's actual location
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                // Update map center and marker
                this.map.setView([lat, lng], 15);
                this.userMarker.setLatLng([lat, lng]);
                this.userMarker.bindPopup('You are here!').openPopup();

                console.log('Location updated:', lat, lng);
                locationBtn.classList.remove('active');
              },
              (error) => {
                console.error('Geolocation error:', error);
                alert('Unable to get your location. Please enable location services.');
                locationBtn.classList.remove('active');
              }
            );
          } else {
            alert('Geolocation is not supported by your browser');
            locationBtn.classList.remove('active');
          }
        });
      }
    } catch (error) {
      console.error('Map initialization error:', error);
    }
  }
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.simpleApp = new SimpleNavigation();
  });
} else {
  window.simpleApp = new SimpleNavigation();
}

console.log('Simple app loaded');