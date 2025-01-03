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
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `catName` varchar(1000) NOT NULL,
  `user` varchar(255) NOT NULL,
  `store` varchar(255) NOT NULL,
  `saveTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Men\'s Clothing','abdul','all','2024-10-05 21:41:14'),(2,'Women\'s Clothing','abdul','Wariyapola','2024-10-05 21:41:18'),(3,'Footwear','abdul','Wariyapola','2024-10-05 21:41:22'),(4,'Accessories','abdul','all','2024-10-05 21:41:26'),(5,'Tapes new','abdul','Wariyapola','2024-10-05 21:41:30'),(7,'Rollers','abdul','Wariyapola','2024-10-05 21:41:39'),(8,'Brushes','abdul','all','2024-10-05 21:41:44'),(9,'Sandpaper','abdul','Wariyapola','2024-10-05 21:41:50'),(10,'Putty','abdul','all','2024-10-05 21:42:00'),(13,'Formal Shirts','abdul','kurunegala','2024-11-26 00:00:00'),(14,'Casual Shirts','abdul','kurunegala','2024-11-26 00:00:00'),(15,'Trousers','abdul','kurunegala','2024-11-26 00:00:00'),(16,'Jeans','abdul','kurunegala','2024-11-26 00:00:00'),(17,'T-Shirts','abdul','kurunegala','2024-11-26 00:00:00'),(18,'Jackets & Coats','abdul','kurunegala','2024-11-26 00:00:00'),(19,'Ethnic Wear','abdul','kurunegala','2024-11-26 00:00:00'),(20,'Activewear','abdul','kurunegala','2024-11-26 00:00:00'),(21,'Underwear & Socks','abdul','kurunegala','2024-11-26 00:00:00'),(22,'Dresses','abdul','kurunegala','2024-11-26 00:00:00'),(23,'Tops & Blouses','abdul','kurunegala','2024-11-26 00:00:00'),(24,'Kurtis & Tunics','abdul','kurunegala','2024-11-26 00:00:00'),(25,'Skirts','abdul','kurunegala','2024-11-26 00:00:00'),(26,'Jeans & Jeggings','abdul','kurunegala','2024-11-26 00:00:00'),(27,'T-Shirts & Casual Wear','abdul','kurunegala','2024-11-26 00:00:00'),(28,'Nightwear & Lingerie','abdul','kurunegala','2024-11-26 00:00:00'),(29,'Baby Clothing','abdul','kurunegala','2024-11-26 00:00:00'),(30,'T-Shirts & Tops','abdul','kurunegala','2024-11-26 00:00:00'),(31,'School Uniforms','abdul','kurunegala','2024-11-26 00:00:00'),(32,'Party Wear','abdul','kurunegala','2024-11-26 00:00:00'),(33,'Winter Wear','abdul','kurunegala','2024-11-26 00:00:00'),(34,'Summer Essentials','abdul','kurunegala','2024-11-26 00:00:00');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
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
