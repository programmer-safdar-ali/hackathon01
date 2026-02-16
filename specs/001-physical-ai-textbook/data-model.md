# Data Model: Physical AI & Humanoid Robotics AI-Native Textbook

**Branch**: `001-physical-ai-textbook` | **Date**: 2026-02-16

## Overview

Two storage systems:
- **Neon Serverless Postgres**: Relational data (users, profiles, chat history, rate limits)
- **Qdrant Cloud**: Vector embeddings (content chunks for RAG search)

## Postgres Schema

### users

Managed by Better-Auth. Schema follows Better-Auth conventions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | TEXT | PK | Better-Auth generated user ID |
| email | TEXT | UNIQUE, NOT NULL | User email address |
| email_verified | BOOLEAN | DEFAULT false | Email verification status |
| name | TEXT | NULLABLE | Display name |
| image | TEXT | NULLABLE | Avatar URL |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Account creation time |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Last update time |

### sessions

Managed by Better-Auth. Used by FastAPI to validate auth.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | TEXT | PK | Session ID |
| user_id | TEXT | FK → users.id, NOT NULL | Owner |
| token | TEXT | UNIQUE, NOT NULL | Session token (cookie value) |
| expires_at | TIMESTAMPTZ | NOT NULL | Expiry time |
| ip_address | TEXT | NULLABLE | Client IP |
| user_agent | TEXT | NULLABLE | Client user agent |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Session start |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Last activity |

### user_profiles

Application-specific user preferences. One-to-one with users.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Profile ID |
| user_id | TEXT | FK → users.id, UNIQUE, NOT NULL | Owner |
| background | TEXT | NOT NULL, CHECK IN ('software', 'hardware') | User background type |
| skill_level | TEXT | NOT NULL, DEFAULT 'intermediate', CHECK IN ('beginner', 'intermediate', 'advanced') | Current skill level |
| language_preference | TEXT | NOT NULL, DEFAULT 'en', CHECK IN ('en', 'ur') | Preferred language |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Created |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Last update |

### chat_conversations

Persisted for authenticated users only. Anonymous conversations are ephemeral (client-side only).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Conversation ID |
| user_id | TEXT | FK → users.id, NOT NULL | Owner |
| title | TEXT | NULLABLE | Auto-generated from first message |
| current_module | TEXT | NULLABLE | Module context when conversation started |
| current_chapter | TEXT | NULLABLE | Chapter context when conversation started |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Started |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Last message time |

**Index**: `idx_chat_conversations_user_id` on `user_id` for listing user conversations.

### chat_messages

Individual messages within a conversation.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Message ID |
| conversation_id | UUID | FK → chat_conversations.id, NOT NULL | Parent conversation |
| role | TEXT | NOT NULL, CHECK IN ('user', 'assistant') | Message sender |
| content | TEXT | NOT NULL | Message text |
| citations | JSONB | NULLABLE | Array of {module, chapter, section, url} |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Sent time |

**Index**: `idx_chat_messages_conversation_id` on `conversation_id` for message retrieval.
**Ordering**: Messages within a conversation ordered by `created_at ASC`.

### rate_limits

Tracks chatbot query counts per user/IP for rate limiting.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Record ID |
| identifier | TEXT | NOT NULL | User ID (authenticated) or IP hash (anonymous) |
| identifier_type | TEXT | NOT NULL, CHECK IN ('user', 'ip') | Type of identifier |
| query_count | INTEGER | NOT NULL, DEFAULT 0 | Queries in current window |
| window_start | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Current rate limit window start |

**Index**: `idx_rate_limits_identifier` on `(identifier, identifier_type)` for fast lookup.
**Logic**: Reset `query_count` to 0 and update `window_start` when current time > window_start + 1 hour.

## Qdrant Collection Schema

### Collection: `textbook_content`

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Unique chunk identifier |
| vector | float[1536] | text-embedding-3-small embedding |

**Payload fields** (filterable metadata):

| Field | Type | Description |
|-------|------|-------------|
| module | string | Module identifier (e.g., "module-1-ros2") |
| chapter | string | Chapter identifier (e.g., "01-ros2-architecture") |
| section | string | Section heading within chapter |
| text | string | Raw text content of the chunk |
| difficulty | string | "beginner", "intermediate", or "advanced" |
| url | string | Relative URL path to the chapter page |
| chunk_index | integer | Position of chunk within the chapter (for ordering) |

**Indexes**: Payload indexes on `module` and `difficulty` for filtered search.

**Chunking strategy**: ~500 tokens per chunk, 50-token overlap between consecutive chunks. Each chapter produces 5-15 chunks depending on length.

## Entity Relationships

```text
users (1) ──── (1) user_profiles
  │
  ├──── (0..*) sessions
  │
  ├──── (0..*) chat_conversations
  │                 │
  │                 └──── (1..*) chat_messages
  │
  └──── (0..*) rate_limits

[Qdrant: textbook_content collection — independent, populated by ingestion pipeline]
```

## State Transitions

### User Profile Lifecycle
1. **Created**: After first sign-up, user selects background + skill level → profile row inserted.
2. **Updated**: User changes skill level or language preference via settings → profile row updated.
3. **No deletion**: Profile persists for the lifetime of the user account.

### Chat Conversation Lifecycle
1. **Created**: User sends first message in a new chat thread → conversation row inserted.
2. **Active**: Messages appended to conversation. `updated_at` refreshed on each message.
3. **Archived**: No explicit archive state. Old conversations remain readable but scroll off the UI.

### Rate Limit Window Lifecycle
1. **Created**: First query from an identifier → new row with `query_count = 1`.
2. **Incremented**: Subsequent queries within the same 1-hour window → `query_count += 1`.
3. **Reset**: Query arrives after `window_start + 1 hour` → reset `query_count = 1`, update `window_start` to now.

## Validation Rules

- **email**: Must be valid email format (RFC 5322). Enforced by Better-Auth.
- **background**: Must be exactly "software" or "hardware". No other values.
- **skill_level**: Must be one of "beginner", "intermediate", "advanced".
- **language_preference**: Must be one of "en", "ur".
- **chat message content**: Maximum 2000 characters (per edge case spec).
- **rate_limit query_count**: Maximum 10 (anonymous) or 60 (authenticated) per 1-hour window.
- **Qdrant text chunk**: Maximum ~500 tokens. If source section exceeds this, split with overlap.
