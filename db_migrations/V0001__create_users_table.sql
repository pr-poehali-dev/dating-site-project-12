CREATE TABLE t_p73361190_dating_site_project_.users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  age INTEGER,
  city VARCHAR(100) DEFAULT 'Москва',
  bio TEXT DEFAULT '',
  interests TEXT[] DEFAULT '{}',
  avatar_url TEXT DEFAULT '',
  verified BOOLEAN DEFAULT FALSE,
  premium BOOLEAN DEFAULT FALSE,
  online BOOLEAN DEFAULT FALSE,
  rating INTEGER DEFAULT 70,
  session_token VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
