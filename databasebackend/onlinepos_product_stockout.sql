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
-- Table structure for table `product_stockout`
--

DROP TABLE IF EXISTS `product_stockout`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_stockout` (
  `stockOutId` int NOT NULL AUTO_INCREMENT,
  `productId` int NOT NULL,
  `productName` varchar(1000) NOT NULL,
  `barcode` varchar(1000) NOT NULL,
  `quantity` decimal(10,4) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `store` varchar(255) DEFAULT NULL,
  `date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `invoiceId` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`stockOutId`)
) ENGINE=InnoDB AUTO_INCREMENT=87 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_stockout`
--

LOCK TABLES `product_stockout` WRITE;
/*!40000 ALTER TABLE `product_stockout` DISABLE KEYS */;
INSERT INTO `product_stockout` VALUES (1,12,'Slim Fit Jeans','34856',1.0000,'Selled Item','kurunegala','2024-11-25 14:20:50','2411250001'),(2,12,'Slim Fit Jeans','34856',2.0000,'StockOut','kurunegala','2024-11-26 15:02:45',NULL),(3,12,'Slim Fit Jeans','34856',3.0000,'StockOut','kurunegala','2024-11-26 15:02:51',NULL),(4,12,'Slim Fit Jeans','34856',4.0000,'StockOut','kurunegala','2024-11-26 15:02:54',NULL),(5,12,'Slim Fit Jeans','34856',2.0000,'StockOut','kurunegala','2024-11-26 15:02:56',NULL),(6,12,'Slim Fit Jeans','34856',5.0000,'StockOut','kurunegala','2024-11-26 15:02:59',NULL),(7,12,'Slim Fit Jeans','34856',20.0000,'StockOut','kurunegala','2024-11-26 15:03:37',NULL),(8,12,'Slim Fit Jeans','34856',20.0000,'StockOut','kurunegala','2024-11-26 16:30:10',NULL),(9,12,'Slim Fit Jeans','34856',150.0000,'StockOut','kurunegala','2024-11-26 16:30:32',NULL),(11,12,'Slim Fit Jeans','34856',69.0000,'StockOut','kurunegala','2024-11-26 16:30:47',NULL),(12,12,'Slim Fit Jeans','34856',65.0000,'StockOut','kurunegala','2024-11-26 16:30:51',NULL),(13,15,'Summer Dress','45782',1.0000,'Selled Item','kurunegala','2024-11-26 18:34:42','2411270001'),(14,21,'Cargo Pants','65147',1.0000,'Selled Item','kurunegala','2024-11-26 18:34:42','2411270001'),(15,16,'Cocktail Dress','32157',3.0000,'Selled Item','kurunegala','2024-11-26 18:34:57','2411270002'),(16,5,'Checkin Pants','59884',2.0000,'Selled Item','kurunegala','2024-11-26 18:57:25','2411270003'),(17,15,'Summer Dress','45782',2.0000,'Selled Item','kurunegala','2024-12-01 19:10:00','2412020001'),(18,1,'Sleeve Shirt ','08145',1.0000,'Selled Item','kurunegala','2024-12-02 02:36:27','2412020002'),(19,15,'Summer Dress','45782',2.0000,'Selled Item','kurunegala','2024-12-03 00:30:35','2412030001'),(20,15,'Summer Dress','45782',1.0000,'Selled Item','kurunegala','2024-12-03 00:30:52','2412030002'),(21,15,'Summer Dress','45782',1.0000,'Selled Item','kurunegala','2024-12-03 16:56:07','2412030003'),(22,37,'Cufflinks','74961',2.0000,'Selled Item','kurunegala','2024-12-03 16:56:07','2412030003'),(23,16,'Cocktail Dress','32157',1.0000,'Selled Item','kurunegala','2024-12-03 16:56:07','2412030003'),(24,11,'Joggers','75894',1.0000,'Selled Item','kurunegala','2024-12-03 16:56:07','2412030003'),(25,32,'Clutch Bag','56132',1.0000,'Selled Item','kurunegala','2024-12-03 16:56:07','2412030003'),(26,18,'Denim Skirt','45713',1.0000,'Selled Item','kurunegala','2024-12-03 16:56:07','2412030003'),(27,21,'Cargo Pants','65147',1.0000,'Selled Item','kurunegala','2024-12-04 00:49:25','2412040001'),(28,15,'Summer Dress','45782',1.0000,'Selled Item','kurunegala','2024-12-04 00:54:01','2412040002'),(29,16,'Cocktail Dress','32157',1.0000,'Selled Item','kurunegala','2024-12-04 00:56:14','2412040003'),(30,43,'Overalls','21546',1.0000,'Selled Item','kurunegala','2024-12-04 00:57:37','2412040004'),(31,16,'Cocktail Dress','32157',1.0000,'Selled Item','kurunegala','2024-12-04 00:58:43','2412040005'),(32,15,'Summer Dress','45782',1.0000,'Selled Item','kurunegala','2024-12-04 01:05:02','2412040006'),(33,15,'Summer Dress','45782',1.0000,'Selled Item','kurunegala','2024-12-04 01:05:29','2412040007'),(34,15,'Summer Dress','45782',1.0000,'Selled Item','kurunegala','2024-12-04 01:05:32','2412040008'),(35,15,'Summer Dress','45782',1.0000,'Selled Item','kurunegala','2024-12-04 01:05:34','2412040009'),(36,16,'Cocktail Dress','32157',1.0000,'Selled Item','kurunegala','2024-12-04 01:06:19','2412040010'),(37,16,'Cocktail Dress','32157',1.0000,'Selled Item','kurunegala','2024-12-04 01:06:47','2412040011'),(38,16,'Cocktail Dress','32157',1.0000,'Selled Item','kurunegala','2024-12-04 01:07:14','2412040012'),(39,16,'Cocktail Dress','32157',1.0000,'Selled Item','kurunegala','2024-12-04 01:47:54','2412040013'),(40,16,'Cocktail Dress','32157',1.0000,'Selled Item','kurunegala','2024-12-04 02:00:13','2412040014'),(41,16,'Cocktail Dress','32157',1.0000,'Selled Item','kurunegala','2024-12-04 02:00:17','2412040015'),(42,16,'Cocktail Dress','32157',1.0000,'Selled Item','kurunegala','2024-12-04 02:00:55','2412040016'),(43,16,'Cocktail Dress','32157',1.0000,'Selled Item','kurunegala','2024-12-04 02:00:58','2412040017'),(44,16,'Cocktail Dress','32157',1.0000,'Selled Item','kurunegala','2024-12-04 02:01:04','2412040018'),(45,15,'Summer Dress','45782',1.0000,'Selled Item','kurunegala','2024-12-04 02:06:00','2412040019'),(46,16,'Cocktail Dress','32157',1.0000,'Selled Item','kurunegala','2024-12-04 02:09:04','2412040020'),(47,15,'Summer Dress','45782',1.0000,'Selled Item','kurunegala','2024-12-04 02:23:47','2412040021'),(48,15,'Summer Dress','45782',1.0000,'Selled Item','kurunegala','2024-12-04 02:25:10','2412040022'),(49,15,'Summer Dress','45782',1.0000,'Selled Item','kurunegala','2024-12-04 02:25:54','2412040023'),(50,9,'Denim Jacket','85963',1.0000,'Selled Item','kurunegala','2024-12-04 02:26:31','2412040024'),(51,16,'Cocktail Dress','32157',1.0000,'Selled Item','kurunegala','2024-12-04 02:33:43','2412040025'),(52,16,'Cocktail Dress','32157',1.0000,'Selled Item','kurunegala','2024-12-04 02:33:51','2412040026'),(53,16,'Cocktail Dress','32157',1.0000,'Selled Item','kurunegala','2024-12-04 02:44:08','2412040027'),(54,16,'Cocktail Dress','32157',1.0000,'Selled Item','kurunegala','2024-12-04 02:44:41','2412040028'),(55,16,'Cocktail Dress','32157',1.0000,'Selled Item','kurunegala','2024-12-04 03:11:36','2412040029'),(56,15,'Summer Dress','45782',1.0000,'Selled Item','kurunegala','2024-12-04 17:02:16','2412040030'),(57,32,'Clutch Bag','56132',2.0000,'Selled Item','kurunegala','2024-12-04 17:02:16','2412040030'),(58,16,'Cocktail Dress','32157',2.0000,'Selled Item','kurunegala','2024-12-04 17:02:56','2412040031'),(59,21,'Cargo Pants','65147',2.0000,'Selled Item','kurunegala','2024-12-04 17:02:56','2412040031'),(60,15,'Summer Dress','45782',1.0000,'Selled Item','kurunegala','2024-12-05 01:14:05','2412050001'),(61,1,'Sleeve Shirt ','08145',1.0000,'Selled Item','kurunegala','2024-12-05 01:14:05','2412050001'),(62,15,'Summer Dress','45782',1.0000,'Selled Item','kurunegala','2024-12-05 01:15:27','2412050002'),(63,16,'Cocktail Dress','32157',1.0000,'Selled Item','kurunegala','2024-12-05 01:30:59','2412050003'),(64,16,'Cocktail Dress','32157',1.0000,'Selled Item','kurunegala','2024-12-05 01:30:59','2412050003'),(65,33,'Satchel Bag','97854',1.0000,'Selled Item','kurunegala','2024-12-05 01:30:59','2412050003'),(66,12,'Slim Fit Jeans','34856',1.0000,'Selled Item','kurunegala','2024-12-06 15:22:01','2412060001'),(67,42,'Linen Pants','58741',1.0000,'Selled Item','kurunegala','2024-12-06 15:22:01','2412060001'),(68,43,'Overalls','21546',1.0000,'Selled Item','kurunegala','2024-12-06 15:22:24','2412060002'),(69,7,'Printed T-Shirt','65748',1.0000,'Selled Item','kurunegala','2024-12-06 15:22:24','2412060002'),(70,15,'Summer Dress','45782',1.0000,'Selled Item','kurunegala','2024-12-07 01:11:08','2412070001'),(71,37,'Cufflinks','74961',1.0000,'Selled Item','kurunegala','2024-12-07 01:11:40','2412070002'),(72,34,'Leather Gloves','34879',1.0000,'Selled Item','kurunegala','2024-12-07 01:11:40','2412070002'),(73,15,'Summer Dress','45782',1.0000,'Selled Item','kurunegala','2024-12-07 02:05:33','2412070003'),(74,24,'Ankle Boots','56487',1.0000,'Selled Item','kurunegala','2024-12-07 02:05:33','2412070003'),(75,18,'Denim Skirt','45713',1.0000,'Selled Item','kurunegala','2024-12-07 02:13:44','2412070004'),(76,1,'Sleeve Shirt ','08145',1.0000,'Selled Item','kurunegala','2024-12-07 02:13:44','2412070004'),(77,19,'Leather Jacket','25714',1.0000,'Selled Item','kurunegala','2024-12-07 02:13:44','2412070004'),(78,1,'Sleeve Shirt ','08145',1.0000,'Selled Item','kurunegala','2024-12-07 02:28:29','2412070005'),(79,1,'Sleeve Shirt ','08145',1.0000,'Selled Item','kurunegala','2024-12-07 02:32:35','2412070006'),(80,1,'Sleeve Shirt ','08145',1.0000,'Selled Item','kurunegala','2024-12-07 02:33:16','2412070007'),(81,16,'Cocktail Dress','32157',1.0000,'Selled Item','kurunegala','2024-12-07 23:48:04','2412080001'),(82,11,'Joggers','75894',1.0000,'Selled Item','kurunegala','2024-12-08 00:16:55','2412080002'),(83,18,'Denim Skirt','45713',1.0000,'Selled Item','kurunegala','2024-12-08 00:16:55','2412080002'),(84,16,'Cocktail Dress','32157',1.0000,'Selled Item','kurunegala','2024-12-08 00:44:26','2412080003'),(85,1,'Sleeve Shirt ','08145',1.0000,'Selled Item','kurunegala','2024-12-08 00:44:26','2412080003'),(86,15,'Summer Dress','45782',1.0000,'Selled Item','kurunegala','2024-12-08 00:44:48','2412080004');
/*!40000 ALTER TABLE `product_stockout` ENABLE KEYS */;
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
