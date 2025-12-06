-- Humanitarian Refugee Route Planning System
-- Database Schema

-- Users table (anonymous, no personal data stored)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Safe zones
CREATE TABLE IF NOT EXISTS safe_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  zone_type TEXT NOT NULL, -- 'UN_CAMP', 'HOSPITAL', 'BORDER_CHECKPOINT', 'EMBASSY', 'SAFE_SHELTER'
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  capacity INTEGER,
  medical_level TEXT, -- 'BASIC', 'INTERMEDIATE', 'ADVANCED'
  water_available BOOLEAN DEFAULT false,
  food_available BOOLEAN DEFAULT false,
  contact_info TEXT,
  verified BOOLEAN DEFAULT false,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Conflict zones and danger areas
CREATE TABLE IF NOT EXISTS conflict_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  zone_type TEXT NOT NULL, -- 'ACTIVE_COMBAT', 'MILITARY_PRESENCE', 'CHECKPOINT', 'LANDMINE', 'FLOODING', 'EXTREME_WEATHER'
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  radius_km DECIMAL(8, 2) NOT NULL,
  danger_level INTEGER CHECK (danger_level >= 1 AND danger_level <= 10), -- 1-10 scale
  description TEXT,
  last_reported TIMESTAMP,
  intelligence_source TEXT,
  verified BOOLEAN DEFAULT false,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Water and resource points
CREATE TABLE IF NOT EXISTS resource_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_type TEXT NOT NULL, -- 'CLEAN_WATER', 'WATER_SOURCE', 'FOOD', 'SHELTER', 'MEDICAL'
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  availability_status TEXT, -- 'AVAILABLE', 'LIMITED', 'UNAVAILABLE'
  last_verified TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Weather and natural disaster alerts
CREATE TABLE IF NOT EXISTS weather_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type TEXT NOT NULL, -- 'RAIN', 'STORM', 'SNOW', 'EXTREME_HEAT', 'FLOODING', 'LANDSLIDE'
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  radius_km DECIMAL(8, 2),
  severity_level INTEGER CHECK (severity_level >= 1 AND severity_level <= 10),
  expected_duration_hours INTEGER,
  description TEXT,
  issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP
);

-- Computed routes and survival assessments
CREATE TABLE IF NOT EXISTS route_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_session_id UUID REFERENCES users(id),
  source_lat DECIMAL(10, 8) NOT NULL,
  source_lon DECIMAL(11, 8) NOT NULL,
  destination_lat DECIMAL(10, 8) NOT NULL,
  destination_lon DECIMAL(11, 8) NOT NULL,
  travel_mode TEXT NOT NULL, -- 'WALKING', 'VEHICLE'
  distance_km DECIMAL(10, 2),
  estimated_duration_hours DECIMAL(8, 2),
  estimated_nights INTEGER,
  survival_score INTEGER CHECK (survival_score >= 0 AND survival_score <= 100),
  risk_level TEXT, -- 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
  terrain_difficulty TEXT, -- 'EASY', 'MODERATE', 'DIFFICULT', 'EXTREME'
  conflict_intersection BOOLEAN,
  water_availability_score INTEGER,
  food_availability_score INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Packing checklist items
CREATE TABLE IF NOT EXISTS checklist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL, -- 'CLOTHING', 'FOOD', 'WATER', 'MEDICINE', 'SHELTER', 'CHILD_CARE', 'ELDERLY_CARE'
  item_name TEXT NOT NULL,
  quantity_required DECIMAL(10, 2),
  unit TEXT,
  priority_level TEXT, -- 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'
  weight_grams DECIMAL(10, 2),
  terrain_dependent BOOLEAN,
  weather_dependent BOOLEAN,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Emergency contacts and resources
CREATE TABLE IF NOT EXISTS emergency_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_type TEXT NOT NULL, -- 'UNHCR', 'NGO', 'EMBASSY', 'LOCAL_AUTHORITY', 'MEDICAL'
  organization_name TEXT NOT NULL,
  country TEXT,
  phone_number TEXT,
  email TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  available_24_7 BOOLEAN,
  languages_spoken TEXT[], -- Array of language codes
  services TEXT[], -- Array of service types
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Image analysis and identification results
CREATE TABLE IF NOT EXISTS image_analysis_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_session_id UUID REFERENCES users(id),
  image_hash TEXT UNIQUE,
  analysis_type TEXT NOT NULL, -- 'FOOD', 'PLANT', 'WATER', 'INJURY', 'MEDICINE', 'THREAT'
  identified_items TEXT[],
  safety_assessment TEXT, -- 'SAFE', 'RISKY', 'DANGEROUS', 'UNKNOWN'
  confidence_score DECIMAL(3, 2),
  ai_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Border and legal information
CREATE TABLE IF NOT EXISTS border_checkpoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  country_from TEXT,
  country_to TEXT,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  legal_crossing BOOLEAN,
  corruption_risk_level INTEGER CHECK (corruption_risk_level >= 0 AND corruption_risk_level <= 10),
  violence_risk_level INTEGER CHECK (violence_risk_level >= 0 AND violence_risk_level <= 10),
  documents_required TEXT[],
  smuggler_activity_reported BOOLEAN,
  unhcr_recognition BOOLEAN,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Offline content cache
CREATE TABLE IF NOT EXISTS offline_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL, -- 'SURVIVAL_GUIDE', 'MEDICAL_GUIDE', 'TRANSLATION', 'MAP_TILE'
  language_code TEXT,
  content_data BYTEA,
  version TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_safe_zones_location ON safe_zones(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_conflict_zones_location ON conflict_zones(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_resource_points_type ON resource_points(resource_type);
CREATE INDEX IF NOT EXISTS idx_weather_alerts_location ON weather_alerts(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_route_plans_user ON route_plans(user_session_id);
CREATE INDEX IF NOT EXISTS idx_image_analysis_user ON image_analysis_results(user_session_id);
