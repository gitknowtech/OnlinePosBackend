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
  `productId` varchar(1000) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `cost` decimal(10,2) DEFAULT NULL,
  `mrp` decimal(10,2) DEFAULT NULL,
  `discount` decimal(10,2) DEFAULT NULL,
  `rate` decimal(10,2) DEFAULT NULL,
  `quantity` decimal(10,2) DEFAULT NULL,
  `totalAmount` decimal(10,2) DEFAULT NULL,
  `barcode` varchar(255) DEFAULT NULL,
  `totalCost` decimal(10,2) GENERATED ALWAYS AS ((`cost` * `quantity`)) STORED,
  `profit` decimal(10,2) GENERATED ALWAYS AS (((`rate` * `quantity`) - (`cost` * `quantity`))) STORED,
  `profitPercentage` decimal(10,2) GENERATED ALWAYS AS ((case when ((`cost` * `quantity`) > 0) then ((`profit` / (`cost` * `quantity`)) * 100) else 0 end)) STORED,
  `discPercentage` decimal(10,2) GENERATED ALWAYS AS ((case when (`mrp` > 0) then (((`mrp` - `rate`) / `mrp`) * 100) else 0 end)) STORED,
  `UserName` varchar(255) NOT NULL,
  `Store` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `invoiceId` (`invoiceId`),
  CONSTRAINT `invoices_ibfk_1` FOREIGN KEY (`invoiceId`) REFERENCES `sales` (`invoiceId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoices`
--

LOCK TABLES `invoices` WRITE;
/*!40000 ALTER TABLE `invoices` DISABLE KEYS */;
INSERT INTO `invoices` (`id`, `invoiceId`, `productId`, `name`, `cost`, `mrp`, `discount`, `rate`, `quantity`, `totalAmount`, `barcode`, `UserName`, `Store`, `createdAt`) VALUES (1,'2411140001',NULL,'Cotton Pants',120.00,450.00,0.00,450.00,1.00,450.00,'12348','abdul','kurunegala','2024-11-14 14:01:06'),(2,'2411140001',NULL,'Slim Fit Jeans',-150.00,-500.00,-100.00,-400.00,-1.00,-400.00,NULL,'abdul','kurunegala','2024-11-14 14:01:06'),(8,'2411170001','016','Cocktail Dress',200.00,700.00,100.00,600.00,5.00,3000.00,'32157','abdul','kurunegala','2024-11-17 11:05:02'),(9,'2411170002','012','Slim Fit Jeans',150.00,500.00,0.00,500.00,2.00,1000.00,'34856','abdul','kurunegala','2024-11-17 11:57:47'),(10,'2411170002','012','Slim Fit Jeans',-150.00,-500.00,0.00,-500.00,-1.00,-500.00,'34856','abdul','kurunegala','2024-11-17 11:57:47'),(11,'2411170003','012','Slim Fit Jeans',150.00,500.00,20.00,480.00,1.00,480.00,'34856','abdul','kurunegala','2024-11-17 12:03:20'),(12,'2411170003','012','Slim Fit Jeans',150.00,500.00,20.00,480.00,2.00,960.00,'34856','abdul','kurunegala','2024-11-17 12:03:20'),(13,'2411170003','012','Slim Fit Jeans',-150.00,-500.00,0.00,-500.00,-1.00,-500.00,'34856','abdul','kurunegala','2024-11-17 12:03:20'),(14,'2411170004','012','Slim Fit Jeans',-150.00,-500.00,-50.00,-450.00,-1.00,-450.00,'34856','abdul','kurunegala','2024-11-17 12:04:01'),(15,'2411170005','012','Slim Fit Jeans',150.00,500.00,50.00,450.00,2.00,900.00,'34856','abdul','kurunegala','2024-11-17 12:06:04'),(16,'2411170006','012','Slim Fit Jeans',-150.00,-500.00,-50.00,-450.00,-2.00,-900.00,'34856','abdul','kurunegala','2024-11-17 12:06:24'),(17,'2411170007','012','Slim Fit Jeans',-150.00,-500.00,-50.00,-450.00,-1.00,-450.00,'34856','abdul','kurunegala','2024-11-17 12:25:41'),(18,'2411170008','012','Slim Fit Jeans',150.00,500.00,50.00,450.00,6.00,2700.00,'34856','abdul','kurunegala','2024-11-17 12:26:12'),(19,'2411170009','012','Slim Fit Jeans',150.00,500.00,0.00,500.00,1.00,500.00,'34856','abdul','kurunegala','2024-11-17 12:31:18'),(20,'2411170009','012','Slim Fit Jeans',-150.00,-500.00,0.00,-500.00,-2.00,-1000.00,'34856','abdul','kurunegala','2024-11-17 12:31:18'),(21,'2411170010','012','Slim Fit Jeans',150.00,500.00,50.00,450.00,5.00,2250.00,'34856','abdul','kurunegala','2024-11-17 12:41:24'),(22,'2411170011','012','Slim Fit Jeans',-150.00,-500.00,-50.00,-450.00,-14.00,-6300.00,'34856','abdul','kurunegala','2024-11-17 12:42:59'),(23,'2411170012','012','Slim Fit Jeans',150.00,500.00,50.00,450.00,5.00,2250.00,'34856','abdul','kurunegala','2024-11-17 12:48:44'),(24,'2411170012','012','Slim Fit Jeans',-150.00,-500.00,-50.00,-450.00,-5.00,-2250.00,NULL,'abdul','kurunegala','2024-11-17 12:48:44');
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

-- Dump completed on 2024-11-17 18:06:17
