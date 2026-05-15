-- ============================================================================
-- SUPABASE FULL MIGRATION SQL (v2 — snake_case columns)
-- Project: Demo-Reno / In & Out Demolition
-- Generated: 2026-05-15
-- ============================================================================
-- INSTRUCTIONS:
--   1. Go to https://supabase.com/dashboard/project/kvhhlvwoarzanasrnjto/sql/new
--   2. Paste this ENTIRE script
--   3. Click "Run"
-- ============================================================================

-- Clean up any previous attempt (drop tables if they exist with wrong schema)
DROP TABLE IF EXISTS "NotificationSettings" CASCADE;
DROP TABLE IF EXISTS "EmailLog" CASCADE;
DROP TABLE IF EXISTS "GalleryImage" CASCADE;
DROP TABLE IF EXISTS "Testimonial" CASCADE;
DROP TABLE IF EXISTS "SiteAudit" CASCADE;
DROP TABLE IF EXISTS "VisitorTracking" CASCADE;
DROP TABLE IF EXISTS "Quote" CASCADE;
DROP TABLE IF EXISTS "Project" CASCADE;
DROP TABLE IF EXISTS "LeadActivity" CASCADE;
DROP TABLE IF EXISTS "Appointment" CASCADE;
DROP TABLE IF EXISTS "Lead" CASCADE;
DROP TABLE IF EXISTS "Owner" CASCADE;

