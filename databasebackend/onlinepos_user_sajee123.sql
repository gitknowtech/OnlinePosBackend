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
-- Table structure for table `user_sajee123`
--

DROP TABLE IF EXISTS `user_sajee123`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_sajee123` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `value` enum('yes','no') NOT NULL DEFAULT 'no',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_sajee123`
--

LOCK TABLES `user_sajee123` WRITE;
/*!40000 ALTER TABLE `user_sajee123` DISABLE KEYS */;
INSERT INTO `user_sajee123` VALUES (1,'Dashboard','no'),(2,'Invoice','no'),(3,'Sales','no'),(4,'InvoiceList','no'),(5,'SalesList','no'),(6,'Stock','no'),(7,'StockIn','no'),(8,'StockOut','no'),(9,'GetStock','no'),(10,'OutStock','no'),(11,'StockByCategory','no'),(12,'StockBySupplier','no'),(13,'StockByBatch','no'),(14,'Product','no'),(15,'ProductCard','no'),(16,'ProductList','no'),(17,'AddProduct','no'),(18,'ManageBatch','no'),(19,'ManageUnit','no'),(20,'ManageCategory','no'),(21,'RemovedProducts','no'),(22,'Purchasing','no'),(23,'SupplierList','no'),(24,'AddSupplier','no'),(25,'SupplierPayment','no'),(26,'ManageBank','no'),(27,'RemovedSupplier','no'),(28,'User','no'),(29,'AddUser','no'),(30,'ManageUser','no'),(31,'Customer','no'),(32,'ManageCustomer','no'),(33,'AddCustomer','no'),(34,'CreditSales','no'),(35,'CustomerBalance','no'),(36,'Quotation','no'),(37,'QuotationList','no'),(38,'Charts','no'),(39,'CustomerChart','no'),(40,'StockChart','no'),(41,'StockOutChart','no'),(42,'SaleChart','no'),(43,'Setting','no'),(44,'Reports','no'),(45,'Backup','no');
/*!40000 ALTER TABLE `user_sajee123` ENABLE KEYS */;
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
