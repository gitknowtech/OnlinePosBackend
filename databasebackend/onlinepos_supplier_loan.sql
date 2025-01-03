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
-- Table structure for table `supplier_loan`
--

DROP TABLE IF EXISTS `supplier_loan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supplier_loan` (
  `id` int NOT NULL AUTO_INCREMENT,
  `generatedId` varchar(255) NOT NULL,
  `supId` varchar(255) NOT NULL,
  `supName` varchar(255) NOT NULL,
  `loanAmount` decimal(10,2) NOT NULL,
  `cashAmount` decimal(10,2) DEFAULT '0.00',
  `totalAmount` decimal(10,2) GENERATED ALWAYS AS ((`loanAmount` + `cashAmount`)) STORED,
  `billNumber` varchar(255) NOT NULL,
  `description` text,
  `filePath` varchar(255) DEFAULT NULL,
  `saveTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `generatedId` (`generatedId`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supplier_loan`
--

LOCK TABLES `supplier_loan` WRITE;
/*!40000 ALTER TABLE `supplier_loan` DISABLE KEYS */;
INSERT INTO `supplier_loan` (`id`, `generatedId`, `supId`, `supName`, `loanAmount`, `cashAmount`, `billNumber`, `description`, `filePath`, `saveTime`) VALUES (9,'7184E9','003','asanka',5000.00,25000.00,'5757','dfbfh','1733367696731-26710150-certificatepaymentofficeandgraphicdesign.pdf','2024-12-05 08:31:36'),(10,'903BA3','003','asanka',50000.00,20000.00,'6541561','veneriguber','1733624787475-226211287-Buddy_Travel.pdf','2024-12-08 07:56:27'),(11,'768846','003','asanka',12000.00,8000.00,'256','hfhg',NULL,'2024-12-08 07:56:51'),(12,'46CAD7','003','asanka',10000.00,1000.00,'515','56156',NULL,'2024-12-08 08:05:12');
/*!40000 ALTER TABLE `supplier_loan` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-09  8:25:41
