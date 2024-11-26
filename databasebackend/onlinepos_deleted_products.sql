-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: onlinepos
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `deleted_products`
--

DROP TABLE IF EXISTS `deleted_products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `deleted_products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `productId` varchar(1000) NOT NULL,
  `productName` varchar(1000) NOT NULL,
  `productNameSinhala` varchar(255) DEFAULT NULL,
  `barcode` varchar(255) DEFAULT NULL,
  `batchNumber` varchar(255) DEFAULT NULL,
  `selectedSupplier` varchar(1000) DEFAULT NULL,
  `selectedCategory` varchar(1000) DEFAULT NULL,
  `selectedUnit` varchar(255) DEFAULT NULL,
  `manufacturingDate` date DEFAULT NULL,
  `expiringDate` date DEFAULT NULL,
  `costPrice` decimal(10,2) DEFAULT NULL,
  `mrpPrice` decimal(10,2) DEFAULT NULL,
  `profitPercentage` decimal(5,2) DEFAULT NULL,
  `profitAmount` decimal(10,2) DEFAULT NULL,
  `discountPrice` decimal(10,2) DEFAULT NULL,
  `discountPercentage` decimal(5,2) DEFAULT NULL,
  `wholesalePrice` decimal(10,2) DEFAULT NULL,
  `wholesalePercentage` decimal(5,2) DEFAULT NULL,
  `lockedPrice` decimal(10,2) DEFAULT NULL,
  `stockQuantity` decimal(10,4) DEFAULT NULL,
  `stockAlert` decimal(10,4) DEFAULT NULL,
  `store` varchar(500) DEFAULT NULL,
  `user` varchar(500) DEFAULT NULL,
  `status` varchar(10) DEFAULT NULL,
  `deleteTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `imageLink` varchar(2000) DEFAULT NULL,
  `openingBalance` decimal(10,4) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `deleted_products`
--

LOCK TABLES `deleted_products` WRITE;
/*!40000 ALTER TABLE `deleted_products` DISABLE KEYS */;
INSERT INTO `deleted_products` VALUES (3,'198','Espadrille Wedges','Wedgeira','87612','239944','Rajith','Footwear','L','2024-09-10','2025-05-10',130.00,400.00,67.50,270.00,65.00,16.25,230.00,48.00,370.00,50.0000,12.0000,'all','abdul','active','2024-10-24 14:44:09','https://example.com/espadrillewedges.jpg',20.0000);
/*!40000 ALTER TABLE `deleted_products` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-26  8:55:07
