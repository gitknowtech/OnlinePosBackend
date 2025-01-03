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
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cusId` varchar(100) NOT NULL,
  `cusName` varchar(255) NOT NULL,
  `address1` varchar(255) DEFAULT NULL,
  `address2` varchar(255) DEFAULT NULL,
  `mobile1` varchar(15) NOT NULL,
  `mobile2` varchar(15) DEFAULT NULL,
  `idNumber` varchar(100) DEFAULT NULL,
  `creditLimit` decimal(10,2) DEFAULT NULL,
  `user` varchar(255) DEFAULT NULL,
  `store` varchar(255) DEFAULT NULL,
  `status` varchar(10) DEFAULT 'active',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cusId` (`cusId`),
  UNIQUE KEY `mobile1` (`mobile1`),
  UNIQUE KEY `mobile2` (`mobile2`),
  UNIQUE KEY `idNumber` (`idNumber`)
) ENGINE=InnoDB AUTO_INCREMENT=102 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (1,'001','Marcus Stewart','Cherylmouth','Munoz Burgs','1301068271','0758475869','25258514651',10000.00,'abdul','all','active','2024-06-09 05:17:24'),(3,'003','Daniel Cruz','West Jomouth','Taylor Bridge','2288604114','8475869478','462-98-0782',15000.00,'abdul','all','active','2024-06-25 17:59:13'),(4,'004','John Randall','Brittneymouth','Simpson Grove','1452619047','8477506721','147-89-0833',NULL,'abdul','all','active','2024-02-03 00:43:44'),(5,'005','Julie Thompson','Huntmouth','Moore Coves','7468703403','8219653468','514-30-2934',NULL,'abdul','all','active','2024-07-15 01:24:35'),(7,'007','Emily Rodriguez','Garciatown','Martinez Mountains','4808322857','3357553244','535-54-6590',NULL,'abdul','all','active','2024-07-25 20:03:40'),(16,'016','Raymond Smith','Jesusland','Ward Prairie','3822827379','0135828449','655-78-3520',NULL,'abdul','all','active','2024-07-07 13:52:50'),(18,'018','Miranda Navarro','South Jeremy','Sophia Island','5159166004','1358110174','064-11-5397',NULL,'abdul','all','active','2024-05-19 01:16:46'),(19,'019','Tanya Hurley','Lake Diane','Allen Mall','4149263659','0098532098','603-72-5704',NULL,'abdul','all','active','2024-05-19 10:36:54'),(23,'023','Andrew Bowman','Scottmouth','Mccall Grove','3935821073','3753306819','689-19-0531',NULL,'abdul','all','active','2024-02-09 18:19:04'),(29,'029','Joshua Wilson','West Jessicashire','Ryan Pike','6154759187','0487086695','532-89-8220',NULL,'abdul','all','active','2024-06-27 02:01:09'),(31,'031','Troy Jackson','Jasonmouth','Allison Throughway','2833857728','3654233512','307-48-7756',NULL,'abdul','all','active','2024-02-19 21:43:49'),(32,'032','Ariel Hamilton','Morrisonburgh','Carpenter Extensions','7065822752','7186189978','639-73-3073',NULL,'abdul','all','active','2024-05-18 18:57:53'),(33,'033','Casey King','North Timothy','Tiffany Ferry','9621403337','1378643232','720-36-1956',NULL,'abdul','all','active','2024-04-28 12:32:45'),(34,'034','James Moore','South Paul','Ellison Via','0719931133','9179208516','160-28-5920',NULL,'abdul','all','active','2024-07-23 21:25:34'),(35,'035','Carl Kelly','East Amanda','Farley Groves','1278220059','4401566352','327-50-4070',NULL,'abdul','all','active','2024-07-07 05:14:30'),(45,'045','Christine Grant','Davidmouth','Leblanc Village','2618517429','7039994260','036-41-0386',NULL,'abdul','all','active','2024-08-19 11:05:15'),(48,'048','Amanda Rogers','East Dianaville','Mitchell Plaza','2830659116','8401595430','854-95-0555',NULL,'abdul','all','active','2024-09-21 03:42:05'),(52,'052','Mrs. Paige Butler','East Nicolehaven','Lewis Divide','8347540419','9694378415','803-42-5462',NULL,'abdul','all','active','2024-09-23 14:24:40'),(53,'053','Andrew Waller','West Joseph','Carla Knolls','5252098654','9200382728','647-73-2949',NULL,'abdul','all','active','2024-05-01 04:49:15'),(55,'055','Gary York','South Leslieton','Thomas Ways','4234986917','4907775277','245-09-5886',NULL,'abdul','all','active','2024-10-02 04:18:24'),(56,'056','Kevin Dean','South John','Gina Ridge','9699469388','7758367215','467-65-3310',NULL,'abdul','all','active','2024-05-22 20:40:33'),(59,'059','David Robinson','Younghaven','Garcia Trafficway','6902516552','9697251789','237-10-9311',NULL,'abdul','all','active','2024-06-21 02:13:02'),(65,'065','Leslie Brown PhD','New Priscilla','Page Flat','8566028345','8750050784','588-33-3555',NULL,'abdul','all','active','2024-01-11 10:12:43'),(67,'067','Alicia Beasley','Aprilfort','Thompson Coves','6116612489','2980705113','342-45-1291',NULL,'abdul','all','active','2024-04-22 18:53:56'),(68,'068','Carlos Smith','North Rachelfurt','Ryan Glens','0534306674','2895352865','354-27-7722',NULL,'abdul','all','active','2024-10-31 14:11:33'),(69,'069','Michael Page','Lake Kim','Ashley Coves','1199348976','9305402486','809-47-6567',NULL,'abdul','all','active','2024-08-22 13:57:33'),(72,'072','Kendra Morgan','Jamesstad','Flores Extension','7678590335','2082852950','280-34-6745',NULL,'abdul','all','active','2024-04-30 18:26:33'),(77,'077','Melissa Perkins','Leeside','Mullins Stravenue','4713991349','1489261384','172-26-2384',NULL,'abdul','all','active','2024-01-02 22:38:44'),(78,'078','Mitchell Dickson','Port Taraview','Chris Stream','5422001409','4729596044','613-15-7675',NULL,'abdul','all','active','2024-07-08 06:02:08'),(79,'079','Rachel Powell','North Andrewmouth','Norman Throughway','2782386167','0473869994','518-45-5850',NULL,'abdul','all','active','2024-05-06 06:40:41'),(83,'083','Kelly Graham','Johnsland','Nicole Trail','6577109477','1489964878','767-69-1555',NULL,'abdul','all','active','2024-08-14 06:37:02'),(85,'085','Judy Reeves','West Susan','Crawford Cliff','4698214365','0716670031','853-96-5703',NULL,'abdul','all','active','2024-03-15 06:41:40'),(88,'088','Donna Kelley','Herreramouth','Patrick Corner','9459640203','3574486620','670-42-8988',NULL,'abdul','all','active','2024-02-03 06:23:38'),(91,'091','Jessica Hernandez','Wardview','Andrea Crescent','3689031386','2606778968','048-34-7583',NULL,'abdul','all','active','2024-10-17 14:53:28'),(94,'094','Thomas Miller','New Karenbury','Janet Manor','3854826799','0359017442','021-52-2760',NULL,'abdul','all','active','2024-04-14 03:50:39'),(95,'095','Kelly Alvarado','Wesleyshire','Lowe Lodge','9162249056','7986061935','808-09-8765',NULL,'abdul','all','active','2024-03-07 06:28:19'),(99,'200','nerw check','kurunegala','','0741587485',NULL,'654165456',NULL,'abdul','all','active','2024-11-04 14:45:58'),(101,'0251','Abdul Rahman','Rathmale','laksiriyuana','0743347776','0743347776','165165151',25000.00,'abdul','kurunegala','active','2024-11-16 12:39:21');
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
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
