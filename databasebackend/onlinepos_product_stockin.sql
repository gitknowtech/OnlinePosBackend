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
-- Table structure for table `product_stockin`
--

DROP TABLE IF EXISTS `product_stockin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_stockin` (
  `stockInId` int NOT NULL AUTO_INCREMENT,
  `productId` int NOT NULL,
  `productname` varchar(1000) NOT NULL,
  `barcode` varchar(1000) NOT NULL,
  `quantity` decimal(10,4) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `store` varchar(255) DEFAULT NULL,
  `date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `invoiceId` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`stockInId`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_stockin`
--

LOCK TABLES `product_stockin` WRITE;
/*!40000 ALTER TABLE `product_stockin` DISABLE KEYS */;
INSERT INTO `product_stockin` VALUES (1,1,'Sleeve Shirt ','08145',2.0000,'ReturnItem','kurunegala','2024-11-25 14:20:50','2411250001'),(2,12,'Slim Fit Jeans','34856',2.0000,'StockIn','kurunegala','2024-11-26 15:58:10',NULL),(3,12,'Slim Fit Jeans','34856',4.0000,'StockIn','kurunegala','2024-11-26 15:58:12',NULL),(4,12,'Slim Fit Jeans','34856',2.0000,'StockIn','kurunegala','2024-11-26 15:58:14',NULL),(5,12,'Slim Fit Jeans','34856',5.0000,'StockIn','kurunegala','2024-11-26 15:58:16',NULL),(6,12,'Slim Fit Jeans','34856',3.0000,'StockIn','kurunegala','2024-11-26 15:58:18',NULL),(7,12,'Slim Fit Jeans','34856',1.0000,'StockIn','kurunegala','2024-11-26 15:58:21',NULL),(8,12,'Slim Fit Jeans','34856',20.0000,'StockIn','kurunegala','2024-11-26 15:58:26',NULL),(9,12,'Slim Fit Jeans','34856',30.0000,'StockIn','kurunegala','2024-11-26 16:30:24',NULL),(10,12,'Slim Fit Jeans','34856',100.0000,'StockIn','kurunegala','2024-11-26 18:12:24',NULL),(11,12,'Slim Fit Jeans','34856',500.0000,'StockIn','kurunegala','2024-11-26 18:12:58',NULL);
/*!40000 ALTER TABLE `product_stockin` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-09  8:25:40
