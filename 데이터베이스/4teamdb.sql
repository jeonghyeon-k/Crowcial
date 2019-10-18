-- MySQL dump 10.14  Distrib 5.5.60-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: 
-- ------------------------------------------------------
-- Server version	5.5.60-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `4team`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `4team` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `4team`;

--
-- Table structure for table `CHATPROJECT`
--

DROP TABLE IF EXISTS `CHATPROJECT`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `CHATPROJECT` (
  `USER_NUM` bigint(20) NOT NULL,
  `PROJECT_NUM` bigint(20) NOT NULL,
  PRIMARY KEY (`USER_NUM`,`PROJECT_NUM`),
  KEY `PROJECT_NUM` (`PROJECT_NUM`),
  CONSTRAINT `CHATPROJECT_ibfk_1` FOREIGN KEY (`USER_NUM`) REFERENCES `USER` (`USER_NUM`),
  CONSTRAINT `CHATPROJECT_ibfk_2` FOREIGN KEY (`PROJECT_NUM`) REFERENCES `PROJECT` (`PROJECT_NUM`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CHATPROJECT`
--

LOCK TABLES `CHATPROJECT` WRITE;
/*!40000 ALTER TABLE `CHATPROJECT` DISABLE KEYS */;
/*!40000 ALTER TABLE `CHATPROJECT` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CHATTING`
--

DROP TABLE IF EXISTS `CHATTING`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `CHATTING` (
  `CHATTING_NUM` bigint(20) NOT NULL,
  `CHATTING_CONTENT` text,
  PRIMARY KEY (`CHATTING_NUM`),
  CONSTRAINT `CHATTING_ibfk_1` FOREIGN KEY (`CHATTING_NUM`) REFERENCES `PROJECT` (`PROJECT_NUM`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CHATTING`
--

LOCK TABLES `CHATTING` WRITE;
/*!40000 ALTER TABLE `CHATTING` DISABLE KEYS */;
/*!40000 ALTER TABLE `CHATTING` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `FUND`
--

DROP TABLE IF EXISTS `FUND`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `FUND` (
  `FUND_NUM` bigint(20) NOT NULL,
  `FUND_NOW` text,
  PRIMARY KEY (`FUND_NUM`),
  CONSTRAINT `FUND_ibfk_1` FOREIGN KEY (`FUND_NUM`) REFERENCES `PROJECT` (`PROJECT_NUM`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `FUND`
--

LOCK TABLES `FUND` WRITE;
/*!40000 ALTER TABLE `FUND` DISABLE KEYS */;
/*!40000 ALTER TABLE `FUND` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `FUNDPROJECT`
--

DROP TABLE IF EXISTS `FUNDPROJECT`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `FUNDPROJECT` (
  `FUND_NUM` int(11) NOT NULL AUTO_INCREMENT,
  `USER_NUM` bigint(20) NOT NULL,
  `PROJECT_NUM` bigint(20) NOT NULL,
  `FUND_DATE` datetime NOT NULL,
  `FUND_MONEY` bigint(20) NOT NULL,
  PRIMARY KEY (`FUND_NUM`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `FUNDPROJECT`
--

LOCK TABLES `FUNDPROJECT` WRITE;
/*!40000 ALTER TABLE `FUNDPROJECT` DISABLE KEYS */;
INSERT INTO `FUNDPROJECT` VALUES (5,3,4,'2019-06-03 02:00:19',100000),(6,3,4,'2019-06-03 02:00:29',1200000),(7,3,11,'2019-06-03 02:02:29',10000000),(8,1,20,'2019-06-03 02:51:47',500000),(9,1,19,'2019-06-03 02:52:04',250000),(10,1,17,'2019-06-03 02:52:18',50000),(11,1,15,'2019-06-03 02:52:34',4000000),(12,1,12,'2019-06-03 02:52:54',3000000),(13,16,16,'2019-06-03 03:18:06',0),(14,14,20,'2019-06-03 03:23:37',5),(15,14,20,'2019-06-03 03:24:45',5000),(16,14,2,'2019-06-03 03:24:51',150000),(17,14,7,'2019-06-03 03:29:51',500000),(18,14,19,'2019-06-03 03:29:57',800000),(19,15,18,'2019-06-03 03:30:28',300000),(20,15,17,'2019-06-03 03:30:41',10000),(21,15,2,'2019-06-03 03:30:59',500000),(22,15,3,'2019-06-03 03:31:05',1000000),(23,5,20,'2019-06-03 03:31:21',100000),(24,5,19,'2019-06-03 03:31:35',500000),(25,5,18,'2019-06-03 03:31:39',340000),(26,5,17,'2019-06-03 03:31:57',1400000),(27,5,16,'2019-06-03 03:32:22',5000000),(28,5,14,'2019-06-03 03:32:33',1345000),(29,5,13,'2019-06-03 03:32:44',200000),(30,5,5,'2019-06-03 03:33:01',10000),(31,5,6,'2019-06-03 03:33:11',40000),(32,5,8,'2019-06-03 03:33:21',150000),(33,5,9,'2019-06-03 03:33:31',40000),(34,5,10,'2019-06-03 03:33:39',20000),(35,5,21,'2019-06-03 03:33:43',153400),(36,5,21,'2019-06-03 03:35:16',153400),(37,5,22,'2019-06-03 03:35:28',10000),(38,14,5,'2019-06-03 03:40:15',100000),(39,14,5,'2019-06-03 03:40:29',2000000),(40,12,22,'2019-06-03 03:41:37',3000000),(41,5,22,'2019-06-03 03:42:43',10000),(42,5,24,'2019-06-03 03:43:57',140000),(43,5,25,'2019-06-03 03:44:13',50000),(44,9,24,'2019-06-03 04:04:26',10000);
/*!40000 ALTER TABLE `FUNDPROJECT` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LIKEPROJECT`
--

DROP TABLE IF EXISTS `LIKEPROJECT`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `LIKEPROJECT` (
  `USER_NUM` bigint(20) NOT NULL,
  `PROJECT_NUM` bigint(20) NOT NULL,
  PRIMARY KEY (`USER_NUM`,`PROJECT_NUM`),
  KEY `PROJECT_NUM` (`PROJECT_NUM`),
  CONSTRAINT `LIKEPROJECT_ibfk_1` FOREIGN KEY (`USER_NUM`) REFERENCES `USER` (`USER_NUM`),
  CONSTRAINT `LIKEPROJECT_ibfk_2` FOREIGN KEY (`PROJECT_NUM`) REFERENCES `PROJECT` (`PROJECT_NUM`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LIKEPROJECT`
--

LOCK TABLES `LIKEPROJECT` WRITE;
/*!40000 ALTER TABLE `LIKEPROJECT` DISABLE KEYS */;
INSERT INTO `LIKEPROJECT` VALUES (1,2),(1,3),(1,4),(1,5),(1,6),(1,11),(2,2),(3,2),(3,4),(3,5),(3,7),(3,9),(3,11),(3,14),(5,2),(5,12),(5,15),(5,16),(5,17),(5,19),(5,20),(5,21),(5,22),(5,23),(5,24),(6,2),(6,3),(6,4),(6,5),(6,7),(6,11),(6,12),(6,15),(6,16),(6,17),(6,18),(6,19),(6,23),(6,24),(9,25),(14,2),(14,3),(14,5),(14,14),(14,17),(14,19),(15,2),(15,20),(16,15),(16,18),(16,19);
/*!40000 ALTER TABLE `LIKEPROJECT` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PROJECT`
--

DROP TABLE IF EXISTS `PROJECT`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `PROJECT` (
  `PROJECT_NUM` bigint(20) NOT NULL AUTO_INCREMENT,
  `PROJECT_SORT` int(11) NOT NULL,
  `PROJECT_NAME` varchar(20) NOT NULL,
  `PROJECT_CONTENT` text NOT NULL,
  `PROJECT_USERNUM` bigint(20) NOT NULL,
  `PROJECT_DATE` date NOT NULL,
  `PROJECT_DUE` date NOT NULL,
  `PROJECT_MONEY` bigint(20) NOT NULL DEFAULT '0',
  `PROJECT_DUEMONEY` bigint(20) NOT NULL,
  `PROJECT_STATE` tinyint(4) NOT NULL DEFAULT '0',
  `PROJECT_SPEND_FILE` varchar(50) NOT NULL,
  `PROJECT_IMAGE` varchar(20) DEFAULT NULL,
  `PROJECT_LIKE` int(11) DEFAULT '0',
  PRIMARY KEY (`PROJECT_NUM`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PROJECT`
--

LOCK TABLES `PROJECT` WRITE;
/*!40000 ALTER TABLE `PROJECT` DISABLE KEYS */;
INSERT INTO `PROJECT` VALUES (1,1,'힘내자!','123456',4,'2019-06-02','2019-06-20',0,1000000,1,'1559485926888','1559485615259',0),(2,6,'사라지는 빙하','지구 온난화 현상으로 인해 빙하가 녹고 있습니다.\r\n그로 인해 해수면 또한 증가하고 있고 북극곰들이 설 자리가 사라지고 있습니다.\r\n이는 우리 인간에게도 결국 좋지 않은 영향을 만들어 낼 것입니다.\r\n여러분들의 도움이 필요합니다.',2,'2019-06-02','2019-06-26',650000,1500000,0,'0','1559486473907',7),(3,1,'백혈병을 겪고있는 우리아이 도와주세요','경찰이 되고 싶어하는 8살의 우리 민호입니다.\r\n치료비가 없어 하루하루 고통속에 살고 있습니다.\r\n여러분들의 도움이 필요합니다.',2,'2019-06-02','2019-12-30',1000000,50000000,0,'0','1559486632777',3),(4,4,'다문화 캠페인','현대의 우리는 지구촌 사회를 살고 있으며 다양한 문화에 대한 이해가 필요합니다.\r\n그에 따른 캠페인을 진행합니다.\r\n\r\n-관리자 확인-\r\n 사용 날짜                                       금액                                     사용사유\r\n2019-06-03                                  105.000원                           필요한 물품 구매 (식재료)\r\n2019-06-04                                  200.400원                           진행하기 위한 장소 마련(학교 체육관 대여)\r\n2019-06-05                                  150.000원                           봉사에 진행되는 다른 사람들 식비 지원(혜자도시락)\r\n2019-06-05                                  125.700원                           필요한 물품 구매 (필기구)\r\n2019-06-06                                  300.000원                           필요한 물품 구매 (의자,책상)\r\n2019-06-07                                  150.900원                           봉사에 진행되는 다른 사람들 식비 지원(혜자도시락)\r\n2019-06-08                                  140.400원                           봉사에 진행되는 다른 사람들 식비 지원(창렬도시락)\r\n2019-06-09                                  170.700원                           진행하기 위한 장소 마련(학교 체육관 대여)\r\n2019-06-10                                  103.150원                           봉사에 진행되는 다른 사람들 식비 지원(혜자도시락)',2,'2019-06-02','2019-06-03',1300000,1200000,1,'1559492304664','1559486773873',3),(5,3,'공부할 권리를 주세요','우리 저소득층 아이들이 생활비가 없어 생계를 이어나가기 어려워하며\r\n공부할 시간과 여건이 마땅치 못합니다.\r\n여러분의 도움이 미래를 이끌어갈 주역을 만들어낼 수 있습니다.',2,'2019-06-02','2019-06-30',2110000,3000000,0,'0','1559486968286',4),(6,6,'동물학대 STOP','단순 유희로 비롯한 동물학대는 그만되어야 합니다.',2,'2019-06-02','2019-07-24',40000,100000,0,'0','1559487086987',1),(7,7,'무관심의 그늘 아래 독거노인','한때 대한민국의 주역이었던 그들이 이제는 사회로부터 소외되어 외로운 인생의 끝을 보내고 있습니다.\r\n여러분의 작은 배려와 관심이 그들에게는 큰 도움이 됩니다.',2,'2019-06-02','2019-08-31',500000,10000000,0,'0','1559487273372',2),(8,7,'어르신 신기술 교육','최근에 스마트폰이 예전의 지도나 라디오, 뉴스등의 소식통을 대신하는 등 새로운 혁신이 있었습니다.\r\n그렇지만 어르신들은 이러한 변화에 적응하기 어려워하며 지식의 알 권리를 보장받지 못합니다.\r\n그렇기에 어르신을 교육해야 합니다. 여러분들의 도움이 있다면 이 프로젝트는 더욱 효과적으로 진행될 것입니다.',2,'2019-06-02','2019-07-31',150000,5000000,0,'0','1559487491183',0),(9,5,'제대로 먹지 못해 굶어 죽어가는 아프','우리는 대한민국에서 최소한 먹을게 없어서 죽지는 않습니다.\r\n그러나 지금 우리가 햄버거를 시켜먹고 치킨과 맥주의 행복한 시간을 보내고 있을 동안에도\r\n아프리카에서는 먹을게 없어서 굶어서 죽어가는 기아가 많은 상황입니다.\r\n여러분들의 관심이 있다면 그들을 살릴 수 있습니다.',2,'2019-06-03','2020-03-31',40000,100000000,0,'0','1559487700274',1),(10,3,'정통고등학교 학생들에게 컴퓨터를 선물','우리 학교는 재정 상황이 좋지 않아서 아이들에게 좋은 교육과 컴퓨터를 통한 실습이 어려운 상황입니다.\r\n여러분의 도움이 있다면 이 아이들이 더 잘 배워서 훌륭한 성인이 될 수 있을 것입니다.',2,'2019-06-03','2019-09-30',20000,30000000,0,'0','1559487858889',0),(11,7,'갈라지고 썩고 물먹고 ... 농민들 ','우리가 손쉽게 마트에서 구매할 수 있는 사과, 배 등의 과일부터 시작해서\r\n쌀, 보리와 같은 곡물까지 누군가는 열심히 땀흘려 일하지만 높은 위험부담과 낮은 이익으로\r\n노동을 한다는 것을 알고 계십니까?\r\n올해에는 흉년으로 인해 많은 농민들이 고통받아 살기 어려운 실정입니다.\r\n여러분의 도움이 있다면 우리가 더 품질 좋은 과일과 작물을 먹을 수 있을 것입니다.',2,'2019-06-03','2019-08-31',10000000,55555555,0,'0','1559488017048',3),(12,3,'청소년은 미래의 주역','청소년은 미래의 주역입니다\n질풍노도의 시기이며 성인들의 따뜻한 배려와 가끔은 따끔한 충고로 올바르게 성장할 수 있도록 도와줘야합니다.\n여러분의 관심이 있다면 청소년들의 입시와 여러 고민들을 상담해주는 캠페인을 진행할 수 있습니다.',3,'2019-06-03','2019-07-31',3000000,7777777,0,'0','1559491443250',2),(13,7,'인디 애니메이션 지원','안녕하세요.\n저희는 곰을 주제로 한 애니메이션을 만들고 있는 인디 팀입니다.\n저희가 예산을 조금만 더 확보할 수 있다면 더 의미있는 작품을 원활하게 만들 수 있을것 같습니다. 도와주시면 감사합니다.',3,'2019-06-03','2019-07-17',200000,10000000,0,'0','1559495342636',0),(14,7,'작곡 그리고 나','저는 많은 사람의 심금을 울리는 훌륭한 작곡가가 되고 싶은 작은 한 사람입니다. 현재는 생활고에 시달리며 어려운 상황이지만 조금만 도와주신다면 세상에 좋은 음악을 널리 알리겠습니다.',3,'2019-06-03','2019-06-20',1345000,750000,0,'0','1559495491738',2),(15,7,'화재 복구 캠페인','최근 있던 전국적인 산불로 복구에 시급한 상황입니다. 인력과 물적 자원을 확보할 수 있게 도와주십시오.',3,'2019-06-03','2019-08-10',4000000,25000000,0,'0','1559495610025',3),(16,1,'우리 아이 이야기','안녕하세요\n저희 아이는 태어날때부터 불치병을 안고 태어나 어려운 상황에 처해있습니다. 여러분들이 따뜻한 한마디와 관심으로 도움을 줄 수 있습니다. 감사합니다',3,'2019-06-03','2019-06-03',5000000,1000000,0,'0','1559495728620',2),(17,2,'모든 어린이가 행복한 세상','아이들은 가정폭력과 불화로부터 보호받으며 화목하면서도 행복하게 보내야 할 권리가 있습니다. 가정적으로 어려운 아이들을 보살펴주는 캠페인입니다.\n이 캠페인은 유엔 아동 권리 협약과 함께합니다.',3,'2019-06-03','2019-06-03',1460000,300000,0,'0','1559496022189',3),(18,2,'초등생 한마음 달리기','가자! 모두 한 마음으로!\n삭박한 세상에 아이들에게 희망이 되어줄 체육대회!\n여러분의 지원으로 아이들이 더욱 즐거운 행사를 보낼 수 있습니다.',3,'2019-06-03','2019-06-30',640000,500000,0,'0','1559496220236',3),(19,5,'식목일 나무심기','자연의 파괴를 막고 나무를 심어서 회복합시다. 후원 비용은 캠페인의 주최비용에 사용됩니다.',3,'2019-06-03','2019-06-03',1550000,400000,1,'0','1559496856460',4),(20,6,'한국의 멸종 위기종...','한국의 멸종 위기종 수리 부엉이를 아시나요?\r\n우리나라의 전통과 역사를 이어온 생물이지만 이제는 멸종위기에 처해있다고 합니다.\r\n여러분들의 도움으로 이 동물의 멸종을 막을 수 있습니다.',3,'2019-06-03','2019-06-27',605005,1000000,0,'0','1559497160943',2),(21,2,'모두모두 힘을 모아','우리 힘을 모아 주변 어려운 사회를 도와요~\r\n저와 동참 해주실 분은 좋아요 및 후원을 해주세요\r\n감사합니다',9,'2019-06-03','2019-06-19',306800,100000,0,'0','1559500353088',1),(22,7,'노는게 제일 좋아','《뽀롱뽀롱 뽀로로》는 아이코닉스가 기획하고 오콘, SK브로드밴드, 스튜디오 게일, 삼천리총회사, EBS가 제작한 풀 애니메이션이다. 높은 시청률을 기록했으며 \'뽀통령\'이라는 말이 생겨날 정도로 많은 아이들에게 사랑을 받고 있다.',9,'2019-06-03','2019-06-28',3020000,100000000,0,'0','1559500441091',1),(23,1,'크롱! 크롱!','로로와 같이 사는 아기 공룡. 1화 시작때 뽀로로 혼자 눈사람을 만들고 놀다가 눈사람의 머리를 잘못 올려 같이 굴러내려가다가 그대로 나무에 부딪혔는데, 그때 눈밭에 파묻혀 있던 알에서 발견했다. 처음 알을 발견한 뽀로로는 요리하려고 했지만 그 알에서 크롱이 태어났고, 뽀로로는 괴물인 줄 알고 도망간다. \r\n대표 색상은 녹색\r\n\r\n그냥 애다. 애답게 욕심도 많고 사리분별을 못해서 자주 싸움이 벌어지곤 한다. 생각해보면 한 살짜리니까 당연할지도. 특히 뽀로로와는 같이 살다보니 왕창 싸운다. 그래도 뽀로로와는 가장 친하게 지낸다. 괜히 뽀로로와 같이 사는 것이 아니다.',11,'2019-06-03','2019-06-27',0,200000000,0,'0','1559500642674',3),(24,7,'마이크로스포트, CROWCIAL와 합','마이크로소프트 코퍼레이션는 미국의 세계 최대의 다국적 소프트웨어 및 하드웨어 기업이다. \r\nCrowcial 기업은 세계적으로 가장 각광 받고 있는 기업으로 지난 해 애플을 제쳤다',19,'2019-06-03','2019-08-22',150000,705000400000,0,'0','1559500892453',2),(25,1,'아 꿀 빨고 싶다','아 꿀 빨고 싶다!!!',15,'2019-06-03','2019-06-03',50000,1000000,0,'0','1559501048965',2);
/*!40000 ALTER TABLE `PROJECT` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `REGISTERPROJECT`
--

DROP TABLE IF EXISTS `REGISTERPROJECT`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `REGISTERPROJECT` (
  `USER_NUM` bigint(20) NOT NULL,
  `PROJECT_NUM` bigint(20) NOT NULL,
  PRIMARY KEY (`USER_NUM`,`PROJECT_NUM`),
  KEY `PROJ_FRN` (`PROJECT_NUM`),
  CONSTRAINT `REGISTERPROJECT_ibfk_1` FOREIGN KEY (`USER_NUM`) REFERENCES `USER` (`USER_NUM`),
  CONSTRAINT `REGISTERPROJECT_ibfk_2` FOREIGN KEY (`PROJECT_NUM`) REFERENCES `PROJECT` (`PROJECT_NUM`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `REGISTERPROJECT`
--

LOCK TABLES `REGISTERPROJECT` WRITE;
/*!40000 ALTER TABLE `REGISTERPROJECT` DISABLE KEYS */;
/*!40000 ALTER TABLE `REGISTERPROJECT` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SESSION`
--

DROP TABLE IF EXISTS `SESSION`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `SESSION` (
  `SESSION_ID` varchar(100) NOT NULL,
  `LOGIN_ID` varchar(20) DEFAULT NULL,
  `REG_CERTCODE` varchar(6) DEFAULT NULL,
  `REG_CERTIFIED` tinyint(1) DEFAULT NULL,
  `REG_MAILLEFT` varchar(64) DEFAULT NULL,
  `REG_MAILRIGHT` varchar(255) DEFAULT NULL,
  `SEARCH_CERTCODE` varchar(6) DEFAULT NULL,
  `SEARCH_CERTIFIED` tinyint(1) DEFAULT NULL,
  `SEARCH_USERID` varchar(20) DEFAULT NULL,
  `SEARCH_MAILLEFT` varchar(64) DEFAULT NULL,
  `SEARCH_MAILRIGHT` varchar(255) DEFAULT NULL,
  `USER_NUM` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`SESSION_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SESSION`
--

LOCK TABLES `SESSION` WRITE;
/*!40000 ALTER TABLE `SESSION` DISABLE KEYS */;
INSERT INTO `SESSION` VALUES ('1KzyHkA3WvSMMjMfIavQSZrWbEfKvKNr','kdhong',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1),('2VvyTB01v4NWQKFAvcetixzhuRWxJfdE','kdhong',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1),('5E65X_nVBLKcFUm3Ky_YeHhce0-W13TE','icebear',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,7),('bJqw3H1edwfxrXeNKlZykW3XqK6Qx6Om','grizz',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3),('Br25uBEBtx_TcOjGYRIuSaghHNdB065k','kdhong',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1),('dS9-wgI6Nie-RHS7Ns6v95ebjOHrPeAT','sangdi',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,14),('FQuaZ3_XR0y1X5o1996D5bl0hbKUsqfz','aodem',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,6),('FxZBa5BtnIRf0kdrgsEgd1r4z3-m6CgA','sangdi',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,14),('H7LTefHAftOxHchhjAGQZh5U7uLxx2Lw','sangdi',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,14),('HN1bpTWrGUCOQFnFdPYxDZPK4wyKVCNS','kdhong',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1),('JpcPLJk_18PUveoaHjSbdio6sJ74NwWT','grizz',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3),('juTBegdFVhG0OPhQM161GGyGZEVtGFSD','grizz',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3),('jwgBNXeGSAQ-oa2yME-7UG6V9dZXUkOY','icebear',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,7),('KfdUkdQLU92s7scN0CpBEA8lzgzwk-1A','aodem',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,6),('kNXzntppg3KxNieOcg6CaL7ojbK5mdp4','icebear',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,7),('kvMy6Uv1c6d7G3OCRpOqzROwDky9sRvl','grizz',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3),('L8R-Zu5OumYqry09KhEX2VsvT2C8I75j','aodem',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,6),('LiD2inqvxABk8GJZkG3at7VXP5wM0CaB','icebear',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,7),('M4OHxx0udol35oSLhnYl2x5o7D1rVUnL','grizz',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3),('m6WhPn_YSWQtBTSwfsMxhLBCEbjJhEr7','grizz',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3),('nIyQR1QIOL_QLAHUmmWvI87TQGje3iGx','kdhong',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1),('nN7uo6t3sFK0anAzUr8ELnnP26NeSMJF','kdhong',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1),('NQCLN7BPICGQKXJRYLu1Ra06t3ZbRp7k','grizz',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3),('OA8IP9FNUq9G-sIhvcl1BKnvMT_3fBnO','kdhong',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1),('OwFI5EE9FsjLI3ZR01n2vijmbLBMhjVY','grizz',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3),('pY8r_Tgqx3-N_QirAxYGqzNN9FvISLsV','aodem',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,6),('qGN5rifU3zHh56tKYkw3PFq7FLaBHfdL','zoro',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,12),('RPZX7dd9so7HY0gTWbFS-W8oMQmcXxAZ','grizz',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3),('SW-qWkbM71qETU03jdO-534izDxUoxGd','grizz',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3),('Ve15gPeR5JHc9vi83cOdoS20iCxkZ0fh','kdhong',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1),('WDhSkbAdy8ajB4E1RdqKSVO1LW0I60DE','grizz',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3),('wmWwx-NCNOIH1nEoRawka_BZ4WkMw4Ux','grizz',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3),('WZTZvr9FDwbhYFwiZ1lXP7bfEWze_EyY','panda',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10),('X-DCtF82fvS1XJ03jgG5lyKmHm4dbwop','icebear',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,7),('YbjRHGYHCz9v-n_uyMwO_iv6KXSanM4Z','grizz',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3),('YelXCzV0ovyq0ldNoy46I_QCd799cAMs','aodem',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,6),('ZQ9Spx3ThRnMYSOij5TEvkB94G1hsoDi','grizz',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3),('_x5UmwDafdTt7YBZ4zwzaWpnZyOfGThN','grizz',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3);
/*!40000 ALTER TABLE `SESSION` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `USER`
--

DROP TABLE IF EXISTS `USER`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `USER` (
  `USER_NUM` bigint(20) NOT NULL AUTO_INCREMENT,
  `USER_NAME` varchar(20) NOT NULL,
  `USER_ID` varchar(20) NOT NULL,
  `USER_PASS` varchar(50) NOT NULL,
  `USER_MAIL_NAME` varchar(64) NOT NULL,
  `USER_MAIL_DOMAIN` varchar(255) NOT NULL,
  `USER_BANK` varchar(20) NOT NULL,
  `USER_ACCOUNT` varchar(20) NOT NULL,
  `USER_IMAGE` varchar(20) NOT NULL,
  `USER_EXIT` tinyint(1) NOT NULL DEFAULT '0',
  `USER_STOP` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`USER_NUM`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `USER`
--

LOCK TABLES `USER` WRITE;
/*!40000 ALTER TABLE `USER` DISABLE KEYS */;
INSERT INTO `USER` VALUES (1,'홍길동','kdhong','LPqgqYP3Juq3is2DIArG9g==','kdhong','naver.com','우리은행','123-412313-414131','1559485059348',0,0),(2,'김영희','yhkim','LPqgqYP3Juq3is2DIArG9g==','yhkim','navercom','우리은행','123-4141413-869503','1559485198868',0,0),(3,'그리즐리','grizz','LPqgqYP3Juq3is2DIArG9g==','grizz','navercom','국민','204-202123-434929','1559485249715',0,0),(5,'손기정','dydwn','LPqgqYP3Juq3is2DIArG9g==','yongjuseong','gmail.com','국민','123','1559496037815',0,0),(6,'이상훈','aodem','KFRUvyK/ey+yRLEOqp9srQ==','aodem','naver.com','국민','204202-04-384939','1559497599617',0,0),(7,'아이스베어','icebear','LPqgqYP3Juq3is2DIArG9g==','icebear','navercom','국민','202213-483948-32','1559498691491',0,0),(8,'현유준','vkn1234','b2Cn5ba0KEnVClK6bTgvyA==','vkn1234','naver.com','기업','1234567890','1559498808142',0,0),(9,'뽀로로','bbororo','LPqgqYP3Juq3is2DIArG9g==','bbo','naver.com','국민은행','123-1234-123','1559498910957',0,0),(10,'판다','panda','LPqgqYP3Juq3is2DIArG9g==','panda','navercom','우리','12345678','1559498968129',0,0),(11,'크롱','crong','LPqgqYP3Juq3is2DIArG9g==','crong','naver.com','신협','123-123-123','1559499063619',0,0),(12,'조로','zoro','LPqgqYP3Juq3is2DIArG9g==','zoro','navercom','우리','123-45678-901','1559499078005',0,0),(13,'현유준2','vkn123420','b2Cn5ba0KEnVClK6bTgvyA==','vkn123420','gmail.com','기업','0987654','1559499161769',0,0),(14,'상디','sangdi','LPqgqYP3Juq3is2DIArG9g==','sangdi','navercom','국민','204202-27-383474','1559499186060',0,0),(15,'곰돌이푸','poo','LPqgqYP3Juq3is2DIArG9g==','poo','naver.com','국민','123-123-123','1559499202847',0,0),(16,'김태균','vkn12345','b2Cn5ba0KEnVClK6bTgvyA==','vkn12345','nate.com','전북','39393280','1559499245047',0,0),(17,'루피','roopi','LPqgqYP3Juq3is2DIArG9g==','roopi','navercom','국민','282474-93-173946','1559499268337',0,0),(18,'송경진','vkn123456','b2Cn5ba0KEnVClK6bTgvyA==','vkn1234567','daum.net','경남','098765218398','1559499307946',0,0),(19,'빌게이츠','billgates','LPqgqYP3Juq3is2DIArG9g==','billgates','naver.com','은행','123-123-123','1559499353524',0,0),(20,'김용수','vkn0987654','b2Cn5ba0KEnVClK6bTgvyA==','vkn12345678','gachon.ac.kr','강원','98232823','1559499412335',0,0),(21,'주커버그','jooker','KlI9lhjQ0l1Vu7V3UyTRtg==','jooker','naver.com','국민','203919-28-483920','1559499724371',0,0);
/*!40000 ALTER TABLE `USER` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `USERMONEY`
--

DROP TABLE IF EXISTS `USERMONEY`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `USERMONEY` (
  `USER_NUM` bigint(20) NOT NULL,
  `USER_NOW` bigint(20) NOT NULL DEFAULT '0',
  `USER_TOTAL` bigint(20) NOT NULL DEFAULT '0',
  `USER_PSEND` bigint(20) NOT NULL DEFAULT '0',
  PRIMARY KEY (`USER_NUM`),
  CONSTRAINT `FK_USER_NUM` FOREIGN KEY (`USER_NUM`) REFERENCES `USER` (`USER_NUM`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `USERMONEY`
--

LOCK TABLES `USERMONEY` WRITE;
/*!40000 ALTER TABLE `USERMONEY` DISABLE KEYS */;
INSERT INTO `USERMONEY` VALUES (1,2200000,0,8792223),(2,5000000,0,0),(3,38700000,0,11300000),(4,0,0,0),(5,338200,0,9661800),(6,10000000,0,0),(7,10000000,0,0),(8,10000000,0,0),(9,9990000,0,10000),(10,10000000,0,0),(11,10000000,0,0),(12,7000000,0,3000000),(13,10000000,0,0),(14,6444995,0,3555005),(15,8190000,0,1810000),(16,10000000,0,0),(17,10000000,0,0),(18,10000000,0,0),(19,10000000,0,0),(20,10000000,0,0),(21,0,0,0);
/*!40000 ALTER TABLE `USERMONEY` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-06-03  4:08:30
