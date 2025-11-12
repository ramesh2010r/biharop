/**
 * API Route Updates for Multi-State Support (After Migration 004)
 * 
 * This document tracks which API routes need to be updated to support state_id filtering
 * after the migration 004_add_states_support.sql is complete.
 * 
 * STRATEGY:
 * - For now: All routes default to state_id=1 (Bihar) to maintain backward compatibility
 * - Later: Accept state parameter in URL (e.g., /api/states/bihar/candidates)
 * 
 * Priority:
 * - HIGH: Routes actively used in production (vote, results, candidates, blog)
 * - MEDIUM: Admin routes (can be updated after user-facing routes)
 * - LOW: Rarely used routes
 */

const API_ROUTE_UPDATES = {
  
  // ========================================
  // HIGH PRIORITY - User-Facing Routes
  // ========================================
  
  "backend/routes/vote.js": {
    priority: "HIGH",
    changes: [
      {
        endpoint: "POST /api/vote",
        current: "Inserts vote without state_id",
        needed: "Add state_id=1 to INSERT statement (default Bihar)",
        query: "INSERT INTO Votes (constituency_id, candidate_id, state_id, ...) VALUES (?, ?, 1, ...)"
      },
      {
        endpoint: "POST /api/vote/check-duplicate",
        current: "Checks duplicates without state filtering",
        needed: "Add state_id=1 to WHERE clause",
        query: "SELECT * FROM Votes WHERE fingerprint_hash = ? AND state_id = 1"
      }
    ]
  },
  
  "backend/routes/results.js": {
    priority: "HIGH",
    changes: [
      {
        endpoint: "GET /api/results",
        current: "Fetches all results",
        needed: "Filter by state_id=1",
        query: "SELECT ... FROM Votes v JOIN Candidates c WHERE v.state_id = 1"
      },
      {
        endpoint: "GET /api/results/constituency/:id",
        current: "Fetches constituency results",
        needed: "Add state_id filter",
        query: "SELECT ... FROM Votes WHERE constituency_id = ? AND state_id = 1"
      },
      {
        endpoint: "GET /api/results/live",
        current: "Real-time results",
        needed: "Filter by state_id=1",
        query: "SELECT ... WHERE state_id = 1 GROUP BY candidate_id"
      }
    ]
  },
  
  "backend/routes/candidates.js": {
    priority: "HIGH",
    changes: [
      {
        endpoint: "GET /api/candidates",
        current: "Lists all candidates",
        needed: "Filter by state_id=1",
        query: "SELECT * FROM Candidates WHERE state_id = 1"
      },
      {
        endpoint: "GET /api/candidates/constituency/:id",
        current: "Candidates by constituency",
        needed: "Add state_id filter for safety",
        query: "SELECT * FROM Candidates WHERE constituency_id = ? AND state_id = 1"
      }
    ]
  },
  
  "backend/routes/constituencies.js": {
    priority: "HIGH",
    changes: [
      {
        endpoint: "GET /api/constituencies",
        current: "Lists all constituencies",
        needed: "Filter by state_id=1",
        query: "SELECT * FROM Constituencies WHERE state_id = 1"
      },
      {
        endpoint: "GET /api/constituencies/:id",
        current: "Single constituency",
        needed: "Add state_id verification",
        query: "SELECT * FROM Constituencies WHERE id = ? AND state_id = 1"
      }
    ]
  },
  
  "backend/routes/districts.js": {
    priority: "HIGH",
    changes: [
      {
        endpoint: "GET /api/districts",
        current: "Lists all districts",
        needed: "Filter by state_id=1",
        query: "SELECT * FROM Districts WHERE state_id = 1"
      }
    ]
  },
  
  "backend/routes/blog.js": {
    priority: "HIGH",
    changes: [
      {
        endpoint: "GET /api/blog",
        current: "Lists all blogs",
        needed: "Filter by state_id=1 (or make state-aware later)",
        query: "SELECT * FROM Blog_Posts WHERE state_id = 1 AND status = 'published'"
      },
      {
        endpoint: "GET /api/blog/:slug",
        current: "Single blog post",
        needed: "Add state_id filter",
        query: "SELECT * FROM Blog_Posts WHERE slug = ? AND state_id = 1"
      }
    ]
  },
  
  // ========================================
  // MEDIUM PRIORITY - Admin Routes
  // ========================================
  
  "backend/routes/admin.js": {
    priority: "MEDIUM",
    changes: [
      {
        endpoint: "POST /api/admin/candidates",
        current: "Creates candidate without state_id",
        needed: "Add state_id=1 to INSERT",
        query: "INSERT INTO Candidates (..., state_id) VALUES (..., 1)"
      },
      {
        endpoint: "GET /api/admin/votes",
        current: "Admin view of all votes",
        needed: "Filter by state_id (or show all with state column)",
        query: "SELECT ..., state_id FROM Votes WHERE state_id = 1"
      },
      {
        endpoint: "POST /api/admin/blog",
        current: "Creates blog without state_id",
        needed: "Add state_id=1 to INSERT",
        query: "INSERT INTO Blog_Posts (..., state_id) VALUES (..., 1)"
      }
    ]
  },
  
  // ========================================
  // FUTURE - New State-Aware Routes
  // ========================================
  
  "NEW: backend/routes/states.js": {
    priority: "FUTURE",
    description: "New route for multi-state support",
    endpoints: [
      {
        endpoint: "GET /api/states",
        purpose: "List all states (for state selector page)",
        query: "SELECT * FROM States WHERE active = 1 ORDER BY name"
      },
      {
        endpoint: "GET /api/states/:slug",
        purpose: "Get single state details",
        query: "SELECT * FROM States WHERE slug = ?"
      },
      {
        endpoint: "GET /api/states/:slug/candidates",
        purpose: "Candidates for specific state",
        query: "SELECT c.* FROM Candidates c JOIN States s ON c.state_id = s.id WHERE s.slug = ?"
      },
      {
        endpoint: "GET /api/states/:slug/results",
        purpose: "Results for specific state",
        query: "SELECT ... FROM Votes v JOIN States s ON v.state_id = s.id WHERE s.slug = ?"
      }
    ]
  }
  
};

/**
 * IMPLEMENTATION PHASES:
 * 
 * Phase 1 (This Week - After Migration):
 * - Add state_id=1 to all existing queries (backward compatible)
 * - Ensures Bihar continues to work as-is
 * - No URL changes yet
 * 
 * Phase 2 (Next Week - URL Restructure):
 * - Create /api/states/:slug/* routes
 * - Update frontend to use new URLs
 * - Keep old routes working with redirects
 * 
 * Phase 3 (Week 3 - Maharashtra Launch):
 * - Activate maharashtra (state_id=2) in States table
 * - Use new state-aware routes for Maharashtra
 * - Bihar remains at state_id=1
 */

module.exports = API_ROUTE_UPDATES;
