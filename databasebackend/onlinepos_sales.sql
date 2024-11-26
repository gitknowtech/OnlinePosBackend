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
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales`
--

LOCK TABLES `sales` WRITE;
/*!40000 ALTER TABLE `sales` DISABLE KEYS */;
INSERT INTO `sales` VALUES (1,'2411240001',-560.00,'Unknown',0.00,0.00,-560.00,0.00,0.00,'Return Payment',-560.00,'abdul','kurunegala','2024-11-24 08:33:08'),(2,'2411240002',500.00,'Unknown',0.00,0.00,500.00,80.00,120.00,'Credit Payment',-300.00,'abdul','kurunegala','2024-11-24 18:49:05'),(3,'2411240003',280.00,'101',0.00,0.00,280.00,0.00,0.00,'Cash Payment',280.00,'abdul','kurunegala','2024-11-24 20:37:55'),(4,'2411240004',850.00,'101',0.00,0.00,850.00,0.00,0.00,'Credit Payment',850.00,'abdul','kurunegala','2024-11-24 20:38:06'),(5,'2411240005',280.00,'101',0.00,0.00,280.00,0.00,0.00,'Credit Payment',280.00,'abdul','kurunegala','2024-11-24 20:38:17'),(6,'2411240006',280.00,'101',10.00,28.00,252.00,32.00,0.00,'Credit Payment',-248.00,'abdul','kurunegala','2024-11-24 20:44:37'),(7,'2411240007',300.00,'18',0.00,0.00,300.00,0.00,0.00,'Credit Payment',300.00,'abdul','kurunegala','2024-11-24 21:07:15'),(8,'2411240008',280.00,'99',0.00,0.00,280.00,0.00,0.00,'Credit Payment',280.00,'abdul','kurunegala','2024-11-24 21:08:01'),(9,'2411240009',280.00,'1',0.00,0.00,280.00,0.00,0.00,'Credit Payment',280.00,'abdul','kurunegala','2024-11-24 21:11:48'),(10,'2411240010',300.00,'200',0.00,0.00,300.00,140.00,120.00,'Credit Payment',-40.00,'abdul','kurunegala','2024-11-24 21:31:34'),(11,'2411240011',250.00,'200',0.00,0.00,250.00,110.00,90.00,'Credit Payment',-50.00,'abdul','kurunegala','2024-11-24 21:31:58'),(13,'2411250001',10.00,'200',0.00,0.00,10.00,5.00,3.00,'Credit Payment',-2.00,'abdul','kurunegala','2024-11-25 19:50:50');
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

-- Dump completed on 2024-11-26  8:55:07
