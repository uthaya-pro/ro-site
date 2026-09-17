-- TUTY RO Purifier — MySQL Database Schema
-- Run this script to create all tables

CREATE DATABASE IF NOT EXISTS tuty_ro_purifier
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE tuty_ro_purifier;

-- ─────────────────────────────────────────────────────────────
-- Table: admins
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admins (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  username      VARCHAR(100)  NOT NULL,
  email         VARCHAR(150)  NOT NULL,
  password_hash VARCHAR(255)  NOT NULL,
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_admin_username (username),
  UNIQUE KEY uq_admin_email    (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────
-- Table: products
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id           INT UNSIGNED   NOT NULL AUTO_INCREMENT,
  name         VARCHAR(200)   NOT NULL,
  slug         VARCHAR(220)   NOT NULL,
  description  TEXT,
  price        DECIMAL(10,2)  NULL COMMENT 'NULL means Contact for Price',
  capacity     VARCHAR(100)   NULL,
  technology   VARCHAR(150)   NULL,
  features     JSON           NULL,
  image_url    VARCHAR(500)   NULL,
  is_active    TINYINT(1)     NOT NULL DEFAULT 1,
  sort_order   INT            NOT NULL DEFAULT 0,
  created_at   TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_product_slug (slug),
  KEY idx_product_active     (is_active),
  KEY idx_product_sort       (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────
-- Table: services
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS services (
  id           INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  name         VARCHAR(200)  NOT NULL,
  description  TEXT,
  price_info   VARCHAR(200)  NULL,
  image_url    VARCHAR(500)  NULL,
  icon         VARCHAR(100)  NULL,
  is_active    TINYINT(1)    NOT NULL DEFAULT 1,
  sort_order   INT           NOT NULL DEFAULT 0,
  created_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_service_active (is_active),
  KEY idx_service_sort   (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────
-- Table: enquiries
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS enquiries (
  id            INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  name          VARCHAR(200)  NOT NULL,
  phone         VARCHAR(20)   NOT NULL,
  email         VARCHAR(150)  NULL,
  product_id    INT UNSIGNED  NULL,
  message       TEXT          NOT NULL,
  enquiry_type  ENUM('product','service','general') NOT NULL DEFAULT 'general',
  status        ENUM('new','contacted','completed')  NOT NULL DEFAULT 'new',
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_enquiry_status  (status),
  KEY idx_enquiry_type    (enquiry_type),
  KEY idx_enquiry_created (created_at),
  CONSTRAINT fk_enquiry_product
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────
-- Table: notifications
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  title        VARCHAR(300) NOT NULL,
  message      TEXT,
  type         ENUM('enquiry','system') NOT NULL DEFAULT 'system',
  is_read      TINYINT(1)   NOT NULL DEFAULT 0,
  reference_id INT UNSIGNED NULL,
  created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_notif_read    (is_read),
  KEY idx_notif_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────
-- Table: business_settings
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS business_settings (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  setting_key   VARCHAR(100) NOT NULL,
  setting_value TEXT,
  updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_setting_key (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
