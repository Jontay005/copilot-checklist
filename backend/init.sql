-- Create tables for copilot checklist app

CREATE TABLE agencies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE checklist_items (
  id SERIAL PRIMARY KEY,
  item VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE agency_progress (
  id SERIAL PRIMARY KEY,
  agency_id INTEGER NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  checklist_item_id INTEGER NOT NULL REFERENCES checklist_items(id),
  completed BOOLEAN DEFAULT false,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(agency_id, checklist_item_id)
);

-- Insert default checklist items
INSERT INTO checklist_items (item, description) VALUES
  ('Assess Current State', 'Document current AI/ML tools and usage'),
  ('Security Review', 'Review data security and compliance requirements'),
  ('Licensing', 'Verify Copilot licensing requirements'),
  ('User Training', 'Identify training needs for teams'),
  ('Data Governance', 'Define data governance policies'),
  ('Integration Planning', 'Plan integration with existing tools'),
  ('Pilot Program', 'Launch pilot with selected group'),
  ('Feedback Collection', 'Collect and document feedback'),
  ('Rollout Plan', 'Create full rollout strategy');
