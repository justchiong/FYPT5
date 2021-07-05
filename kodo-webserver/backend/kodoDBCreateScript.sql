-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema kododb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema kododb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `kododb` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `kododb` ;

-- -----------------------------------------------------
-- Table `kododb`.`requests`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kododb`.`requests` (
  `uuid` VARCHAR(36) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `original_filename` MEDIUMTEXT NOT NULL,
  `options_chosen` TINYTEXT NOT NULL,
  PRIMARY KEY (`uuid`),
  UNIQUE INDEX `uuid_UNIQUE` (`uuid` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `kododb`.`results`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kododb`.`results` (
  `result_id` INT NOT NULL AUTO_INCREMENT,
  `request_uuid` VARCHAR(45) NOT NULL,
  `selected_option` VARCHAR(45) NOT NULL,
  `cwe` VARCHAR(45) NOT NULL,
  `type` VARCHAR(100) NOT NULL,
  `description` MEDIUMTEXT NOT NULL,
  `severity` VARCHAR(45) NOT NULL,
  `highlighted_code` VARCHAR(45) NOT NULL,
  `referenced_code` VARCHAR(45) NOT NULL,
  `code_snippet` MEDIUMTEXT NOT NULL,
  `fileLocation` VARCHAR(45) NOT NULL,
  `lineNumbers` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`result_id`),
  UNIQUE INDEX `result_id_UNIQUE` (`result_id` ASC) VISIBLE,
  INDEX `uuid_idx` (`request_uuid` ASC) VISIBLE,
  CONSTRAINT `uuid`
    FOREIGN KEY (`request_uuid`)
    REFERENCES `kododb`.`requests` (`uuid`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 1
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
