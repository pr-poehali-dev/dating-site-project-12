CREATE TABLE t_p73361190_dating_site_project_.likes (
  id SERIAL PRIMARY KEY,
  from_user_id INTEGER NOT NULL,
  to_user_id INTEGER NOT NULL,
  type VARCHAR(20) DEFAULT 'like',
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(from_user_id, to_user_id)
);

CREATE TABLE t_p73361190_dating_site_project_.matches (
  id SERIAL PRIMARY KEY,
  user1_id INTEGER NOT NULL,
  user2_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user1_id, user2_id)
);
