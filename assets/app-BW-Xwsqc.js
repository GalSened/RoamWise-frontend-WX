var k = Object.defineProperty;
var b = (u, i, e) =>
  i in u ? k(u, i, { enumerable: !0, configurable: !0, writable: !0, value: e }) : (u[i] = e);
var l = (u, i, e) => b(u, typeof i != 'symbol' ? i + '' : i, e);
import { t as c, A as g, c as L } from './maps-COZuNwZo.js';
import { c as A } from './weather-Ck8jVTs4.js';
import { l as m } from './vendor-CyG76CEV.js';
const N = {
    primary: '#0066cc',
    secondary: '#6366f1',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#1e293b',
    textSecondary: '#64748b',
    border: '#e2e8f0',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  },
  E = {
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f1f5f9',
    textSecondary: '#94a3b8',
    border: '#334155',
    success: '#34d399',
    warning: '#fbbf24',
    error: '#f87171',
  };
function R(u, i) {
  return new CustomEvent(u, { detail: i });
}
class f {
  constructor() {
    l(this, 'listeners', new Map());
  }
  on(i, e) {
    (this.listeners.has(i) || this.listeners.set(i, new Set()), this.listeners.get(i).add(e));
  }
  off(i, e) {
    const t = this.listeners.get(i);
    t && (t.delete(e), t.size === 0 && this.listeners.delete(i));
  }
  emit(i, e) {
    const t = this.listeners.get(i);
    t &&
      t.forEach((r) => {
        try {
          r(e);
        } catch (a) {
          console.error('Error in event listener for '.concat(i, ':'), a);
        }
      });
  }
  once(i, e) {
    const t = (...r) => {
      (this.off(i, t), e(...r));
    };
    this.on(i, t);
  }
  destroy() {
    this.listeners.clear();
  }
}
class I extends f {
  constructor() {
    super();
    l(this, 'currentTheme', 'system');
    l(this, 'prefersDark', !1);
    l(this, 'mediaQuery');
    ((this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')),
      (this.prefersDark = this.mediaQuery.matches),
      this.mediaQuery.addEventListener('change', (e) => {
        ((this.prefersDark = e.matches),
          this.currentTheme === 'system' &&
            (this.applyTheme(), this.emit('theme-changed', { theme: this.getEffectiveTheme() })));
      }),
      this.loadTheme(),
      this.applyTheme());
  }
  loadTheme() {
    const e = localStorage.getItem('app-theme');
    e && ['light', 'dark', 'system'].includes(e) && (this.currentTheme = e);
  }
  saveTheme() {
    localStorage.setItem('app-theme', this.currentTheme);
  }
  getTheme() {
    return this.currentTheme;
  }
  getEffectiveTheme() {
    return this.currentTheme === 'system'
      ? this.prefersDark
        ? 'dark'
        : 'light'
      : this.currentTheme;
  }
  getColors() {
    return this.getEffectiveTheme() === 'dark' ? E : N;
  }
  setTheme(e) {
    this.currentTheme !== e &&
      ((this.currentTheme = e),
      this.saveTheme(),
      this.applyTheme(),
      this.emit('theme-changed', { theme: this.getEffectiveTheme() }));
  }
  toggleTheme() {
    const e = this.getEffectiveTheme();
    this.setTheme(e === 'light' ? 'dark' : 'light');
  }
  applyTheme() {
    const e = this.getEffectiveTheme(),
      t = this.getColors(),
      r = document.documentElement;
    (Object.entries(t).forEach(([s, n]) => {
      r.style.setProperty('--color-'.concat(s), n);
    }),
      r.setAttribute('data-theme', e));
    const a = document.querySelector('meta[name="theme-color"]');
    (a && (a.content = t.primary), this.updateMapStyle(e));
  }
  updateMapStyle(e) {
    window.dispatchEvent(R('map-theme-change', { theme: e }));
  }
  getCSSVariables() {
    const e = this.getColors(),
      t = {};
    return (
      Object.entries(e).forEach(([r, a]) => {
        t['--color-'.concat(r)] = a;
      }),
      t
    );
  }
  isDark() {
    return this.getEffectiveTheme() === 'dark';
  }
  getMapTileURL() {
    return this.isDark()
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  }
  getMapTileAttribution() {
    return this.isDark()
      ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
  }
}
const y = new I();
class D extends f {
  constructor(e = {}) {
    super();
    l(this, 'config');
    l(this, 'checkTimer');
    l(this, 'lastCheckTime', 0);
    l(this, 'updateAvailable', !1);
    l(this, 'latestVersion');
    ((this.config = {
      checkInterval: 30 * 60 * 1e3,
      apiEndpoint: '/app/version.json',
      currentVersion: '2.0.0',
      autoCheck: !0,
      ...e,
    }),
      this.config.autoCheck && this.startPeriodicCheck());
  }
  async checkForUpdates(e = !1) {
    const t = Date.now();
    if (!e && t - this.lastCheckTime < 5 * 60 * 1e3) return this.getLastUpdateInfo();
    ((this.lastCheckTime = t), c.track('update_check_started'));
    try {
      const r = await fetch(this.config.apiEndpoint, {
        cache: 'no-cache',
        headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
      });
      if (!r.ok) throw new Error('Update check failed: '.concat(r.status));
      const a = await r.json(),
        s = this.compareVersions(a);
      return (
        (this.latestVersion = a),
        (this.updateAvailable = s.available),
        s.available &&
          (this.emit('update-available', s),
          c.track('update_available', { current: s.current, latest: s.latest, urgent: s.urgent })),
        c.track('update_check_completed', { available: s.available, version: s.latest }),
        s
      );
    } catch (r) {
      return (
        console.error('Update check failed:', r),
        c.track('update_check_failed', { error: r instanceof Error ? r.message : 'Unknown error' }),
        { available: !1, current: this.config.currentVersion, latest: this.config.currentVersion }
      );
    }
  }
  compareVersions(e) {
    const t = this.config.currentVersion,
      r = this.isNewerVersion(e.version, t);
    return {
      available: r,
      current: t,
      latest: e.version,
      releaseNotes: r ? e : void 0,
      urgent: r && e.breaking && e.breaking.length > 0,
    };
  }
  isNewerVersion(e, t) {
    const r = e.split('.').map(Number),
      a = t.split('.').map(Number);
    for (let s = 0; s < Math.max(r.length, a.length); s++) {
      const n = r[s] || 0,
        o = a[s] || 0;
      if (n > o) return !0;
      if (n < o) return !1;
    }
    return !1;
  }
  getLastUpdateInfo() {
    var e, t;
    return {
      available: this.updateAvailable,
      current: this.config.currentVersion,
      latest: ((e = this.latestVersion) == null ? void 0 : e.version) || this.config.currentVersion,
      releaseNotes: this.updateAvailable ? this.latestVersion : void 0,
      urgent:
        this.updateAvailable &&
        ((t = this.latestVersion) == null ? void 0 : t.breaking) &&
        this.latestVersion.breaking.length > 0,
    };
  }
  async applyUpdate() {
    if (!this.updateAvailable) throw new Error('No update available');
    c.track('update_apply_started');
    try {
      if ('serviceWorker' in navigator) {
        const e = await navigator.serviceWorker.getRegistration();
        if (e && e.waiting) {
          (e.waiting.postMessage({ type: 'SKIP_WAITING' }),
            this.emit('update-applied'),
            c.track('update_applied', { method: 'service_worker' }));
          return;
        }
      }
      this.isNativeApp() ? this.redirectToStore() : window.location.reload();
    } catch (e) {
      throw (
        console.error('Update application failed:', e),
        c.track('update_apply_failed', { error: e instanceof Error ? e.message : 'Unknown error' }),
        e
      );
    }
  }
  isNativeApp() {
    var e;
    return !!(
      window.ReactNativeWebView ||
      ((e = window.webkit) != null && e.messageHandlers) ||
      navigator.userAgent.includes('TravelingApp')
    );
  }
  redirectToStore() {
    const e = navigator.userAgent;
    e.includes('iPhone') || e.includes('iPad')
      ? window.open('https://apps.apple.com/app/traveling-app', '_blank')
      : e.includes('Android')
        ? window.open('https://play.google.com/store/apps/details?id=com.traveling.app', '_blank')
        : window.location.reload();
  }
  startPeriodicCheck() {
    this.checkTimer = window.setInterval(() => {
      this.checkForUpdates();
    }, this.config.checkInterval);
  }
  stopPeriodicCheck() {
    this.checkTimer && (clearInterval(this.checkTimer), (this.checkTimer = void 0));
  }
  destroy() {
    (this.stopPeriodicCheck(), super.destroy());
  }
}
'serviceWorker' in navigator &&
  navigator.serviceWorker.addEventListener('message', (u) => {
    var i;
    ((i = u.data) == null ? void 0 : i.type) === 'UPDATE_AVAILABLE' &&
      _.emit('update-available', {
        available: !0,
        current: _.getLastUpdateInfo().current,
        latest: u.data.version || 'unknown',
      });
  });
const _ = new D({ currentVersion: '2.0.0' });
class M {
  constructor(i = {}) {
    l(this, 'config');
    this.config = { baseUrl: 'https://router.project-osrm.org', profile: 'driving', ...i };
  }
  async route(i) {
    var t;
    const e = performance.now();
    try {
      const r = this.getOSRMProfile(i.mode || 'car'),
        s = [i.origin, ...(i.via || []), i.destination]
          .map((p) => ''.concat(p.lng, ',').concat(p.lat))
          .join(';'),
        n = new URL(''.concat(this.config.baseUrl, '/route/v1/').concat(r, '/').concat(s));
      (n.searchParams.set('overview', 'full'),
        n.searchParams.set('geometries', 'geojson'),
        n.searchParams.set('steps', 'true'),
        n.searchParams.set('annotations', 'true'));
      const o = await fetch(n.toString());
      if (!o.ok) throw new g('OSRM API error: '.concat(o.status), 'OSRM_API_ERROR', o.status);
      const d = await o.json();
      if (!d.routes || d.routes.length === 0) throw new g('No route found', 'NO_ROUTE_FOUND');
      const h = this.transformRoute(d.routes[0]);
      return (
        c.track('osrm_route_calculation', {
          mode: i.mode,
          has_waypoints: !!((t = i.via) != null && t.length),
          duration: performance.now() - e,
          distance: h.overview.distance,
          travel_time: h.overview.duration,
        }),
        h
      );
    } catch (r) {
      throw (
        c.track('osrm_route_calculation_error', {
          mode: i.mode,
          error: r instanceof Error ? r.message : 'Unknown error',
          duration: performance.now() - e,
        }),
        r
      );
    }
  }
  getOSRMProfile(i) {
    switch (i) {
      case 'walk':
        return 'foot';
      case 'bike':
        return 'cycling';
      default:
        return 'driving';
    }
  }
  transformRoute(i) {
    return {
      legs: i.legs.map((e) => {
        var t, r, a, s, n, o, d, h;
        return {
          start: {
            lng:
              ((r = (t = e.steps[0]) == null ? void 0 : t.intersections[0]) == null
                ? void 0
                : r.location[0]) || 0,
            lat:
              ((s = (a = e.steps[0]) == null ? void 0 : a.intersections[0]) == null
                ? void 0
                : s.location[1]) || 0,
          },
          end: {
            lng:
              ((o = (n = e.steps[e.steps.length - 1]) == null ? void 0 : n.intersections[0]) == null
                ? void 0
                : o.location[0]) || 0,
            lat:
              ((h = (d = e.steps[e.steps.length - 1]) == null ? void 0 : d.intersections[0]) == null
                ? void 0
                : h.location[1]) || 0,
          },
          duration: e.duration,
          distance: e.distance,
          steps: e.steps.map((p) => ({
            instruction: p.maneuver.instruction,
            duration: p.duration,
            distance: p.distance,
            start: { lng: p.maneuver.location[0], lat: p.maneuver.location[1] },
            end: {
              lng: p.geometry.coordinates[p.geometry.coordinates.length - 1][0],
              lat: p.geometry.coordinates[p.geometry.coordinates.length - 1][1],
            },
            polyline: this.encodePolyline(p.geometry.coordinates),
            maneuver: p.maneuver.type,
          })),
          polyline: this.encodePolyline(e.steps.flatMap((p) => p.geometry.coordinates)),
        };
      }),
      overview: {
        polyline: this.encodePolyline(i.geometry.coordinates),
        bounds: this.calculateBounds(i.geometry.coordinates),
        duration: i.duration,
        distance: i.distance,
      },
      warnings: [],
      summary: 'OSRM Route',
    };
  }
  calculateBounds(i) {
    const e = i.map((r) => r[0]),
      t = i.map((r) => r[1]);
    return {
      north: Math.max(...t),
      south: Math.min(...t),
      east: Math.max(...e),
      west: Math.min(...e),
    };
  }
  encodePolyline(i) {
    return i.map((e) => ''.concat(e[1], ',').concat(e[0])).join(' ');
  }
}
function C(u) {
  return new M({ baseUrl: u });
}
class O extends f {
  constructor(e, t) {
    super();
    l(this, 'routingProvider');
    l(this, 'weatherProvider');
    l(this, 'routeCache', new Map());
    l(this, 'weatherCache', new Map());
    l(this, 'cacheTimeout', 5 * 60 * 1e3);
    ((this.routingProvider = e), (this.weatherProvider = t));
  }
  async calculateWeatherAwareRoute(e, t, r = {}) {
    const a = performance.now();
    try {
      const s = await this.getBasicRoute(e, t, r);
      if (!r.weatherAware)
        return {
          originalRoute: s,
          weatherScore: 0.7,
          weatherFactors: this.getNeutralWeatherFactors(),
          recommendation: 'proceed',
          weatherAlerts: [],
        };
      const n = await this.analyzeRouteWeather(s),
        o = this.calculateWeatherScore(n),
        d = this.generateWeatherRecommendation(o, r);
      let h = [];
      r.includeAlternatives &&
        (o.overall < 0.6 || r.maxAlternatives) &&
        (h = await this.generateAlternativeRoutes(e, t, s, r));
      const p = {
        originalRoute: s,
        weatherScore: o.overall,
        weatherFactors: o,
        recommendation: d,
        weatherAlerts: this.generateWeatherAlerts(n, o),
        alternativeRoutes: h,
      };
      return (
        c.track('weather_aware_route_calculated', {
          weather_score: o.overall,
          recommendation: d,
          has_alternatives: h.length > 0,
          duration: performance.now() - a,
        }),
        this.emit('route-calculated', p),
        p
      );
    } catch (s) {
      throw (
        c.track('weather_aware_route_error', {
          error: s instanceof Error ? s.message : 'Unknown error',
          duration: performance.now() - a,
        }),
        s
      );
    }
  }
  async getBasicRoute(e, t, r) {
    const a = ''
        .concat(e.lat, ',')
        .concat(e.lng, '-')
        .concat(t.lat, ',')
        .concat(t.lng, '-')
        .concat(JSON.stringify(r)),
      s = this.routeCache.get(a);
    if (s && Date.now() - s.timestamp < this.cacheTimeout) return s.route;
    const n = await this.routingProvider.route({ origin: e, destination: t, ...r });
    return (this.routeCache.set(a, { route: n, timestamp: Date.now() }), n);
  }
  async analyzeRouteWeather(e) {
    const r = this.extractWeatherCheckpoints(e).map((a) => this.getWeatherForPoint(a));
    return Promise.all(r);
  }
  extractWeatherCheckpoints(e) {
    const t = [];
    return (
      e.legs.length > 0 && (t.push(e.legs[0].start), t.push(e.legs[e.legs.length - 1].end)),
      e.legs.forEach((r) => {
        if (r.distance > 2e4) {
          const a = this.interpolateLatLng(r.start, r.end, 0.5);
          t.push(a);
        }
      }),
      t
    );
  }
  async getWeatherForPoint(e) {
    const t = ''.concat(e.lat.toFixed(3), ',').concat(e.lng.toFixed(3)),
      r = this.weatherCache.get(t);
    if (r && Date.now() - r.timestamp < this.cacheTimeout) return r.data;
    const a = await this.weatherProvider.getCurrent(e.lat, e.lng);
    return (this.weatherCache.set(t, { data: a, timestamp: Date.now() }), a);
  }
  calculateWeatherScore(e) {
    if (e.length === 0) return this.getNeutralWeatherFactors();
    const t = this.aggregateWeatherData(e),
      r = this.scorePrecipitation(t.precipitation),
      a = this.scoreTemperature(t.temperature),
      s = this.scoreVisibility(t.visibility),
      n = this.scoreWind(t.windSpeed),
      o = r * 0.4 + a * 0.2 + s * 0.3 + n * 0.1;
    return { precipitation: r, temperature: a, visibility: s, wind: n, overall: o };
  }
  aggregateWeatherData(e) {
    const t = e.length;
    return {
      temperature: e.reduce((r, a) => r + a.temperature, 0) / t,
      precipitation: Math.max(...e.map((r) => r.precipitation || 0)),
      windSpeed: e.reduce((r, a) => r + (a.windSpeed || 0), 0) / t,
      visibility: Math.min(...e.map((r) => r.visibility || 10)),
    };
  }
  scorePrecipitation(e) {
    return e <= 0.5 ? 1 : e <= 2.5 ? 0.8 : e <= 7.5 ? 0.5 : e <= 15 ? 0.2 : 0;
  }
  scoreTemperature(e) {
    return e >= 15 && e <= 25
      ? 1
      : e >= 10 && e <= 30
        ? 0.8
        : e >= 5 && e <= 35
          ? 0.6
          : e >= 0 && e <= 40
            ? 0.3
            : 0.1;
  }
  scoreVisibility(e) {
    return e >= 10 ? 1 : e >= 5 ? 0.8 : e >= 2 ? 0.5 : e >= 1 ? 0.2 : 0;
  }
  scoreWind(e) {
    return e <= 20 ? 1 : e <= 40 ? 0.8 : e <= 60 ? 0.5 : e <= 80 ? 0.2 : 0;
  }
  generateWeatherRecommendation(e, t) {
    const r = t.weatherThreshold || 0.6;
    return e.overall >= r
      ? 'proceed'
      : e.precipitation < 0.3 || e.visibility < 0.3
        ? 'delay'
        : e.wind < 0.2 || e.overall < 0.3
          ? 'cancel'
          : 'indoor_route';
  }
  generateWeatherAlerts(e, t) {
    const r = [];
    if (
      (t.precipitation < 0.5 &&
        r.push('⚠️ Heavy rain expected along route. Consider delaying travel.'),
      t.visibility < 0.5 && r.push('🌫️ Reduced visibility due to fog or weather conditions.'),
      t.wind < 0.5 &&
        r.push('💨 Strong winds reported. Drive carefully, especially in open areas.'),
      t.temperature < 0.3)
    ) {
      const a = e.reduce((s, n) => s + n.temperature, 0) / e.length;
      a < 0
        ? r.push('🧊 Freezing conditions. Watch for ice on roads.')
        : a > 35 && r.push('🌡️ Extremely hot weather. Ensure vehicle cooling and hydration.');
    }
    return r;
  }
  async generateAlternativeRoutes(e, t, r, a) {
    const s = [],
      n = a.maxAlternatives || 2,
      o = [
        { ...a, routePreference: 'shortest' },
        { ...a, avoidHighways: !0 },
        { ...a, avoidTolls: !0 },
      ];
    for (const d of o.slice(0, n))
      try {
        const h = await this.getBasicRoute(e, t, d);
        if (this.routesSimilar(r, h)) continue;
        const p = await this.analyzeRouteWeather(h),
          v = this.calculateWeatherScore(p),
          S = this.generateWeatherRecommendation(v, a);
        s.push({
          originalRoute: h,
          weatherScore: v.overall,
          weatherFactors: v,
          recommendation: S,
          weatherAlerts: this.generateWeatherAlerts(p, v),
        });
      } catch (h) {
        console.warn('Failed to generate alternative route:', h);
      }
    return s.sort((d, h) => h.weatherScore - d.weatherScore);
  }
  routesSimilar(e, t) {
    const r = Math.abs(e.overview.distance - t.overview.distance),
      a = Math.abs(e.overview.duration - t.overview.duration);
    return r < e.overview.distance * 0.1 && a < e.overview.duration * 0.1;
  }
  getNeutralWeatherFactors() {
    return { precipitation: 0.7, temperature: 0.7, visibility: 0.7, wind: 0.7, overall: 0.7 };
  }
  interpolateLatLng(e, t, r) {
    return { lat: e.lat + (t.lat - e.lat) * r, lng: e.lng + (t.lng - e.lng) * r };
  }
  async updateRouteWeather(e) {
    const t = await this.analyzeRouteWeather(e),
      r = this.calculateWeatherScore(t);
    return (this.emit('route-weather-updated', r), r);
  }
  async getRouteForecast(e, t, r) {
    var a;
    try {
      const s = await this.weatherProvider.getForecast(e.lat, e.lng),
        n = r.getHours(),
        o = ((a = s.hourly) == null ? void 0 : a.slice(n, n + 6)) || [],
        d = this.calculateWeatherScore(o);
      let h = 'Good weather for travel';
      return (
        d.overall < 0.4
          ? (h = 'Consider delaying travel due to poor weather conditions')
          : d.overall < 0.6 && (h = 'Acceptable weather, drive carefully'),
        { hourlyWeather: o, recommendation: h }
      );
    } catch (s) {
      return (
        console.warn('Failed to get route forecast:', s),
        { hourlyWeather: [], recommendation: 'Weather data unavailable' }
      );
    }
  }
  clearCache() {
    (this.routeCache.clear(), this.weatherCache.clear());
  }
}
function x(u, i) {
  return new O(u, i);
}
class z {
  constructor(i, e, t) {
    ((this.placesProvider = i), (this.routingProvider = e), (this.weatherProvider = t));
  }
  async createPlan(i) {
    const e = performance.now();
    try {
      let t = [];
      i.destination && (t = await this.placesProvider.search(i.destination, { near: i.origin }));
      let r;
      i.constraints.weatherAware &&
        i.origin &&
        (r = await this.weatherProvider.getForecast(i.origin.lat, i.origin.lng));
      const a = await this.findCandidateStops(i, r),
        s = await this.scoreRecommendations(a, i, r),
        n = await this.createOptimizedItinerary(s, i);
      return (
        c.track('ai_plan_created', {
          destination: i.destination,
          candidates_count: a.length,
          recommendations_count: s.length,
          duration: performance.now() - e,
          weather_aware: i.constraints.weatherAware,
        }),
        {
          plan: n,
          reasoning: this.generatePlanReasoning(n, s, r),
          confidence: this.calculatePlanConfidence(n, s),
          alternatives: [],
        }
      );
    } catch (t) {
      throw (
        c.track('ai_plan_creation_error', {
          error: t instanceof Error ? t.message : 'Unknown error',
          duration: performance.now() - e,
        }),
        t
      );
    }
  }
  async findCandidateStops(i, e) {
    const t = [];
    if (!i.origin) return t;
    const a = i.constraints.categories || ['meal', 'scenic', 'activity'];
    for (const s of a)
      try {
        const n = await this.placesProvider.search(this.getCategorySearchTerm(s), {
          near: i.origin,
          radius: 1e4,
          openNow: !0,
        });
        t.push(...n);
      } catch (n) {
        console.warn('Failed to search for '.concat(s, ':'), n);
      }
    return t;
  }
  getCategorySearchTerm(i) {
    return (
      {
        meal: 'restaurants cafes food',
        scenic: 'viewpoint scenic attractions parks',
        activity: 'attractions activities things to do',
        cultural: 'museums galleries cultural sites',
        shopping: 'shopping centers markets stores',
      }[i] || i
    );
  }
  async scoreRecommendations(i, e, t) {
    return i
      .map((r) => {
        const a = {
            rating: this.scoreRating(r.rating),
            distance: this.scoreDistance(r, e.origin),
            weather: this.scoreWeatherFit(r, t),
            openNow: r.openNow ? 1 : 0.3,
            priceLevel: this.scorePriceLevel(r.priceLevel, e.constraints.budget),
          },
          s =
            a.rating * 0.3 +
            a.distance * 0.2 +
            a.weather * 0.2 +
            a.openNow * 0.2 +
            a.priceLevel * 0.1;
        return {
          place: r,
          score: s,
          reasoning: this.generateRecommendationReasoning(a, r),
          category: this.inferCategory(r),
          estimatedDuration: this.estimateDuration(r),
          weatherFit: a.weather,
          detourTime: 0,
        };
      })
      .sort((r, a) => a.score - r.score);
  }
  scoreRating(i) {
    return i ? Math.min(i / 5, 1) : 0.5;
  }
  scoreDistance(i, e) {
    if (!e) return 0.5;
    const t = this.calculateDistance(e, i.location);
    return t <= 5e3 ? 1 : t <= 1e4 ? 0.8 : t <= 2e4 ? 0.5 : 0.2;
  }
  scoreWeatherFit(i, e) {
    var s;
    if (!e || !i.types) return 0.7;
    const t = i.types.some((n) => ['museum', 'shopping_mall', 'restaurant', 'cafe'].includes(n)),
      r = i.types.some((n) => ['park', 'tourist_attraction', 'natural_feature'].includes(n)),
      a = (s = e.hourly) == null ? void 0 : s[0];
    return a
      ? a.precipitation > 5
        ? t
          ? 1
          : 0.3
        : a.temperature > 30
          ? t
            ? 0.9
            : 0.6
          : a.temperature > 15 && a.precipitation < 1 && r
            ? 1
            : 0.7
      : 0.7;
  }
  scorePriceLevel(i, e) {
    if (!i || !e) return 0.7;
    const t = i * 50;
    return t >= e.min && t <= e.max ? 1 : t < e.min ? 0.8 : t > e.max * 1.5 ? 0.2 : 0.5;
  }
  generateRecommendationReasoning(i, e) {
    const t = [];
    return (
      i.rating > 0.8 && t.push('highly rated'),
      i.distance > 0.8 && t.push('nearby'),
      i.weather > 0.8 && t.push('perfect for current weather'),
      i.openNow === 1 && t.push('open now'),
      t.length > 0 ? 'Great choice: '.concat(t.join(', ')) : 'Good option for your trip'
    );
  }
  inferCategory(i) {
    return i.types
      ? i.types.includes('restaurant') || i.types.includes('cafe')
        ? 'meal'
        : i.types.includes('tourist_attraction')
          ? 'scenic'
          : i.types.includes('museum')
            ? 'cultural'
            : i.types.includes('shopping_mall')
              ? 'shopping'
              : 'activity'
      : 'other';
  }
  estimateDuration(i) {
    const e = this.inferCategory(i);
    return (
      { meal: 90, scenic: 60, cultural: 120, shopping: 180, activity: 120, other: 60 }[e] || 60
    );
  }
  async createOptimizedItinerary(i, e) {
    const t = Math.min(i.length, 8),
      r = i.slice(0, t);
    return {
      name: e.destination ? 'Trip to '.concat(e.destination) : 'Custom Trip',
      description: 'AI-generated trip plan based on your preferences',
      stops: r.map((a, s) => ({
        id: 'stop-'.concat(s),
        place: a.place,
        category: a.category,
        priority: Math.max(1, Math.ceil(a.score * 5)),
        duration: a.estimatedDuration,
        weatherDependent: a.weatherFit < 0.5,
        notes: a.reasoning,
      })),
    };
  }
  generatePlanReasoning(i, e, t) {
    var s, n;
    const r = [
      'Selected '.concat(
        ((s = i.stops) == null ? void 0 : s.length) || 0,
        ' stops based on ratings, proximity, and your preferences.'
      ),
    ];
    if (t) {
      const o = (n = t.hourly) == null ? void 0 : n[0];
      (o == null ? void 0 : o.precipitation) > 5
        ? r.push('Prioritized indoor activities due to rain forecast.')
        : (o == null ? void 0 : o.temperature) > 25 &&
          r.push('Balanced indoor and outdoor activities for comfort in warm weather.');
    }
    const a = e.filter((o) => o.score > 0.8).length;
    return (a > 0 && r.push('Included '.concat(a, ' highly-rated recommendations.')), r.join(' '));
  }
  calculatePlanConfidence(i, e) {
    if (!e.length) return 0;
    const t = e.reduce((a, s) => a + s.score, 0) / e.length,
      r = e.some((a) => a.score > 0.8);
    return Math.min(t + (r ? 0.2 : 0), 1);
  }
  calculateDistance(i, e) {
    const r = (i.lat * Math.PI) / 180,
      a = (e.lat * Math.PI) / 180,
      s = ((e.lat - i.lat) * Math.PI) / 180,
      n = ((e.lng - i.lng) * Math.PI) / 180,
      o =
        Math.sin(s / 2) * Math.sin(s / 2) +
        Math.cos(r) * Math.cos(a) * Math.sin(n / 2) * Math.sin(n / 2);
    return 6371e3 * (2 * Math.atan2(Math.sqrt(o), Math.sqrt(1 - o)));
  }
}
class $ extends f {
  constructor(e, t, r) {
    super();
    l(this, 'plannerAgent');
    l(this, 'tools', new Map());
    ((this.placesProvider = e),
      (this.routingProvider = t),
      (this.weatherProvider = r),
      (this.plannerAgent = new z(e, t, r)),
      this.initializeTools());
  }
  initializeTools() {
    (this.registerTool({
      name: 'search_places',
      description: 'Search for places near a location',
      execute: async (e) => this.placesProvider.search(e.query, { near: e.location }),
    }),
      this.registerTool({
        name: 'calculate_route',
        description: 'Calculate route between locations',
        execute: async (e) => this.routingProvider.route(e),
      }),
      this.registerTool({
        name: 'get_weather',
        description: 'Get weather information for a location',
        execute: async (e) =>
          e.forecast
            ? this.weatherProvider.getForecast(e.location.lat, e.location.lng)
            : this.weatherProvider.getCurrent(e.location.lat, e.location.lng),
      }));
  }
  registerTool(e) {
    this.tools.set(e.name, e);
  }
  async processVoiceIntent(e, t) {
    switch (
      (c.track('ai_voice_intent_processed', { intent_type: e.type, confidence: e.confidence }),
      e.type)
    ) {
      case 'plan_create':
        return this.handlePlanCreate(e, t);
      case 'plan_update':
        return this.handlePlanUpdate(e, t);
      case 'search':
        return this.handleSearch(e, t);
      case 'navigate':
        return this.handleNavigate(e, t);
      case 'weather':
        return this.handleWeather(e, t);
      default:
        throw new g('Unsupported intent type: '.concat(e.type), 'UNSUPPORTED_INTENT');
    }
  }
  async handlePlanCreate(e, t) {
    const r = e.parameters.destination,
      a = { weatherAware: !0, maxDrivingTime: 8 * 60, ...(t == null ? void 0 : t.constraints) };
    return this.plannerAgent.createPlan({
      destination: r,
      origin: t == null ? void 0 : t.location,
      constraints: a,
      userPreferences: t == null ? void 0 : t.userPreferences,
    });
  }
  async handlePlanUpdate(e, t) {
    return { action: 'plan_update', parameters: e.parameters };
  }
  async handleSearch(e, t) {
    const r = e.parameters.query,
      a = t == null ? void 0 : t.location,
      s = this.tools.get('search_places');
    if (!s) throw new g('Search tool not available', 'TOOL_NOT_FOUND');
    return s.execute({ query: r, location: a });
  }
  async handleNavigate(e, t) {
    return { action: 'navigate', parameters: e.parameters };
  }
  async handleWeather(e, t) {
    const r = t == null ? void 0 : t.location;
    if (!r) throw new g('Location required for weather information', 'LOCATION_REQUIRED');
    const a = this.tools.get('get_weather');
    if (!a) throw new g('Weather tool not available', 'TOOL_NOT_FOUND');
    return a.execute({ location: r, forecast: !0 });
  }
  async explainRecommendation(e) {
    const t = [
      'This place has a score of '.concat(
        (e.score * 100).toFixed(0),
        '% based on multiple factors:'
      ),
    ];
    return (
      e.place.rating &&
        e.place.rating > 4 &&
        t.push(
          '• Highly rated ('
            .concat(e.place.rating, '⭐) by ')
            .concat(e.place.userRatingsTotal || 'many', ' visitors')
        ),
      e.weatherFit > 0.8
        ? t.push('• Perfect for current weather conditions')
        : e.weatherFit < 0.4 && t.push('• Consider weather conditions when visiting'),
      e.detourTime < 10 && t.push('• Very close to your route (minimal detour)'),
      t.push('• Estimated visit duration: '.concat(e.estimatedDuration, ' minutes')),
      t.push('• Category: '.concat(e.category)),
      t.join('\n')
    );
  }
}
function U(u, i, e) {
  return new $(u, i, e);
}
class F {
  async get(i) {
    try {
      const e = localStorage.getItem(i);
      return e ? JSON.parse(e) : null;
    } catch (e) {
      return (console.warn('Failed to get '.concat(i, ' from localStorage:'), e), null);
    }
  }
  async set(i, e) {
    try {
      localStorage.setItem(i, JSON.stringify(e));
    } catch (t) {
      throw (console.warn('Failed to set '.concat(i, ' in localStorage:'), t), t);
    }
  }
  async remove(i) {
    try {
      localStorage.removeItem(i);
    } catch (e) {
      console.warn('Failed to remove '.concat(i, ' from localStorage:'), e);
    }
  }
  async clear() {
    try {
      localStorage.clear();
    } catch (i) {
      console.warn('Failed to clear localStorage:', i);
    }
  }
  async keys() {
    try {
      return Object.keys(localStorage);
    } catch (i) {
      return (console.warn('Failed to get localStorage keys:', i), []);
    }
  }
}
class B {
  constructor() {
    l(this, 'dbName', 'TravelingAppDB');
    l(this, 'version', 1);
    l(this, 'storeName', 'keyvalue');
    l(this, 'db');
  }
  async getDB() {
    return this.db
      ? this.db
      : new Promise((i, e) => {
          const t = indexedDB.open(this.dbName, this.version);
          ((t.onerror = () => e(t.error)),
            (t.onsuccess = () => {
              ((this.db = t.result), i(this.db));
            }),
            (t.onupgradeneeded = (r) => {
              const a = r.target.result;
              a.objectStoreNames.contains(this.storeName) || a.createObjectStore(this.storeName);
            }));
        });
  }
  async get(i) {
    try {
      const e = await this.getDB();
      return new Promise((t, r) => {
        const n = e.transaction([this.storeName], 'readonly').objectStore(this.storeName).get(i);
        ((n.onerror = () => r(n.error)), (n.onsuccess = () => t(n.result)));
      });
    } catch (e) {
      return (console.warn('Failed to get '.concat(i, ' from IndexedDB:'), e), null);
    }
  }
  async set(i, e) {
    try {
      const t = await this.getDB();
      return new Promise((r, a) => {
        const o = t
          .transaction([this.storeName], 'readwrite')
          .objectStore(this.storeName)
          .put(e, i);
        ((o.onerror = () => a(o.error)), (o.onsuccess = () => r()));
      });
    } catch (t) {
      throw (console.warn('Failed to set '.concat(i, ' in IndexedDB:'), t), t);
    }
  }
  async remove(i) {
    try {
      const e = await this.getDB();
      return new Promise((t, r) => {
        const n = e
          .transaction([this.storeName], 'readwrite')
          .objectStore(this.storeName)
          .delete(i);
        ((n.onerror = () => r(n.error)), (n.onsuccess = () => t()));
      });
    } catch (e) {
      console.warn('Failed to remove '.concat(i, ' from IndexedDB:'), e);
    }
  }
  async clear() {
    try {
      const i = await this.getDB();
      return new Promise((e, t) => {
        const s = i.transaction([this.storeName], 'readwrite').objectStore(this.storeName).clear();
        ((s.onerror = () => t(s.error)), (s.onsuccess = () => e()));
      });
    } catch (i) {
      console.warn('Failed to clear IndexedDB:', i);
    }
  }
  async keys() {
    try {
      const i = await this.getDB();
      return new Promise((e, t) => {
        const s = i
          .transaction([this.storeName], 'readonly')
          .objectStore(this.storeName)
          .getAllKeys();
        ((s.onerror = () => t(s.error)), (s.onsuccess = () => e(s.result)));
      });
    } catch (i) {
      return (console.warn('Failed to get IndexedDB keys:', i), []);
    }
  }
}
class V {
  constructor() {
    l(this, 'data', new Map());
  }
  async get(i) {
    return this.data.get(i) || null;
  }
  async set(i, e) {
    this.data.set(i, e);
  }
  async remove(i) {
    this.data.delete(i);
  }
  async clear() {
    this.data.clear();
  }
  async keys() {
    return Array.from(this.data.keys());
  }
}
class W {
  constructor() {
    l(this, 'adapter');
    this.adapter = this.createAdapter();
  }
  createAdapter() {
    if (typeof indexedDB < 'u')
      try {
        return new B();
      } catch (i) {
        console.warn('IndexedDB not available, falling back to localStorage');
      }
    if (typeof localStorage < 'u')
      try {
        return (
          localStorage.setItem('__test__', 'test'),
          localStorage.removeItem('__test__'),
          new F()
        );
      } catch (i) {
        console.warn('localStorage not available, falling back to memory storage');
      }
    return new V();
  }
  async get(i) {
    return this.adapter.get(i);
  }
  async set(i, e) {
    return this.adapter.set(i, e);
  }
  async remove(i) {
    return this.adapter.remove(i);
  }
  async clear() {
    return this.adapter.clear();
  }
  async keys() {
    return this.adapter.keys();
  }
  async getNumber(i, e = 0) {
    const t = await this.get(i);
    return typeof t == 'number' ? t : e;
  }
  async getString(i, e = '') {
    const t = await this.get(i);
    return typeof t == 'string' ? t : e;
  }
  async getBoolean(i, e = !1) {
    const t = await this.get(i);
    return typeof t == 'boolean' ? t : e;
  }
  async getArray(i, e = []) {
    const t = await this.get(i);
    return Array.isArray(t) ? t : e;
  }
  async getObject(i, e = null) {
    const t = await this.get(i);
    return t && typeof t == 'object' ? t : e;
  }
  async setMany(i) {
    await Promise.all(Object.entries(i).map(([e, t]) => this.set(e, t)));
  }
  async getMany(i) {
    return (await Promise.all(i.map(async (t) => ({ key: t, value: await this.get(t) })))).reduce(
      (t, { key: r, value: a }) => ((t[r] = a), t),
      {}
    );
  }
  async setWithTTL(i, e, t) {
    const r = Date.now() + t;
    await this.set(i, { value: e, expiry: r });
  }
  async getWithTTL(i) {
    const e = await this.get(i);
    return !e || typeof e != 'object' || !e.expiry
      ? null
      : Date.now() > e.expiry
        ? (await this.remove(i), null)
        : e.value;
  }
}
const w = new W();
class q extends f {
  constructor() {
    super();
    l(this, 'currentPlan');
    l(this, 'plans', new Map());
    this.loadPlans();
  }
  async createPlan(e, t, r, a) {
    const s = {
      id: this.generateId(),
      name: e,
      description: t,
      startDate: r || new Date(),
      endDate: a || new Date(Date.now() + 864e5),
      stops: [],
      metadata: { created: new Date(), updated: new Date(), version: 1 },
    };
    return (
      this.plans.set(s.id, s),
      (this.currentPlan = s),
      await this.savePlans(),
      c.track('trip_plan_created', {
        plan_id: s.id,
        has_description: !!t,
        duration_days: Math.ceil(
          (s.endDate.getTime() - s.startDate.getTime()) / (24 * 60 * 60 * 1e3)
        ),
      }),
      this.emit('plan-created', s),
      s
    );
  }
  async updatePlan(e, t) {
    var n;
    const r = this.plans.get(e);
    if (!r) throw new g('Trip plan not found', 'PLAN_NOT_FOUND');
    const a = {
        ...r,
        ...t,
        id: r.id,
        metadata: { ...r.metadata, updated: new Date(), version: r.metadata.version + 1 },
      },
      s = this.validatePlan(a);
    if (!s.valid)
      throw new g('Plan validation failed: '.concat(s.errors.join(', ')), 'PLAN_VALIDATION_FAILED');
    return (
      this.plans.set(e, a),
      ((n = this.currentPlan) == null ? void 0 : n.id) === e && (this.currentPlan = a),
      await this.savePlans(),
      c.track('trip_plan_updated', {
        plan_id: e,
        stops_count: a.stops.length,
        has_route: !!a.route,
      }),
      this.emit('plan-updated', a),
      a
    );
  }
  async deletePlan(e) {
    var r;
    if (!this.plans.get(e)) throw new g('Trip plan not found', 'PLAN_NOT_FOUND');
    (this.plans.delete(e),
      ((r = this.currentPlan) == null ? void 0 : r.id) === e && (this.currentPlan = void 0),
      await this.savePlans(),
      c.track('trip_plan_deleted', { plan_id: e }),
      this.emit('plan-deleted', e));
  }
  async addStop(e, t, r) {
    const a = this.plans.get(e);
    if (!a) throw new g('Trip plan not found', 'PLAN_NOT_FOUND');
    const s = {
      id: this.generateId(),
      place: t,
      category: r.category,
      priority: r.priority || 3,
      arrivalTime: r.arrivalTime,
      departureTime: r.departureTime,
      duration: r.duration,
      notes: r.notes,
      weatherDependent: r.weatherDependent || !1,
    };
    return (
      r.insertIndex !== void 0 && r.insertIndex >= 0
        ? a.stops.splice(r.insertIndex, 0, s)
        : a.stops.push(s),
      await this.updatePlan(e, { stops: a.stops }),
      c.track('trip_stop_added', {
        plan_id: e,
        stop_id: s.id,
        category: s.category,
        has_timing: !!(s.arrivalTime || s.departureTime),
        weather_dependent: s.weatherDependent,
      }),
      this.emit('stop-added', { planId: e, stop: s }),
      s
    );
  }
  async updateStop(e, t, r) {
    const a = this.plans.get(e);
    if (!a) throw new g('Trip plan not found', 'PLAN_NOT_FOUND');
    const s = a.stops.findIndex((o) => o.id === t);
    if (s === -1) throw new g('Stop not found', 'STOP_NOT_FOUND');
    const n = { ...a.stops[s], ...r, id: t };
    return (
      (a.stops[s] = n),
      await this.updatePlan(e, { stops: a.stops }),
      c.track('trip_stop_updated', { plan_id: e, stop_id: t }),
      this.emit('stop-updated', { planId: e, stop: n }),
      n
    );
  }
  async removeStop(e, t) {
    const r = this.plans.get(e);
    if (!r) throw new g('Trip plan not found', 'PLAN_NOT_FOUND');
    const a = r.stops.findIndex((s) => s.id === t);
    if (a === -1) throw new g('Stop not found', 'STOP_NOT_FOUND');
    (r.stops.splice(a, 1),
      await this.updatePlan(e, { stops: r.stops }),
      c.track('trip_stop_removed', { plan_id: e, stop_id: t }),
      this.emit('stop-removed', { planId: e, stopId: t }));
  }
  async reorderStops(e, t, r) {
    const a = this.plans.get(e);
    if (!a) throw new g('Trip plan not found', 'PLAN_NOT_FOUND');
    if (t < 0 || t >= a.stops.length || r < 0 || r >= a.stops.length)
      throw new g('Invalid stop indices', 'INVALID_INDICES');
    const [s] = a.stops.splice(t, 1);
    (a.stops.splice(r, 0, s),
      await this.updatePlan(e, { stops: a.stops }),
      c.track('trip_stops_reordered', { plan_id: e, from_index: t, to_index: r }),
      this.emit('stops-reordered', { planId: e, fromIndex: t, toIndex: r }));
  }
  validatePlan(e) {
    const t = [],
      r = [];
    (e.name.trim() || t.push('Plan name is required'),
      e.endDate <= e.startDate && t.push('End date must be after start date'));
    for (let n = 0; n < e.stops.length; n++) {
      const o = e.stops[n],
        d = 'Stop '.concat(n + 1);
      if (
        (o.place.name || t.push(''.concat(d, ': Place name is required')),
        (!o.place.location.lat || !o.place.location.lng) &&
          t.push(''.concat(d, ': Valid location coordinates are required')),
        o.arrivalTime && o.departureTime)
      ) {
        o.departureTime <= o.arrivalTime &&
          t.push(''.concat(d, ': Departure time must be after arrival time'));
        const h = o.departureTime.getTime() - o.arrivalTime.getTime(),
          p = (o.duration || 60) * 60 * 1e3;
        Math.abs(h - p) > 30 * 60 * 1e3 &&
          r.push(''.concat(d, ': Duration mismatch between times and specified duration'));
      }
      if (n < e.stops.length - 1) {
        const h = e.stops[n + 1];
        o.departureTime &&
          h.arrivalTime &&
          o.departureTime > h.arrivalTime &&
          t.push(''.concat(d, ": Departure time overlaps with next stop's arrival time"));
      }
      if (o.duration) {
        const p = {
          meal: 180,
          scenic: 120,
          activity: 480,
          accommodation: 720,
          fuel: 30,
          shopping: 240,
          cultural: 360,
          other: 480,
        }[o.category];
        (o.duration > p &&
          r.push(
            ''
              .concat(d, ': Duration (')
              .concat(o.duration, ' min) seems unusually long for ')
              .concat(o.category)
          ),
          o.duration < 5 &&
            o.category !== 'fuel' &&
            r.push(''.concat(d, ': Duration (').concat(o.duration, ' min) seems too short')));
      }
    }
    const a = Math.ceil((e.endDate.getTime() - e.startDate.getTime()) / (24 * 60 * 60 * 1e3));
    return (
      a > 30 && r.push('Trip duration is very long (> 30 days)'),
      e.stops.length / a > 10 &&
        r.push('Very high number of stops per day - consider reducing for a more relaxed trip'),
      { valid: t.length === 0, errors: t, warnings: r }
    );
  }
  optimizeStopOrder(e, t) {
    return Promise.resolve(this.plans.get(e));
  }
  getPlan(e) {
    return this.plans.get(e);
  }
  getCurrentPlan() {
    return this.currentPlan;
  }
  getAllPlans() {
    return Array.from(this.plans.values()).sort(
      (e, t) => t.metadata.updated.getTime() - e.metadata.updated.getTime()
    );
  }
  setCurrentPlan(e) {
    const t = this.plans.get(e);
    t && ((this.currentPlan = t), this.emit('current-plan-changed', t));
  }
  generateId() {
    return ''.concat(Date.now(), '-').concat(Math.random().toString(36).substr(2, 9));
  }
  async loadPlans() {
    try {
      ((await w.get('trip-plans')) || []).forEach((r) => {
        ((r.startDate = new Date(r.startDate)),
          (r.endDate = new Date(r.endDate)),
          (r.metadata.created = new Date(r.metadata.created)),
          (r.metadata.updated = new Date(r.metadata.updated)),
          r.stops.forEach((a) => {
            (a.arrivalTime && (a.arrivalTime = new Date(a.arrivalTime)),
              a.departureTime && (a.departureTime = new Date(a.departureTime)));
          }),
          this.plans.set(r.id, r));
      });
      const t = await w.get('current-plan-id');
      t && (this.currentPlan = this.plans.get(t));
    } catch (e) {
      console.warn('Failed to load plans:', e);
    }
  }
  async savePlans() {
    try {
      const e = Array.from(this.plans.values());
      (await w.set('trip-plans', e),
        this.currentPlan && (await w.set('current-plan-id', this.currentPlan.id)));
    } catch (e) {
      console.warn('Failed to save plans:', e);
    }
  }
}
const j = new q();
class G {
  constructor(i, e) {
    l(this, 'recognition');
    l(this, 'isActive', !1);
    l(this, 'config');
    l(this, 'eventBus');
    ((this.config = i), (this.eventBus = e), this.initializeRecognition());
  }
  initializeRecognition() {
    if (!this.isSupported()) return;
    const i = window.SpeechRecognition || window.webkitSpeechRecognition;
    ((this.recognition = new i()),
      (this.recognition.continuous = this.config.continuous),
      (this.recognition.interimResults = this.config.interimResults),
      (this.recognition.lang = this.config.language),
      (this.recognition.maxAlternatives = this.config.maxAlternatives),
      (this.recognition.onstart = () => {
        ((this.isActive = !0),
          this.eventBus.emit('stt-started'),
          c.track('voice_recognition_started'));
      }),
      (this.recognition.onend = () => {
        ((this.isActive = !1), this.eventBus.emit('stt-ended'), c.track('voice_recognition_ended'));
      }),
      (this.recognition.onresult = (e) => {
        const t = Array.from(e.results),
          r = t.map((s) => s[0].transcript).join(' '),
          a = t.length > 0 ? t[0][0].confidence : 0;
        (this.eventBus.emit('stt-result', { transcript: r, confidence: a }),
          c.track('voice_recognition_result', {
            transcript_length: r.length,
            confidence: a,
            is_final: e.results[e.results.length - 1].isFinal,
          }));
      }),
      (this.recognition.onerror = (e) => {
        ((this.isActive = !1),
          this.eventBus.emit('stt-error', e.error),
          c.track('voice_recognition_error', { error: e.error }));
      }));
  }
  async startListening() {
    if (!(!this.recognition || this.isActive))
      try {
        this.recognition.start();
      } catch (i) {
        throw new g('Failed to start speech recognition', 'STT_START_FAILED');
      }
  }
  async stopListening() {
    !this.recognition || !this.isActive || this.recognition.stop();
  }
  isListening() {
    return this.isActive;
  }
  isSupported() {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }
}
class H {
  constructor() {
    l(this, 'patterns', {
      plan_create: [
        /plan.*trip.*to\s+(.+)/i,
        /create.*plan.*for\s+(.+)/i,
        /תכנן.*טיול.*ל(.+)/i,
        /צור.*תוכנית.*ל(.+)/i,
      ],
      plan_update: [
        /add.*stop.*at\s+(.+)/i,
        /include.*(.+).*in.*plan/i,
        /הוסף.*עצירה.*ב(.+)/i,
        /כלול.*(.+).*בתוכנית/i,
      ],
      search: [
        /find.*(.+)/i,
        /search.*for\s+(.+)/i,
        /look.*for\s+(.+)/i,
        /מצא.*(.+)/i,
        /חפש.*(.+)/i,
      ],
      navigate: [
        /navigate.*to\s+(.+)/i,
        /directions.*to\s+(.+)/i,
        /go.*to\s+(.+)/i,
        /נווט.*ל(.+)/i,
        /הוראות.*ל(.+)/i,
      ],
      weather: [/weather.*(?:in|at|for)\s+(.+)/i, /מזג.*אוויר.*ב(.+)/i],
    });
  }
  async parse(i) {
    const e = i.trim().toLowerCase();
    for (const [t, r] of Object.entries(this.patterns))
      for (const a of r) {
        const s = e.match(a);
        if (s)
          return {
            type: t,
            confidence: 0.8,
            parameters: this.extractParameters(t, s),
            original: i,
          };
      }
    return { type: 'search', confidence: 0.5, parameters: { query: i }, original: i };
  }
  extractParameters(i, e) {
    const t = e[1] || '';
    switch (i) {
      case 'plan_create':
        return { destination: t.trim() };
      case 'plan_update':
        return { place: t.trim() };
      case 'search':
      case 'navigate':
        return { query: t.trim() };
      case 'weather':
        return { location: t.trim() };
      default:
        return { text: t.trim() };
    }
  }
}
class K extends f {
  constructor() {
    super();
    l(this, 'sttProvider');
    l(this, 'intentParser');
    l(this, 'isInitialized', !1);
    const e = { language: 'he-IL', continuous: !1, interimResults: !0, maxAlternatives: 3 };
    ((this.sttProvider = new G(e, this)), (this.intentParser = new H()), this.setupEventHandlers());
  }
  setupEventHandlers() {
    (this.on('stt-result', async ({ transcript: e, confidence: t }) => {
      try {
        const r = await this.intentParser.parse(e);
        (this.emit('intent-recognized', r),
          c.track('voice_intent_recognized', {
            intent_type: r.type,
            confidence: r.confidence,
            has_parameters: Object.keys(r.parameters).length > 0,
          }));
      } catch (r) {
        (console.error('Intent parsing failed:', r), this.emit('intent-error', r));
      }
    }),
      this.on('stt-error', (e) => {
        this.emit('voice-error', new g('Speech recognition error: '.concat(e), 'STT_ERROR'));
      }));
  }
  async initialize() {
    if (!this.isInitialized) {
      if (!this.sttProvider.isSupported())
        throw new g('Speech recognition not supported', 'STT_NOT_SUPPORTED');
      ((this.isInitialized = !0), c.track('voice_manager_initialized'));
    }
  }
  async startListening() {
    (await this.initialize(),
      await this.sttProvider.startListening(),
      this.emit('listening-started'));
  }
  async stopListening() {
    (await this.sttProvider.stopListening(), this.emit('listening-stopped'));
  }
  isListening() {
    return this.sttProvider.isListening();
  }
  isSupported() {
    return this.sttProvider.isSupported();
  }
  speak(e, t = {}) {
    return new Promise((r, a) => {
      if (!('speechSynthesis' in window)) {
        a(new g('Text-to-speech not supported', 'TTS_NOT_SUPPORTED'));
        return;
      }
      const s = new SpeechSynthesisUtterance(e);
      ((s.lang = t.language || 'he-IL'),
        (s.rate = t.rate || 0.9),
        (s.pitch = t.pitch || 1),
        (s.volume = t.volume || 0.8),
        (s.onend = () => {
          (c.track('voice_tts_completed', { text_length: e.length }), r());
        }),
        (s.onerror = (n) => {
          (c.track('voice_tts_error', { error: n.error }),
            a(new g('Text-to-speech error: '.concat(n.error), 'TTS_ERROR')));
        }),
        speechSynthesis.speak(s),
        c.track('voice_tts_started', { text_length: e.length }));
    });
  }
  stopSpeaking() {
    'speechSynthesis' in window && speechSynthesis.cancel();
  }
  isSpeaking() {
    return 'speechSynthesis' in window && speechSynthesis.speaking;
  }
  async startPressAndHold() {
    (await this.startListening(), document.body.classList.add('voice-listening'));
  }
  async endPressAndHold() {
    (await this.stopListening(), document.body.classList.remove('voice-listening'));
  }
  async processQuickCommand(e) {
    const t = await this.intentParser.parse(e);
    return (this.emit('intent-recognized', t), t);
  }
}
const P = new K();
class Q extends f {
  constructor() {
    super();
    l(this, 'state', {
      isNavigating: !1,
      currentLeg: 0,
      currentStep: 0,
      distanceToNextStep: 0,
      estimatedTimeRemaining: 0,
    });
    l(this, 'settings', {
      voiceGuidance: !0,
      units: 'metric',
      avoidTolls: !1,
      routePreference: 'fastest',
    });
    l(this, 'watchId');
    l(this, 'lastAnnouncedStep', -1);
    this.loadSettings();
  }
  async startNavigation(e, t = 0) {
    try {
      ((this.state = {
        isNavigating: !0,
        currentRoute: e,
        currentLeg: 0,
        currentStep: t,
        distanceToNextStep: 0,
        estimatedTimeRemaining: e.overview.duration,
      }),
        await this.startLocationTracking(),
        this.emit('navigation-started', this.state),
        c.track('navigation_started', {
          total_distance: e.overview.distance,
          total_duration: e.overview.duration,
          legs_count: e.legs.length,
        }),
        this.settings.voiceGuidance && this.announceNextInstruction());
    } catch (r) {
      throw (
        c.track('navigation_start_error', {
          error: r instanceof Error ? r.message : 'Unknown error',
        }),
        r
      );
    }
  }
  async stopNavigation() {
    ((this.state.isNavigating = !1),
      this.stopLocationTracking(),
      this.emit('navigation-stopped'),
      c.track('navigation_stopped', { was_completed: this.isNavigationComplete() }));
  }
  async pauseNavigation() {
    (this.stopLocationTracking(), this.emit('navigation-paused'), c.track('navigation_paused'));
  }
  async resumeNavigation() {
    if (!this.state.currentRoute) throw new g('No active route to resume', 'NO_ACTIVE_ROUTE');
    (await this.startLocationTracking(),
      this.emit('navigation-resumed'),
      c.track('navigation_resumed'));
  }
  async startLocationTracking() {
    if (!navigator.geolocation)
      throw new g('Geolocation not supported', 'GEOLOCATION_NOT_SUPPORTED');
    return new Promise((e, t) => {
      const r = { enableHighAccuracy: !0, timeout: 1e4, maximumAge: 1e3 };
      navigator.geolocation.getCurrentPosition(
        (a) => {
          (this.updateLocation({ lat: a.coords.latitude, lng: a.coords.longitude }),
            (this.watchId = navigator.geolocation.watchPosition(
              (s) => {
                this.updateLocation({ lat: s.coords.latitude, lng: s.coords.longitude });
              },
              (s) => {
                (console.error('Location tracking error:', s),
                  this.emit(
                    'navigation-error',
                    new g(
                      'Location tracking failed: '.concat(s.message),
                      'LOCATION_TRACKING_FAILED'
                    )
                  ));
              },
              r
            )),
            e());
        },
        (a) => {
          t(new g('Failed to get initial location: '.concat(a.message), 'INITIAL_LOCATION_FAILED'));
        },
        r
      );
    });
  }
  stopLocationTracking() {
    this.watchId !== void 0 &&
      (navigator.geolocation.clearWatch(this.watchId), (this.watchId = void 0));
  }
  updateLocation(e) {
    ((this.state.currentLocation = e),
      !(!this.state.currentRoute || !this.state.isNavigating) &&
        (this.updateNavigationProgress(e),
        this.emit('location-updated', { location: e, state: this.state })));
  }
  updateNavigationProgress(e) {
    if (!this.state.currentRoute) return;
    const t = this.state.currentRoute.legs[this.state.currentLeg];
    if (!t) return;
    const r = t.steps[this.state.currentStep];
    r &&
      ((this.state.distanceToNextStep = this.calculateDistance(e, r.end)),
      this.state.distanceToNextStep < 20 && this.advanceToNextStep(),
      this.updateEstimatedTime(),
      this.checkVoiceAnnouncements());
  }
  advanceToNextStep() {
    if (!this.state.currentRoute) return;
    const e = this.state.currentRoute.legs[this.state.currentLeg];
    if (e) {
      if ((this.state.currentStep++, this.state.currentStep >= e.steps.length)) {
        if (
          (this.state.currentLeg++,
          (this.state.currentStep = 0),
          this.state.currentLeg >= this.state.currentRoute.legs.length)
        ) {
          this.completeNavigation();
          return;
        }
        this.emit('leg-completed', {
          completedLeg: this.state.currentLeg - 1,
          currentLeg: this.state.currentLeg,
        });
      }
      (this.settings.voiceGuidance && this.announceNextInstruction(),
        this.emit('step-advanced', this.state),
        c.track('navigation_step_advanced', {
          leg: this.state.currentLeg,
          step: this.state.currentStep,
        }));
    }
  }
  completeNavigation() {
    var e;
    ((this.state.isNavigating = !1),
      this.stopLocationTracking(),
      this.emit('navigation-completed'),
      c.track('navigation_completed', {
        total_legs: (e = this.state.currentRoute) == null ? void 0 : e.legs.length,
        final_leg: this.state.currentLeg,
        final_step: this.state.currentStep,
      }),
      this.settings.voiceGuidance && this.speak('You have arrived at your destination!'));
  }
  updateEstimatedTime() {
    if (!this.state.currentRoute) return;
    let e = 0;
    e += this.state.distanceToNextStep;
    const t = this.state.currentRoute.legs[this.state.currentLeg];
    if (t)
      for (let a = this.state.currentStep + 1; a < t.steps.length; a++) e += t.steps[a].distance;
    for (let a = this.state.currentLeg + 1; a < this.state.currentRoute.legs.length; a++)
      e += this.state.currentRoute.legs[a].distance;
    const r = (50 * 1e3) / 3600;
    this.state.estimatedTimeRemaining = Math.round(e / r);
  }
  checkVoiceAnnouncements() {
    if (!this.settings.voiceGuidance || !this.state.currentRoute) return;
    const e = this.state.currentRoute.legs[this.state.currentLeg];
    if (!e || !e.steps[this.state.currentStep]) return;
    this.state.distanceToNextStep <= 100 &&
      this.lastAnnouncedStep !== this.state.currentStep &&
      (this.announceNextInstruction(), (this.lastAnnouncedStep = this.state.currentStep));
  }
  announceNextInstruction() {
    if (!this.state.currentRoute) return;
    const e = this.state.currentRoute.legs[this.state.currentLeg];
    if (!e) return;
    const t = this.state.currentStep + 1,
      r = e.steps[t];
    if (r) {
      const a = this.formatDistance(this.state.distanceToNextStep),
        s = 'In '.concat(a, ', ').concat(r.instruction);
      this.speak(s);
    }
  }
  speak(e) {
    if ('speechSynthesis' in window) {
      const t = new SpeechSynthesisUtterance(e);
      ((t.rate = 0.9), (t.volume = 0.8), speechSynthesis.speak(t));
    }
  }
  formatDistance(e) {
    if (this.settings.units === 'imperial') {
      const t = e * 3.28084;
      if (t < 1e3) return ''.concat(Math.round(t), ' feet');
      {
        const r = t / 5280;
        return ''.concat(r.toFixed(1), ' miles');
      }
    } else {
      if (e < 1e3) return ''.concat(Math.round(e), ' meters');
      {
        const t = e / 1e3;
        return ''.concat(t.toFixed(1), ' kilometers');
      }
    }
  }
  calculateDistance(e, t) {
    const a = (e.lat * Math.PI) / 180,
      s = (t.lat * Math.PI) / 180,
      n = ((t.lat - e.lat) * Math.PI) / 180,
      o = ((t.lng - e.lng) * Math.PI) / 180,
      d =
        Math.sin(n / 2) * Math.sin(n / 2) +
        Math.cos(a) * Math.cos(s) * Math.sin(o / 2) * Math.sin(o / 2);
    return 6371e3 * (2 * Math.atan2(Math.sqrt(d), Math.sqrt(1 - d)));
  }
  getState() {
    return { ...this.state };
  }
  getCurrentInstruction() {
    if (!this.state.currentRoute) return '';
    const e = this.state.currentRoute.legs[this.state.currentLeg];
    if (!e) return '';
    const t = e.steps[this.state.currentStep];
    return (t == null ? void 0 : t.instruction) || '';
  }
  getUpcomingInstructions(e = 3) {
    if (!this.state.currentRoute) return [];
    if (!this.state.currentRoute.legs[this.state.currentLeg]) return [];
    const r = [];
    let a = this.state.currentStep + 1,
      s = this.state.currentLeg;
    for (; r.length < e && s < this.state.currentRoute.legs.length; ) {
      const n = this.state.currentRoute.legs[s];
      a < n.steps.length ? (r.push(n.steps[a]), a++) : (s++, (a = 0));
    }
    return r;
  }
  updateSettings(e) {
    ((this.settings = { ...this.settings, ...e }),
      this.saveSettings(),
      this.emit('settings-updated', this.settings));
  }
  getSettings() {
    return { ...this.settings };
  }
  loadSettings() {
    try {
      const e = localStorage.getItem('navigation-settings');
      e && (this.settings = { ...this.settings, ...JSON.parse(e) });
    } catch (e) {
      console.warn('Failed to load navigation settings:', e);
    }
  }
  saveSettings() {
    try {
      localStorage.setItem('navigation-settings', JSON.stringify(this.settings));
    } catch (e) {
      console.warn('Failed to save navigation settings:', e);
    }
  }
  isNavigationComplete() {
    return this.state.currentRoute
      ? this.state.currentLeg >= this.state.currentRoute.legs.length
      : !1;
  }
  simulateLocation(e) {}
  simulateProgress(e, t) {}
}
const T = new Q();
class J extends f {
  constructor(e) {
    super();
    l(this, 'map');
    l(this, 'config');
    l(this, 'layers', { route: m.layerGroup(), places: m.layerGroup(), user: m.layerGroup() });
    l(this, 'currentLocation');
    this.config = e;
  }
  async initialize() {
    const e = document.getElementById('map');
    if (!e) throw new Error('Map container not found');
    ((this.map = m.map(e, {
      center: this.config.center || [32.0853, 34.7818],
      zoom: this.config.zoom || 13,
      zoomControl: !0,
      attributionControl: !0,
    })),
      this.updateMapTiles(),
      Object.values(this.layers).forEach((t) => {
        t.addTo(this.map);
      }),
      this.setupMapEvents(),
      c.track('map_initialized', { center: this.config.center, zoom: this.config.zoom }));
  }
  updateMapTiles() {
    if (!this.map) return;
    (this.map.eachLayer((t) => {
      t instanceof m.TileLayer && this.map.removeLayer(t);
    }),
      m
        .tileLayer(y.getMapTileURL(), { attribution: y.getMapTileAttribution(), maxZoom: 19 })
        .addTo(this.map));
  }
  setupMapEvents() {
    this.map &&
      (this.map.on('click', (e) => {
        (this.emit('map-clicked', { location: e.latlng }),
          c.track('map_clicked', {
            lat: e.latlng.lat,
            lng: e.latlng.lng,
            zoom: this.map.getZoom(),
          }));
      }),
      this.map.on('zoomend', () => {
        this.emit('zoom-changed', { zoom: this.map.getZoom() });
      }),
      this.map.on('moveend', () => {
        const e = this.map.getCenter();
        this.emit('center-changed', { center: e });
      }));
  }
  updateTheme(e) {
    (this.updateMapTiles(), c.track('map_theme_updated', { theme: e }));
  }
  setCenter(e, t) {
    this.map &&
      (this.map.setView([e.lat, e.lng], t || this.map.getZoom()),
      this.emit('center-changed', { center: e }));
  }
  addPlace(e, t = {}) {
    if (!this.map) throw new Error('Map not initialized');
    const r = m.marker([e.location.lat, e.location.lng]).bindPopup(
      '\n        <div class="place-popup">\n          <h3>'
        .concat(e.name, '</h3>\n          ')
        .concat(e.address ? '<p>'.concat(e.address, '</p>') : '', '\n          ')
        .concat(
          e.rating
            ? '<div>⭐ '.concat(e.rating, ' (').concat(e.userRatingsTotal || 0, ' reviews)</div>')
            : '',
          '\n          <div class="popup-actions">\n            <button onclick="window.mapManager.focusPlace(\''
        )
        .concat(
          e.id,
          '\')">Details</button>\n            <button onclick="window.mapManager.navigateToPlace(\''
        )
        .concat(e.id, '\')">Navigate</button>\n          </div>\n        </div>\n      ')
    );
    return (
      r.addTo(this.layers.places),
      t.showPopup && r.openPopup(),
      t.focus && this.setCenter(e.location, 16),
      c.track('place_added_to_map', { place_id: e.id, show_popup: t.showPopup, focus: t.focus }),
      r
    );
  }
  addRoute(e, t = {}) {
    if (!this.map) throw new Error('Map not initialized');
    const r = this.decodePolyline(e.overview.polyline),
      a = m.polyline(r, { color: t.color || '#3b82f6', weight: t.weight || 5, opacity: 0.8 });
    if ((a.addTo(this.layers.route), e.legs.length > 0)) {
      const s = e.legs[0],
        n = e.legs[e.legs.length - 1];
      (m.marker([s.start.lat, s.start.lng]).bindPopup('Start').addTo(this.layers.route),
        m.marker([n.end.lat, n.end.lng]).bindPopup('Destination').addTo(this.layers.route));
    }
    return (
      this.map.fitBounds(a.getBounds(), { padding: [20, 20] }),
      c.track('route_added_to_map', {
        distance: e.overview.distance,
        duration: e.overview.duration,
        legs_count: e.legs.length,
      }),
      a
    );
  }
  setUserLocation(e, t) {
    if (!this.map) return;
    ((this.currentLocation = e),
      this.layers.user.clearLayers(),
      m
        .marker([e.lat, e.lng], {
          icon: m.divIcon({
            className: 'user-location-marker',
            html: '<div class="user-location-dot"></div>',
            iconSize: [20, 20],
            iconAnchor: [10, 10],
          }),
        })
        .bindPopup('Your location')
        .addTo(this.layers.user),
      t &&
        m
          .circle([e.lat, e.lng], {
            radius: t,
            weight: 1,
            color: '#3b82f6',
            fillColor: '#3b82f6',
            fillOpacity: 0.1,
          })
          .addTo(this.layers.user),
      this.emit('user-location-updated', { location: e, accuracy: t }));
  }
  getCurrentLocation() {
    return this.currentLocation;
  }
  clearPlaces() {
    this.layers.places.clearLayers();
  }
  clearRoute() {
    this.layers.route.clearLayers();
  }
  clearAll() {
    Object.values(this.layers).forEach((e) => e.clearLayers());
  }
  focusPlace(e) {
    this.emit('place-focused', { placeId: e });
  }
  navigateToPlace(e) {
    this.emit('navigation-requested', { placeId: e });
  }
  decodePolyline(e) {
    const t = [];
    let r = 0;
    const a = e.length;
    let s = 0,
      n = 0;
    for (; r < a; ) {
      let o,
        d = 0,
        h = 0;
      do ((o = e.charCodeAt(r++) - 63), (h |= (o & 31) << d), (d += 5));
      while (o >= 32);
      const p = h & 1 ? ~(h >> 1) : h >> 1;
      ((s += p), (d = 0), (h = 0));
      do ((o = e.charCodeAt(r++) - 63), (h |= (o & 31) << d), (d += 5));
      while (o >= 32);
      const v = h & 1 ? ~(h >> 1) : h >> 1;
      ((n += v), t.push([s / 1e5, n / 1e5]));
    }
    return t;
  }
  destroy() {
    (this.map && (this.map.remove(), (this.map = void 0)), super.destroy());
  }
}
typeof window < 'u' &&
  (window.mapManager = {
    focusPlace: (u) => {
      window.dispatchEvent(new CustomEvent('place-focus', { detail: { placeId: u } }));
    },
    navigateToPlace: (u) => {
      window.dispatchEvent(new CustomEvent('navigation-request', { detail: { placeId: u } }));
    },
  });
class Z extends f {
  constructor(e) {
    super();
    l(this, 'config');
    l(this, 'isInitialized', !1);
    l(this, 'currentView', 'search');
    this.config = e;
  }
  async initialize() {
    this.isInitialized ||
      (this.setupNavigation(),
      this.setupVoiceUI(),
      this.setupPlanningUI(),
      this.setupSearchUI(),
      this.setupUpdateUI(),
      this.setupThemeToggle(),
      (this.isInitialized = !0),
      c.track('ui_manager_initialized'));
  }
  setupNavigation() {
    const e = document.querySelectorAll('.nav-item, .nav-btn'),
      t = document.querySelectorAll('.mobile-view, .app-view');
    e.forEach((r) => {
      r.addEventListener('click', () => {
        const a = r.getAttribute('data-view');
        if (!a) return;
        (e.forEach((n) => n.classList.remove('active')),
          r.classList.add('active'),
          t.forEach((n) => n.classList.remove('active')));
        const s = document.querySelector('[data-view="'.concat(a, '"]'));
        (s && s.classList.add('active'),
          (this.currentView = a),
          this.emit('view-changed', { view: a }),
          c.track('view_changed', { view: a }),
          this.handleViewChange(a));
      });
    });
  }
  handleViewChange(e) {
    switch (e) {
      case 'map':
        this.emit('map-view-activated');
        break;
      case 'trip':
        this.initializeTripPlanning();
        break;
      case 'ai':
        this.initializeAIInterface();
        break;
      case 'voice':
        this.initializeVoiceInterface();
        break;
    }
  }
  setupVoiceUI() {
    const e = document.getElementById('voiceBtn');
    if (!e) return;
    let t = !1;
    const r = async () => {
        if (!t) {
          t = !0;
          try {
            (await this.config.voiceManager.startPressAndHold(),
              e.classList.add('listening'),
              this.showVoiceStatus('Listening... Release to stop'),
              c.track('voice_press_and_hold_started'));
          } catch (s) {
            (console.error('Voice listening failed:', s),
              this.showVoiceStatus('Voice not available'),
              (t = !1));
          }
        }
      },
      a = async () => {
        if (t) {
          t = !1;
          try {
            (await this.config.voiceManager.endPressAndHold(),
              e.classList.remove('listening'),
              this.showVoiceStatus('Processing...'),
              c.track('voice_press_and_hold_ended'));
          } catch (s) {
            (console.error('Voice stop failed:', s), this.showVoiceStatus(''));
          }
        }
      };
    (e.addEventListener('mousedown', r),
      e.addEventListener('mouseup', a),
      e.addEventListener('mouseleave', a),
      e.addEventListener('touchstart', (s) => {
        (s.preventDefault(), r());
      }),
      e.addEventListener('touchend', (s) => {
        (s.preventDefault(), a());
      }),
      e.addEventListener('touchcancel', a));
  }
  setupPlanningUI() {
    (document.querySelectorAll('.duration-option').forEach((a) => {
      a.addEventListener('click', () => {
        (document
          .querySelectorAll('.duration-option')
          .forEach((s) => s.classList.remove('selected')),
          a.classList.add('selected'));
      });
    }),
      document.querySelectorAll('.interest-option').forEach((a) => {
        a.addEventListener('click', () => {
          (a.classList.toggle('selected'),
            document.querySelectorAll('.interest-option.selected').length > 4 &&
              (a.classList.remove('selected'),
              this.showNotification('Maximum 4 interests allowed', 'warning')));
        });
      }));
    const e = document.getElementById('budgetRange'),
      t = document.getElementById('budgetAmount');
    e &&
      t &&
      e.addEventListener('input', () => {
        t.textContent = e.value;
      });
    const r = document.getElementById('generateTripBtn');
    r && r.addEventListener('click', this.handleTripGeneration.bind(this));
  }
  async handleTripGeneration() {
    var r, a, s;
    const e = document.getElementById('generateTripBtn'),
      t = document.getElementById('tripGenerationStatus');
    if (!(!e || !t)) {
      ((e.disabled = !0),
        (e.textContent = 'Generating...'),
        (t.textContent = 'Creating your perfect trip...'));
      try {
        const n = this.getSelectedDuration(),
          o = this.getSelectedInterests(),
          d = parseInt(
            ((r = document.getElementById('budgetRange')) == null ? void 0 : r.value) || '300'
          ),
          h = ((a = document.getElementById('groupType')) == null ? void 0 : a.value) || 'couple',
          p = parseInt(
            ((s = document.getElementById('groupSize')) == null ? void 0 : s.value) || '2'
          ),
          v = await this.config.planningManager.createPlan(
            'AI Generated Trip',
            'Automatically generated based on your preferences'
          );
        ((t.textContent = 'Trip generated successfully!'),
          this.showTripPlan(v),
          c.track('trip_generated', {
            duration: n,
            interests: o.length,
            budget: d,
            group_type: h,
            group_size: p,
          }));
      } catch (n) {
        (console.error('Trip generation failed:', n),
          (t.textContent = 'Failed to generate trip. Please try again.'),
          this.showError('Trip generation failed'));
      } finally {
        ((e.disabled = !1), (e.textContent = 'Generate Smart Trip'));
      }
    }
  }
  setupSearchUI() {
    const e = document.getElementById('searchBtn'),
      t = document.getElementById('freeText');
    if (e && t) {
      const r = async () => {
        const a = t.value.trim();
        if (a)
          try {
            ((e.textContent = 'Searching...'),
              this.showSearchResults([]),
              c.track('search_performed', { query: a }));
          } catch (s) {
            (console.error('Search failed:', s), this.showError('Search failed'));
          } finally {
            e.textContent = 'Search';
          }
      };
      (e.addEventListener('click', r),
        t.addEventListener('keypress', (a) => {
          a.key === 'Enter' && r();
        }));
    }
    document.querySelectorAll('.category-card').forEach((r) => {
      r.addEventListener('click', () => {
        const a = r.getAttribute('data-preset');
        a && this.performQuickSearch(a);
      });
    });
  }
  setupUpdateUI() {
    if (!document.getElementById('updateNotification')) {
      const e = document.createElement('div');
      ((e.id = 'updateNotification'),
        (e.className = 'update-notification hidden'),
        document.body.appendChild(e));
    }
  }
  setupThemeToggle() {
    const e = document.getElementById('themeToggle');
    e &&
      e.addEventListener('click', () => {
        (this.emit('theme-toggle-clicked'), c.track('theme_toggle_clicked'));
      });
  }
  showUpdateNotification(e) {
    const t = document.getElementById('updateNotification');
    t &&
      ((t.innerHTML =
        '\n      <div class="update-card">\n        <div class="update-header">\n          <h3>🎉 Update Available</h3>\n          <button class="close-btn" onclick="this.parentElement.parentElement.parentElement.classList.add(\'hidden\')">×</button>\n        </div>\n        <div class="update-content">\n          <p>Version '
          .concat(e.latest, ' is available</p>\n          ')
          .concat(
            e.urgent ? '<p class="urgent">⚠️ Important security update</p>' : '',
            '\n          <div class="update-actions">\n            <button class="btn-primary" onclick="window.updateManager.applyUpdate()">Update Now</button>\n            <button class="btn-secondary" onclick="this.parentElement.parentElement.parentElement.classList.add(\'hidden\')">Later</button>\n          </div>\n        </div>\n      </div>\n    '
          )),
      t.classList.remove('hidden'),
      c.track('update_notification_displayed', e));
  }
  showError(e) {
    this.showNotification(e, 'error');
  }
  showSuccess(e) {
    this.showNotification(e, 'success');
  }
  showNotification(e, t = 'info') {
    const r = document.createElement('div');
    ((r.className = 'notification notification-'.concat(t)),
      (r.textContent = e),
      document.body.appendChild(r),
      setTimeout(() => {
        r.remove();
      }, 3e3),
      c.track('notification_shown', { message: e, type: t }));
  }
  handleAIResult(e, t) {
    switch (e) {
      case 'plan_create':
        this.showTripPlan(t.plan);
        break;
      case 'search':
        this.showSearchResults(t);
        break;
      case 'weather':
        this.showWeatherInfo(t);
        break;
      default:
        console.log('AI result:', t);
    }
  }
  enterNavigationMode() {
    (document.body.classList.add('navigation-mode'),
      (this.currentView = 'navigation'),
      this.emit('navigation-mode-entered'));
  }
  exitNavigationMode() {
    (document.body.classList.remove('navigation-mode'), this.emit('navigation-mode-exited'));
  }
  getSelectedDuration() {
    const e = document.querySelector('.duration-option.selected');
    return parseInt((e == null ? void 0 : e.getAttribute('data-duration')) || '8');
  }
  getSelectedInterests() {
    const e = document.querySelectorAll('.interest-option.selected');
    return Array.from(e)
      .map((t) => t.getAttribute('data-interest'))
      .filter(Boolean);
  }
  showVoiceStatus(e) {
    const t = document.getElementById('voiceStatus');
    t && (t.textContent = e);
  }
  async performQuickSearch(e) {
    try {
      c.track('quick_search_performed', { category: e });
    } catch (t) {
      (console.error('Quick search failed:', t), this.showError('Search failed'));
    }
  }
  showTripPlan(e) {
    const t = document.getElementById('enhancedTripDisplay');
    t && (t.hidden = !1);
  }
  showSearchResults(e) {
    const t = document.getElementById('list');
    if (t) {
      if (e.length === 0) {
        t.innerHTML = '<div class="no-results">No results found</div>';
        return;
      }
      t.innerHTML = e
        .map((r) =>
          '\n      <div class="result-card">\n        <h3>'
            .concat(r.name, '</h3>\n        <p>')
            .concat(r.address || '', '</p>\n        ')
            .concat(
              r.rating ? '<div class="rating">⭐ '.concat(r.rating, '</div>') : '',
              '\n      </div>\n    '
            )
        )
        .join('');
    }
  }
  showWeatherInfo(e) {
    console.log('Weather info:', e);
  }
  initializeTripPlanning() {}
  initializeAIInterface() {}
  initializeVoiceInterface() {}
}
class Y {
  constructor() {
    l(this, 'config');
    l(this, 'providers', {});
    l(this, 'managers', {});
    l(this, 'aiOrchestrator');
    l(this, 'isInitialized', !1);
    this.config = {
      googleMapsApiKey: 'demo_key_replace_with_real',
      openWeatherApiKey: 'demo_key_replace_with_real',
      routingProvider: 'google',
      weatherProvider: 'openweather',
    };
  }
  async initialize() {
    if (!this.isInitialized) {
      c.track('app_initialization_started');
      try {
        (await this.initializeTheme(),
          await this.initializeProviders(),
          await this.initializeManagers(),
          await this.initializeUI(),
          await this.setupEventHandlers(),
          (this.isInitialized = !0),
          c.track('app_initialization_completed'),
          setTimeout(() => _.checkForUpdates(), 2e3));
      } catch (i) {
        throw (
          c.track('app_initialization_failed', {
            error: i instanceof Error ? i.message : 'Unknown error',
          }),
          i
        );
      }
    }
  }
  async initializeTheme() {
    const i = y.getEffectiveTheme();
    c.track('theme_initialized', { theme: i });
  }
  async initializeProviders() {
    if (this.config.googleMapsApiKey) {
      const i = L(this.config.googleMapsApiKey);
      ((this.providers.googlePlaces = i.places), (this.providers.googleRouting = i.routing));
    }
    (this.config.routingProvider === 'google' && this.providers.googleRouting
      ? (this.providers.routing = this.providers.googleRouting)
      : (this.providers.routing = C()),
      this.config.openWeatherApiKey && (this.providers.weather = A(this.config.openWeatherApiKey)),
      this.providers.routing &&
        this.providers.weather &&
        (this.providers.weatherAwareRouter = x(this.providers.routing, this.providers.weather)),
      (this.providers.places = this.providers.googlePlaces || {
        search: async () => [],
        details: async () => ({}),
        photos: async () => [],
      }),
      c.track('providers_initialized', {
        routing: this.config.routingProvider,
        weather: this.config.weatherProvider,
        places: this.providers.googlePlaces ? 'google' : 'fallback',
      }));
  }
  async initializeManagers() {
    (this.providers.places &&
      this.providers.routing &&
      this.providers.weather &&
      (this.aiOrchestrator = U(
        this.providers.places,
        this.providers.routing,
        this.providers.weather
      )),
      (this.managers.map = new J({ providers: this.providers })),
      (this.managers.ui = new Z({
        planningManager: j,
        voiceManager: P,
        navigationManager: T,
        aiOrchestrator: this.aiOrchestrator,
        providers: this.providers,
      })),
      c.track('managers_initialized'));
  }
  async initializeUI() {
    (await this.managers.ui.initialize(),
      await this.managers.map.initialize(),
      c.track('ui_initialized'));
  }
  async setupEventHandlers() {
    (y.on('theme-changed', (i) => {
      var e;
      ((e = this.managers.map) == null || e.updateTheme(i.theme),
        c.track('theme_changed', { theme: i.theme }));
    }),
      _.on('update-available', (i) => {
        var e;
        ((e = this.managers.ui) == null || e.showUpdateNotification(i),
          c.track('update_notification_shown', i));
      }),
      P.on('intent-recognized', async (i) => {
        var e, t, r;
        if (this.aiOrchestrator)
          try {
            const a = await this.aiOrchestrator.processVoiceIntent(i, {
              location: (e = this.managers.map) == null ? void 0 : e.getCurrentLocation(),
              userPreferences: await this.getUserPreferences(),
            });
            (t = this.managers.ui) == null || t.handleAIResult(i.type, a);
          } catch (a) {
            (console.error('Voice intent processing failed:', a),
              (r = this.managers.ui) == null || r.showError('Failed to process voice command'));
          }
      }),
      T.on('navigation-started', () => {
        var i;
        (i = this.managers.ui) == null || i.enterNavigationMode();
      }),
      T.on('navigation-stopped', () => {
        var i;
        (i = this.managers.ui) == null || i.exitNavigationMode();
      }),
      window.addEventListener('error', (i) => {
        var e;
        (e = this.managers.ui) == null || e.showError('An unexpected error occurred');
      }),
      c.track('event_handlers_setup'));
  }
  async getUserPreferences() {
    return {
      language: navigator.language,
      units: 'metric',
      categories: ['meal', 'scenic', 'activity'],
    };
  }
  getProviders() {
    return this.providers;
  }
  getManagers() {
    return this.managers;
  }
  getAIOrchestrator() {
    return this.aiOrchestrator;
  }
  isReady() {
    return this.isInitialized;
  }
}
const X = new Y();
async function ae() {
  await X.initialize();
}
export { X as app, ae as initializeApp };
//# sourceMappingURL=app-BW-Xwsqc.js.map
