/*
 Navicat Premium Data Transfer

 Source Server Type    : MySQL
 Source Host           : 127.0.0.1:3306
 Source Schema         : newpapers

 Target Server Type    : MySQL

 Date: 26/07/2021
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for papers
-- ----------------------------

DROP TABLE IF EXISTS `papers`;
CREATE TABLE `papers`(
	`PaperID` int(11) unsigned NOT NULL AUTO_INCREMENT,
	`Avatar` varchar(500) NOT NULL,
	`Title` varchar(500) NOT NULL,
  `CatID` int(11) NOT NULL,
	`CreatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
	`Abstract` varchar(500) NOT NULL,
	`Content` text NOT NULL,
  	PRIMARY KEY (`PaperID`)
);


-- ----------------------------
-- Table structure for categories
-- ----------------------------

DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `CatID` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `CatName` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`CatID`)
) ENGINE=MyISAM AUTO_INCREMENT=22 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Table structure for tags
-- ----------------------------

DROP TABLE IF EXISTS `tags`;
CREATE TABLE `tags` (
  `TagId` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `TagName` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`TagId`)
) ENGINE=MyISAM AUTO_INCREMENT=22 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Table struct for paper_tags
-- ----------------------------

DROP TABLE IF EXISTS `paper_tags`;
CREATE TABLE `paper_tags`(
	`PaperID` int(11) unsigned NOT NULL ,
	`TagID` int(11) unsigned NOT NULL,
  	PRIMARY KEY (`PaperID`, `TagID`)
);

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `dob` date NOT NULL,
  `permission` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


-- ----------------------------
-- Records of categories
-- ----------------------------

BEGIN;
INSERT INTO `categories` VALUES (1, 'Mobile');
INSERT INTO `categories` VALUES (2, 'TinICT');
INSERT INTO `categories` VALUES (3, 'Internet');
INSERT INTO `categories` VALUES (4, 'Explore');

COMMIT;

-- ----------------------------
-- Records of tags
-- ----------------------------

BEGIN;
INSERT INTO `tags` VALUES (1, 'Biotech');
INSERT INTO `tags` VALUES (2, 'AI');
INSERT INTO `tags` VALUES (3, 'Euro');
INSERT INTO `tags` VALUES (4, 'Vietnam');
INSERT INTO `tags` VALUES (5, 'Machine Learning');
INSERT INTO `tags` VALUES (6, 'Algorithm');
COMMIT;

-- ----------------------------
-- Records of papers_tags
-- ----------------------------

INSERT INTO `paper_tags` VALUES (1, 1);
INSERT INTO `paper_tags` VALUES (1, 2);
INSERT INTO `paper_tags` VALUES (1, 3);
INSERT INTO `paper_tags` VALUES (2, 4);
INSERT INTO `paper_tags` VALUES (2, 5);
INSERT INTO `paper_tags` VALUES (2, 6);

