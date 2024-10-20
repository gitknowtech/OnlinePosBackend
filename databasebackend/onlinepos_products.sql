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
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `productId` varchar(1000) NOT NULL,
  `productName` varchar(1000) NOT NULL,
  `productNameSinhala` varchar(255) DEFAULT NULL,
  `barcode` varchar(255) DEFAULT NULL,
  `batchNumber` varchar(255) DEFAULT NULL,
  `selectedSupplier` varchar(1000) DEFAULT NULL,
  `selectedCategory` varchar(1000) DEFAULT NULL,
  `selectedUnit` varchar(255) DEFAULT NULL,
  `manufacturingDate` date DEFAULT NULL,
  `expiringDate` date DEFAULT NULL,
  `costPrice` decimal(10,2) DEFAULT NULL,
  `mrpPrice` decimal(10,2) DEFAULT NULL,
  `profitPercentage` decimal(5,2) DEFAULT NULL,
  `profitAmount` decimal(10,2) DEFAULT NULL,
  `discountPrice` decimal(10,2) DEFAULT NULL,
  `discountPercentage` decimal(5,2) DEFAULT NULL,
  `wholesalePrice` decimal(10,2) DEFAULT NULL,
  `wholesalePercentage` decimal(5,2) DEFAULT NULL,
  `lockedPrice` decimal(10,2) DEFAULT NULL,
  `stockQuantity` decimal(10,4) DEFAULT NULL,
  `stockAlert` decimal(10,4) DEFAULT NULL,
  `store` varchar(500) DEFAULT NULL,
  `user` varchar(500) DEFAULT NULL,
  `status` varchar(10) DEFAULT NULL,
  `saveTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `imageLink` varchar(2000) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'001','Sleve Shirt','new shirt','08145','241018','Asanka','Cleaning Supplies','L','2024-10-20','2025-01-23',100.00,250.00,150.00,150.00,25.00,10.00,50.00,20.00,150.00,NULL,20.0000,'all','abdul','Inactive','2024-10-20 14:46:23','https://mansion.lk/wp-content/uploads/2023/12/Red-Checked-Long-Sleeve-Shirt-GS-8067-front.jpg'),(2,'002','shorts','egfg','88689','241005','Asanka','Cleaning Supplies','L','2024-10-20','2024-10-22',100.00,350.00,250.00,250.00,88.00,25.00,158.00,45.00,250.00,NULL,25.0000,'all','abdul','Active','2024-10-20 14:48:09','https://www.lornajane.com.au/dw/image/v2/BDXV_PRD/on/demandware.static/-/Sites-lornajane-master/default/dwc9561307/images/LB0265/LB0265_BLK_8_PRODUCT.jpg?sw=603&sh=846&q=90&strip=true'),(3,'003','sarong','sarma','38721','241018','amith','Specialty Paints','NEW','2024-10-20','2024-10-24',100.00,150.00,50.00,50.00,8.00,5.00,15.00,10.00,120.00,NULL,24.0000,'all','abdul','Inactive','2024-10-20 14:55:27','https://objectstorage.ap-mumbai-1.oraclecloud.com/n/softlogicbicloud/b/cdn/o/products/1700632723001--1--1627449504.jpeg'),(4,'005','checkin','fvfdgf','59884','241005','amith','Specialty Paints','NEW','2024-10-20','2024-10-30',160.00,500.00,212.50,340.00,50.00,10.00,100.00,20.00,350.00,NULL,25.0000,'all','abdul','Active','2024-10-20 14:58:05',''),(5,'052','new product','dvew','97899','241018','Asanka','Specialty Paints','L','2024-10-20','2024-11-21',100.00,250.00,150.00,150.00,25.00,10.00,50.00,20.00,120.00,NULL,15.0000,'all','abdul','Inactive','2024-10-20 15:03:52','https://objectstorage.ap-mumbai-1.oraclecloud.com/n/softlogicbicloud/b/cdn/o/products/1700632723001--1--1627449504.jpeg'),(6,'025','new product','wfwdfvw','33937','241018','Asanka','Specialty Paints','L','2024-10-20','2024-10-31',150.00,680.00,353.33,530.00,68.00,10.00,136.00,20.00,550.00,50.0000,20.0000,'all','abdul','Inactive','2024-10-20 15:23:16','');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-20 17:33:22
