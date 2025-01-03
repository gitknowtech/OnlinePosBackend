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
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales`
--

LOCK TABLES `sales` WRITE;
/*!40000 ALTER TABLE `sales` DISABLE KEYS */;
INSERT INTO `sales` VALUES (1,'2411240001',-560.00,'Unknown',0.00,0.00,-560.00,0.00,0.00,'Return Payment',-560.00,'abdul','kurunegala','2024-11-24 08:33:08'),(2,'2411240002',500.00,'Unknown',0.00,0.00,500.00,80.00,120.00,'Credit Payment',-300.00,'abdul','kurunegala','2024-11-24 18:49:05'),(3,'2411240003',280.00,'101',0.00,0.00,280.00,0.00,0.00,'Cash Payment',280.00,'abdul','kurunegala','2024-11-24 20:37:55'),(4,'2411240004',850.00,'101',0.00,0.00,850.00,0.00,0.00,'Credit Payment',-850.00,'abdul','kurunegala','2024-11-24 20:38:06'),(5,'2411240005',280.00,'101',0.00,0.00,280.00,0.00,0.00,'Credit Payment',280.00,'abdul','kurunegala','2024-11-24 20:38:17'),(6,'2411240006',280.00,'101',10.00,28.00,252.00,32.00,0.00,'Credit Payment',-248.00,'abdul','kurunegala','2024-11-24 20:44:37'),(7,'2411240007',300.00,'18',0.00,0.00,300.00,0.00,0.00,'Credit Payment',300.00,'abdul','kurunegala','2024-11-24 21:07:15'),(8,'2411240008',280.00,'99',0.00,0.00,280.00,0.00,0.00,'Credit Payment',280.00,'abdul','kurunegala','2024-11-24 21:08:01'),(9,'2411240009',280.00,'1',0.00,0.00,280.00,0.00,0.00,'Credit Payment',280.00,'abdul','kurunegala','2024-11-24 21:11:48'),(10,'2411240010',300.00,'200',0.00,0.00,300.00,140.00,120.00,'Credit Payment',-40.00,'abdul','kurunegala','2024-11-24 21:31:34'),(11,'2411240011',250.00,'200',0.00,0.00,250.00,110.00,90.00,'Credit Payment',-50.00,'abdul','kurunegala','2024-11-24 21:31:58'),(13,'2411250001',10.00,'200',0.00,0.00,10.00,5.00,3.00,'Credit Payment',-2.00,'abdul','kurunegala','2024-11-25 19:50:50'),(14,'2411270001',700.00,'200',10.00,70.00,630.00,600.00,0.00,'Credit Payment',-30.00,'abdul','kurunegala','2024-11-27 00:04:42'),(15,'2411270002',1950.00,'200',0.00,0.00,1950.00,1000.00,0.00,'Credit Payment',-950.00,'abdul','kurunegala','2024-11-27 00:04:57'),(16,'2411270003',900.00,'200',0.00,0.00,900.00,600.00,0.00,'Credit Payment',-300.00,'abdul','kurunegala','2024-11-27 00:27:25'),(17,'2412020001',560.00,'200',0.00,0.00,560.00,700.00,0.00,'Cash Payment',140.00,'abdul','kurunegala','2024-12-02 00:40:00'),(18,'2412020002',250.00,'200',5.00,12.50,237.50,200.00,0.00,'Credit Payment',-37.50,'abdul','kurunegala','2024-12-02 08:06:27'),(19,'2412030001',560.00,'Unknown',10.71,60.00,500.00,400.00,0.00,'Credit Payment',-100.00,'abdul','kurunegala','2024-12-03 06:00:35'),(20,'2412030002',280.00,'035',28.57,80.00,200.00,100.00,100.00,'Cash and Card Payment',0.00,'abdul','kurunegala','2024-12-03 06:00:52'),(21,'2412030003',1920.00,'Unknown',6.25,120.00,1800.00,1000.00,0.00,'Credit Payment',-800.00,'abdul','kurunegala','2024-12-03 22:26:07'),(22,'2412040001',400.00,'Unknown',0.00,0.00,400.00,400.00,0.00,'Cash Payment',0.00,'abdul','kurunegala','2024-12-04 06:19:25'),(23,'2412040002',300.00,'Unknown',0.00,0.00,300.00,500.00,0.00,'Cash Payment',200.00,'abdul','kurunegala','2024-12-04 06:24:01'),(24,'2412040003',700.00,'Unknown',0.00,0.00,700.00,800.00,0.00,'Cash Payment',100.00,'abdul','kurunegala','2024-12-04 06:26:14'),(25,'2412040004',350.00,'Unknown',0.00,0.00,350.00,400.00,0.00,'Cash Payment',50.00,'abdul','kurunegala','2024-12-04 06:27:37'),(26,'2412040005',700.00,'200',0.00,0.00,700.00,0.00,0.00,'Credit Payment',-700.00,'abdul','kurunegala','2024-12-04 06:28:43'),(27,'2412040006',300.00,'Unknown',0.00,0.00,300.00,500.00,0.00,'Cash Payment',200.00,'abdul','kurunegala','2024-12-04 06:35:02'),(28,'2412040007',300.00,'Unknown',0.00,0.00,300.00,0.00,0.00,'Credit Payment',300.00,'abdul','kurunegala','2024-12-04 06:35:29'),(29,'2412040008',300.00,'Unknown',0.00,0.00,300.00,0.00,0.00,'Credit Payment',300.00,'abdul','kurunegala','2024-12-04 06:35:32'),(30,'2412040009',300.00,'Unknown',0.00,0.00,300.00,0.00,0.00,'Credit Payment',300.00,'abdul','kurunegala','2024-12-04 06:35:34'),(31,'2412040010',700.00,'Unknown',0.00,0.00,700.00,0.00,0.00,'Cash Payment',700.00,'abdul','kurunegala','2024-12-04 06:36:19'),(32,'2412040011',700.00,'Unknown',0.00,0.00,700.00,800.00,0.00,'Cash Payment',100.00,'abdul','kurunegala','2024-12-04 06:36:47'),(33,'2412040012',700.00,'Unknown',0.00,0.00,700.00,800.00,0.00,'Cash Payment',100.00,'abdul','kurunegala','2024-12-04 06:37:14'),(34,'2412040013',700.00,'200',0.00,0.00,700.00,1000.00,0.00,'Cash Payment',300.00,'abdul','kurunegala','2024-12-04 07:17:54'),(35,'2412040014',700.00,'200',0.00,0.00,700.00,500.00,0.00,'Credit Payment',-200.00,'abdul','kurunegala','2024-12-04 07:30:13'),(36,'2412040015',700.00,'200',0.00,0.00,700.00,500.00,0.00,'Credit Payment',-200.00,'abdul','kurunegala','2024-12-04 07:30:17'),(37,'2412040016',700.00,'200',0.00,0.00,700.00,500.00,0.00,'Credit Payment',-200.00,'abdul','kurunegala','2024-12-04 07:30:55'),(38,'2412040017',700.00,'200',0.00,0.00,700.00,500.00,0.00,'Credit Payment',-200.00,'abdul','kurunegala','2024-12-04 07:30:58'),(39,'2412040018',700.00,'200',0.00,0.00,700.00,500.00,0.00,'Credit Payment',-200.00,'abdul','kurunegala','2024-12-04 07:31:04'),(40,'2412040019',300.00,'200',0.00,0.00,300.00,500.00,0.00,'Cash Payment',200.00,'abdul','kurunegala','2024-12-04 07:36:00'),(41,'2412040020',700.00,'Unknown',0.00,0.00,700.00,900.00,0.00,'Cash Payment',200.00,'abdul','kurunegala','2024-12-04 07:39:04'),(42,'2412040021',300.00,'Unknown',0.00,0.00,300.00,400.00,0.00,'Cash Payment',100.00,'abdul','kurunegala','2024-12-04 07:53:47'),(43,'2412040022',280.00,'200',0.00,0.00,280.00,200.00,0.00,'Credit Payment',-80.00,'abdul','kurunegala','2024-12-04 07:55:10'),(44,'2412040023',300.00,'200',0.00,0.00,300.00,250.00,0.00,'Credit Payment',-50.00,'abdul','kurunegala','2024-12-04 07:55:54'),(45,'2412040024',800.00,'200',0.00,0.00,800.00,600.00,0.00,'Credit Payment',-200.00,'abdul','kurunegala','2024-12-04 07:56:31'),(46,'2412040025',700.00,'200',0.00,0.00,700.00,650.00,0.00,'Credit Payment',-50.00,'abdul','kurunegala','2024-12-04 08:03:43'),(47,'2412040026',700.00,'200',0.00,0.00,700.00,650.00,0.00,'Credit Payment',-50.00,'abdul','kurunegala','2024-12-04 08:03:51'),(48,'2412040027',700.00,'Unknown',0.00,0.00,700.00,800.00,0.00,'Cash Payment',100.00,'abdul','kurunegala','2024-12-04 08:14:08'),(49,'2412040028',700.00,'Unknown',0.00,0.00,700.00,0.00,0.00,'Credit Payment',700.00,'abdul','kurunegala','2024-12-04 08:14:41'),(50,'2412040029',700.00,'Unknown',0.00,0.00,700.00,800.00,0.00,'Cash Payment',100.00,'abdul','kurunegala','2024-12-04 08:41:36'),(51,'2412040030',800.00,'0251',0.00,0.00,800.00,400.00,0.00,'Credit Payment',-400.00,'abdul','kurunegala','2024-12-04 22:32:16'),(52,'2412040031',2100.00,'0251',0.00,0.00,2100.00,1500.00,200.00,'Credit Payment',-400.00,'abdul','kurunegala','2024-12-04 22:32:56'),(53,'2412050001',550.00,'Unknown',0.00,0.00,550.00,600.00,0.00,'Cash Payment',50.00,'abdul','kurunegala','2024-12-05 06:44:05'),(54,'2412050002',300.00,'Unknown',0.00,0.00,300.00,0.00,0.00,'Credit Payment',300.00,'abdul','kurunegala','2024-12-05 06:45:27'),(55,'2412050003',1750.00,'0251',0.00,0.00,1750.00,1500.00,0.00,'Credit Payment',-250.00,'abdul','kurunegala','2024-12-05 07:00:59'),(56,'2412060001',800.00,'200',0.00,0.00,800.00,1000.00,0.00,'Cash Payment',200.00,'abdul','kurunegala','2024-12-06 20:52:01'),(57,'2412060002',500.00,'200',0.00,0.00,500.00,300.00,0.00,'Credit Payment',-200.00,'abdul','kurunegala','2024-12-06 20:52:24'),(58,'2412070001',300.00,'0251',0.00,0.00,300.00,100.00,0.00,'Credit Payment',-200.00,'abdul','kurunegala','2024-12-07 06:41:08'),(59,'2412070002',260.00,'085',0.00,0.00,260.00,200.00,0.00,'Credit Payment',-60.00,'abdul','kurunegala','2024-12-07 06:41:40'),(60,'2412070003',700.00,'0251',0.00,0.00,700.00,500.00,0.00,'Credit Payment',-200.00,'abdul','kurunegala','2024-12-07 07:35:33'),(61,'2412070004',1410.00,'0251',14.18,200.00,1210.00,2000.00,0.00,'Cash Payment',790.00,'abdul','kurunegala','2024-12-07 07:43:44'),(62,'2412070005',250.00,'Unknown',0.00,0.00,250.00,200.00,50.00,'Credit Payment',-50.00,'abdul','kurunegala','2024-12-07 07:58:29'),(63,'2412070006',80.00,'0251',0.00,0.00,80.00,100.00,0.00,'Cash Payment',20.00,'abdul','kurunegala','2024-12-07 08:02:35'),(64,'2412070007',80.00,'0251',0.00,0.00,80.00,100.00,0.00,'Cash Payment',20.00,'abdul','kurunegala','2024-12-07 08:03:16'),(65,'2412080001',700.00,'0251',0.00,0.00,700.00,800.00,0.00,'Cash Payment',100.00,'abdul','kurunegala','2024-12-08 05:18:04'),(66,'2412080002',580.00,'200',0.00,0.00,580.00,600.00,0.00,'Cash Payment',20.00,'abdul','kurunegala','2024-12-08 05:46:55'),(67,'2412080003',950.00,'200',0.00,0.00,950.00,1000.00,0.00,'Cash Payment',50.00,'abdul','kurunegala','2024-12-08 06:14:26'),(68,'2412080004',300.00,'200',0.00,0.00,300.00,0.00,0.00,'Credit Payment',-300.00,'abdul','kurunegala','2024-12-08 06:14:48');
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

-- Dump completed on 2024-12-09  8:25:39
