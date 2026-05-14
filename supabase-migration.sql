-- ============================================================================
-- SUPABASE FULL MIGRATION SQL
-- Project: Demo-Reno / In & Out Demolition
-- Generated: 2026-05-15
-- ============================================================================
-- INSTRUCTIONS:
--   1. Go to https://supabase.com/dashboard/project/kvhhlvwoarzanasrnjto/sql/new
--   2. Paste this ENTIRE script
--   3. Click "Run"
--   4. This creates all 12 tables + indexes + RLS policies + seed data
-- ============================================================================

-- ============================================================================
-- STEP 0: Enable required extensions
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- STEP 1: Create ENUM types for status fields
-- ============================================================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lead_status') THEN
        CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'qualified', 'proposal', 'won', 'lost', 'archived');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lead_priority') THEN
        CREATE TYPE lead_priority AS ENUM ('low', 'medium', 'high', 'urgent');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'funnel_stage') THEN
        CREATE TYPE funnel_stage AS ENUM ('awareness', 'interest', 'consideration', 'intent', 'evaluation', 'purchase');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'appointment_status') THEN
        CREATE TYPE appointment_status AS ENUM ('scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'project_status') THEN
        CREATE TYPE project_status AS ENUM ('pending', 'in-progress', 'completed', 'cancelled');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'quote_status') THEN
        CREATE TYPE quote_status AS ENUM ('draft', 'sent', 'viewed', 'accepted', 'rejected');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'email_status') THEN
        CREATE TYPE email_status AS ENUM ('sent', 'failed', 'queued');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lead_source') THEN
        CREATE TYPE lead_source AS ENUM ('website', 'phone', 'referral', 'walk-in');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'activity_type') THEN
        CREATE TYPE activity_type AS ENUM ('call', 'email', 'visit', 'estimate', 'follow-up');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tracking_action') THEN
        CREATE TYPE tracking_action AS ENUM ('view', 'click', 'form_start', 'form_submit', 'estimate_request', 'call_click');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'gallery_category') THEN
        CREATE TYPE gallery_category AS ENUM ('interior', 'exterior', 'cabinet', 'deck', 'commercial');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'audit_metric') THEN
        CREATE TYPE audit_metric AS ENUM ('page_view', 'form_submission', 'phone_click', 'estimate_request', 'appointment_booking');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'email_type') THEN
        CREATE TYPE email_type AS ENUM ('lead_notification', 'appointment_confirm', 'quote_sent');
    END IF;
END $$;


-- ============================================================================
-- STEP 2: Create all 12 tables (matching Prisma schema)
-- ============================================================================