-- ============================================================================
-- STEP 0: Enable required extensions
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- STEP 1: Create ENUM types for status fields
-- ============================================================================
DO $$
BEGIN
    CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'qualified', 'proposal', 'won', 'lost', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE TYPE lead_priority AS ENUM ('low', 'medium', 'high', 'urgent');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE TYPE funnel_stage_enum AS ENUM ('awareness', 'interest', 'consideration', 'intent', 'evaluation', 'purchase');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE TYPE appointment_status AS ENUM ('scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE TYPE project_status AS ENUM ('pending', 'in-progress', 'completed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE TYPE quote_status AS ENUM ('draft', 'sent', 'viewed', 'accepted', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE TYPE email_status AS ENUM ('sent', 'failed', 'queued');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE TYPE lead_source AS ENUM ('website', 'phone', 'referral', 'walk-in');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE TYPE activity_type AS ENUM ('call', 'email', 'visit', 'estimate', 'follow-up');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE TYPE tracking_action AS ENUM ('view', 'click', 'form_start', 'form_submit', 'estimate_request', 'call_click');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE TYPE gallery_category AS ENUM ('interior', 'exterior', 'cabinet', 'deck', 'commercial');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE TYPE audit_metric AS ENUM ('page_view', 'form_submission', 'phone_click', 'estimate_request', 'appointment_booking');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE TYPE email_type AS ENUM ('lead_notification', 'appointment_confirm', 'quote_sent');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;


-- ============================================================================
-- STEP 2: Create all 12 tables — ALL columns in snake_case
-- ============================================================================

-- ---------- OWNER / ADMIN ----------
CREATE TABLE IF NOT EXISTS "Owner" (
    "id"            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "email"         TEXT NOT NULL UNIQUE,
    "password_hash"  TEXT NOT NULL,
    "name"          TEXT NOT NULL,
    "phone"         TEXT,
    "company"       TEXT NOT NULL DEFAULT 'In & Out Demolition',
    "address"       TEXT,
    "google_email"   TEXT,
    "google_token"   TEXT,
    "slack_webhook"  TEXT,
    "created_at"     TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at"     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- LEADS & CONTACTS ----------
CREATE TABLE IF NOT EXISTS "Lead" (
    "id"            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "first_name"     TEXT NOT NULL,
    "last_name"      TEXT NOT NULL,
    "email"         TEXT NOT NULL,
    "phone"         TEXT,
    "address"       TEXT,
    "city"          TEXT,
    "postal_code"    TEXT,
    "service_type"   TEXT,
    "project_desc"   TEXT,
    "budget"        TEXT,
    "how_heard"      TEXT,
    "lead_source"    lead_source NOT NULL DEFAULT 'website',
    "status"        lead_status NOT NULL DEFAULT 'new',
    "priority"      lead_priority NOT NULL DEFAULT 'medium',
    "notes"         TEXT,
    "funnel_stage"   funnel_stage_enum NOT NULL DEFAULT 'awareness',
    "assigned_to"    TEXT,
    "estimated_value" DOUBLE PRECISION,
    "closed_value"   DOUBLE PRECISION,
    "closed_at"      TIMESTAMPTZ,
    "last_contacted" TIMESTAMPTZ,
    "created_at"     TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at"     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "Lead_email_idx" ON "Lead"("email");
CREATE INDEX IF NOT EXISTS "Lead_status_idx" ON "Lead"("status");
CREATE INDEX IF NOT EXISTS "Lead_funnel_stage_idx" ON "Lead"("funnel_stage");
CREATE INDEX IF NOT EXISTS "Lead_lead_source_idx" ON "Lead"("lead_source");
CREATE INDEX IF NOT EXISTS "Lead_priority_idx" ON "Lead"("priority");
CREATE INDEX IF NOT EXISTS "Lead_created_at_idx" ON "Lead"("created_at");

-- ---------- LEAD ACTIVITY ----------
CREATE TABLE IF NOT EXISTS "LeadActivity" (
    "id"          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "lead_id"      UUID NOT NULL REFERENCES "Lead"("id") ON DELETE CASCADE,
    "type"        activity_type NOT NULL,
    "description" TEXT NOT NULL,
    "outcome"     TEXT,
    "created_at"   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "LeadActivity_lead_id_idx" ON "LeadActivity"("lead_id");
CREATE INDEX IF NOT EXISTS "LeadActivity_type_idx" ON "LeadActivity"("type");
CREATE INDEX IF NOT EXISTS "LeadActivity_created_at_idx" ON "LeadActivity"("created_at");

-- ---------- APPOINTMENTS ----------
CREATE TABLE IF NOT EXISTS "Appointment" (
    "id"           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "lead_id"       UUID REFERENCES "Lead"("id") ON DELETE SET NULL,
    "first_name"    TEXT NOT NULL,
    "last_name"     TEXT NOT NULL,
    "email"        TEXT NOT NULL,
    "phone"        TEXT,
    "address"      TEXT,
    "service_type"  TEXT,
    "notes"        TEXT,
    "date"         TIMESTAMPTZ NOT NULL,
    "duration"     INTEGER NOT NULL DEFAULT 60,
    "status"       appointment_status NOT NULL DEFAULT 'scheduled',
    "google_event_id" TEXT,
    "created_at"    TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at"    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "Appointment_date_idx" ON "Appointment"("date");
CREATE INDEX IF NOT EXISTS "Appointment_status_idx" ON "Appointment"("status");
CREATE INDEX IF NOT EXISTS "Appointment_lead_id_idx" ON "Appointment"("lead_id");
CREATE INDEX IF NOT EXISTS "Appointment_email_idx" ON "Appointment"("email");

-- ---------- PROJECTS ----------
CREATE TABLE IF NOT EXISTS "Project" (
    "id"           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "lead_id"       UUID REFERENCES "Lead"("id") ON DELETE SET NULL,
    "name"         TEXT NOT NULL,
    "description"  TEXT,
    "service_type"  TEXT,
    "status"       project_status NOT NULL DEFAULT 'pending',
    "start_date"    TIMESTAMPTZ,
    "end_date"      TIMESTAMPTZ,
    "estimated_cost" DOUBLE PRECISION,
    "actual_cost"   DOUBLE PRECISION,
    "address"      TEXT,
    "notes"        TEXT,
    "team_members"  JSONB,
    "before_images" JSONB,
    "after_images"  JSONB,
    "created_at"    TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at"    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "Project_status_idx" ON "Project"("status");
CREATE INDEX IF NOT EXISTS "Project_lead_id_idx" ON "Project"("lead_id");
CREATE INDEX IF NOT EXISTS "Project_created_at_idx" ON "Project"("created_at");

-- ---------- QUOTES / ESTIMATES ----------
CREATE TABLE IF NOT EXISTS "Quote" (
    "id"          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "lead_id"      UUID REFERENCES "Lead"("id") ON DELETE SET NULL,
    "project_id"   UUID REFERENCES "Project"("id") ON DELETE SET NULL,
    "title"       TEXT NOT NULL,
    "items"       JSONB NOT NULL DEFAULT '[]'::jsonb,
    "subtotal"    DOUBLE PRECISION NOT NULL,
    "tax"         DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total"       DOUBLE PRECISION NOT NULL,
    "status"      quote_status NOT NULL DEFAULT 'draft',
    "valid_until"  TIMESTAMPTZ,
    "notes"       TEXT,
    "created_at"   TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at"   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "Quote_status_idx" ON "Quote"("status");
CREATE INDEX IF NOT EXISTS "Quote_lead_id_idx" ON "Quote"("lead_id");
CREATE INDEX IF NOT EXISTS "Quote_project_id_idx" ON "Quote"("project_id");

-- ---------- VISITOR TRACKING ----------
CREATE TABLE IF NOT EXISTS "VisitorTracking" (
    "id"               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "lead_id"           UUID REFERENCES "Lead"("id") ON DELETE SET NULL,
    "session_id"        TEXT NOT NULL,
    "page"             TEXT NOT NULL,
    "referrer"         TEXT,
    "utm_source"        TEXT,
    "utm_medium"        TEXT,
    "utm_campaign"      TEXT,
    "utm_term"          TEXT,
    "utm_content"       TEXT,
    "action"           tracking_action,
    "element_id"        TEXT,
    "user_agent"        TEXT,
    "ip_address"        TEXT,
    "screen_resolution" TEXT,
    "created_at"        TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "VisitorTracking_session_id_idx" ON "VisitorTracking"("session_id");
CREATE INDEX IF NOT EXISTS "VisitorTracking_page_idx" ON "VisitorTracking"("page");
CREATE INDEX IF NOT EXISTS "VisitorTracking_action_idx" ON "VisitorTracking"("action");
CREATE INDEX IF NOT EXISTS "VisitorTracking_created_at_idx" ON "VisitorTracking"("created_at");

-- ---------- SITE AUDIT ----------
CREATE TABLE IF NOT EXISTS "SiteAudit" (
    "id"       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "metric"   audit_metric NOT NULL,
    "value"    DOUBLE PRECISION NOT NULL DEFAULT 1,
    "metadata" JSONB,
    "date"     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "SiteAudit_metric_idx" ON "SiteAudit"("metric");
CREATE INDEX IF NOT EXISTS "SiteAudit_date_idx" ON "SiteAudit"("date");

-- ---------- TESTIMONIALS ----------
CREATE TABLE IF NOT EXISTS "Testimonial" (
    "id"         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name"       TEXT NOT NULL,
    "location"   TEXT,
    "rating"     INTEGER NOT NULL DEFAULT 5 CHECK ("rating" >= 1 AND "rating" <= 5),
    "text"       TEXT NOT NULL,
    "service"    TEXT,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "is_approved" BOOLEAN NOT NULL DEFAULT true,
    "created_at"  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "Testimonial_is_featured_idx" ON "Testimonial"("is_featured");
CREATE INDEX IF NOT EXISTS "Testimonial_is_approved_idx" ON "Testimonial"("is_approved");

-- ---------- GALLERY ----------
CREATE TABLE IF NOT EXISTS "GalleryImage" (
    "id"          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "title"       TEXT NOT NULL,
    "description" TEXT,
    "category"    gallery_category NOT NULL,
    "before_url"   TEXT,
    "after_url"    TEXT,
    "is_featured"  BOOLEAN NOT NULL DEFAULT false,
    "sort_order"   INTEGER NOT NULL DEFAULT 0,
    "created_at"   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "GalleryImage_category_idx" ON "GalleryImage"("category");
CREATE INDEX IF NOT EXISTS "GalleryImage_is_featured_idx" ON "GalleryImage"("is_featured");
CREATE INDEX IF NOT EXISTS "GalleryImage_sort_order_idx" ON "GalleryImage"("sort_order");

-- ---------- EMAIL LOG ----------
CREATE TABLE IF NOT EXISTS "EmailLog" (
    "id"        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "to"        TEXT NOT NULL,
    "subject"   TEXT NOT NULL,
    "body"      TEXT NOT NULL,
    "status"    email_status NOT NULL DEFAULT 'sent',
    "type"      email_type NOT NULL,
    "metadata"  JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "EmailLog_to_idx" ON "EmailLog"("to");
CREATE INDEX IF NOT EXISTS "EmailLog_status_idx" ON "EmailLog"("status");
CREATE INDEX IF NOT EXISTS "EmailLog_type_idx" ON "EmailLog"("type");
CREATE INDEX IF NOT EXISTS "EmailLog_created_at_idx" ON "EmailLog"("created_at");

-- ---------- NOTIFICATION SETTINGS ----------
CREATE TABLE IF NOT EXISTS "NotificationSettings" (
    "id"              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "new_lead"         BOOLEAN NOT NULL DEFAULT true,
    "new_appointment"  BOOLEAN NOT NULL DEFAULT true,
    "quote_sent"       BOOLEAN NOT NULL DEFAULT true,
    "project_update"   BOOLEAN NOT NULL DEFAULT true,
    "daily_summary"    BOOLEAN NOT NULL DEFAULT true,
    "weekly_report"    BOOLEAN NOT NULL DEFAULT true,
    "email_enabled"    BOOLEAN NOT NULL DEFAULT true,
    "slack_enabled"    BOOLEAN NOT NULL DEFAULT false,
    "created_at"       TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at"       TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ============================================================================
-- STEP 3: Enable Row Level Security on ALL tables
-- ============================================================================
ALTER TABLE "Owner" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Lead" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LeadActivity" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Appointment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Project" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Quote" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "VisitorTracking" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SiteAudit" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Testimonial" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "GalleryImage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "EmailLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "NotificationSettings" ENABLE ROW LEVEL SECURITY;


-- ============================================================================
-- STEP 4: RLS Policies — Public Read
-- ============================================================================
CREATE POLICY "Public read approved testimonials"
    ON "Testimonial" FOR SELECT
    USING ("is_approved" = true);

CREATE POLICY "Public read gallery"
    ON "GalleryImage" FOR SELECT
    USING (true);

CREATE POLICY "Public read site audit"
    ON "SiteAudit" FOR SELECT
    USING (true);


-- ============================================================================
-- STEP 5: RLS Policies — Anonymous INSERT (tracking, leads, appointments)
-- ============================================================================
CREATE POLICY "Anonymous insert visitor tracking"
    ON "VisitorTracking" FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Anonymous insert site audit"
    ON "SiteAudit" FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Anonymous insert lead"
    ON "Lead" FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Anonymous insert appointment"
    ON "Appointment" FOR INSERT
    WITH CHECK (true);


-- ============================================================================
-- STEP 6: RLS Policies — Full access for authenticated + anon
-- ============================================================================
CREATE POLICY "Full access Owner" ON "Owner" FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);
CREATE POLICY "Full access Lead" ON "Lead" FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);
CREATE POLICY "Full access LeadActivity" ON "LeadActivity" FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);
CREATE POLICY "Full access Appointment" ON "Appointment" FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);
CREATE POLICY "Full access Project" ON "Project" FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);
CREATE POLICY "Full access Quote" ON "Quote" FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);
CREATE POLICY "Full access VisitorTracking" ON "VisitorTracking" FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);
CREATE POLICY "Full access SiteAudit" ON "SiteAudit" FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);
CREATE POLICY "Full access Testimonial" ON "Testimonial" FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);
CREATE POLICY "Full access GalleryImage" ON "GalleryImage" FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);
CREATE POLICY "Full access EmailLog" ON "EmailLog" FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);
CREATE POLICY "Full access NotificationSettings" ON "NotificationSettings" FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);


-- ============================================================================
-- STEP 7: Auto-update triggers for updated_at
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updated_at" = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DO $$
DECLARE
    tbl TEXT;
BEGIN
    FOR tbl IN SELECT unnest(ARRAY['Owner','Lead','Appointment','Project','Quote','NotificationSettings'])
    LOOP
        EXECUTE format(
            'CREATE TRIGGER set_updated_at BEFORE UPDATE ON %I
             FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();',
            tbl
        );
    END LOOP;
END $$;


-- ============================================================================
-- STEP 8: Seed Data
-- ============================================================================
INSERT INTO "Owner" ("email", "password_hash", "name", "company", "phone", "address")
VALUES (
    'owner@inoutdemolition.com',
    '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu6GK',
    'In & Out Demolition',
    'In & Out Demolition',
    '(437) 535-0494',
    '3300 Highway 7 W, Suite 600, Vaughan ON L4K 4M3'
);

INSERT INTO "NotificationSettings" ("id", "new_lead", "new_appointment", "quote_sent", "project_update", "daily_summary", "weekly_report", "email_enabled", "slack_enabled")
VALUES (
    '00000000-0000-0000-0000-000000000001',
    true, true, true, true, true, true, true, false
);

INSERT INTO "Testimonial" ("name", "location", "rating", "text", "service", "is_featured") VALUES
    ('Sarah M.', 'Vaughan, ON', 5, 'Absolutely incredible work! They transformed our outdated kitchen cabinets into a modern masterpiece. The team was professional, punctual, and the attention to detail was outstanding.', 'Cabinet Refinishing', true),
    ('James T.', 'Toronto, ON', 5, 'From start to finish, the experience was seamless. The crew was respectful of our home and completed the interior painting ahead of schedule. Highly recommend!', 'Interior Painting', true),
    ('Priya K.', 'Mississauga, ON', 5, 'Our commercial space looks brand new. The team worked around our business hours and the quality of the exterior painting exceeded our expectations.', 'Commercial Painting', true),
    ('Michael & Lisa R.', 'Richmond Hill, ON', 4, 'Great value for the quality of work. Our deck and fence look amazing. The only minor delay was due to weather, but they kept us informed throughout.', 'Deck & Fence', true),
    ('David W.', 'Brampton, ON', 5, 'The color consultation service was a game-changer. They helped us choose the perfect palette for our home exterior. Neighbors keep complimenting us!', 'Color Consultation', true),
    ('Anna S.', 'Markham, ON', 5, 'Professional, clean, and incredibly skilled. They painted our entire two-story home in just 3 days and left everything spotless. Will definitely use again!', 'Interior Painting', false),
    ('Robert C.', 'Oakville, ON', 4, 'Excellent work on our exterior. The prep work was thorough and the finish is flawless. A bit pricey but absolutely worth every penny.', 'Exterior Painting', false),
    ('Emily & John D.', 'Vaughan, ON', 5, 'We had our office space painted and it looks incredible. The team was flexible with our schedule and the result speaks for itself. 10/10!', 'Commercial Painting', false);

INSERT INTO "GalleryImage" ("title", "description", "category", "is_featured", "sort_order") VALUES
    ('Modern Living Room Transformation', 'Complete interior repaint with accent wall', 'interior', true, 1),
    ('Kitchen Cabinet Refresh', 'White cabinet refinishing with gold hardware', 'cabinet', true, 2),
    ('Victorian Home Exterior', 'Full exterior repaint preserving period details', 'exterior', true, 3),
    ('Commercial Office Space', 'Modern office repaint for tech startup', 'commercial', true, 4),
    ('Deck & Fence Restoration', 'Cedar deck and fence staining', 'deck', true, 5),
    ('Spa Bathroom Renovation', 'Moisture-resistant paint in luxury bathroom', 'interior', true, 6),
    ('Heritage Home Exterior', 'Color-matched historical exterior restoration', 'exterior', false, 7),
    ('Retail Store Front', 'Eye-catching commercial storefront repaint', 'commercial', false, 8),
    ('Open Concept Kitchen', 'Two-tone kitchen cabinet transformation', 'cabinet', false, 9),
    ('Backyard Deck Makeover', 'Composite deck with custom staining', 'deck', false, 10),
    ('Master Bedroom Retreat', 'Calming neutral tones with accent ceiling', 'interior', false, 11),
    ('Townhouse Exterior Refresh', 'Modern color palette for contemporary townhome', 'exterior', false, 12);


-- ============================================================================
-- DONE! Verification
-- ============================================================================
DO $$
DECLARE
    table_count INTEGER;
    policy_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO table_count FROM information_schema.tables
        WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
        AND table_name IN ('Owner','Lead','LeadActivity','Appointment','Project','Quote','VisitorTracking','SiteAudit','Testimonial','GalleryImage','EmailLog','NotificationSettings');

    SELECT COUNT(*) INTO policy_count FROM pg_policies
        WHERE schemaname = 'public';

    RAISE NOTICE '========================================';
    RAISE NOTICE 'Migration Complete!';
    RAISE NOTICE 'Tables created: %', table_count;
    RAISE NOTICE 'RLS policies created: %', policy_count;
    RAISE NOTICE '========================================';
END $$;
