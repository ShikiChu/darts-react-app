-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: dartapp
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `dart_scores`
--

DROP TABLE IF EXISTS `dart_scores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dart_scores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `playerid` int NOT NULL,
  `total_points` int NOT NULL DEFAULT '0',
  `shots` int NOT NULL DEFAULT '0',
  `games_finished` int DEFAULT NULL,
  `hs` int DEFAULT NULL,
  `h_finish` int DEFAULT NULL,
  `high_scores_171_180` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `playerid` (`playerid`),
  CONSTRAINT `dart_scores_ibfk_1` FOREIGN KEY (`playerid`) REFERENCES `teammates` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dart_scores`
--

LOCK TABLES `dart_scores` WRITE;
/*!40000 ALTER TABLE `dart_scores` DISABLE KEYS */;
/*!40000 ALTER TABLE `dart_scores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dart_scores_night`
--

DROP TABLE IF EXISTS `dart_scores_night`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dart_scores_night` (
  `id` int NOT NULL AUTO_INCREMENT,
  `playerid` int NOT NULL,
  `total_points` int NOT NULL DEFAULT '0',
  `shots` int NOT NULL DEFAULT '0',
  `games_finished` int DEFAULT NULL,
  `hs` int DEFAULT NULL,
  `h_finish` int DEFAULT NULL,
  `high_scores_171_180` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dart_scores_night`
--

LOCK TABLES `dart_scores_night` WRITE;
/*!40000 ALTER TABLE `dart_scores_night` DISABLE KEYS */;
/*!40000 ALTER TABLE `dart_scores_night` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `data`
--

DROP TABLE IF EXISTS `data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `data` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `input` text,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `data_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `data`
--

LOCK TABLES `data` WRITE;
/*!40000 ALTER TABLE `data` DISABLE KEYS */;
/*!40000 ALTER TABLE `data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `team_stats`
--

DROP TABLE IF EXISTS `team_stats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `team_stats` (
  `id` int NOT NULL AUTO_INCREMENT,
  `game_plays` int NOT NULL,
  `wins` int NOT NULL,
  `team_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `team_id` (`team_id`),
  CONSTRAINT `team_stats_ibfk_1` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `team_stats`
--

LOCK TABLES `team_stats` WRITE;
/*!40000 ALTER TABLE `team_stats` DISABLE KEYS */;
/*!40000 ALTER TABLE `team_stats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teammates`
--

DROP TABLE IF EXISTS `teammates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teammates` (
  `id` int NOT NULL AUTO_INCREMENT,
  `team_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `team_id` (`team_id`),
  CONSTRAINT `teammates_ibfk_1` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teammates`
--

LOCK TABLES `teammates` WRITE;
/*!40000 ALTER TABLE `teammates` DISABLE KEYS */;
INSERT INTO `teammates` VALUES (1,2,'James'),(2,2,'Natacha'),(3,2,'Angela'),(4,3,'Marc'),(5,3,'Annick'),(6,3,'Kelby'),(7,4,'Dan'),(8,4,'Marty Rada'),(9,6,'Scott'),(10,5,'JD'),(11,9,'Jean-Marc'),(12,7,'Reyje'),(14,5,'Yvon'),(15,5,'Daryl'),(16,9,'Ken'),(18,10,'Art'),(19,10,'Shawn'),(20,10,'Lynda'),(21,4,'Martin M'),(22,6,'Richard'),(23,6,'Diane'),(25,7,'Hunter'),(26,7,'Alain'),(27,8,'Jay'),(28,8,'Francine'),(29,11,'Etienne'),(30,11,'Altia'),(31,11,'Lise'),(32,13,'Ann'),(33,13,'Marcy'),(34,13,'Mel'),(35,14,'Serge'),(36,14,'Lindsay'),(37,14,'Line'),(38,12,'Kevin'),(39,12,'Michelle'),(40,12,'Cory'),(41,15,'Jeff'),(42,15,'Cindy'),(43,15,'Stephane'),(44,16,'Miguel'),(45,16,'Balinda'),(46,16,'Janet'),(47,9,'Dave'),(48,9,'Tricia'),(49,9,'Frank'),(50,9,'Ray'),(51,9,'Cliff'),(52,9,'Marty D'),(53,9,'Mike'),(54,9,'Jason'),(55,9,'Angela (SP)'),(56,9,'Sue'),(57,9,'Linda'),(58,9,'John'),(59,9,'Jacques');
/*!40000 ALTER TABLE `teammates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teams`
--

DROP TABLE IF EXISTS `teams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teams` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `nickname` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teams`
--

LOCK TABLES `teams` WRITE;
/*!40000 ALTER TABLE `teams` DISABLE KEYS */;
INSERT INTO `teams` VALUES (2,'1','Throwers'),(3,'2','Relatively Shafted'),(4,'3','Darting Martys Plus One'),(5,'4','You don\'t want this!'),(6,'5','Bocky Castards'),(7,'6','P Diddy\'s Diddlers'),(8,'7','The F\'n J\'s'),(9,'Spare',NULL),(10,'8',NULL),(11,'9',NULL),(12,'10',NULL),(13,'11',NULL),(14,'12',NULL),(15,'13',NULL),(16,'14',NULL);
/*!40000 ALTER TABLE `teams` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'darts','$2a$10$20VGzh0XPij8qCV0hyuMqOzd8ntGsiTkBhGVRVaocYi0WVwsJ5c6.'),(2,'ken','$2a$10$ue5e2emojA0UkmWzl3m1/u5T5PfJzPS8v.cdm8JDb6BZ6l6pnOP2K');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-27 21:43:58