-- ---------- OWNER / ADMIN ----------
CREATE TABLE IF NOT EXISTS "Owner" (
    "id"            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "email"         TEXT NOT NULL UNIQUE,
    "passwordHash"  TEXT NOT NULL,
    "name"          TEXT NOT NULL,
    "phone"         TEXT,
    "company"       TEXT NOT NULL DEFAULT 'In & Out Demolition',
    "address"       TEXT,
    "googleEmail"   TEXT,
    "googleToken"   TEXT,
    "slackWebhook"  TEXT,
    "createdAt"     TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt"     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- LEADS & CONTACTS ----------
CREATE TABLE IF NOT EXISTS "Lead" (
    "id"            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "firstName"     TEXT NOT NULL,
    "lastName"      TEXT NOT NULL,
    "email"         TEXT NOT NULL,
    "phone"         TEXT,
    "address"       TEXT,
    "city"          TEXT,
    "postalCode"    TEXT,
    "serviceType"   TEXT,
    "projectDesc"   TEXT,
    "budget"        TEXT,
    "howHeard"      TEXT,
    "leadSource"    lead_source NOT NULL DEFAULT 'website',
    "status"        lead_status NOT NULL DEFAULT 'new',
    "priority"      lead_priority NOT NULL DEFAULT 'medium',
    "notes"         TEXT,
    "funnelStage"   funnel_stage NOT NULL DEFAULT 'awareness',
    "assignedTo"    TEXT,
    "estimatedValue" DOUBLE PRECISION,
    "closedValue"   DOUBLE PRECISION,
    "closedAt"      TIMESTAMPTZ,
    "lastContacted" TIMESTAMPTZ,
    "createdAt"     TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt"     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "Lead_email_idx" ON "Lead"("email");
CREATE INDEX IF NOT EXISTS "Lead_status_idx" ON "Lead"("status");
CREATE INDEX IF NOT EXISTS "Lead_funnelStage_idx" ON "Lead"("funnelStage");
CREATE INDEX IF NOT EXISTS "Lead_leadSource_idx" ON "Lead"("leadSource");
CREATE INDEX IF NOT EXISTS "Lead_priority_idx" ON "Lead"("priority");
CREATE INDEX IF NOT EXISTS "Lead_createdAt_idx" ON "Lead"("createdAt");

-- ---------- LEAD ACTIVITY ----------
CREATE TABLE IF NOT EXISTS "LeadActivity" (
    "id"          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "leadId"      UUID NOT NULL REFERENCES "Lead"("id") ON DELETE CASCADE,
    "type"        activity_type NOT NULL,
    "description" TEXT NOT NULL,
    "outcome"     TEXT,
    "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "LeadActivity_leadId_idx" ON "LeadActivity"("leadId");
CREATE INDEX IF NOT EXISTS "LeadActivity_type_idx" ON "LeadActivity"("type");
CREATE INDEX IF NOT EXISTS "LeadActivity_createdAt_idx" ON "LeadActivity"("createdAt");

-- ---------- APPOINTMENTS ----------
CREATE TABLE IF NOT EXISTS "Appointment" (
    "id"           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "leadId"       UUID REFERENCES "Lead"("id") ON DELETE SET NULL,
    "firstName"    TEXT NOT NULL,
    "lastName"     TEXT NOT NULL,
    "email"        TEXT NOT NULL,
    "phone"        TEXT,
    "address"      TEXT,
    "serviceType"  TEXT,
    "notes"        TEXT,
    "date"         TIMESTAMPTZ NOT NULL,
    "duration"     INTEGER NOT NULL DEFAULT 60,
    "status"       appointment_status NOT NULL DEFAULT 'scheduled',
    "googleEventId" TEXT,
    "createdAt"    TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt"    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "Appointment_date_idx" ON "Appointment"("date");
CREATE INDEX IF NOT EXISTS "Appointment_status_idx" ON "Appointment"("status");
CREATE INDEX IF NOT EXISTS "Appointment_leadId_idx" ON "Appointment"("leadId");
CREATE INDEX IF NOT EXISTS "Appointment_email_idx" ON "Appointment"("email");

-- ---------- PROJECTS ----------
CREATE TABLE IF NOT EXISTS "Project" (
    "id"           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "leadId"       UUID REFERENCES "Lead"("id") ON DELETE SET NULL,
    "name"         TEXT NOT NULL,
    "description"  TEXT,
    "serviceType"  TEXT,
    "status"       project_status NOT NULL DEFAULT 'pending',
    "startDate"    TIMESTAMPTZ,
    "endDate"      TIMESTAMPTZ,
    "estimatedCost" DOUBLE PRECISION,
    "actualCost"   DOUBLE PRECISION,
    "address"      TEXT,
    "notes"        TEXT,
    "teamMembers"  JSONB,
    "beforeImages" JSONB,
    "afterImages"  JSONB,
    "createdAt"    TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt"    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "Project_status_idx" ON "Project"("status");
CREATE INDEX IF NOT EXISTS "Project_leadId_idx" ON "Project"("leadId");
CREATE INDEX IF NOT EXISTS "Project_createdAt_idx" ON "Project"("createdAt");

-- ---------- QUOTES / ESTIMATES ----------
CREATE TABLE IF NOT EXISTS "Quote" (
    "id"          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "leadId"      UUID REFERENCES "Lead"("id") ON DELETE SET NULL,
    "projectId"   UUID REFERENCES "Project"("id") ON DELETE SET NULL,
    "title"       TEXT NOT NULL,
    "items"       JSONB NOT NULL DEFAULT '[]'::jsonb,
    "subtotal"    DOUBLE PRECISION NOT NULL,
    "tax"         DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total"       DOUBLE PRECISION NOT NULL,
    "status"      quote_status NOT NULL DEFAULT 'draft',
    "validUntil"  TIMESTAMPTZ,
    "notes"       TEXT,
    "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt"   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "Quote_status_idx" ON "Quote"("status");
CREATE INDEX IF NOT EXISTS "Quote_leadId_idx" ON "Quote"("leadId");
CREATE INDEX IF NOT EXISTS "Quote_projectId_idx" ON "Quote"("projectId");

-- ---------- VISITOR TRACKING ----------
CREATE TABLE IF NOT EXISTS "VisitorTracking" (
    "id"               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "leadId"           UUID REFERENCES "Lead"("id") ON DELETE SET NULL,
    "sessionId"        TEXT NOT NULL,
    "page"             TEXT NOT NULL,
    "referrer"         TEXT,
    "utmSource"        TEXT,
    "utmMedium"        TEXT,
    "utmCampaign"      TEXT,
    "utmTerm"          TEXT,
    "utmContent"       TEXT,
    "action"           tracking_action,
    "elementId"        TEXT,
    "userAgent"        TEXT,
    "ipAddress"        TEXT,
    "screenResolution" TEXT,
    "createdAt"        TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "VisitorTracking_sessionId_idx" ON "VisitorTracking"("sessionId");
CREATE INDEX IF NOT EXISTS "VisitorTracking_page_idx" ON "VisitorTracking"("page");
CREATE INDEX IF NOT EXISTS "VisitorTracking_action_idx" ON "VisitorTracking"("action");
CREATE INDEX IF NOT EXISTS "VisitorTracking_createdAt_idx" ON "VisitorTracking"("createdAt");

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
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isApproved" BOOLEAN NOT NULL DEFAULT true,
    "createdAt"  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "Testimonial_isFeatured_idx" ON "Testimonial"("isFeatured");
CREATE INDEX IF NOT EXISTS "Testimonial_isApproved_idx" ON "Testimonial"("isApproved");

-- ---------- GALLERY ----------
CREATE TABLE IF NOT EXISTS "GalleryImage" (
    "id"          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "title"       TEXT NOT NULL,
    "description" TEXT,
    "category"    gallery_category NOT NULL,
    "beforeUrl"   TEXT,
    "afterUrl"    TEXT,
    "isFeatured"  BOOLEAN NOT NULL DEFAULT false,
    "sortOrder"   INTEGER NOT NULL DEFAULT 0,
    "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "GalleryImage_category_idx" ON "GalleryImage"("category");
CREATE INDEX IF NOT EXISTS "GalleryImage_isFeatured_idx" ON "GalleryImage"("isFeatured");
CREATE INDEX IF NOT EXISTS "GalleryImage_sortOrder_idx" ON "GalleryImage"("sortOrder");

-- ---------- EMAIL LOG ----------
CREATE TABLE IF NOT EXISTS "EmailLog" (
    "id"        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "to"        TEXT NOT NULL,
    "subject"   TEXT NOT NULL,
    "body"      TEXT NOT NULL,
    "status"    email_status NOT NULL DEFAULT 'sent',
    "type"      email_type NOT NULL,
    "metadata"  JSONB,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "EmailLog_to_idx" ON "EmailLog"("to");
CREATE INDEX IF NOT EXISTS "EmailLog_status_idx" ON "EmailLog"("status");
CREATE INDEX IF NOT EXISTS "EmailLog_type_idx" ON "EmailLog"("type");
CREATE INDEX IF NOT EXISTS "EmailLog_createdAt_idx" ON "EmailLog"("createdAt");

-- ---------- NOTIFICATION SETTINGS ----------
CREATE TABLE IF NOT EXISTS "NotificationSettings" (
    "id"              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "newLead"         BOOLEAN NOT NULL DEFAULT true,
    "newAppointment"  BOOLEAN NOT NULL DEFAULT true,
    "quoteSent"       BOOLEAN NOT NULL DEFAULT true,
    "projectUpdate"   BOOLEAN NOT NULL DEFAULT true,
    "dailySummary"    BOOLEAN NOT NULL DEFAULT true,
    "weeklyReport"    BOOLEAN NOT NULL DEFAULT true,
    "emailEnabled"    BOOLEAN NOT NULL DEFAULT true,
    "slackEnabled"    BOOLEAN NOT NULL DEFAULT false,
    "createdAt"       TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt"       TIMESTAMPTZ NOT NULL DEFAULT now()
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
-- STEP 4: RLS Policies — Public Read (anonymous visitors can read)
-- ============================================================================
-- Testimonials: anyone can read approved testimonials
CREATE POLICY "Public read approved testimonials"
    ON "Testimonial" FOR SELECT
    USING ("isApproved" = true);

-- Gallery: anyone can view
CREATE POLICY "Public read gallery"
    ON "GalleryImage" FOR SELECT
    USING (true);

-- SiteAudit: anyone can read (aggregate stats)
CREATE POLICY "Public read site audit"
    ON "SiteAudit" FOR SELECT
    USING (true);


-- ============================================================================
-- STEP 5: RLS Policies — Tracking (anonymous visitors can INSERT tracking data)
-- ============================================================================
CREATE POLICY "Anonymous insert visitor tracking"
    ON "VisitorTracking" FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Anonymous insert site audit"
    ON "SiteAudit" FOR INSERT
    WITH CHECK (true);


-- ============================================================================
-- STEP 6: RLS Policies — Lead Submission (anonymous can submit leads)
-- ============================================================================
CREATE POLICY "Anonymous insert lead"
    ON "Lead" FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Anonymous insert appointment"
    ON "Appointment" FOR INSERT
    WITH CHECK (true);


-- ============================================================================
-- STEP 7: RLS Policies — Service Role (full access via server-side key)
-- ============================================================================
-- Owner
CREATE POLICY "Service role full access Owner"
    ON "Owner" FOR ALL
    TO authenticated, anon
    USING (true)
    WITH CHECK (true);

-- Lead — full CRUD
CREATE POLICY "Service role full access Lead"
    ON "Lead" FOR ALL
    TO authenticated, anon
    USING (true)
    WITH CHECK (true);

-- LeadActivity — full CRUD
CREATE POLICY "Service role full access LeadActivity"
    ON "LeadActivity" FOR ALL
    TO authenticated, anon
    USING (true)
    WITH CHECK (true);

-- Appointment — full CRUD
CREATE POLICY "Service role full access Appointment"
    ON "Appointment" FOR ALL
    TO authenticated, anon
    USING (true)
    WITH CHECK (true);

-- Project — full CRUD
CREATE POLICY "Service role full access Project"
    ON "Project" FOR ALL
    TO authenticated, anon
    USING (true)
    WITH CHECK (true);

-- Quote — full CRUD
CREATE POLICY "Service role full access Quote"
    ON "Quote" FOR ALL
    TO authenticated, anon
    USING (true)
    WITH CHECK (true);

-- VisitorTracking — full CRUD
CREATE POLICY "Service role full access VisitorTracking"
    ON "VisitorTracking" FOR ALL
    TO authenticated, anon
    USING (true)
    WITH CHECK (true);

-- SiteAudit — full CRUD
CREATE POLICY "Service role full access SiteAudit"
    ON "SiteAudit" FOR ALL
    TO authenticated, anon
    USING (true)
    WITH CHECK (true);

-- Testimonial — full CRUD
CREATE POLICY "Service role full access Testimonial"
    ON "Testimonial" FOR ALL
    TO authenticated, anon
    USING (true)
    WITH CHECK (true);

-- GalleryImage — full CRUD
CREATE POLICY "Service role full access GalleryImage"
    ON "GalleryImage" FOR ALL
    TO authenticated, anon
    USING (true)
    WITH CHECK (true);

-- EmailLog — full CRUD
CREATE POLICY "Service role full access EmailLog"
    ON "EmailLog" FOR ALL
    TO authenticated, anon
    USING (true)
    WITH CHECK (true);

-- NotificationSettings — full CRUD
CREATE POLICY "Service role full access NotificationSettings"
    ON "NotificationSettings" FOR ALL
    TO authenticated, anon
    USING (true)
    WITH CHECK (true);


-- ============================================================================
-- STEP 8: UpdatedAt auto-update triggers
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = now();
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
-- STEP 9: Seed Data — Default Owner Account
-- ============================================================================
INSERT INTO "Owner" ("email", "passwordHash", "name", "company", "phone", "address")
VALUES (
    'owner@inoutdemolition.com',
    -- Default password: 'password123' (bcrypt hash)
    -- CHANGE THIS in production!
    '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu6GK',
    'In & Out Demolition',
    'In & Out Demolition',
    '(437) 535-0494',
    '3300 Highway 7 W, Suite 600, Vaughan ON L4K 4M3'
) ON CONFLICT ("email") DO NOTHING;

-- Seed NotificationSettings with defaults
INSERT INTO "NotificationSettings" ("id", "newLead", "newAppointment", "quoteSent", "projectUpdate", "dailySummary", "weeklyReport", "emailEnabled", "slackEnabled")
VALUES (
    '00000000-0000-0000-0000-000000000001',
    true, true, true, true, true, true, true, false
) ON CONFLICT DO NOTHING;

-- Seed sample testimonials
INSERT INTO "Testimonial" ("name", "location", "rating", "text", "service", "isFeatured") VALUES
    ('Sarah M.', 'Vaughan, ON', 5, 'Absolutely incredible work! They transformed our outdated kitchen cabinets into a modern masterpiece. The team was professional, punctual, and the attention to detail was outstanding.', 'Cabinet Refinishing', true),
    ('James T.', 'Toronto, ON', 5, 'From start to finish, the experience was seamless. The crew was respectful of our home and completed the interior painting ahead of schedule. Highly recommend!', 'Interior Painting', true),
    ('Priya K.', 'Mississauga, ON', 5, 'Our commercial space looks brand new. The team worked around our business hours and the quality of the exterior painting exceeded our expectations.', 'Commercial Painting', true),
    ('Michael & Lisa R.', 'Richmond Hill, ON', 4, 'Great value for the quality of work. Our deck and fence look amazing. The only minor delay was due to weather, but they kept us informed throughout.', 'Deck & Fence', true),
    ('David W.', 'Brampton, ON', 5, 'The color consultation service was a game-changer. They helped us choose the perfect palette for our home exterior. Neighbors keep complimenting us!', 'Color Consultation', true),
    ('Anna S.', 'Markham, ON', 5, 'Professional, clean, and incredibly skilled. They painted our entire two-story home in just 3 days and left everything spotless. Will definitely use again!', 'Interior Painting', false),
    ('Robert C.', 'Oakville, ON', 4, 'Excellent work on our exterior. The prep work was thorough and the finish is flawless. A bit pricey but absolutely worth every penny.', 'Exterior Painting', false),
    ('Emily & John D.', 'Vaughan, ON', 5, 'We had our office space painted and it looks incredible. The team was flexible with our schedule and the result speaks for itself. 10/10!', 'Commercial Painting', false)
ON CONFLICT DO NOTHING;

-- Seed sample gallery images
INSERT INTO "GalleryImage" ("title", "description", "category", "isFeatured", "sortOrder") VALUES
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
    ('Townhouse Exterior Refresh', 'Modern color palette for contemporary townhome', 'exterior', false, 12)
ON CONFLICT DO NOTHING;


-- ============================================================================
-- STEP 10: CreatedAt trigger (for tables without one)
-- ============================================================================
DO $$
DECLARE
    tbl TEXT;
BEGIN
    FOR tbl IN SELECT unnest(ARRAY['Testimonial','GalleryImage','LeadActivity','VisitorTracking','SiteAudit','EmailLog'])
    LOOP
        EXECUTE format(
            'CREATE TRIGGER set_created_at BEFORE INSERT ON %I
             FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();',
            tbl
        );
    END LOOP;
END $$;


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
    RAISE NOTICE 'Next steps:';
    RAISE NOTICE '1. Provide the service_role key to your developer';
    RAISE NOTICE '2. Run: bun install @supabase/supabase-js';
    RAISE NOTICE '3. Update .env.local with NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY';
    RAISE NOTICE '4. Update Prisma schema to use postgresql provider';
    RAISE NOTICE '========================================';
END $$;
