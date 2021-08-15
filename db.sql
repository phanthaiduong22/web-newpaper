-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema newspapers
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema newspapers
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `newspapers` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `newspapers` ;

-- -----------------------------------------------------
-- Table `newspapers`.`categories`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `newspapers`.`categories` (
  `CatID` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `CatName` VARCHAR(50) CHARACTER SET 'utf8' COLLATE 'utf8_unicode_ci' NOT NULL,
  PRIMARY KEY (`CatID`),
  UNIQUE INDEX `CatName_UNIQUE` (`CatName` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 28
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `newspapers`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `newspapers`.`users` (
  `UserID` INT NOT NULL AUTO_INCREMENT,
  `Username` VARCHAR(50) CHARACTER SET 'utf8' COLLATE 'utf8_unicode_ci' NOT NULL,
  `Password` VARCHAR(255) CHARACTER SET 'utf8' COLLATE 'utf8_unicode_ci' NOT NULL,
  `Name` VARCHAR(50) CHARACTER SET 'utf8' COLLATE 'utf8_unicode_ci' NOT NULL,
  `Email` VARCHAR(50) CHARACTER SET 'utf8' COLLATE 'utf8_unicode_ci' NOT NULL,
  `Dob` DATE NOT NULL,
  `Role` VARCHAR(50) NOT NULL DEFAULT 'user',
  `Premium` TINYINT NOT NULL DEFAULT '0',
  `Time` BIGINT NULL DEFAULT NULL,
  `GetPremiumAt` BIGINT NULL DEFAULT NULL,
  PRIMARY KEY (`UserID`))
ENGINE = InnoDB
AUTO_INCREMENT = 35
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `newspapers`.`category_editors`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `newspapers`.`category_editors` (
  `EditorID` INT NOT NULL,
  `CatID` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`EditorID`),
  UNIQUE INDEX `EditorID` (`EditorID` ASC) VISIBLE,
  INDEX `category_editors_ibfk_1` (`CatID` ASC) VISIBLE,
  CONSTRAINT `category_editors_ibfk_1`
    FOREIGN KEY (`CatID`)
    REFERENCES `newspapers`.`categories` (`CatID`),
  CONSTRAINT `category_editors_ibfk_2`
    FOREIGN KEY (`EditorID`)
    REFERENCES `newspapers`.`users` (`UserID`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `newspapers`.`sub_categories`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `newspapers`.`sub_categories` (
  `SubCatID` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `SubCatName` VARCHAR(50) CHARACTER SET 'utf8' COLLATE 'utf8_unicode_ci' NOT NULL,
  PRIMARY KEY (`SubCatID`),
  UNIQUE INDEX `SubCatName_UNIQUE` (`SubCatName` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 53
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `newspapers`.`category_sub_categories`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `newspapers`.`category_sub_categories` (
  `CatID` INT UNSIGNED NOT NULL,
  `SubCatID` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`CatID`, `SubCatID`),
  INDEX `SubCatID` (`SubCatID` ASC) VISIBLE,
  CONSTRAINT `category_sub_categories_ibfk_1`
    FOREIGN KEY (`CatID`)
    REFERENCES `newspapers`.`categories` (`CatID`),
  CONSTRAINT `category_sub_categories_ibfk_2`
    FOREIGN KEY (`SubCatID`)
    REFERENCES `newspapers`.`sub_categories` (`SubCatID`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `newspapers`.`comment`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `newspapers`.`comment` (
  `PaperID` INT NOT NULL,
  `Content` TEXT NOT NULL,
  `UserID` VARCHAR(45) NOT NULL,
  `CreatedAt` TIMESTAMP NOT NULL,
  `CommentID` INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`CommentID`))
ENGINE = InnoDB
AUTO_INCREMENT = 9
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `newspapers`.`papers`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `newspapers`.`papers` (
  `PaperID` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `Avatar` VARCHAR(500) NOT NULL,
  `Title` VARCHAR(500) NOT NULL,
  `CatID` INT UNSIGNED NOT NULL,
  `SubCatID` INT UNSIGNED NOT NULL,
  `CreatedAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `Abstract` VARCHAR(500) NOT NULL,
  `Content` TEXT NOT NULL,
  `Tags` VARCHAR(500) NOT NULL,
  `Views` INT NOT NULL DEFAULT '0',
  `Status` VARCHAR(500) NOT NULL DEFAULT 'Draft',
  `UserID` INT NOT NULL,
  `EditorComment` VARCHAR(500) NULL DEFAULT NULL,
  `PublishDate` TIMESTAMP NULL DEFAULT NULL,
  `Premium` TINYINT NULL DEFAULT '0',
  PRIMARY KEY (`PaperID`),
  INDEX `CatID` (`CatID` ASC) VISIBLE,
  INDEX `SubCatID` (`SubCatID` ASC) VISIBLE,
  FULLTEXT INDEX `Title` (`Title`, `Abstract`, `Content`) VISIBLE,
  CONSTRAINT `papers_ibfk_1`
    FOREIGN KEY (`CatID`)
    REFERENCES `newspapers`.`categories` (`CatID`),
  CONSTRAINT `papers_ibfk_2`
    FOREIGN KEY (`SubCatID`)
    REFERENCES `newspapers`.`sub_categories` (`SubCatID`))
ENGINE = InnoDB
AUTO_INCREMENT = 60
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `newspapers`.`reset`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `newspapers`.`reset` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `otp` INT NOT NULL,
  `created_at` BIGINT NOT NULL,
  `expiresin` BIGINT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 100
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `newspapers`.`tag`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `newspapers`.`tag` (
  `TagId` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `TagName` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`TagId`),
  UNIQUE INDEX `TagName_UNIQUE` (`TagName` ASC) VISIBLE,
  UNIQUE INDEX `TagId_UNIQUE` (`TagId` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 117
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

 BEGIN;
  INSERT INTO `categories` VALUES (1, 'Mobile');
  INSERT INTO `categories` VALUES (2, 'TinICT');
  INSERT INTO `categories` VALUES (3, 'Internet');
  INSERT INTO `categories` VALUES (4, 'Explore');
 COMMIT;

 BEGIN;
  INSERT INTO `sub_categories` VALUES (1, 'Iphone');
  INSERT INTO `sub_categories` VALUES (2, 'Android');
  INSERT INTO `sub_categories` VALUES (3, 'Machine Learning');
  INSERT INTO `sub_categories` VALUES (4, 'Networking');
  INSERT INTO `sub_categories` VALUES (5, 'Google');
  INSERT INTO `sub_categories` VALUES (6, 'Knowledge');
 COMMIT;

 BEGIN;
  INSERT INTO `category_sub_categories` VALUES (1, 1);
  INSERT INTO `category_sub_categories` VALUES (1, 2);
  INSERT INTO `category_sub_categories` VALUES (2, 3);
  INSERT INTO `category_sub_categories` VALUES (3, 4);
  INSERT INTO `category_sub_categories` VALUES (3, 5);
  INSERT INTO `category_sub_categories` VALUES (4, 6);
 COMMIT;



-- UPDATE users SET role = 'admin' where Username='admin'