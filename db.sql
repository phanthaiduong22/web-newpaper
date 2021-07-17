  /*
  Navicat Premium Data Transfer

  Source Server Type    : MySQL
  Source Host           : 127.0.0.1:3306
  Source Schema         : newpapers

  Target Server Type    : MySQL

  Date: 26/07/2021
  */


  drop database newspapers;

  create database newspapers;

  USE newspapers;

  SET NAMES utf8mb4;
  SET FOREIGN_KEY_CHECKS = 0;

  -- ----------------------------
  -- Table structure for categories
  -- ----------------------------

  DROP TABLE IF EXISTS `categories`;
  CREATE TABLE `categories` (
    `CatID` int(11) unsigned NOT NULL AUTO_INCREMENT,
    `CatName` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
    PRIMARY KEY (`CatID`)
  );

  -- ----------------------------
  -- Table structure for sub_categories
  -- ----------------------------

  DROP TABLE IF EXISTS `sub_categories`;
  CREATE TABLE `sub_categories` (
    `SubCatID` int(11) unsigned NOT NULL AUTO_INCREMENT,
    `SubCatName` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
    PRIMARY KEY (`SubCatID`)
  );


  -- ----------------------------
  -- Table structure for users
  -- ----------------------------
  DROP TABLE IF EXISTS `users`;
  CREATE TABLE `users` (
    `UserID` int(11) NOT NULL AUTO_INCREMENT,
    `Username` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
    `Password` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
    `Name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
    `Email` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
    `Dob` date NOT NULL,
    `Role` varchar(50) NOT NULL DEFAULT 'user',
    PRIMARY KEY (`UserID`)
  );

    -- ----------------------------
  -- Table structure for papers
  -- ----------------------------

  DROP TABLE IF EXISTS `papers`;
  CREATE TABLE `papers`(
    `PaperID` int(11) unsigned NOT NULL AUTO_INCREMENT,
    `Avatar` varchar(500) NOT NULL,
    `Title` varchar(500) NOT NULL,
    `CatID` int(11) unsigned NOT NULL,
    `SubCatID` int(11) unsigned NOT NULL,
    `CreatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
    `Abstract` varchar(500) NOT NULL,
    `Content` text NOT NULL,
    `Tags` varchar(100) NOT NULL,
    `Views` int(11) NOT NULL DEFAULT 0,
    `Status` varchar(500) NOT NULL DEFAULT 'Draft',
    `UserID`  int(11) NOT NULL,
    `EditorComment` varchar(500),
    PRIMARY KEY (`PaperID`),
    FOREIGN KEY (`CatID`) REFERENCES categories(`CatID`),
    FOREIGN KEY (`SubCatID`) REFERENCES sub_categories(`SubCatID`),
    FOREIGN KEY (`UserID`) REFERENCES users(`UserID`)
  );

  -- ----------------------------
  -- Create FTS for papers
  -- ----------------------------

  ALTER TABLE papers ADD FULLTEXT (Title, Abstract, Content);

  -- ----------------------------
  -- Table structure for sub_categories
  -- ----------------------------

  DROP TABLE IF EXISTS `category_sub_categories`;
  CREATE TABLE `category_sub_categories` (
    `CatID` int(11) unsigned NOT NULL ,
    `SubCatID` int(11) unsigned NOT NULL ,
    PRIMARY KEY (`CatID`, `SubCatID`),
    FOREIGN KEY (`CatID`) REFERENCES categories(`CatID`),
    FOREIGN KEY (`SubCatID`) REFERENCES sub_categories(`SubCatID`)
  );




  -- ----------------------------
  -- Table structure for users
  -- ----------------------------
  -- each editor manages a category
  DROP TABLE IF EXISTS `category_editors`;
  CREATE TABLE `category_editors` (
    `EditorID` int(11) NOT NULL UNIQUE,
    `CatID` int(11) unsigned,
    PRIMARY KEY (`EditorID`),
    FOREIGN KEY (`CatID`) REFERENCES categories(`CatID`),
    FOREIGN KEY (`EditorID`) REFERENCES users(`UserID`)
  );


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
  -- Records of sub_categories
  -- ----------------------------

  BEGIN;
  INSERT INTO `sub_categories` VALUES (1, 'Iphone');
  INSERT INTO `sub_categories` VALUES (2, 'Android');;
  INSERT INTO `sub_categories` VALUES (3, 'Machine Learning');
  INSERT INTO `sub_categories` VALUES (4, 'Networking');
  INSERT INTO `sub_categories` VALUES (5, 'Google');
  INSERT INTO `sub_categories` VALUES (6, 'Knowledge');
  COMMIT;

  -- ----------------------------
  -- Records of category_sub_categories
  -- ----------------------------

  BEGIN;
  INSERT INTO `category_sub_categories` VALUES (1, 1);
  INSERT INTO `category_sub_categories` VALUES (1, 2);
  INSERT INTO `category_sub_categories` VALUES (2, 3);
  INSERT INTO `category_sub_categories` VALUES (3, 4);
  INSERT INTO `category_sub_categories` VALUES (3, 5);
  INSERT INTO `category_sub_categories` VALUES (4, 6);
  COMMIT;

-- After create Admin
--  