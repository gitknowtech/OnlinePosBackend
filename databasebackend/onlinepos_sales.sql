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
-- Table structure for table `sales`
--

DROP TABLE IF EXISTS `sales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sales` (
  `id` int NOT NULL AUTO_INCREMENT,
  `invoiceId` varchar(100) NOT NULL,
  `GrossTotal` decimal(10,2) NOT NULL,
  `CustomerId` varchar(255) NOT NULL DEFAULT 'Unknown',
  `discountPercent` decimal(10,2) DEFAULT NULL,
  `discountAmount` decimal(10,2) DEFAULT NULL,
  `netAmount` decimal(10,2) NOT NULL,
  `CashPay` decimal(10,2) DEFAULT NULL,
  `CardPay` decimal(10,2) DEFAULT NULL,
  `PaymentType` varchar(50) NOT NULL,
  `Balance` decimal(10,2) DEFAULT NULL,
  `UserName` varchar(255) NOT NULL,
  `Store` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `invoiceId` (`invoiceId`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales`
--

LOCK TABLES `sales` WRITE;
/*!40000 ALTER TABLE `sales` DISABLE KEYS */;
INSERT INTO `sales` VALUES (1,'2411140001',50.00,'99',5.00,2.50,47.50,45.00,2.50,'Cash and Card Payment',0.00,'abdul','kurunegala','2024-11-14 14:01:06'),(5,'2411170001',3000.00,'Unknown',0.00,0.00,3000.00,4000.00,0.00,'Cash Payment',1000.00,'abdul','kurunegala','2024-11-17 11:05:02'),(6,'2411170002',500.00,'Unknown',0.00,0.00,500.00,500.00,0.00,'Cash Payment',0.00,'abdul','kurunegala','2024-11-17 11:57:47'),(7,'2411170003',940.00,'Unknown',0.00,0.00,940.00,1000.00,0.00,'Cash Payment',60.00,'abdul','kurunegala','2024-11-17 12:03:20'),(8,'2411170004',-450.00,'Unknown',0.00,0.00,-450.00,0.00,0.00,'Return Payment',-450.00,'abdul','kurunegala','2024-11-17 12:04:01'),(9,'2411170005',900.00,'Unknown',0.00,0.00,900.00,1000.00,0.00,'Cash Payment',100.00,'abdul','kurunegala','2024-11-17 12:06:04'),(10,'2411170006',-900.00,'Unknown',0.00,0.00,-900.00,0.00,0.00,'Return Payment',-900.00,'abdul','kurunegala','2024-11-17 12:06:24'),(11,'2411170007',-450.00,'Unknown',0.00,0.00,-450.00,0.00,0.00,'Return Payment',-450.00,'abdul','kurunegala','2024-11-17 12:25:41'),(12,'2411170008',2700.00,'Unknown',0.00,0.00,2700.00,5000.00,0.00,'Cash Payment',2300.00,'abdul','kurunegala','2024-11-17 12:26:12'),(13,'2411170009',-500.00,'Unknown',0.00,0.00,-500.00,0.00,0.00,'Return Payment',-500.00,'abdul','kurunegala','2024-11-17 12:31:18'),(14,'2411170010',2250.00,'Unknown',0.00,0.00,2250.00,3000.00,0.00,'Cash Payment',750.00,'abdul','kurunegala','2024-11-17 12:41:24'),(15,'2411170011',-6300.00,'Unknown',0.00,0.00,-6300.00,0.00,0.00,'Return Payment',-6300.00,'abdul','kurunegala','2024-11-17 12:42:59'),(16,'2411170012',0.00,'Unknown',0.00,0.00,0.00,0.00,0.00,'Cash Payment',0.00,'abdul','kurunegala','2024-11-17 12:48:44');
/*!40000 ALTER TABLE `sales` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-17 18:06:20
