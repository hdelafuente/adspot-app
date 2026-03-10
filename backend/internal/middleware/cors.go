package middleware

import (
	"net/http"
	"strings"
)

// CORS returns a middleware that sets cross-origin headers so a browser-based
// frontend (e.g. Next.js on localhost:3000) can call the API.
//
// allowedOrigins is the list of origins to echo back in the
// Access-Control-Allow-Origin header. If the request Origin is not in the
// list the header is omitted (browser will block the request).
//
// Configure via the ALLOWED_ORIGINS env var (comma-separated):
//
//	ALLOWED_ORIGINS=http://localhost:3000,https://adspot.example.com
func CORS(allowedOrigins []string) func(http.Handler) http.Handler {
	allowed := make(map[string]struct{}, len(allowedOrigins))
	for _, o := range allowedOrigins {
		allowed[strings.TrimSpace(o)] = struct{}{}
	}

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			origin := r.Header.Get("Origin")
			if _, ok := allowed[origin]; ok {
				w.Header().Set("Access-Control-Allow-Origin", origin)
				w.Header().Set("Vary", "Origin")
			}

			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, X-Request-ID")

			// Respond to CORS preflight and stop the chain.
			if r.Method == http.MethodOptions {
				w.WriteHeader(http.StatusNoContent)
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}
