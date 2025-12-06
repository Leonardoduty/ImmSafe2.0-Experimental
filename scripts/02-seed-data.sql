-- Seed sample data for demonstration

-- Safe zones
INSERT INTO safe_zones (name, zone_type, latitude, longitude, capacity, medical_level, water_available, food_available, verified)
VALUES
  ('UN Camp Alpha', 'UN_CAMP', 35.0, 40.0, 5000, 'ADVANCED', true, true, true),
  ('Hospital Beta', 'HOSPITAL', 34.8, 41.2, 200, 'INTERMEDIATE', true, false, true),
  ('Border Crossing Point', 'BORDER_CHECKPOINT', 34.5, 39.5, 500, 'BASIC', true, true, true),
  ('Local Shelter Network', 'SAFE_SHELTER', 35.2, 40.8, 300, 'BASIC', false, false, false);

-- Conflict zones
INSERT INTO conflict_zones (name, zone_type, latitude, longitude, radius_km, danger_level, intelligence_source, verified)
VALUES
  ('Active Military Zone A', 'ACTIVE_COMBAT', 35.5, 39.8, 5.0, 9, 'Local reports', true),
  ('Checkpoint Sector', 'CHECKPOINT', 34.5, 41.8, 2.0, 6, 'Traveler reports', true),
  ('Flooding Risk Area', 'FLOODING', 35.3, 40.2, 3.0, 7, 'Weather reports', true);

-- Resource points
INSERT INTO resource_points (resource_type, latitude, longitude, availability_status, notes)
VALUES
  ('CLEAN_WATER', 35.2, 40.5, 'AVAILABLE', 'Spring-fed, regularly verified'),
  ('FOOD', 35.1, 40.3, 'LIMITED', 'Market operates 3x per week'),
  ('MEDICAL', 35.0, 40.1, 'AVAILABLE', 'Basic clinic with medicine');

-- Emergency contacts
INSERT INTO emergency_contacts (contact_type, organization_name, country, phone_number, available_24_7, languages_spoken, verified)
VALUES
  ('UNHCR', 'UNHCR Regional Office', 'Regional Hub', '+1-555-0100', true, ARRAY['EN', 'AR', 'KU', 'TR', 'FA'], true),
  ('NGO', 'International Red Crescent', 'Regional', '+1-555-0101', true, ARRAY['EN', 'AR', 'TR'], true),
  ('EMBASSY', 'Neighboring Country Embassy', 'Capital City', '+1-555-0102', false, ARRAY['EN', 'FA'], true);
