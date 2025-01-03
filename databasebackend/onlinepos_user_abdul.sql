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
-- Table structure for table `user_abdul`
--

DROP TABLE IF EXISTS `user_abdul`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_abdul` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `value` enum('yes','no') NOT NULL DEFAULT 'yes',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_abdul`
--

LOCK TABLES `user_abdul` WRITE;
/*!40000 ALTER TABLE `user_abdul` DISABLE KEYS */;
INSERT INTO `user_abdul` VALUES (1,'Dashboard','yes'),(2,'Invoice','yes'),(3,'Sales','yes'),(4,'InvoiceList','yes'),(5,'SalesList','yes'),(6,'Stock','yes'),(7,'StockIn','yes'),(8,'StockOut','yes'),(9,'GetStock','yes'),(10,'OutStock','yes'),(11,'StockByCategory','yes'),(12,'StockBySupplier','yes'),(13,'StockByBatch','yes'),(14,'Product','yes'),(15,'ProductCard','yes'),(16,'ProductList','yes'),(17,'AddProduct','yes'),(18,'ManageBatch','yes'),(19,'ManageUnit','yes'),(20,'ManageCategory','yes'),(21,'RemovedProducts','yes'),(22,'Purchasing','yes'),(23,'SupplierList','yes'),(24,'AddSupplier','yes'),(25,'SupplierPayment','yes'),(26,'ManageBank','yes'),(27,'RemovedSupplier','yes'),(28,'User','yes'),(29,'AddUser','yes'),(30,'ManageUser','yes'),(31,'Customer','yes'),(32,'ManageCustomer','yes'),(33,'AddCustomer','yes'),(34,'CreditSales','yes'),(35,'CustomerBalance','yes'),(36,'Quotation','yes'),(37,'QuotationList','yes'),(38,'Charts','yes'),(39,'CustomerChart','yes'),(40,'StockChart','yes'),(41,'StockOutChart','yes'),(42,'SaleChart','yes'),(43,'Setting','yes'),(44,'Reports','yes'),(45,'Backup','yes');
/*!40000 ALTER TABLE `user_abdul` ENABLE KEYS */;
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
