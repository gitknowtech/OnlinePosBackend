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
-- Table structure for table `invoices`
--

DROP TABLE IF EXISTS `invoices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoices` (
  `id` int NOT NULL AUTO_INCREMENT,
  `invoiceId` varchar(100) NOT NULL,
  `productId` varchar(1000) NOT NULL,
  `name` varchar(255) NOT NULL,
  `cost` decimal(10,2) DEFAULT NULL,
  `mrp` decimal(10,2) DEFAULT NULL,
  `discount` decimal(10,2) DEFAULT NULL,
  `rate` decimal(10,2) DEFAULT NULL,
  `quantity` decimal(10,2) DEFAULT NULL,
  `totalAmount` decimal(10,2) DEFAULT NULL,
  `barcode` varchar(255) DEFAULT NULL,
  `totalCost` decimal(10,2) GENERATED ALWAYS AS ((case when ((`cost` < 0) and (`quantity` < 0)) then -((`cost` * `quantity`)) else (`cost` * `quantity`) end)) STORED,
  `profit` decimal(10,2) GENERATED ALWAYS AS ((case when ((`rate` < 0) and (`quantity` < 0)) then -(((`rate` * `quantity`) - (`cost` * `quantity`))) when ((`cost` < 0) and (`quantity` < 0)) then -(((`rate` * `quantity`) - (`cost` * `quantity`))) else ((`rate` * `quantity`) - (`cost` * `quantity`)) end)) STORED,
  `profitPercentage` decimal(10,2) GENERATED ALWAYS AS ((case when (abs((`cost` * `quantity`)) > 0) then (((`rate` - `cost`) / abs(`cost`)) * 100) else 0 end)) STORED,
  `discPercentage` decimal(10,2) GENERATED ALWAYS AS ((case when (`mrp` > 0) then (((`mrp` - `rate`) / `mrp`) * 100) else 0 end)) STORED,
  `UserName` varchar(255) NOT NULL,
  `Store` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `invoiceId` (`invoiceId`),
  CONSTRAINT `invoices_ibfk_1` FOREIGN KEY (`invoiceId`) REFERENCES `sales` (`invoiceId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoices`
--

LOCK TABLES `invoices` WRITE;
/*!40000 ALTER TABLE `invoices` DISABLE KEYS */;
INSERT INTO `invoices` (`id`, `invoiceId`, `productId`, `name`, `cost`, `mrp`, `discount`, `rate`, `quantity`, `totalAmount`, `barcode`, `UserName`, `Store`, `createdAt`) VALUES (1,'2411240001','015','Summer Dress',-110.00,-300.00,-20.00,-280.00,-2.00,-560.00,NULL,'abdul','kurunegala','2024-11-24 08:33:08'),(2,'2411240002','015','Summer Dress',110.00,300.00,50.00,250.00,2.00,500.00,'45782','abdul','kurunegala','2024-11-24 18:49:05'),(3,'2411240003','015','Summer Dress',110.00,300.00,20.00,280.00,1.00,280.00,'45782','abdul','kurunegala','2024-11-24 20:37:55'),(4,'2411240004','019','Leather Jacket',300.00,900.00,50.00,850.00,1.00,850.00,'25714','abdul','kurunegala','2024-11-24 20:38:06'),(5,'2411240005','015','Summer Dress',110.00,300.00,20.00,280.00,1.00,280.00,'45782','abdul','kurunegala','2024-11-24 20:38:17'),(6,'2411240006','015','Summer Dress',110.00,300.00,20.00,280.00,1.00,280.00,'45782','abdul','kurunegala','2024-11-24 20:44:37'),(7,'2411240007','015','Summer Dress',110.00,300.00,0.00,300.00,1.00,300.00,'45782','abdul','kurunegala','2024-11-24 21:07:15'),(8,'2411240008','015','Summer Dress',110.00,300.00,20.00,280.00,1.00,280.00,'45782','abdul','kurunegala','2024-11-24 21:08:01'),(9,'2411240009','015','Summer Dress',110.00,300.00,20.00,280.00,1.00,280.00,'45782','abdul','kurunegala','2024-11-24 21:11:48'),(10,'2411240010','015','Summer Dress',110.00,300.00,0.00,300.00,1.00,300.00,'45782','abdul','kurunegala','2024-11-24 21:31:34'),(11,'2411240011','018','Denim Skirt',90.00,280.00,30.00,250.00,1.00,250.00,'45713','abdul','kurunegala','2024-11-24 21:31:58'),(13,'2411250001','012','Slim Fit Jeans',150.00,500.00,50.00,450.00,1.00,450.00,'34856','abdul','kurunegala','2024-11-25 19:50:50'),(14,'2411250001','001','Sleeve Shirt ',-100.00,-250.00,-30.00,-220.00,-2.00,-440.00,NULL,'abdul','kurunegala','2024-11-25 19:50:50');
/*!40000 ALTER TABLE `invoices` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-26  8:55:05
