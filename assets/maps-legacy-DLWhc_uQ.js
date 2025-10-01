System.register([], function (e, t) {
  'use strict';
  return {
    execute: function () {
      e('c', function (e) {
        const t = { apiKey: e, language: 'en', region: 'US' };
        return { places: new i(t), routing: new r(t) };
      });
      const t = e(
        't',
        new (class {
          config;
          eventQueue = [];
          perfQueue = [];
          flushTimer;
          sessionId;
          constructor(e = {}) {
            ((this.config = {
              enabled: !1,
              endpoint: '/api/telemetry',
              batchSize: 10,
              flushInterval: 3e4,
              ...e,
            }),
              (this.sessionId = this.generateSessionId()),
              this.config.enabled &&
                (this.startPeriodicFlush(), this.setupUnloadHandler(), this.trackPageView()));
          }
          track(e, t) {
            if (!this.config.enabled) return;
            const n = {
              name: e,
              properties: {
                ...t,
                userAgent: navigator.userAgent,
                url: window.location.href,
                referrer: document.referrer,
              },
              timestamp: Date.now(),
              sessionId: this.sessionId,
              userId: this.config.userId,
            };
            (this.eventQueue.push(n), this.checkFlushThreshold());
          }
          trackPerformance(e, t, n) {
            if (!this.config.enabled) return;
            const o = { name: e, value: t, unit: n, timestamp: Date.now() };
            (this.perfQueue.push(o), this.checkFlushThreshold());
          }
          trackError(e, t) {
            this.config.enabled &&
              this.track('error', { message: e.message, stack: e.stack, name: e.name, ...t });
          }
          trackUserAction(e, t, n) {
            this.config.enabled && this.track('user_action', { action: e, target: t, ...n });
          }
          trackPageView(e) {
            this.config.enabled &&
              this.track('page_view', {
                path: e || window.location.pathname,
                title: document.title,
              });
          }
          measureTime(e, t) {
            if (!this.config.enabled) return t();
            const n = performance.now(),
              o = t();
            return o instanceof Promise
              ? o.finally(() => {
                  this.trackPerformance(e, performance.now() - n, 'ms');
                })
              : (this.trackPerformance(e, performance.now() - n, 'ms'), o);
          }
          setUser(e) {
            this.config.userId = e;
          }
          setProperty(e, t) {
            (globalThis.__telemetryGlobals || (globalThis.__telemetryGlobals = {}),
              (globalThis.__telemetryGlobals[e] = t));
          }
          generateSessionId() {
            return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          }
          startPeriodicFlush() {
            this.flushTimer = window.setInterval(() => {
              this.flush();
            }, this.config.flushInterval);
          }
          setupUnloadHandler() {
            (window.addEventListener('beforeunload', () => {
              this.flush(!0);
            }),
              window.addEventListener('visibilitychange', () => {
                'hidden' === document.visibilityState && this.flush();
              }));
          }
          checkFlushThreshold() {
            this.eventQueue.length + this.perfQueue.length >= this.config.batchSize && this.flush();
          }
          async flush(e = !1) {
            if (0 === this.eventQueue.length && 0 === this.perfQueue.length) return;
            const t = [...this.eventQueue],
              n = [...this.perfQueue];
            ((this.eventQueue = []), (this.perfQueue = []));
            const o = {
              events: t.map((e) => ({
                ...e,
                properties: { ...e.properties, ...globalThis.__telemetryGlobals },
              })),
              metrics: n,
              sessionId: this.sessionId,
              timestamp: Date.now(),
            };
            try {
              e && 'sendBeacon' in navigator
                ? navigator.sendBeacon(this.config.endpoint, JSON.stringify(o))
                : await fetch(this.config.endpoint, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      ...(this.config.apiKey && { Authorization: `Bearer ${this.config.apiKey}` }),
                    },
                    body: JSON.stringify(o),
                    keepalive: !0,
                  });
            } catch (i) {
              (console.warn('Failed to send telemetry:', i),
                this.eventQueue.length < 100 &&
                  (this.eventQueue.unshift(...t.slice(-50)),
                  this.perfQueue.unshift(...n.slice(-50))));
            }
          }
          destroy() {
            (this.flushTimer && clearInterval(this.flushTimer), this.flush(!0));
          }
        })()
      );
      'undefined' != typeof window &&
        (function () {
          if ('PerformanceObserver' in window)
            try {
              (new PerformanceObserver((e) => {
                const n = e.getEntries(),
                  o = n[n.length - 1];
                o && t.trackPerformance('lcp', o.startTime, 'ms');
              }).observe({ entryTypes: ['largest-contentful-paint'] }),
                new PerformanceObserver((e) => {
                  e.getEntries().forEach((e) => {
                    t.trackPerformance('fid', e.processingStart - e.startTime, 'ms');
                  });
                }).observe({ entryTypes: ['first-input'] }));
              let e = 0;
              (new PerformanceObserver((t) => {
                t.getEntries().forEach((t) => {
                  t.hadRecentInput || (e += t.value);
                });
              }).observe({ entryTypes: ['layout-shift'] }),
                window.addEventListener('beforeunload', () => {
                  t.trackPerformance('cls', e);
                }));
            } catch (e) {
              console.warn('Web Vitals tracking failed:', e);
            }
        })();
      const n = Object.freeze(
        Object.defineProperty({ __proto__: null, telemetry: t }, Symbol.toStringTag, {
          value: 'Module',
        })
      );
      e('i', n);
      class o extends Error {
        constructor(e, t, n, o = !1) {
          (super(e),
            (this.code = t),
            (this.statusCode = n),
            (this.retryable = o),
            (this.name = 'AppError'));
        }
      }
      e('A', o);
      class i {
        config;
        service;
        constructor(e) {
          ((this.config = e), this.initializeService());
        }
        async initializeService() {
          if (this.service) return;
          'undefined' == typeof google && (await this.loadGoogleMapsAPI());
          const e = document.createElement('div');
          this.service = new google.maps.places.PlacesService(e);
        }
        loadGoogleMapsAPI() {
          return new Promise((e, t) => {
            if ('undefined' != typeof google) return void e();
            const n = document.createElement('script');
            ((n.src = `https://maps.googleapis.com/maps/api/js?key=${this.config.apiKey}&libraries=places&language=${this.config.language || 'en'}`),
              (n.async = !0),
              (n.defer = !0),
              (n.onload = () => e()),
              (n.onerror = () =>
                t(new o('Failed to load Google Maps API', 'MAPS_API_LOAD_FAILED'))),
              document.head.appendChild(n));
          });
        }
        async search(e, n = {}) {
          const i = performance.now();
          try {
            await this.initializeService();
            const r = {
                query: e,
                location: n.near ? new google.maps.LatLng(n.near.lat, n.near.lng) : void 0,
                radius: n.radius || 5e3,
                type: n.type,
                openNow: n.openNow,
              },
              a = (
                await new Promise((e, t) => {
                  this.service.textSearch(r, (n, i) => {
                    i === google.maps.places.PlacesServiceStatus.OK && n
                      ? e(n)
                      : t(new o(`Places search failed: ${i}`, 'PLACES_SEARCH_FAILED'));
                  });
                })
              )
                .map(this.transformPlace)
                .filter(Boolean);
            return (
              t.track('places_search', {
                query: e,
                results_count: a.length,
                duration: performance.now() - i,
                has_location: !!n.near,
              }),
              a
            );
          } catch (r) {
            throw (
              t.track('places_search_error', {
                query: e,
                error: r instanceof Error ? r.message : 'Unknown error',
                duration: performance.now() - i,
              }),
              r
            );
          }
        }
        async details(e) {
          const n = performance.now();
          try {
            await this.initializeService();
            const i = {
                placeId: e,
                fields: [
                  'place_id',
                  'name',
                  'formatted_address',
                  'geometry',
                  'rating',
                  'user_ratings_total',
                  'price_level',
                  'types',
                  'opening_hours',
                  'formatted_phone_number',
                  'website',
                  'reviews',
                  'photos',
                  'vicinity',
                ],
              },
              r = await new Promise((e, t) => {
                this.service.getDetails(i, (n, i) => {
                  i === google.maps.places.PlacesServiceStatus.OK && n
                    ? e(n)
                    : t(new o(`Place details failed: ${i}`, 'PLACE_DETAILS_FAILED'));
                });
              }),
              a = this.transformPlaceDetail(r);
            return (t.track('place_details', { place_id: e, duration: performance.now() - n }), a);
          } catch (i) {
            throw (
              t.track('place_details_error', {
                place_id: e,
                error: i instanceof Error ? i.message : 'Unknown error',
                duration: performance.now() - n,
              }),
              i
            );
          }
        }
        async photos(e, t = 5) {
          try {
            const n = await this.details(e);
            return n.photos?.slice(0, t) || [];
          } catch (n) {
            return (console.warn('Failed to get place photos:', n), []);
          }
        }
        transformPlace(e) {
          return e.place_id && e.name && e.geometry?.location
            ? {
                id: e.place_id,
                name: e.name,
                address: e.formatted_address,
                location: { lat: e.geometry.location.lat(), lng: e.geometry.location.lng() },
                rating: e.rating,
                userRatingsTotal: e.user_ratings_total,
                priceLevel: e.price_level,
                types: e.types,
                openNow: e.opening_hours?.open_now,
                photos: e.photos?.map((e) => ({
                  url: e.getUrl({ maxWidth: 400, maxHeight: 300 }),
                  width: 400,
                  height: 300,
                  attributions: e.html_attributions,
                })),
              }
            : null;
        }
        transformPlaceDetail(e) {
          const t = this.transformPlace(e);
          if (!t) throw new o('Invalid place data', 'INVALID_PLACE_DATA');
          return {
            ...t,
            formattedAddress: e.formatted_address || t.address || '',
            phoneNumber: e.formatted_phone_number,
            website: e.website,
            openingHours: e.opening_hours
              ? {
                  openNow: e.opening_hours.open_now || !1,
                  periods:
                    e.opening_hours.periods?.map((e) => ({
                      open: { day: e.open?.day || 0, time: e.open?.time || '0000' },
                      close: e.close ? { day: e.close.day, time: e.close.time } : void 0,
                    })) || [],
                  weekdayText: e.opening_hours.weekday_text || [],
                }
              : void 0,
            reviews: e.reviews?.map((e) => ({
              author: e.author_name,
              rating: e.rating,
              text: e.text,
              time: e.time,
            })),
            vicinity: e.vicinity,
          };
        }
      }
      class r {
        config;
        service;
        constructor(e) {
          ((this.config = e), this.initializeService());
        }
        async initializeService() {
          this.service ||
            ('undefined' == typeof google && (await this.loadGoogleMapsAPI()),
            (this.service = new google.maps.DirectionsService()));
        }
        loadGoogleMapsAPI() {
          return new Promise((e, t) => {
            if ('undefined' != typeof google) return void e();
            const n = document.createElement('script');
            ((n.src = `https://maps.googleapis.com/maps/api/js?key=${this.config.apiKey}&language=${this.config.language || 'en'}`),
              (n.async = !0),
              (n.defer = !0),
              (n.onload = () => e()),
              (n.onerror = () =>
                t(new o('Failed to load Google Maps API', 'MAPS_API_LOAD_FAILED'))),
              document.head.appendChild(n));
          });
        }
        async route(e) {
          const n = performance.now();
          try {
            await this.initializeService();
            const i = {
                origin: new google.maps.LatLng(e.origin.lat, e.origin.lng),
                destination: new google.maps.LatLng(e.destination.lat, e.destination.lng),
                waypoints: e.via?.map((e) => ({
                  location: new google.maps.LatLng(e.lat, e.lng),
                  stopover: !0,
                })),
                travelMode: this.getTravelMode(e.mode || 'car'),
                avoidTolls: e.avoidTolls || !1,
                drivingOptions: e.departTime
                  ? {
                      departureTime: e.departTime,
                      trafficModel: google.maps.TrafficModel.BEST_GUESS,
                    }
                  : void 0,
                unitSystem: google.maps.UnitSystem.METRIC,
              },
              r = await new Promise((e, t) => {
                this.service.route(i, (n, i) => {
                  i === google.maps.DirectionsStatus.OK && n
                    ? e(n)
                    : t(new o(`Route calculation failed: ${i}`, 'ROUTE_CALCULATION_FAILED'));
                });
              }),
              a = this.transformRoute(r);
            return (
              t.track('route_calculation', {
                mode: e.mode,
                has_waypoints: !!e.via?.length,
                duration: performance.now() - n,
                distance: a.overview.distance,
                travel_time: a.overview.duration,
              }),
              a
            );
          } catch (i) {
            throw (
              t.track('route_calculation_error', {
                mode: e.mode,
                error: i instanceof Error ? i.message : 'Unknown error',
                duration: performance.now() - n,
              }),
              i
            );
          }
        }
        getTravelMode(e) {
          switch (e) {
            case 'walk':
              return google.maps.TravelMode.WALKING;
            case 'bike':
              return google.maps.TravelMode.BICYCLING;
            case 'transit':
              return google.maps.TravelMode.TRANSIT;
            default:
              return google.maps.TravelMode.DRIVING;
          }
        }
        transformRoute(e) {
          const t = e.routes[0];
          if (!t) throw new o('No route found', 'NO_ROUTE_FOUND');
          return {
            legs: t.legs.map((e) => ({
              start: { lat: e.start_location.lat(), lng: e.start_location.lng() },
              end: { lat: e.end_location.lat(), lng: e.end_location.lng() },
              duration: e.duration?.value || 0,
              distance: e.distance?.value || 0,
              steps: e.steps.map((e) => ({
                instruction: e.instructions,
                duration: e.duration?.value || 0,
                distance: e.distance?.value || 0,
                start: { lat: e.start_location.lat(), lng: e.start_location.lng() },
                end: { lat: e.end_location.lat(), lng: e.end_location.lng() },
                polyline: e.polyline?.points || '',
                maneuver: e.maneuver,
              })),
              polyline: e.steps.map((e) => e.polyline?.points).join(''),
            })),
            overview: {
              polyline: t.overview_polyline?.points || '',
              bounds: {
                north: t.bounds?.getNorthEast().lat() || 0,
                south: t.bounds?.getSouthWest().lat() || 0,
                east: t.bounds?.getNorthEast().lng() || 0,
                west: t.bounds?.getSouthWest().lng() || 0,
              },
              duration: t.legs.reduce((e, t) => e + (t.duration?.value || 0), 0),
              distance: t.legs.reduce((e, t) => e + (t.distance?.value || 0), 0),
            },
            warnings: t.warnings,
            summary: t.summary,
          };
        }
      }
    },
  };
});
//# sourceMappingURL=maps-legacy-DLWhc_uQ.js.map
