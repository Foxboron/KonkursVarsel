DROP TABLE IF EXISTS `bedrifter`;
CREATE TABLE `bedrifter` (
  `orgnr` varchar(64) NOT NULL,
  `navn` varchar(100) NOT NULL,
  `addresse` varchar(100) DEFAULT NULL,
  `postnummer` varchar(4) DEFAULT NULL,
  `avvikling` varchar(1) DEFAULT NULL,
  `konkurs` varchar(1) DEFAULT NULL,
  `tvangsavvikling` varchar(1) DEFAULT NULL,
  `sektorkode` varchar(45) NOT NULL,
  `nkode1` varchar(20) NOT NULL,
  `tidligerekonk` varchar(1) NOT NULL,
  `sistoppdatert` datetime DEFAULT NULL,
  PRIMARY KEY (`orgnr`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `brukere`;
CREATE TABLE `brukere` (
  `navn` varchar(45) NOT NULL,
  `hash` varchar(45) DEFAULT NULL,
  `id` int(1) NOT NULL,
  `email` varchar(60) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `subs`;
CREATE TABLE `subs` (
  `bruker_id` int(1) NOT NULL,
  `orgnr_id` varchar(64) NOT NULL,
  PRIMARY KEY (`bruker_id`,`orgnr_id`),
  KEY `okey` (`bruker_id`) USING BTREE,
  KEY `orgnr_id` (`orgnr_id`) USING BTREE,
  CONSTRAINT `subs_ibfk_2` FOREIGN KEY (`orgnr_id`) REFERENCES `bedrifter` (`orgnr`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `subs_ibfk_1` FOREIGN KEY (`bruker_id`) REFERENCES `brukere` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT;

DROP TABLE IF EXISTS `test`;
CREATE TABLE `test` (
  `bruker_id` int(1) NOT NULL,
  `orgnr_id` varchar(64) NOT NULL,
  PRIMARY KEY (`bruker_id`,`orgnr_id`),
  KEY `okey` (`bruker_id`),
  KEY `orgnr_id` (`orgnr_id`),
  CONSTRAINT `test_ibfk_1` FOREIGN KEY (`bruker_id`) REFERENCES `brukere` (`id`),
  CONSTRAINT `test_ibfk_2` FOREIGN KEY (`orgnr_id`) REFERENCES `bedrifter` (`orgnr`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
