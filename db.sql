
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `UserID` int NOT NULL AUTO_INCREMENT,
  `Username` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `Password` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `Name` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `Email` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `Dob` date NOT NULL,
  `Role` varchar(50) NOT NULL DEFAULT 'user',
  `Premium` tinyint NOT NULL DEFAULT '0',
  `Time` bigint DEFAULT NULL,
  `GetPremiumAt` bigint DEFAULT NULL,
  PRIMARY KEY (`UserID`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `CatID` int unsigned NOT NULL AUTO_INCREMENT,
  `CatName` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`CatID`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `category_editors`;
CREATE TABLE `category_editors` (
  `EditorID` int NOT NULL,
  `CatID` int unsigned DEFAULT NULL,
  PRIMARY KEY (`EditorID`),
  UNIQUE KEY `EditorID` (`EditorID`),
  KEY `CatID` (`CatID`),
  CONSTRAINT `category_editors_ibfk_1` FOREIGN KEY (`CatID`) REFERENCES `categories` (`CatID`),
  CONSTRAINT `category_editors_ibfk_2` FOREIGN KEY (`EditorID`) REFERENCES `users` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `sub_categories`;
CREATE TABLE `sub_categories` (
  `SubCatID` int unsigned NOT NULL AUTO_INCREMENT,
  `SubCatName` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`SubCatID`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `category_sub_categories`;
CREATE TABLE `category_sub_categories` (
  `CatID` int unsigned NOT NULL,
  `SubCatID` int unsigned NOT NULL,
  PRIMARY KEY (`CatID`,`SubCatID`),
  KEY `SubCatID` (`SubCatID`),
  CONSTRAINT `category_sub_categories_ibfk_1` FOREIGN KEY (`CatID`) REFERENCES `categories` (`CatID`),
  CONSTRAINT `category_sub_categories_ibfk_2` FOREIGN KEY (`SubCatID`) REFERENCES `sub_categories` (`SubCatID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `comment`;
CREATE TABLE `comment` (
  `PaperID` int NOT NULL,
  `Content` text NOT NULL,
  `UserID` varchar(45) NOT NULL,
  `CreatedAt` timestamp NOT NULL,
  PRIMARY KEY (`PaperID`,`UserID`,`CreatedAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `reset`;
CREATE TABLE `reset` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `otp` int NOT NULL,
  `created_at` bigint NOT NULL,
  `expiresin` bigint NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



DROP TABLE IF EXISTS `tag`;
CREATE TABLE `tag` (
  `TagId` int unsigned NOT NULL AUTO_INCREMENT,
  `TagName` varchar(45) NOT NULL,
  PRIMARY KEY (`TagId`),
  UNIQUE KEY `TagName_UNIQUE` (`TagName`),
  UNIQUE KEY `TagId_UNIQUE` (`TagId`)
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `papers`;
CREATE TABLE `papers` (
  `PaperID` int unsigned NOT NULL AUTO_INCREMENT,
  `Avatar` varchar(500) NOT NULL,
  `Title` varchar(500) NOT NULL,
  `CatID` int unsigned NOT NULL,
  `SubCatID` int unsigned NOT NULL,
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `Abstract` varchar(500) NOT NULL,
  `Content` text NOT NULL,
  `Tags` varchar(500) NOT NULL,
  `Views` int NOT NULL DEFAULT '0',
  `Status` varchar(500) NOT NULL DEFAULT 'Draft',
  `UserID` int NOT NULL,
  `EditorComment` varchar(500) DEFAULT NULL,
  `PublishDate` timestamp NULL DEFAULT NULL,
  `Premium` tinyint DEFAULT '0',
  PRIMARY KEY (`PaperID`),
  KEY `CatID` (`CatID`),
  KEY `SubCatID` (`SubCatID`),
  KEY `UserID` (`UserID`),
  FULLTEXT KEY `Title` (`Title`,`Abstract`,`Content`),
  CONSTRAINT `papers_ibfk_1` FOREIGN KEY (`CatID`) REFERENCES `categories` (`CatID`),
  CONSTRAINT `papers_ibfk_2` FOREIGN KEY (`SubCatID`) REFERENCES `sub_categories` (`SubCatID`),
  CONSTRAINT `papers_ibfk_3` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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