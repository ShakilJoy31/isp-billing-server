-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jan 16, 2026 at 08:47 PM
-- Server version: 8.4.6
-- PHP Version: 8.4.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `billispc_isp-database`
--

-- --------------------------------------------------------

--
-- Table structure for table `authority-informations`
--

CREATE TABLE `authority-informations` (
  `id` int NOT NULL,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `age` int NOT NULL,
  `bloodGroup` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '',
  `dateOfBirth` datetime NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `photo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `fatherOrSpouseName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `fullName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `jobCategory` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '',
  `jobType` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `maritalStatus` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `mobileNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `nidOrPassportNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `religion` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '',
  `role` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `sex` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `userId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `status` enum('active','inactive','pending') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'pending',
  `baseSalary` decimal(10,2) DEFAULT '0.00',
  `joinedThroughName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `joinedThroughMobileNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `joinedThroughRelation` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `joinedThroughAddress` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '',
  `emergencyContactName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `emergencyContactMobileNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `emergencyContactRelation` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `emergencyContactAddress` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '',
  `nidPhotoFrontSide` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `nidPhotoBackSide` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `authority-informations`
--

INSERT INTO `authority-informations` (`id`, `address`, `age`, `bloodGroup`, `dateOfBirth`, `email`, `photo`, `fatherOrSpouseName`, `fullName`, `jobCategory`, `jobType`, `maritalStatus`, `mobileNo`, `nidOrPassportNo`, `religion`, `role`, `sex`, `userId`, `password`, `status`, `baseSalary`, `joinedThroughName`, `joinedThroughMobileNo`, `joinedThroughRelation`, `joinedThroughAddress`, `emergencyContactName`, `emergencyContactMobileNo`, `emergencyContactRelation`, `emergencyContactAddress`, `nidPhotoFrontSide`, `nidPhotoBackSide`, `createdAt`, `updatedAt`) VALUES
(1, '3/2, Wapda Road, Savar, Dhaka - 1340', 38, 'B+', '1987-09-12 00:00:00', 'shamim.rony@yandex.com', 'https://server.billisp.com/uploads/2e950cf49989fe6b.jpg', 'Tafazzal Hossain', 'Shamim Rony', 'Manager', 'Full Time', 'Unmarried', '01684175551', '00', 'Islam', 'manager', 'Male', 'shamim9489@ringtel', '01684175551', 'active', 5000.00, 'Mahabub Robi', '01689203297', 'Brother', '3/2, Wapda Road, Savar, Dhaka - 1340', 'Mahabub Robi', '01689203297', 'Brother', '3/2, Wapda Road, Savar, Dhaka - 1340', '', '', '2026-01-10 18:31:38', '2026-01-10 18:31:38');

-- --------------------------------------------------------

--
-- Table structure for table `bank_accounts`
--

CREATE TABLE `bank_accounts` (
  `id` int NOT NULL,
  `bankName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `accountHolderName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `accountName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `accountNumber` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `accountType` enum('Bank','MobileBanking','AgentBanking','DigitalWallet','Other') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Bank',
  `branchId` int DEFAULT NULL,
  `branchName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `routingNumber` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `swiftCode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `iban` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `openingBalance` decimal(15,2) NOT NULL DEFAULT '0.00',
  `currentBalance` decimal(15,2) NOT NULL DEFAULT '0.00',
  `currency` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'BDT',
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `isPrimary` tinyint(1) NOT NULL DEFAULT '0',
  `lastTransactionDate` datetime DEFAULT NULL,
  `transactionLimit` decimal(15,2) DEFAULT NULL,
  `dailyLimit` decimal(15,2) DEFAULT NULL,
  `monthlyLimit` decimal(15,2) DEFAULT NULL,
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `createdBy` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'admin',
  `updatedBy` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bank_accounts`
--

INSERT INTO `bank_accounts` (`id`, `bankName`, `accountHolderName`, `accountName`, `accountNumber`, `accountType`, `branchId`, `branchName`, `routingNumber`, `swiftCode`, `iban`, `openingBalance`, `currentBalance`, `currency`, `isActive`, `isPrimary`, `lastTransactionDate`, `transactionLimit`, `dailyLimit`, `monthlyLimit`, `notes`, `createdBy`, `updatedBy`, `createdAt`, `updatedAt`) VALUES
(1, 'Bkash', 'SRS Technology', 'bKash Merchant', '01684175551', 'MobileBanking', NULL, '', '', '', '', 1.00, 1.00, 'BDT', 1, 0, NULL, NULL, NULL, NULL, '', 'admin', NULL, '2026-01-12 19:52:32', '2026-01-12 19:52:32'),
(2, 'Dhaka Bank', 'Md Shamim Hossan Rony', 'Ring Tel', '2221500000831', 'Bank', NULL, 'Savar Bazar Bus Stand Branch', '010264094', '', '', 10.00, 10.00, 'BDT', 1, 0, NULL, NULL, NULL, NULL, '', 'admin', NULL, '2026-01-16 05:11:11', '2026-01-16 05:11:11');

-- --------------------------------------------------------

--
-- Table structure for table `benefits`
--

CREATE TABLE `benefits` (
  `id` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `type` enum('Internet Package','Bundle Offer','Promotional Offer','Loyalty Benefit','Seasonal Offer','Corporate Package','Custom Package') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `category` enum('Residential','Business','Student','Senior Citizen','Low Income','General') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'General',
  `basePrice` decimal(10,2) NOT NULL,
  `discountPrice` decimal(10,2) DEFAULT NULL,
  `billingCycle` enum('Monthly','Quarterly','Yearly','One-time') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Monthly',
  `internetSpeed` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `dataLimit` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `uploadSpeed` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `downloadSpeed` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `includesTv` tinyint(1) NOT NULL DEFAULT '0',
  `includesPhone` tinyint(1) NOT NULL DEFAULT '0',
  `includesWifi` tinyint(1) NOT NULL DEFAULT '1',
  `tvChannels` int DEFAULT NULL,
  `phoneMinutes` int DEFAULT NULL,
  `contractLength` int DEFAULT NULL,
  `installationFee` decimal(10,2) DEFAULT NULL,
  `equipmentFee` decimal(10,2) DEFAULT NULL,
  `startDate` datetime NOT NULL,
  `endDate` datetime DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `isFeatured` tinyint(1) NOT NULL DEFAULT '0',
  `minContractLength` int DEFAULT NULL,
  `eligibilityCriteria` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `features` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `termsConditions` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `createdBy` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'admin',
  `updatedBy` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `chatmessages`
--

CREATE TABLE `chatmessages` (
  `id` int NOT NULL,
  `messageId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `chatId` int NOT NULL,
  `senderId` int NOT NULL,
  `senderType` enum('User','Support','System') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'User',
  `messageType` enum('Text','Image','File','Location','System') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Text',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci COMMENT 'Text content or caption for media messages',
  `attachments` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin COMMENT 'Array of file attachments with metadata',
  `readBy` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin COMMENT 'Array of user IDs who read the message',
  `deliveredTo` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin COMMENT 'Array of user IDs who received the message',
  `status` enum('Sent','Delivered','Read','Failed') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Sent',
  `replyTo` int DEFAULT NULL COMMENT 'Reference to replied message ID',
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `isEdited` tinyint(1) DEFAULT '0',
  `editedAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `deletedBy` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `chatparticipants`
--

CREATE TABLE `chatparticipants` (
  `id` int NOT NULL,
  `chatId` int NOT NULL,
  `userId` int NOT NULL,
  `userType` enum('User','Support','Admin') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'User',
  `role` enum('Member','Admin','Creator') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Member',
  `joinedAt` datetime DEFAULT NULL,
  `lastSeenAt` datetime DEFAULT NULL,
  `isMuted` tinyint(1) DEFAULT '0',
  `isArchived` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `chats`
--

CREATE TABLE `chats` (
  `id` int NOT NULL,
  `chatId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Chat title for group chats or custom naming',
  `chatType` enum('User-Support','User-User','Group','Broadcast') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'User-Support',
  `status` enum('Active','Resolved','Closed','Archived') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Active',
  `priority` enum('Low','Normal','High','Urgent') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Normal',
  `category` enum('Billing','Technical','Connection','Package','Speed','General','Complaint','Feedback') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'General',
  `lastMessageAt` datetime DEFAULT NULL,
  `createdBy` int NOT NULL COMMENT 'User ID who created the chat',
  `assignedTo` int DEFAULT NULL COMMENT 'Support agent/Admin assigned to handle',
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin COMMENT 'Additional chat metadata',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cities`
--

CREATE TABLE `cities` (
  `id` int NOT NULL,
  `cityName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `cityDetails` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Active',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cities`
--

INSERT INTO `cities` (`id`, `cityName`, `cityDetails`, `status`, `createdAt`, `updatedAt`) VALUES
(2, 'Savar', 'Savar', 'Active', '2026-01-10 17:53:04', '2026-01-10 17:53:04');

-- --------------------------------------------------------

--
-- Table structure for table `client-informations`
--

CREATE TABLE `client-informations` (
  `id` int NOT NULL,
  `customerId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `userId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `fullName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `photo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fatherOrSpouseName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `dateOfBirth` datetime DEFAULT NULL,
  `age` int NOT NULL,
  `sex` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `maritalStatus` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `nidOrPassportNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `isFreeClient` tinyint(1) DEFAULT '0',
  `jobPlaceName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `jobCategory` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `jobType` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `mobileNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `customerType` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `package` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `area` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `flatAptNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `houseNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `roadNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `landmark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `connectionDetails` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `costForPackage` int DEFAULT NULL,
  `referId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `nidPhotoBackSide` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `role` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'client',
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'pending',
  `nidPhotoFrontSide` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `userAddedBy` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `routerLoginId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `routerLoginPassword` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `client-informations`
--

INSERT INTO `client-informations` (`id`, `customerId`, `userId`, `fullName`, `photo`, `fatherOrSpouseName`, `dateOfBirth`, `age`, `sex`, `maritalStatus`, `nidOrPassportNo`, `isFreeClient`, `jobPlaceName`, `jobCategory`, `jobType`, `mobileNo`, `email`, `customerType`, `package`, `location`, `area`, `flatAptNo`, `houseNo`, `roadNo`, `landmark`, `connectionDetails`, `costForPackage`, `referId`, `nidPhotoBackSide`, `role`, `status`, `nidPhotoFrontSide`, `password`, `userAddedBy`, `routerLoginId`, `routerLoginPassword`, `createdAt`, `updatedAt`) VALUES
(28, '675469854654', 'shamim@ringtel', 'Shamim Rony', NULL, 'Md. Abdul Karim', '1992-05-15 00:00:00', 32, 'Male', 'Married', '1992051523456', 0, 'Green Delta Insurance Company', 'Executive', 'Full Time', '01700000000', 'shamim@gmail.com', 'residential', 'Premium', 'Dhaka', 'Gulshan', '5B', '78', '12', 'Near Gulshan 1 Park', 'Fiber optic, Wi-Fi router included', 850, 'REF789012', '', 'Super-Admin', 'active', '', '01700000000', '', NULL, NULL, '2026-01-10 17:35:20', '2026-01-10 17:35:20'),
(29, '720009001', 'halima@ringtel', 'Ring Tel', 'https://server.billisp.com/uploads/89fe6ba673834858.jpg', 'N/A', '1988-01-10 00:00:00', 38, 'Male', 'Unmarried', 'N/A', 1, 'Ring Tel', 'Network Support Engineer', 'Full Time', '01601997701', 'ringtel.isp@gmail.com', 'residential', '10 Mbps', 'Savar', 'Bazar Road', '2D', '3/2', 'Wapda Road', 'N/A', 'Office Connection', 350, NULL, '', 'client', 'active', '', '01601997701', NULL, 'rtel@ringtel', '123456', '2026-01-10 19:07:11', '2026-01-14 09:46:29'),
(30, '720009002', 'md@ringtel', 'Md Raju Hossain', 'https://server.billisp.com/uploads/9fe6ba6738348584.jpg', 'Md Saiful Islam', '2000-11-01 00:00:00', 25, 'Male', 'Unmarried', '2412933083', 0, 'Furniture Concept', 'Sales & Marketing Executive', 'Full Time', '01924772120', 'rajuhossain120k@gmail.com', 'residential', '3', 'Savar', 'Dim Potti', '3A', '3', 'Wapda Road', 'N/A', NULL, 500, NULL, 'https://server.billisp.com/uploads/e6ba6738348584db.jpg', 'client', 'active', 'https://server.billisp.com/uploads/fe6ba6738348584d.jpg', '01924772120', NULL, 'raju@ringtel', '123456', '2026-01-11 07:37:15', '2026-01-11 07:37:15'),
(31, '720009003', 'md1@ringtel', 'Md Ratan Khan', 'https://server.billisp.com/uploads/a6738348584db8af.jpg', 'Md Makbul Khan', '1994-11-13 00:00:00', 31, 'Male', 'Married', '9144901767', 0, 'Super Star Electronics (Pvt.) Ltd.', 'Sales & Marketing Executive', 'Full Time', '01515252805', 'ratan@gmail.com', 'residential', '3', 'Savar', 'Still Goli', 'A1', '0', 'Still Goli, Bazar Road', 'Near Singair Press', NULL, 350, NULL, 'https://server.billisp.com/uploads/738348584db8af7e.jpg', 'client', 'active', 'https://server.billisp.com/uploads/6738348584db8af7.jpg', '01515252805', NULL, 'ratan01@ringtel', '123456', '2026-01-12 07:32:45', '2026-01-12 07:32:45'),
(32, '720009004', 'md2@ringtel', 'Md Arafat Hossen', 'https://server.billisp.com/uploads/38348584db8af7ea.jpg', 'Md Mokter Hossen', '2000-12-02 00:00:00', 25, 'Male', 'Unmarried', '3311039238', 0, NULL, 'Sales & Marketing Executive', 'Full Time', '01704503771', 'arafatrahman01628@gmail.com', 'residential', '3', 'Savar', 'Wapda Road', 'B3', '3/2', 'Wapda Road, Savar', 'N/A', NULL, 500, NULL, 'https://server.billisp.com/uploads/348584db8af7ea3c.jpg', 'client', 'active', 'https://server.billisp.com/uploads/8348584db8af7ea3.jpg', '01704503771', NULL, 'arafat@ringtel', '123456', '2026-01-12 07:38:06', '2026-01-12 07:38:06'),
(33, '720009005', 'md3@ringtel', 'Md Mohidur Rahman', 'https://server.billisp.com/uploads/48584db8af7ea3c7.jpeg', 'Md Ohidur Rahman', '1971-01-11 00:00:00', 55, 'Male', 'Married', '7787650527', 0, 'Sara Fashion', 'Proprietor', 'Full Time', '01819423812', 'mohidur@gmail.com', 'commercial', '10 Mbps', 'Savar', 'Dim Potti', '0', '0', 'Malancha Market, Savar', 'N/A', NULL, 500, NULL, '', 'client', 'active', '', '01819423812', NULL, 'sara@ringtel', '123456', '2026-01-12 07:53:15', '2026-01-12 07:54:14'),
(34, '720009006', 'md4@ringtel', 'Md Robin', 'https://server.billisp.com/uploads/8584db8af7ea3c76.jpg', 'Md Abdur Razzak', '1994-02-17 00:00:00', 31, 'Male', 'Unmarried', '9161471033', 0, 'Pabna Cosmetics', 'Proprietor', 'Full Time', '01845312323', 'robin@gmail.com', 'commercial', '3', 'Savar', 'Dim Potti', '0', '0', 'Wapda Road, Savar', 'N/A', NULL, 500, NULL, 'https://server.billisp.com/uploads/84db8af7ea3c7685.jpg', 'client', 'active', 'https://server.billisp.com/uploads/584db8af7ea3c768.jpg', '01845312323', NULL, 'shamim@ringtel', '123456', '2026-01-12 07:58:00', '2026-01-12 07:58:00'),
(35, '720009007', 'md5@ringtel', 'Md Reza', 'https://server.billisp.com/uploads/4db8af7ea3c7685b.png', 'N/A', '1995-01-11 00:00:00', 31, 'Male', 'Married', '00', 0, 'Dutch Bangla Bank Plc. ', 'Office Assistant', 'Full Time', '01620676740', 'reza@gmail.com', 'residential', '3', 'Savar', 'Wapda Road', 'B4', '3/2', 'Wapda Road, Savar', 'N/A', NULL, 600, NULL, '', 'client', 'active', '', '01620676740', NULL, 'reza@ringtel', '123456', '2026-01-12 08:03:12', '2026-01-12 08:03:12'),
(36, '720009008', 'md6@ringtel', 'Md Azaharul Islam', 'https://server.billisp.com/uploads/db8af7ea3c7685b8.jpg', 'Abdur Razzak', '1985-01-01 00:00:00', 41, 'Male', 'Married', '1923867905', 0, NULL, 'Billing Officer', 'Full Time', '01743787174', 'azahar@gmail.com', 'residential', '3', 'Savar', 'Wapda Road', 'C5', '3/2', 'Wapda Road', 'N/A', NULL, 500, NULL, 'https://server.billisp.com/uploads/8af7ea3c7685b8d2.jpg', 'client', 'active', 'https://server.billisp.com/uploads/b8af7ea3c7685b8d.jpg', '01743787174', NULL, 'fifthfloor@ringtel', '123456', '2026-01-12 14:09:32', '2026-01-12 14:09:32'),
(37, '720009009', 'fahim@ringtel', 'Fahim Reza', 'https://server.billisp.com/uploads/af7ea3c7685b8d2f.jpeg', 'Nurul Islam', '1990-09-27 00:00:00', 35, 'Male', 'Married', '5988679394', 0, NULL, 'Proprietor', 'Full Time', '01670141373', 'frbdcanada@gmail.com', 'residential', '3', 'Savar', 'Wapda Road', 'A2', '2/3', 'Wapda Road, Savar', 'N/A', NULL, 500, NULL, 'https://server.billisp.com/uploads/7ea3c7685b8d2fb2.jpeg', 'client', 'active', 'https://server.billisp.com/uploads/f7ea3c7685b8d2fb.jpeg', '01670141373', NULL, 'fahim@ringtel', '123456', '2026-01-12 14:19:29', '2026-01-12 14:19:29'),
(38, '720009010', 'md7@ringtel', 'Md Sumon Akon', 'https://server.billisp.com/uploads/ea3c7685b8d2fb2a.jpg', 'Md Kalam Akon', '1992-01-01 00:00:00', 34, 'Male', 'Married', '5574165865', 0, 'Liton Birany House', 'Proprietor', 'Full Time', '01301262600', 'mj4039742@gmail.com', 'commercial', '3', 'Savar', 'Wapda Road', 'Shop 03', '3/2', 'Wapda Road', 'N/A', NULL, 500, NULL, 'https://server.billisp.com/uploads/3c7685b8d2fb2a46.png', 'client', 'active', 'https://server.billisp.com/uploads/a3c7685b8d2fb2a4.png', '01301262600', NULL, 'shop01@ringtel', '123456', '2026-01-12 14:27:24', '2026-01-12 14:27:24'),
(39, '720009011', 'hafiza@ringtel', 'Hafiza', 'https://server.billisp.com/uploads/c7685b8d2fb2a467.JPG', 'N/A', '2001-01-11 00:00:00', 25, 'Female', 'Married', '0', 0, NULL, 'Housewife', 'Full Time', '01790844239', 'hafiza@gmail.com', 'residential', '10 Mbps', 'Savar', 'Dim Potti', 'A4', '0', 'Waoda Road, Savar', 'N/A', NULL, 500, NULL, '', 'client', 'active', '', '01790844239', NULL, 'hafiza@ringtel', '123456', '2026-01-12 14:30:29', '2026-01-12 14:45:21'),
(40, '720009012', 'md8@ringtel', 'Md Masudur Rahman Talukder', 'https://server.billisp.com/uploads/7685b8d2fb2a4672.png', 'Abdul Jobbar Talukder', '1978-01-01 00:00:00', 48, 'Male', 'Married', '5542947576', 0, 'Saifurs', 'Manager', 'Full Time', '01713432031', 'masud@gmail.com', 'commercial', '3', 'Savar', 'Razzak Plaza', '0', '0', 'Behind Razzak Plaza, Wapda Road, Savar', 'N/A', NULL, 500, NULL, 'https://server.billisp.com/uploads/85b8d2fb2a467295.jpg', 'client', 'active', 'https://server.billisp.com/uploads/685b8d2fb2a46729.jpg', '01713432031', NULL, 'masud@ringtel', '123456', '2026-01-12 14:49:28', '2026-01-12 14:49:28'),
(41, '720009013', 'md9@ringtel', 'Md Asik Parvej', 'https://server.billisp.com/uploads/5b8d2fb2a4672951.JPG', 'Idris Munshi', '1999-02-11 00:00:00', 26, 'Male', 'Married', '8267568049', 0, 'Ekota Cosmetics', 'Proprietor', 'Full Time', '01910035661', 'ashik@gmail.com', 'commercial', '3', 'Savar', 'Wapda Road', 'Shop No. 19', '3/2', 'Wapda Road, Savar', 'N/A', NULL, 500, NULL, 'https://server.billisp.com/uploads/8d2fb2a467295113.jpg', 'client', 'active', 'https://server.billisp.com/uploads/b8d2fb2a46729511.jpg', '01910035661', NULL, 'shop02@ringtel', '123456', '2026-01-12 14:54:36', '2026-01-12 14:54:36'),
(42, '720009014', 'md10@ringtel', 'Md Zakaria', 'https://server.billisp.com/uploads/d2fb2a467295113f.JPG', 'Md Zahangir', '2003-01-11 00:00:00', 23, 'Male', 'Unmarried', '8723784651', 0, 'Zakaria Cosmetics', 'Proprietor', 'Full Time', '01623623074', 'mdjakariaislam@gmail.com', 'residential', '4', 'Savar', 'Dim Potti', 'B4', '3', 'Wapda Road, Savar', 'N/A', NULL, 700, NULL, '', 'client', 'active', '', '01623623074', NULL, 'zakaria@ringtel', '123456', '2026-01-12 15:11:53', '2026-01-12 15:11:53'),
(43, '720009015', 'md11@ringtel', 'Md Jewel Hossen', 'https://server.billisp.com/uploads/2fb2a467295113f4.png', 'Md Lehaj Uddin Haulader', '1996-01-01 00:00:00', 30, 'Male', 'Unmarried', '2378796920', 0, 'Super Star Pvt. Ltd.', 'Sales & Marketing Executive', 'Full Time', '01715266090', 'jewel@gmail.com', 'residential', '3', 'Savar', 'Banpukur', 'A4', '2', 'Wapda Road, Savar', 'N/A', NULL, 500, NULL, 'https://server.billisp.com/uploads/b2a467295113f4df.jpg', 'client', 'active', 'https://server.billisp.com/uploads/fb2a467295113f4d.jpg', '01715266090', NULL, 'jewel@ringtel', '123456', '2026-01-12 15:17:34', '2026-01-12 15:17:34'),
(44, '720009016', 'g@ringtel', 'G M Ziaul Haque', 'https://server.billisp.com/uploads/2a467295113f4dfb.jpg', 'G M Alauddin ', '1985-02-07 00:00:00', 40, 'Male', 'Married', '2838749402', 0, 'Legend School', 'Principal', 'Full Time', '01708881666', 'legendschoolbd@gmail.com', 'commercial', '10 Mbps', 'Savar', 'Wapda Road', '0', 'A/2', ' Wapda Road, Savar', 'N/A', NULL, 500, NULL, 'https://server.billisp.com/uploads/467295113f4dfb89.jpg', 'client', 'active', 'https://server.billisp.com/uploads/a467295113f4dfb8.jpg', '01708881666', NULL, 'legend@ringtel', '123456', '2026-01-12 15:23:18', '2026-01-12 15:23:34'),
(45, '720009017', 'md12@ringtel', 'Ratan Khan', 'https://server.billisp.com/uploads/4dfb896de5bed625.jpg', 'Md Makbul Khan', '1994-11-13 00:00:00', 31, 'Male', 'Married', '914490176702', 0, 'Super Star Electronics (Pvt.) Ltd.', 'Sales & Marketing Executive', 'Full Time', '01515252804', 'ratan02@gmail.com', 'residential', '10 Mbps', 'Savar', 'Still Goli', 'A1', '0', 'Still Goli, Bazar Road', 'N/A', NULL, 350, NULL, 'https://server.billisp.com/uploads/fb896de5bed625cb.jpg', 'client', 'active', 'https://server.billisp.com/uploads/dfb896de5bed625c.jpg', '01515252804', NULL, 'ratan02@ringtel', '123456', '2026-01-12 15:27:17', '2026-01-16 04:43:32'),
(46, '720009018', 'elias@ringtel', 'Elias Jabed', 'https://server.billisp.com/uploads/b896de5bed625cb6.jpg', 'Abed Ali', '1981-01-07 00:00:00', 45, 'Male', 'Married', '6438634054', 0, 'Nantu Gosto Bitan', 'Proprietor', 'Full Time', '01715507037', 'elias@gmail.com', 'residential', '3', 'Savar', 'Still Goli', 'A3', '22', 'Wapda Road, Savar', 'Press er Goli', NULL, 500, NULL, 'https://server.billisp.com/uploads/96de5bed625cb628.jpg', 'client', 'active', 'https://server.billisp.com/uploads/896de5bed625cb62.jpg', '01715507037', NULL, 'elias@ringtel', '123456', '2026-01-12 15:34:48', '2026-01-12 15:34:48'),
(47, '720009020', 'md13@ringtel', 'Md Manik Mia ', 'https://server.billisp.com/uploads/6de5bed625cb6280.jpg', 'Tazul Islam', '1988-05-07 00:00:00', 37, 'Male', 'Married', '8689144700', 0, 'Manik Bakery', 'Sales & Marketing Executive', 'Full Time', '01781666692', 'manik@gmail.com', 'residential', '3', 'Savar', 'Dim Potti', 'A2', '0', 'Malancha Market, Wapda Road, Savar', 'N/A', NULL, 800, NULL, 'https://server.billisp.com/uploads/e5bed625cb628017.jpg', 'client', 'active', 'https://server.billisp.com/uploads/de5bed625cb62801.jpg', '01781666692', NULL, 'manik@ringtel', '123456', '2026-01-12 16:42:14', '2026-01-12 16:42:14'),
(48, '720009021', 'md14@ringtel', 'Md Shahadat Hossain Shamol', 'https://server.billisp.com/uploads/5bed625cb6280170.jpeg', 'Md Shohidul Islam', '1984-10-21 00:00:00', 41, 'Male', 'Married', '9550870431', 0, 'Shamol Shoes', 'Proprietor', 'Full Time', '01921088100', 'nushu4321@gmail.com', 'commercial', '10 Mbps', 'Savar', 'Shiraj Market', '0', '0', 'Aricha High Way, Savar', 'Shiraj Market', NULL, 500, NULL, 'https://server.billisp.com/uploads/ed625cb6280170d0.jpeg', 'client', 'active', 'https://server.billisp.com/uploads/bed625cb6280170d.jpeg', '01921088100', NULL, 'iqbal@ringtel', '123456', '2026-01-12 16:47:01', '2026-01-12 16:47:24'),
(49, '720009022', 'md15@ringtel', 'Md Mokhlesur Rahman', 'https://server.billisp.com/uploads/d625cb6280170d0c.jpg', 'Md Solaiman', '1972-07-09 00:00:00', 53, 'Male', 'Married', '1002128328', 0, 'Mohana Printers', 'Proprietor', 'Full Time', '01911037137', 'spp.bd17@gmail.com', 'commercial', '3', 'Savar', 'Still Goli', '0', '0', 'Malancha R/A, Savar', 'N/A', NULL, 500, NULL, 'https://server.billisp.com/uploads/25cb6280170d0c07.jpg', 'client', 'active', 'https://server.billisp.com/uploads/625cb6280170d0c0.jpg', '01911037137', NULL, 'insafp@ringtel', '123456', '2026-01-12 16:49:40', '2026-01-12 16:49:40'),
(50, '720009023', 'md16@ringtel', 'Md Mahabub Hossain Robi', 'https://server.billisp.com/uploads/5cb6280170d0c07f.jpg', 'Md Tafazzal Hossain', '1987-02-08 00:00:00', 38, 'Male', 'Married', '19872627203000211', 0, NULL, NULL, 'Full Time', '01515206120', 'mahabub.goldenfairy@gmail.com', 'commercial', '15 Mbps', 'Savar', 'Wapda Road', 'D2', '3/2', 'Wapda Road, Savar', 'N/A', NULL, 430, NULL, 'https://server.billisp.com/uploads/b6280170d0c07f45.jpg', 'client', 'active', 'https://server.billisp.com/uploads/cb6280170d0c07f4.jpg', '01515206120', NULL, 'robi@ringtel', '123456', '2026-01-12 16:54:39', '2026-01-12 17:04:04'),
(51, '720009024', 'md17@ringtel', 'Md Mosharof', 'https://server.billisp.com/uploads/6280170d0c07f45d.png', 'Md Abdul Momin', '1997-12-27 00:00:00', 28, 'Male', 'Married', '5107977760', 0, 'ePark Electronics', 'Managing Partner', 'Full Time', '01711775453', 'mosharofhossainemu@gmail.com', 'commercial', '4', 'Savar', 'Bazar Road', '0', '0', 'Savar Bazar Road, Savar', 'Mabi Watch er nicher Shop', NULL, 1000, NULL, 'https://server.billisp.com/uploads/80170d0c07f45d55.jpg', 'client', 'active', 'https://server.billisp.com/uploads/280170d0c07f45d5.jpg', '01711775453', NULL, 'epark@ringtel', '123456', '2026-01-12 16:58:55', '2026-01-12 16:58:55'),
(52, '720009025', 'md18@ringtel', 'Md Mahabub Hossain', 'https://server.billisp.com/uploads/0d0c07f45d55bec8.jpg', 'Md Tafazzal Hossain', '1987-02-08 00:00:00', 38, 'Male', 'Married', '2627203000211', 0, NULL, NULL, 'Full Time', '01689203297', 'hossain.mahabub@hotmail.co.uk', 'residential', '10 Mbps', 'Savar', 'Wapda Road', 'A3', '3/2', 'Wapda Road, Savar', 'N/A', NULL, 500, NULL, 'https://server.billisp.com/uploads/0c07f45d55bec8b8.jpg', 'client', 'active', 'https://server.billisp.com/uploads/d0c07f45d55bec8b.jpg', '01689203297', NULL, 'mahabub@ringtel', '123456', '2026-01-12 17:03:45', '2026-01-12 17:04:16'),
(53, '720009027', 'md19@ringtel', 'Md Saiful Islam', 'https://server.billisp.com/uploads/c07f45d55bec8b8f.jpg', 'Md Tomser Ali', '1998-03-01 00:00:00', 27, 'Male', 'Unmarried', '3304236114', 0, 'Nirob Wood Furniture', 'Manager', 'Full Time', '01945988529', 'saiful@gmail.com', 'commercial', '3', 'Savar', 'Bazar Road', '0', 'A-18', 'Savar Bazar Bus Stand, Savar', 'N/A', NULL, 500, NULL, 'https://server.billisp.com/uploads/7f45d55bec8b8ff9.jpg', 'client', 'active', 'https://server.billisp.com/uploads/07f45d55bec8b8ff.jpg', '01945988529', NULL, 'saiful@ringtel', '123456', '2026-01-12 18:12:04', '2026-01-12 18:12:04'),
(54, '720009028', 'asik@ringtel', 'Asik Parvej', 'https://server.billisp.com/uploads/f45d55bec8b8ff9f.JPG', 'Idris Munshi', '1999-02-11 00:00:00', 26, 'Male', 'Married', '19998267568049', 0, 'Ekota Cosmetics', 'Proprietor', 'Full Time', '01960657413', 'parvej@gmail.com', 'residential', '3', 'Savar', 'Still Goli', 'A4', '0', 'Malancha R/A, Savar', 'N/A', NULL, 500, NULL, 'https://server.billisp.com/uploads/5d55bec8b8ff9ff6.jpg', 'client', 'active', 'https://server.billisp.com/uploads/45d55bec8b8ff9ff.jpg', '01960657413', NULL, 'ashik@ringtel', '123456', '2026-01-12 18:25:22', '2026-01-12 18:25:22'),
(55, '720009029', 'amir@ringtel', 'Amir Hossain', 'https://server.billisp.com/uploads/d55bec8b8ff9ff6c.jpg', 'Abdul Matin Bepary', '1987-10-25 00:00:00', 38, 'Male', 'Married', '1483819148', 0, 'Molla Hotel', 'Proprietor', 'Full Time', '01748644644', 'amir@gmail.com', 'residential', '4', 'Savar', 'Razzak Plaza', '0', '0', 'Wapda Road, Savar', 'N/A', NULL, 1000, NULL, '', 'client', 'active', 'https://server.billisp.com/uploads/55bec8b8ff9ff6c7.jpg', '01748644644', NULL, 'amir@ringtel', '123456', '2026-01-12 18:37:03', '2026-01-12 18:37:03'),
(56, '720009030', 'smity@ringtel', 'Smity Das', 'https://server.billisp.com/uploads/5bec8b8ff9ff6c7e.jpg', 'Roton Das', '2004-04-28 00:00:00', 21, 'Male', 'Married', '6019068557', 0, NULL, NULL, 'Full Time', '01627201045', 'smity@gmail.com', 'residential', '3', 'Savar', 'Wapda Road', 'A5', '3/2', 'Wapda Road, Savar', 'N/A', NULL, 500, NULL, 'https://server.billisp.com/uploads/ec8b8ff9ff6c7e77.jpg', 'client', 'active', 'https://server.billisp.com/uploads/bec8b8ff9ff6c7e7.jpg', '01627201045', NULL, 'mariam@ringtel', '123456', '2026-01-12 18:51:00', '2026-01-12 18:51:00'),
(57, '720009031', 'md20@ringtel', 'Md Rajib Hossain', 'https://server.billisp.com/uploads/c8b8ff9ff6c7e77a.jpg', 'Kodom Ali', '1998-02-10 00:00:00', 27, 'Male', 'Unmarried', '7830173584', 0, 'Noorjahan Pharmacy ', 'Proprietor', 'Full Time', '01648499250', 'rajib@gmail.com', 'residential', '3', 'Savar', 'Nasir Plaza', '0', '0', 'Behind Razzak Plaza, Savar', 'N/A', NULL, 500, NULL, 'https://server.billisp.com/uploads/b8ff9ff6c7e77a0b.jpg', 'client', 'active', 'https://server.billisp.com/uploads/8b8ff9ff6c7e77a0.jpg', '01648499250', NULL, 'rajib@ringtel', '123456', '2026-01-12 19:43:33', '2026-01-12 19:43:33'),
(58, '720009019', 'md21@ringtel', 'Md Aminul Islam ', 'https://server.billisp.com/uploads/8ff9ff6c7e77a0bf.jpg', 'Lokman Gazi', '1973-01-01 00:00:00', 53, 'Male', 'Married', '5537550088', 0, 'Gazi Bosraloy', 'Proprietor', 'Full Time', '01711266326', 'aminul@gmail.com', 'commercial', '3', 'Savar', 'Hobi Plaza', '0', '0', 'Hobi Plaza Market, Savar', 'N/A', NULL, 500, NULL, 'https://server.billisp.com/uploads/f9ff6c7e77a0bfe7.jpg', 'client', 'active', 'https://server.billisp.com/uploads/ff9ff6c7e77a0bfe.jpg', '01711266326', NULL, ' gazi@ringtel', '123456', '2026-01-12 19:49:31', '2026-01-12 19:49:31');

-- --------------------------------------------------------

--
-- Table structure for table `contacts`
--

CREATE TABLE `contacts` (
  `id` int NOT NULL,
  `section` enum('contact_info','office_locations') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `subtitle` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `address` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `city` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `country` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `working_hours` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `whatsapp` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `telegram` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `facebook` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `linkedin` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `instagram` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `imo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `icon` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'phone',
  `color` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'from-blue-500 to-cyan-400',
  `bg_color` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'bg-blue-500/10',
  `display_order` int NOT NULL DEFAULT '0',
  `additional_details` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'admin',
  `updated_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contacts`
--

INSERT INTO `contacts` (`id`, `section`, `title`, `subtitle`, `description`, `phone`, `email`, `address`, `city`, `country`, `working_hours`, `whatsapp`, `telegram`, `facebook`, `linkedin`, `instagram`, `imo`, `latitude`, `longitude`, `icon`, `color`, `bg_color`, `display_order`, `additional_details`, `is_active`, `created_by`, `updated_by`, `createdAt`, `updatedAt`) VALUES
(1, 'contact_info', 'Support', '24/7 Support via WhatsApp', '01601997701', '01601997701', 'ringtel.isp@gmail.com', NULL, NULL, NULL, NULL, 'https://wa.me/01601997701', NULL, 'https://www.facebook.com/ringtelnet', NULL, NULL, NULL, NULL, NULL, 'phone', 'from-red-500 to-pink-400', 'bg-blue-500/10', 1, '[]', 1, 'admin', 'admin', '2026-01-10 18:03:39', '2026-01-10 18:04:33');

-- --------------------------------------------------------

--
-- Table structure for table `emails`
--

CREATE TABLE `emails` (
  `id` int NOT NULL,
  `appName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `emailAppPassword` varchar(255) NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `emails`
--

INSERT INTO `emails` (`id`, `appName`, `email`, `emailAppPassword`, `isActive`, `createdAt`, `updatedAt`) VALUES
(2, 'Ringtel', 'shakidul31@gmail.com', 'svozchfcqhuqefcx', 1, '2026-01-10 13:55:42', '2026-01-10 13:55:42');

-- --------------------------------------------------------

--
-- Table structure for table `employeeattendances`
--

CREATE TABLE `employeeattendances` (
  `id` int NOT NULL,
  `employeeId` int NOT NULL,
  `checkIn` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `checkOut` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `date` date NOT NULL,
  `status` enum('Present','Absent','Leave','Half Day') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Present',
  `workingHours` float DEFAULT NULL,
  `lateMinutes` int NOT NULL DEFAULT '0',
  `earlyDeparture` int NOT NULL DEFAULT '0',
  `note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `createdBy` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Super-Admin',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employee_bill_collection`
--

CREATE TABLE `employee_bill_collection` (
  `id` int NOT NULL,
  `clientId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `clientName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `clientPhone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `clientAddress` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `employeeId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `employeeName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `invoiceId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Optional invoice ID for reference',
  `billingMonth` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'Format: YYYY-MM e.g., 2025-01',
  `amount` decimal(10,2) NOT NULL,
  `paymentMethod` enum('cash','bkash','nagad','rocket','card','bank_transfer') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'cash',
  `transactionId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Transaction ID for mobile banking/bank transfers',
  `referenceNote` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `collectionDate` datetime NOT NULL,
  `collectionTime` time DEFAULT NULL,
  `receiptNumber` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `status` enum('collected','verified','deposited','cancelled','refunded') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'collected',
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `attachment` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Receipt/transaction slip image path',
  `verifiedBy` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `verifiedAt` datetime DEFAULT NULL,
  `verificationRemark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `depositedBy` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `depositedAt` datetime DEFAULT NULL,
  `depositSlipNumber` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `discount` float NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employee_bill_collection`
--

INSERT INTO `employee_bill_collection` (`id`, `clientId`, `clientName`, `clientPhone`, `clientAddress`, `employeeId`, `employeeName`, `invoiceId`, `billingMonth`, `amount`, `paymentMethod`, `transactionId`, `referenceNote`, `collectionDate`, `collectionTime`, `receiptNumber`, `status`, `notes`, `attachment`, `verifiedBy`, `verifiedAt`, `verificationRemark`, `depositedBy`, `depositedAt`, `depositSlipNumber`, `discount`, `createdAt`, `updatedAt`) VALUES
(15, 'md2@ringtel', 'Md Arafat Hossen', '01704503771', 'B3, 3/2, Wapda Road, Savar, Wapda Road', 'shamim9489@ringtel', 'Shamim Rony', 'INV-January-2026-720009004', 'January 2026', 500.00, 'cash', '', '', '2026-01-14 09:46:10', '15:46:10', 'RCT-2026-01-000001', 'collected', '', '', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2026-01-14 09:46:10', '2026-01-14 09:46:10'),
(16, 'fahim@ringtel', 'Fahim Reza', '01670141373', 'A2, 2/3, Wapda Road, Savar, Wapda Road', 'shamim9489@ringtel', 'Shamim Rony', 'INV-January-2026-720009009', 'January 2026', 500.00, 'cash', '', '', '2026-01-14 09:50:15', '15:50:15', 'RCT-2026-01-000002', 'collected', '', '', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2026-01-14 09:50:15', '2026-01-14 09:50:15'),
(17, 'g@ringtel', 'G M Ziaul Haque', '01708881666', '0, A/2,  Wapda Road, Savar, Wapda Road', 'shamim9489@ringtel', 'Shamim Rony', 'INV-January-2026-720009016', 'January 2026', 500.00, 'cash', '', '', '2026-01-14 09:50:40', '15:50:40', 'RCT-2026-01-000003', 'collected', '', '', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2026-01-14 09:50:40', '2026-01-14 09:50:40'),
(18, 'md10@ringtel', 'Md Zakaria', '01623623074', 'B4, 3, Wapda Road, Savar, Dim Potti', 'shamim9489@ringtel', 'Shamim Rony', 'INV-January-2026-720009014', 'January 2026', 700.00, 'cash', '', '', '2026-01-14 09:52:36', '15:52:36', 'RCT-2026-01-000004', 'collected', '', '', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2026-01-14 09:52:36', '2026-01-14 09:52:36'),
(19, 'md4@ringtel', 'Md Robin', '01845312323', '0, 0, Wapda Road, Savar, Dim Potti', 'shamim9489@ringtel', 'Shamim Rony', 'INV-January-2026-720009006', 'January 2026', 500.00, 'cash', '', '', '2026-01-14 09:53:05', '15:53:05', 'RCT-2026-01-000005', 'collected', '', '', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2026-01-14 09:53:05', '2026-01-14 09:53:05'),
(20, 'md14@ringtel', 'Md Shahadat Hossain Shamol', '01921088100', '0, 0, Aricha High Way, Savar, Shiraj Market', 'shamim9489@ringtel', 'Shamim Rony', 'INV-January-2026-720009021', 'January 2026', 500.00, 'cash', '', '', '2026-01-14 09:53:32', '15:53:32', 'RCT-2026-01-000006', 'collected', '', '', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2026-01-14 09:53:32', '2026-01-14 09:53:32'),
(21, 'md5@ringtel', 'Md Reza', '01620676740', 'B4, 3/2, Wapda Road, Savar, Wapda Road', 'shamim9489@ringtel', 'Shamim Rony', 'INV-January-2026-720009007', 'January 2026', 600.00, 'cash', '', '', '2026-01-14 09:54:15', '15:54:15', 'RCT-2026-01-000007', 'collected', '', '', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2026-01-14 09:54:15', '2026-01-14 09:54:15'),
(22, 'md20@ringtel', 'Md Rajib Hossain', '01648499250', '0, 0, Behind Razzak Plaza, Savar, Nasir Plaza', 'shamim9489@ringtel', 'Shamim Rony', 'INV-January-2026-720009031', 'January 2026', 500.00, 'cash', '', '', '2026-01-14 09:54:39', '15:54:39', 'RCT-2026-01-000008', 'collected', '', '', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2026-01-14 09:54:39', '2026-01-14 09:54:39'),
(23, 'hafiza@ringtel', 'Hafiza', '01790844239', 'A4, 0, Waoda Road, Savar, Dim Potti', 'shamim9489@ringtel', 'Shamim Rony', 'INV-January-2026-720009011', 'January 2026', 500.00, 'cash', '', '', '2026-01-14 09:54:59', '15:54:59', 'RCT-2026-01-000009', 'collected', '', '', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2026-01-14 09:54:59', '2026-01-14 09:54:59'),
(24, 'md3@ringtel', 'Md Mohidur Rahman', '01819423812', '0, 0, Malancha Market, Savar, Dim Potti', 'shamim9489@ringtel', 'Shamim Rony', 'INV-January-2026-720009005', 'January 2026', 500.00, 'cash', '', '', '2026-01-14 09:55:30', '15:55:30', 'RCT-2026-01-000010', 'collected', '', '', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2026-01-14 09:55:30', '2026-01-14 09:55:30'),
(25, 'md17@ringtel', 'Md Mosharof', '01711775453', '0, 0, Savar Bazar Road, Savar, Bazar Road', 'shamim9489@ringtel', 'Shamim Rony', 'INV-January-2026-720009024', 'January 2026', 1000.00, 'cash', '', '', '2026-01-14 09:55:53', '15:55:53', 'RCT-2026-01-000011', 'collected', '', '', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2026-01-14 09:55:53', '2026-01-14 09:55:53'),
(26, 'md7@ringtel', 'Md Sumon Akon', '01301262600', 'Shop 03, 3/2, Wapda Road, Wapda Road', 'shamim9489@ringtel', 'Shamim Rony', 'INV-January-2026-720009010', 'January 2026', 500.00, 'cash', '', '', '2026-01-14 09:56:15', '15:56:15', 'RCT-2026-01-000012', 'collected', '', '', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2026-01-14 09:56:15', '2026-01-14 09:56:15'),
(27, 'md6@ringtel', 'Md Azaharul Islam', '01743787174', 'C5, 3/2, Wapda Road, Wapda Road', 'shamim9489@ringtel', 'Shamim Rony', 'INV-January-2026-720009008', 'January 2026', 500.00, 'cash', '', '', '2026-01-14 09:57:42', '15:57:42', 'RCT-2026-01-000013', 'collected', '', '', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2026-01-14 09:57:42', '2026-01-14 09:57:42'),
(28, 'elias@ringtel', 'Elias Jabed', '01715507037', 'A3, 22, Wapda Road, Savar, Still Goli', 'shamim9489@ringtel', 'Shamim Rony', 'INV-January-2026-720009018', 'January 2026', 500.00, 'cash', '', '', '2026-01-14 09:58:02', '15:58:02', 'RCT-2026-01-000014', 'collected', '', '', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2026-01-14 09:58:02', '2026-01-14 09:58:02'),
(29, 'md19@ringtel', 'Md Saiful Islam', '01945988529', '0, A-18, Savar Bazar Bus Stand, Savar, Bazar Road', 'shamim9489@ringtel', 'Shamim Rony', 'INV-January-2026-720009027', 'January 2026', 500.00, 'cash', '', '', '2026-01-14 09:58:23', '15:58:23', 'RCT-2026-01-000015', 'collected', '', '', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2026-01-14 09:58:23', '2026-01-14 09:58:23'),
(30, 'smity@ringtel', 'Smity Das', '01627201045', 'A5, 3/2, Wapda Road, Savar, Wapda Road', 'shamim9489@ringtel', 'Shamim Rony', 'INV-January-2026-720009030', 'January 2026', 500.00, 'cash', '', '', '2026-01-14 09:58:50', '15:58:50', 'RCT-2026-01-000016', 'collected', '', '', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2026-01-14 09:58:50', '2026-01-14 09:58:50'),
(31, 'md8@ringtel', 'Md Masudur Rahman Talukder', '01713432031', '0, 0, Behind Razzak Plaza, Wapda Road, Savar, Razzak Plaza', 'shamim9489@ringtel', 'Shamim Rony', 'INV-January-2026-720009012', 'January 2026', 500.00, 'cash', '', '', '2026-01-14 09:59:52', '15:59:52', 'RCT-2026-01-000017', 'collected', '', '', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2026-01-14 09:59:52', '2026-01-14 09:59:52'),
(32, 'md15@ringtel', 'Md Mokhlesur Rahman', '01911037137', '0, 0, Malancha R/A, Savar, Still Goli', 'shamim9489@ringtel', 'Shamim Rony', 'INV-January-2026-720009022', 'January 2026', 500.00, 'cash', '', '', '2026-01-14 10:00:16', '16:00:16', 'RCT-2026-01-000018', 'verified', '', '', 'shamim@ringtel', '2026-01-16 04:53:04', '', NULL, NULL, NULL, 0, '2026-01-14 10:00:16', '2026-01-16 04:53:04'),
(33, 'md9@ringtel', 'Md Asik Parvej', '01910035661', 'Shop No. 19, 3/2, Wapda Road, Savar, Wapda Road', 'shamim9489@ringtel', 'Shamim Rony', 'INV-January-2026-720009013', 'January 2026', 500.00, 'cash', '', '', '2026-01-14 10:00:58', '16:00:58', 'RCT-2026-01-000019', 'collected', '', '', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2026-01-14 10:00:58', '2026-01-14 10:00:58'),
(34, 'md1@ringtel', 'Md Ratan Khan', '01515252805', 'A1, 0, Still Goli, Bazar Road, Still Goli', 'shamim9489@ringtel', 'Shamim Rony', 'INV-January-2026-720009003', 'January 2026', 350.00, 'cash', '', '', '2026-01-15 17:12:57', '23:12:57', 'RCT-2026-01-000020', 'verified', '', '', 'shamim@ringtel', '2026-01-16 04:47:52', '', NULL, NULL, NULL, 0, '2026-01-15 17:12:57', '2026-01-16 04:47:52'),
(35, 'asik@ringtel', 'Asik Parvej', '01960657413', 'A4, 0, Malancha R/A, Savar, Still Goli', 'shamim9489@ringtel', 'Shamim Rony', 'INV-January-2026-720009028', 'January 2026', 500.00, 'cash', '', '', '2026-01-15 17:26:08', '23:26:08', 'RCT-2026-01-000021', 'verified', '', '', 'shamim@ringtel', '2026-01-16 04:46:49', '', NULL, NULL, NULL, 0, '2026-01-15 17:26:08', '2026-01-16 04:46:49'),
(36, 'md12@ringtel', 'Md Ratan Khan', '01515252804', 'A1, 0, Still Goli, Bazar Road, Still Goli', 'shamim9489@ringtel', 'Shamim Rony', 'INV-January-2026-720009017', 'January 2026', 350.00, 'cash', '', '', '2026-01-15 17:45:42', '23:45:42', 'RCT-2026-01-000022', 'verified', '', '', 'shamim@ringtel', '2026-01-16 04:46:12', '', NULL, NULL, NULL, 0, '2026-01-15 17:45:42', '2026-01-16 04:46:12');

-- --------------------------------------------------------

--
-- Table structure for table `employee_salaries`
--

CREATE TABLE `employee_salaries` (
  `id` int NOT NULL,
  `employeeId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `employeeName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `department` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `designation` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `salaryMonth` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `salaryYear` int NOT NULL,
  `basicSalary` decimal(10,2) NOT NULL DEFAULT '0.00',
  `houseRent` decimal(10,2) NOT NULL DEFAULT '0.00',
  `medicalAllowance` decimal(10,2) NOT NULL DEFAULT '0.00',
  `travelAllowance` decimal(10,2) NOT NULL DEFAULT '0.00',
  `otherAllowances` decimal(10,2) NOT NULL DEFAULT '0.00',
  `providentFund` decimal(10,2) NOT NULL DEFAULT '0.00',
  `taxDeduction` decimal(10,2) NOT NULL DEFAULT '0.00',
  `otherDeductions` decimal(10,2) NOT NULL DEFAULT '0.00',
  `totalWorkingDays` int NOT NULL DEFAULT '0',
  `presentDays` decimal(5,2) NOT NULL DEFAULT '0.00',
  `absentDays` int NOT NULL DEFAULT '0',
  `paidLeaves` int NOT NULL DEFAULT '0',
  `unpaidLeaves` int NOT NULL DEFAULT '0',
  `overtimeHours` decimal(5,2) NOT NULL DEFAULT '0.00',
  `overtimeRate` decimal(10,2) NOT NULL DEFAULT '0.00',
  `overtimeAmount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `performanceBonus` decimal(10,2) NOT NULL DEFAULT '0.00',
  `festivalBonus` decimal(10,2) NOT NULL DEFAULT '0.00',
  `otherBonuses` decimal(10,2) NOT NULL DEFAULT '0.00',
  `grossSalary` decimal(10,2) NOT NULL DEFAULT '0.00',
  `totalDeductions` decimal(10,2) NOT NULL DEFAULT '0.00',
  `netSalary` decimal(10,2) NOT NULL DEFAULT '0.00',
  `paymentStatus` enum('pending','paid','failed','cancelled') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'pending',
  `paymentDate` datetime DEFAULT NULL,
  `paymentMethod` enum('bank','cash','mobile_banking') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'bank',
  `bankAccount` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '',
  `salaryId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `expenses`
--

CREATE TABLE `expenses` (
  `id` int NOT NULL,
  `expenseCode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `expenseCategoryId` int NOT NULL,
  `expenseSubcategoryId` int DEFAULT NULL,
  `totalAmount` decimal(15,2) NOT NULL,
  `date` date NOT NULL,
  `image` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` enum('Pending','Approved','Rejected','Partially_Paid','Paid') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Pending',
  `paymentStatus` enum('Pending','Partially_Paid','Paid') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Pending',
  `approvedBy` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `approvedAt` datetime DEFAULT NULL,
  `rejectionReason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `expense_categories`
--

CREATE TABLE `expense_categories` (
  `id` int NOT NULL,
  `categoryName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `categoryCode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `budgetLimit` decimal(15,2) NOT NULL DEFAULT '0.00',
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `requiresApproval` tinyint(1) NOT NULL DEFAULT '0',
  `createdBy` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'admin',
  `updatedBy` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `expense_categories`
--

INSERT INTO `expense_categories` (`id`, `categoryName`, `categoryCode`, `description`, `budgetLimit`, `isActive`, `requiresApproval`, `createdBy`, `updatedBy`, `createdAt`, `updatedAt`) VALUES
(1, '5000 – Network & Bandwidth Costs', '402029', '5000 – Network & Bandwidth Costs', 500000.00, 1, 1, 'admin', 'admin', '2026-01-16 05:57:22', '2026-01-16 06:09:33'),
(2, '5100 – Infrastructure & Equipment Expenses', '111389', '5100 – Infrastructure & Equipment Expenses', 500000.00, 1, 1, 'admin', 'admin', '2026-01-16 06:00:44', '2026-01-16 06:09:37'),
(3, '5200 – Maintenance & Operations', '330887', '5200 – Maintenance & Operations', 500000.00, 1, 1, 'admin', 'admin', '2026-01-16 06:02:21', '2026-01-16 06:09:43'),
(4, '5300 – Power, Utilities & Facilities', '703043', '5300 – Power, Utilities & Facilities', 500000.00, 1, 1, 'admin', 'admin', '2026-01-16 06:02:40', '2026-01-16 06:09:52'),
(5, '5400 – Employee & HR Expenses', '710451', '5400 – Employee & HR Expenses', 500000.00, 1, 1, 'admin', 'admin', '2026-01-16 06:02:54', '2026-01-16 06:09:58'),
(6, '5500 – Office & Administrative Expenses', '601005', '5500 – Office & Administrative Expenses', 500000.00, 1, 1, 'admin', 'admin', '2026-01-16 06:03:07', '2026-01-16 06:10:04'),
(7, '5600 – Regulatory & Licensing (BTRC)', '590524', '5600 – Regulatory & Licensing (BTRC)', 500000.00, 1, 1, 'admin', 'admin', '2026-01-16 06:03:22', '2026-01-16 06:10:11'),
(8, '5700 – Marketing & Customer Acquisition', '633816', '5700 – Marketing & Customer Acquisition', 500000.00, 1, 1, 'admin', 'admin', '2026-01-16 06:03:35', '2026-01-16 06:10:19'),
(9, '5800 – Customer Support & Billing', '372640', '5800 – Customer Support & Billing', 500000.00, 1, 1, 'admin', 'admin', '2026-01-16 06:03:46', '2026-01-16 06:10:27'),
(10, '5900 – Legal, Professional & Compliance', '595076', '5900 – Legal, Professional & Compliance', 500000.00, 1, 1, 'admin', 'admin', '2026-01-16 06:03:58', '2026-01-16 06:10:34'),
(11, '6000 – Financial & Risk Management', '789274', '6000 – Financial & Risk Management', 50000.00, 1, 1, 'admin', 'admin', '2026-01-16 06:04:10', '2026-01-16 06:51:55'),
(12, '6100 – Other Expenses', '823763', '6100 – Other Expenses', 50000.00, 1, 1, 'admin', NULL, '2026-01-16 06:04:21', '2026-01-16 06:04:21'),
(13, '6200 - Depreciation & Amortization', '129886', '6200 - Depreciation & Amortization', 500000.00, 1, 1, 'admin', NULL, '2026-01-16 06:47:41', '2026-01-16 06:47:41');

-- --------------------------------------------------------

--
-- Table structure for table `expense_payments`
--

CREATE TABLE `expense_payments` (
  `id` int NOT NULL,
  `expenseId` int NOT NULL,
  `accountId` int NOT NULL,
  `paymentAmount` decimal(15,2) NOT NULL,
  `status` enum('Pending','Processed','Failed') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Pending',
  `processedAt` datetime DEFAULT NULL,
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `createdBy` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'admin',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `expense_sub_categories`
--

CREATE TABLE `expense_sub_categories` (
  `id` int NOT NULL,
  `subCategoryName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `subCategoryCode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `budgetLimit` decimal(15,2) NOT NULL DEFAULT '0.00',
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `requiresApproval` tinyint(1) NOT NULL DEFAULT '0',
  `categoryId` int NOT NULL,
  `createdBy` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'admin',
  `updatedBy` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `expense_sub_categories`
--

INSERT INTO `expense_sub_categories` (`id`, `subCategoryName`, `subCategoryCode`, `description`, `budgetLimit`, `isActive`, `requiresApproval`, `categoryId`, `createdBy`, `updatedBy`, `createdAt`, `updatedAt`) VALUES
(1, '5020 International Gateway Fees', '598406', '5020 International Gateway Fees', 50000.00, 1, 1, 1, 'admin', 'admin', '2026-01-16 05:58:20', '2026-01-16 06:11:36'),
(2, '5010 Upstream Bandwidth Purchase (IIG)', '356091', '5010 Upstream Bandwidth Purchase (IIG)', 50000.00, 1, 1, 1, 'admin', 'admin', '2026-01-16 06:09:12', '2026-01-16 06:11:16'),
(3, '5030 Peering & Transit Costs (BDIX)', '941541', '5030 Peering & Transit Costs (BDIX)', 50000.00, 1, 1, 1, 'admin', NULL, '2026-01-16 06:11:55', '2026-01-16 06:11:55'),
(4, '5040 Submarine Cable Charges', '925813', '5040 Submarine Cable Charges', 50000.00, 1, 1, 1, 'admin', NULL, '2026-01-16 06:12:08', '2026-01-16 06:12:08'),
(5, '5050 Redundant / Backup Bandwidth', '522279', '5050 Redundant / Backup Bandwidth', 50000.00, 1, 1, 1, 'admin', NULL, '2026-01-16 06:12:21', '2026-01-16 06:12:21'),
(6, '5060 SLA Premium Charges', '889240', '5060 SLA Premium Charges', 50000.00, 1, 1, 1, 'admin', NULL, '2026-01-16 06:12:48', '2026-01-16 06:12:48'),
(7, '5070 IPv4 Leasing / IPv6 Costs', '815101', '5070 IPv4 Leasing / IPv6 Costs', 50000.00, 1, 1, 1, 'admin', NULL, '2026-01-16 06:13:02', '2026-01-16 06:13:02'),
(8, '5110 Fiber Lease Charges', '698929', '5110 Fiber Lease Charges', 50000.00, 1, 1, 2, 'admin', NULL, '2026-01-16 06:13:29', '2026-01-16 06:13:29'),
(9, '5120 Right-of-Way (RoW) Fees', '961655', '5120 Right-of-Way (RoW) Fees', 50000.00, 1, 1, 2, 'admin', NULL, '2026-01-16 06:13:45', '2026-01-16 06:13:45'),
(10, '5130 Pole / Duct Rental Fees', '286615', '5130 Pole / Duct Rental Fees', 50000.00, 1, 1, 2, 'admin', NULL, '2026-01-16 06:14:01', '2026-01-16 06:14:01'),
(11, '5140 Wireless Equipment Rental', '197197', '5140 Wireless Equipment Rental', 50000.00, 1, 1, 2, 'admin', NULL, '2026-01-16 06:18:21', '2026-01-16 06:18:21'),
(12, '5150 Data Center / PoP Colocation Fees', '167240', '5150 Data Center / PoP Colocation Fees', 50000.00, 1, 1, 2, 'admin', NULL, '2026-01-16 06:18:34', '2026-01-16 06:18:34'),
(13, '5160 Network Cabinets & ODF Expenses', '773422', '5160 Network Cabinets & ODF Expenses', 49999.99, 1, 1, 2, 'admin', NULL, '2026-01-16 06:18:49', '2026-01-16 06:18:49'),
(14, '5210 Network Maintenance & Repairs', '890502', '5210 Network Maintenance & Repairs', 50000.00, 1, 1, 3, 'admin', NULL, '2026-01-16 06:19:02', '2026-01-16 06:19:02'),
(15, '5220 AMC – Network Equipment', '855385', '5220 AMC – Network Equipment', 50000.00, 1, 1, 3, 'admin', NULL, '2026-01-16 06:19:17', '2026-01-16 06:19:17'),
(16, '5230 Field Technician Expenses', '890890', '5230 Field Technician Expenses', 50000.00, 1, 1, 3, 'admin', NULL, '2026-01-16 06:19:32', '2026-01-16 06:19:32'),
(17, '5240 Spare Parts Consumption', '767476', '5240 Spare Parts Consumption', 50000.00, 1, 1, 3, 'admin', NULL, '2026-01-16 06:19:47', '2026-01-16 06:19:47'),
(18, '5250 NOC Operations Costs', '236732', '5250 NOC Operations Costs', 50000.00, 1, 1, 3, 'admin', NULL, '2026-01-16 06:20:01', '2026-01-16 06:20:01'),
(19, '5260 Network Monitoring Software', '583991', '5260 Network Monitoring Software', 50000.00, 1, 1, 3, 'admin', NULL, '2026-01-16 06:20:13', '2026-01-16 06:20:13'),
(20, '5310 Electricity – Office', '889561', '5310 Electricity – Office', 50000.00, 1, 1, 4, 'admin', NULL, '2026-01-16 06:20:37', '2026-01-16 06:20:37'),
(21, '5320 Electricity – Network Sites', '136336', '5320 Electricity – Network Sites', 50000.00, 1, 1, 4, 'admin', NULL, '2026-01-16 06:20:50', '2026-01-16 06:20:50'),
(22, '5330 Generator Fuel', '143377', '5330 Generator Fuel', 50000.00, 1, 1, 4, 'admin', NULL, '2026-01-16 06:21:07', '2026-01-16 06:21:07'),
(23, '5340 UPS & Battery Maintenance', '733689', '5340 UPS & Battery Maintenance', 50000.00, 1, 1, 4, 'admin', 'admin', '2026-01-16 06:21:20', '2026-01-16 06:51:34'),
(24, '5350 Cooling / HVAC Expenses', '155362', '5350 Cooling / HVAC Expenses', 50000.00, 1, 1, 4, 'admin', NULL, '2026-01-16 06:21:34', '2026-01-16 06:21:34'),
(25, '5360 Fire & Safety Systems', '179332', '5360 Fire & Safety Systems', 50000.00, 1, 1, 4, 'admin', NULL, '2026-01-16 06:21:49', '2026-01-16 06:21:49'),
(26, '5410 Salaries & Wages', '360778', '5410 Salaries & Wages', 200000.00, 1, 1, 5, 'admin', NULL, '2026-01-16 06:24:07', '2026-01-16 06:24:07'),
(27, '5420 Overtime & Allowances', '182718', '5420 Overtime & Allowances', 200000.00, 1, 1, 5, 'admin', NULL, '2026-01-16 06:24:22', '2026-01-16 06:24:22'),
(28, '5430 Sales Commissions', '767401', '5430 Sales Commissions', 200000.00, 1, 1, 5, 'admin', NULL, '2026-01-16 06:24:38', '2026-01-16 06:24:38'),
(29, '5440 Bonuses & Incentives', '413917', '5440 Bonuses & Incentives', 200000.00, 1, 1, 5, 'admin', NULL, '2026-01-16 06:24:51', '2026-01-16 06:24:51'),
(30, '5450 Training & Certification', '123053', '5450 Training & Certification', 200000.00, 1, 1, 5, 'admin', NULL, '2026-01-16 06:25:10', '2026-01-16 06:25:10'),
(31, '5460 Recruitment Expenses', '901508', '5460 Recruitment Expenses', 200000.00, 1, 1, 5, 'admin', NULL, '2026-01-16 06:25:25', '2026-01-16 06:25:25'),
(32, '5470 PF / Gratuity / Staff Welfare', '235464', '5470 PF / Gratuity / Staff Welfare', 200000.00, 1, 1, 5, 'admin', NULL, '2026-01-16 06:25:41', '2026-01-16 06:25:41'),
(33, '5480 Group Insurance / Medical', '467681', '5480 Group Insurance / Medical', 200000.00, 1, 1, 5, 'admin', NULL, '2026-01-16 06:25:56', '2026-01-16 06:25:56'),
(34, '5510 Office Rent', '573463', '5510 Office Rent', 50000.00, 1, 1, 6, 'admin', NULL, '2026-01-16 06:26:13', '2026-01-16 06:26:13'),
(35, '5520 Office Utilities', '940596', '5520 Office Utilities', 50000.00, 1, 1, 6, 'admin', NULL, '2026-01-16 06:26:26', '2026-01-16 06:26:26'),
(36, '5530 Office Supplies & Stationery', '675291', '5530 Office Supplies & Stationery', 50000.00, 1, 1, 6, 'admin', NULL, '2026-01-16 06:26:43', '2026-01-16 06:26:43'),
(37, '5540 Communication Expenses', '613339', '5540 Communication Expenses', 50000.00, 1, 1, 6, 'admin', NULL, '2026-01-16 06:27:03', '2026-01-16 06:27:03'),
(38, '5550 Internet & IT Services (Office)', '806840', '5550 Internet & IT Services (Office)', 50000.00, 1, 1, 6, 'admin', NULL, '2026-01-16 06:27:17', '2026-01-16 06:27:17'),
(39, '5560 Security Services', '259892', '5560 Security Services', 50000.00, 1, 1, 6, 'admin', 'admin', '2026-01-16 06:27:30', '2026-01-16 06:49:09'),
(40, '5570 Cleaning & Maintenance', '171568', '5570 Cleaning & Maintenance', 50000.00, 1, 1, 6, 'admin', 'admin', '2026-01-16 06:27:44', '2026-01-16 06:49:16'),
(41, '5610 ISP License Fees', '990221', '5610 ISP License Fees', 100000.00, 1, 1, 7, 'admin', NULL, '2026-01-16 06:28:04', '2026-01-16 06:28:04'),
(42, '5620 Annual License Renewal', '837326', '5620 Annual License Renewal', 100000.00, 1, 1, 7, 'admin', NULL, '2026-01-16 06:28:24', '2026-01-16 06:28:24'),
(43, '5630 Revenue Sharing with BTRC', '259457', '5630 Revenue Sharing with BTRC', 100000.00, 1, 1, 7, 'admin', NULL, '2026-01-16 06:28:45', '2026-01-16 06:28:45'),
(44, '5640 Social Obligation Fund', '380557', '5640 Social Obligation Fund', 50000.00, 1, 1, 7, 'admin', NULL, '2026-01-16 06:29:02', '2026-01-16 06:29:02'),
(45, '5650 Spectrum / Frequency Fees', '883969', '5650 Spectrum / Frequency Fees', 100000.00, 1, 1, 7, 'admin', NULL, '2026-01-16 06:29:18', '2026-01-16 06:29:18'),
(46, '5660 Compliance & Audit Fees', '555382', '5660 Compliance & Audit Fees', 100000.00, 1, 1, 7, 'admin', NULL, '2026-01-16 06:29:34', '2026-01-16 06:29:34'),
(47, '5670 Regulatory Penalties & Late Fees', '864924', '5670 Regulatory Penalties & Late Fees', 100000.00, 1, 1, 7, 'admin', NULL, '2026-01-16 06:29:52', '2026-01-16 06:29:52'),
(48, '5710 Digital Advertising', '606540', '5710 Digital Advertising', 50000.00, 1, 1, 8, 'admin', NULL, '2026-01-16 06:30:08', '2026-01-16 06:30:08'),
(49, '5720 Offline Marketing', '491234', '5720 Offline Marketing', 50000.00, 1, 1, 8, 'admin', NULL, '2026-01-16 06:30:25', '2026-01-16 06:30:25'),
(50, '5730 Dealer / Reseller Commission', '499536', '5730 Dealer / Reseller Commission', 100000.00, 1, 1, 8, 'admin', NULL, '2026-01-16 06:31:01', '2026-01-16 06:31:01'),
(51, '5740 Customer Onboarding Offers', '915969', '5740 Customer Onboarding Offers', 100000.00, 1, 1, 8, 'admin', NULL, '2026-01-16 06:31:17', '2026-01-16 06:31:17'),
(52, '5750 Branding & Website Maintenance', '395367', '5750 Branding & Website Maintenance', 100000.00, 1, 1, 8, 'admin', NULL, '2026-01-16 06:31:35', '2026-01-16 06:31:35'),
(53, '5760 Referral & Retention Programs', '885862', '5760 Referral & Retention Programs', 100000.00, 1, 1, 8, 'admin', NULL, '2026-01-16 06:31:59', '2026-01-16 06:31:59'),
(54, '5810 Call Center Expenses', '217479', '5810 Call Center Expenses', 50000.00, 1, 1, 9, 'admin', NULL, '2026-01-16 06:32:40', '2026-01-16 06:32:40'),
(55, '5820 Helpdesk Software', '702415', '5820 Helpdesk Software', 50000.00, 1, 1, 9, 'admin', NULL, '2026-01-16 06:32:56', '2026-01-16 06:32:56'),
(56, '5830 Billing Software Subscription', '952163', '5830 Billing Software Subscription', 50000.00, 1, 1, 9, 'admin', NULL, '2026-01-16 06:33:11', '2026-01-16 06:33:11'),
(57, '5840 Payment Gateway Charges', '614889', '5840 Payment Gateway Charges', 50000.00, 1, 1, 9, 'admin', NULL, '2026-01-16 06:33:27', '2026-01-16 06:33:27'),
(58, '5850 SMS / OTP Costs', '227252', '5850 SMS / OTP Costs', 49999.97, 1, 1, 9, 'admin', NULL, '2026-01-16 06:33:45', '2026-01-16 06:33:45'),
(59, '5860 IVR Systems', '837781', '5860 IVR Systems', 50000.00, 1, 1, 9, 'admin', NULL, '2026-01-16 06:34:00', '2026-01-16 06:34:00'),
(60, '5870 Revenue Assurance / Fraud Tools', '130862', '5870 Revenue Assurance / Fraud Tools', 50000.00, 1, 1, 9, 'admin', NULL, '2026-01-16 06:34:53', '2026-01-16 06:34:53'),
(61, '5910 Legal Fees', '178790', '5910 Legal Fees', 100000.00, 1, 1, 10, 'admin', NULL, '2026-01-16 06:35:17', '2026-01-16 06:35:17'),
(62, '5920 Accounting & Audit Fees', '190874', '5920 Accounting & Audit Fees', 100000.00, 1, 1, 10, 'admin', NULL, '2026-01-16 06:35:47', '2026-01-16 06:35:47'),
(63, '5930 Tax Consultancy Fees', '935880', '5930 Tax Consultancy Fees', 50000.00, 1, 1, 10, 'admin', NULL, '2026-01-16 06:37:54', '2026-01-16 06:37:54'),
(64, '5940 Cybersecurity Audit', '371292', '5940 Cybersecurity Audit', 50000.00, 1, 1, 10, 'admin', 'admin', '2026-01-16 06:38:07', '2026-01-16 06:49:31'),
(65, '5950 Insurance – Equipment', '217063', '5950 Insurance – Equipment', 50000.00, 1, 1, 10, 'admin', 'admin', '2026-01-16 06:38:20', '2026-01-16 06:49:38'),
(66, '5960 Insurance – Liability', '973690', '5960 Insurance – Liability', 50000.00, 1, 1, 10, 'admin', 'admin', '2026-01-16 06:38:34', '2026-01-16 06:49:45'),
(67, '6010 Bank Charges', '863679', '6010 Bank Charges', 100000.00, 1, 1, 11, 'admin', 'admin', '2026-01-16 06:39:28', '2026-01-16 06:49:59'),
(68, '6020 LC & Import Charges', '109598', '6020 LC & Import Charges', 50000.00, 1, 1, 11, 'admin', 'admin', '2026-01-16 06:39:46', '2026-01-16 06:49:53'),
(69, '6030 Interest on Loans', '253673', '6030 Interest on Loans', 50000.00, 1, 1, 11, 'admin', 'admin', '2026-01-16 06:40:20', '2026-01-16 06:50:07'),
(70, '6040 Foreign Exchange Loss', '416609', '6040 Foreign Exchange Loss', 50000.00, 1, 1, 11, 'admin', 'admin', '2026-01-16 06:40:37', '2026-01-16 06:40:47'),
(71, '6050 Credit Risk Provision', '632158', '6050 Credit Risk Provision', 100000.00, 1, 1, 11, 'admin', NULL, '2026-01-16 06:41:01', '2026-01-16 06:41:01'),
(72, '6110 Travel & Transportation', '743037', '6110 Travel & Transportation', 50000.00, 1, 1, 12, 'admin', 'admin', '2026-01-16 06:42:00', '2026-01-16 06:50:17'),
(73, '6120 Vehicle Fuel & Maintenance', '370897', '6120 Vehicle Fuel & Maintenance', 50000.00, 1, 1, 11, 'admin', 'admin', '2026-01-16 06:42:17', '2026-01-16 06:50:23'),
(74, '6130 Bad Debts Written Off', '162914', '6130 Bad Debts Written Off', 100000.00, 1, 1, 12, 'admin', NULL, '2026-01-16 06:42:58', '2026-01-16 06:42:58'),
(75, '6140 Obsolete Equipment Write-off', '529671', '6140 Obsolete Equipment Write-off', 100000.00, 1, 1, 12, 'admin', NULL, '2026-01-16 06:43:34', '2026-01-16 06:43:34'),
(76, '6150 Disaster Recovery Expenses', '355137', '6150 Disaster Recovery Expenses', 50000.00, 1, 1, 12, 'admin', 'admin', '2026-01-16 06:43:48', '2026-01-16 06:50:29'),
(77, '6160 Business Continuity Planning', '120479', '6160 Business Continuity Planning', 100000.00, 1, 1, 12, 'admin', NULL, '2026-01-16 06:44:08', '2026-01-16 06:44:08'),
(78, '6210 Depreciation – Network Equipment', '173761', '6210 Depreciation – Network Equipment', 250000.00, 1, 1, 13, 'admin', 'admin', '2026-01-16 06:48:19', '2026-01-16 06:50:44'),
(79, '6220 Depreciation – Fiber Infrastructure', '265126', '6220 Depreciation – Fiber Infrastructure', 250000.00, 1, 1, 13, 'admin', 'admin', '2026-01-16 06:48:34', '2026-01-16 06:50:36'),
(80, '6230 Depreciation – Office Equipment', '577104', '6230 Depreciation – Office Equipment', 250000.00, 1, 1, 13, 'admin', NULL, '2026-01-16 06:48:49', '2026-01-16 06:48:49'),
(81, '6240 Amortization – Software & Licenses', '578409', '6240 Amortization – Software & Licenses', 250000.00, 1, 1, 13, 'admin', NULL, '2026-01-16 06:51:11', '2026-01-16 06:51:11');

-- --------------------------------------------------------

--
-- Table structure for table `ftp_servers`
--

CREATE TABLE `ftp_servers` (
  `id` int NOT NULL,
  `serverName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `serverLink` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Active',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ftp_servers`
--

INSERT INTO `ftp_servers` (`id`, `serverName`, `serverLink`, `description`, `status`, `createdAt`, `updatedAt`) VALUES
(4, 'Crazy CTG', 'https://crazyctg.com/', 'Crazy CTG', 'Active', '2026-01-10 18:07:03', '2026-01-10 18:07:03'),
(5, 'DFlix', 'https://dflix.discoveryftp.net/m', 'DFlix', 'Active', '2026-01-10 18:07:22', '2026-01-10 18:07:22'),
(6, 'Movie Server', 'https://ftp.com.bd/movieserver.html', 'Movie Server', 'Active', '2026-01-10 18:08:50', '2026-01-10 18:08:50'),
(7, 'Dhaka Flix', 'https://172.16.50.4/', 'Dhaka Flix', 'Active', '2026-01-10 18:09:13', '2026-01-10 18:09:13'),
(8, 'FTP BD', 'https://ftpbd.net/', 'FTP BD', 'Active', '2026-01-10 18:09:40', '2026-01-10 18:09:40'),
(9, 'IP TV', 'https://172.16.14.1/', 'IP TV', 'Active', '2026-01-10 18:11:19', '2026-01-10 18:11:19'),
(10, 'Live TV', 'https://redforce.live/', 'Live TV', 'Active', '2026-01-10 18:11:34', '2026-01-10 18:11:34');

-- --------------------------------------------------------

--
-- Table structure for table `job_categories`
--

CREATE TABLE `job_categories` (
  `id` int NOT NULL,
  `categoryName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `categoryDetails` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Active',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `job_categories`
--

INSERT INTO `job_categories` (`id`, `categoryName`, `categoryDetails`, `status`, `createdAt`, `updatedAt`) VALUES
(2, 'Managing Partner', 'Managing Partner', 'Active', '2026-01-10 18:16:17', '2026-01-10 18:16:17'),
(3, 'Managing Director', 'Managing Director', 'Active', '2026-01-10 18:16:26', '2026-01-10 18:16:26'),
(4, 'Manager', 'Manager', 'Active', '2026-01-10 18:16:41', '2026-01-10 18:16:41'),
(5, 'Operations Manager', 'Operations Manager', 'Active', '2026-01-10 18:16:44', '2026-01-10 18:16:44'),
(6, 'Network In-Charge', 'Network In-Charge', 'Active', '2026-01-10 18:17:00', '2026-01-10 18:17:00'),
(7, 'Senior Network Engineer', 'Senior Network Engineer (Core / Routing)', 'Active', '2026-01-10 18:17:13', '2026-01-10 18:17:13'),
(8, 'Network Engineer', 'Network Engineer (Access / Distribution)', 'Active', '2026-01-10 18:17:24', '2026-01-10 18:17:24'),
(9, 'NOC Engineer', 'NOC Engineer', 'Active', '2026-01-10 18:17:35', '2026-01-10 18:17:35'),
(10, 'System & Server Administrator', 'System & Server Administrator', 'Active', '2026-01-10 18:17:43', '2026-01-10 18:17:43'),
(11, 'Network Support Engineer', 'Network Support Engineer', 'Active', '2026-01-10 18:17:50', '2026-01-10 18:17:50'),
(12, 'Field Operations Supervisor', 'Field Operations Supervisor', 'Active', '2026-01-10 18:17:59', '2026-01-10 18:17:59'),
(13, 'Fiber Technician (FTTH)', 'Fiber Technician (FTTH)', 'Active', '2026-01-10 18:18:05', '2026-01-10 18:18:05'),
(14, 'Splicing Technician', 'Splicing Technician', 'Active', '2026-01-10 18:18:13', '2026-01-10 18:18:13'),
(15, 'Installation & Service Technician', 'Installation & Service Technician', 'Active', '2026-01-10 18:18:19', '2026-01-10 18:18:19'),
(16, 'Maintenance Technician', 'Maintenance Technician', 'Active', '2026-01-10 18:18:26', '2026-01-10 18:18:26'),
(17, 'Customer Support Supervisor', 'Customer Support Supervisor', 'Active', '2026-01-10 18:18:39', '2026-01-10 18:18:39'),
(18, 'Customer Care Executive', 'Customer Care Executive', 'Active', '2026-01-10 18:18:45', '2026-01-10 18:18:45'),
(19, 'Technical Support Executive', 'Technical Support Executive (L1)', 'Active', '2026-01-10 18:18:55', '2026-01-10 18:18:55'),
(20, 'Complaint & Service Ticket Officer', 'Complaint & Service Ticket Officer', 'Active', '2026-01-10 18:19:02', '2026-01-10 18:19:02'),
(21, 'Sales & Marketing Executive', 'Sales & Marketing Executive', 'Active', '2026-01-10 18:19:10', '2026-01-10 18:19:10'),
(22, 'Local Area / Zone Sales Officer', 'Local Area / Zone Sales Officer', 'Active', '2026-01-10 18:19:21', '2026-01-10 18:19:21'),
(23, 'Corporate / SME Sales Executive', 'Corporate / SME Sales Executive', 'Active', '2026-01-10 18:19:27', '2026-01-10 18:19:27'),
(24, 'Dealer / Agent Coordinator', 'Dealer / Agent Coordinator', 'Active', '2026-01-10 18:19:36', '2026-01-10 18:19:36'),
(25, 'Digital Marketing Executive', 'Digital Marketing Executive', 'Active', '2026-01-10 18:19:45', '2026-01-10 18:19:45'),
(26, 'Accounts & Finance Officer', 'Accounts & Finance Officer', 'Active', '2026-01-10 18:19:52', '2026-01-10 18:19:52'),
(27, 'Assistant Accountant', 'Assistant Accountant', 'Active', '2026-01-10 18:20:00', '2026-01-10 18:20:00'),
(28, 'Billing Officer', 'Billing Officer', 'Active', '2026-01-10 18:20:05', '2026-01-10 18:20:05'),
(29, 'Collection Executive', 'Collection Executive', 'Active', '2026-01-10 18:20:13', '2026-01-10 18:20:13'),
(30, 'Admin & HR Officer', 'Admin & HR Officer', 'Active', '2026-01-10 18:20:20', '2026-01-10 18:20:20'),
(31, 'Office Executive', 'Office Executive', 'Active', '2026-01-10 18:20:28', '2026-01-10 18:20:28'),
(32, 'Purchase & Procurement Officer', 'Purchase & Procurement Officer', 'Active', '2026-01-10 18:20:37', '2026-01-10 18:20:37'),
(33, 'Inventory Officer', 'Inventory Officer', 'Active', '2026-01-10 18:20:53', '2026-01-10 18:20:53'),
(34, 'Asset & Equipment Custodian', 'Asset & Equipment Custodian', 'Active', '2026-01-10 18:21:01', '2026-01-10 18:21:01'),
(35, 'Area In-Charge', 'Area In-Charge', 'Active', '2026-01-10 18:21:09', '2026-01-10 18:21:09'),
(36, 'Zone Technical Supervisor', 'Zone Technical Supervisor', 'Active', '2026-01-10 18:21:16', '2026-01-10 18:21:16'),
(37, 'Zone Sales Supervisor', 'Zone Sales Supervisor', 'Active', '2026-01-10 18:21:24', '2026-01-10 18:21:24'),
(38, 'Sub-Dealer Coordinator', 'Sub-Dealer Coordinator', 'Active', '2026-01-10 18:21:35', '2026-01-10 18:21:35'),
(39, 'Office Assistant', 'Office Assistant', 'Active', '2026-01-10 18:21:44', '2026-01-10 18:21:44'),
(40, 'Security Guard', 'Security Guard', 'Active', '2026-01-10 18:21:53', '2026-01-10 18:21:53'),
(41, 'Proprietor', 'Proprietor', 'Active', '2026-01-12 07:53:44', '2026-01-12 07:53:44'),
(42, 'Housewife', 'Housewife', 'Active', '2026-01-12 14:31:20', '2026-01-12 14:31:20'),
(43, 'Student', 'Student', 'Active', '2026-01-12 14:31:35', '2026-01-12 14:31:35'),
(44, 'Private Service', 'Private Service', 'Active', '2026-01-12 14:44:57', '2026-01-12 14:44:57'),
(45, 'Government service', 'Government service', 'Active', '2026-01-12 14:45:02', '2026-01-12 14:45:02'),
(46, 'Principal', 'Principal', 'Active', '2026-01-12 15:20:45', '2026-01-12 15:20:45'),
(47, 'Business', 'Business', 'Active', '2026-01-12 16:42:32', '2026-01-12 16:42:32');

-- --------------------------------------------------------

--
-- Table structure for table `packages`
--

CREATE TABLE `packages` (
  `id` int NOT NULL,
  `packageName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `packageBandwidth` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `packagePrice` decimal(10,2) NOT NULL,
  `packageDetails` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `packageFeatures` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `packageType` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Residential',
  `duration` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Monthly',
  `downloadSpeed` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `uploadSpeed` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `dataLimit` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'Unlimited',
  `installationFee` decimal(10,2) DEFAULT '0.00',
  `discount` decimal(10,2) DEFAULT '0.00',
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Active',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `packages`
--

INSERT INTO `packages` (`id`, `packageName`, `packageBandwidth`, `packagePrice`, `packageDetails`, `packageFeatures`, `packageType`, `duration`, `downloadSpeed`, `uploadSpeed`, `dataLimit`, `installationFee`, `discount`, `status`, `createdAt`, `updatedAt`) VALUES
(3, '10 Mbps', '10 Mbps', 350.00, '', '24/7 Support', 'Residential', 'Monthly', '10 Mbps', '10 Mbps', 'Unlimited', 500.00, 0.00, 'Active', '2026-01-10 18:25:46', '2026-01-10 18:25:46'),
(4, '15 Mbps', '15Mbps', 430.00, '', '24/7 Support', 'Residential', 'Monthly', '15Mbps', '15Mbps', 'Unlimited', 500.00, 0.00, 'Active', '2026-01-10 18:26:23', '2026-01-10 18:26:48'),
(5, '20 Mbps', '20 Mbps', 500.00, '', '24/7 Support', 'Residential', 'Monthly', '20 Mbps', '20 Mbps', 'Unlimited', 500.00, 0.00, 'Active', '2026-01-10 18:27:17', '2026-01-10 18:27:17');

-- --------------------------------------------------------

--
-- Table structure for table `reminders`
--

CREATE TABLE `reminders` (
  `id` int NOT NULL,
  `reminderId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `customerId` int NOT NULL,
  `customerName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `customerPhone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `customerEmail` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `serviceType` enum('Internet','TV','Phone','Bundle','Installation','Maintenance','Other') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Internet',
  `packageName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `amountDue` decimal(10,2) NOT NULL,
  `dueDate` datetime NOT NULL,
  `reminderType` enum('Payment Due','Payment Overdue','Service Renewal','Contract Expiry','Special Offer','Maintenance Reminder','Custom') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Payment Due',
  `reminderMethod` enum('SMS','Email','Email & System','System Only') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'SMS',
  `message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `status` enum('Pending','Sent','Failed','Cancelled') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Pending',
  `scheduledAt` datetime NOT NULL,
  `sentAt` datetime DEFAULT NULL,
  `priority` enum('Low','Medium','High','Urgent') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Medium',
  `retryCount` int NOT NULL DEFAULT '0',
  `maxRetries` int NOT NULL DEFAULT '3',
  `responseData` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `isRecurring` tinyint(1) NOT NULL DEFAULT '0',
  `recurrencePattern` enum('Daily','Weekly','Monthly','Yearly','Custom') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `nextReminderDate` datetime DEFAULT NULL,
  `createdBy` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'admin',
  `updatedBy` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reminders`
--

INSERT INTO `reminders` (`id`, `reminderId`, `customerId`, `customerName`, `customerPhone`, `customerEmail`, `serviceType`, `packageName`, `amountDue`, `dueDate`, `reminderType`, `reminderMethod`, `message`, `status`, `scheduledAt`, `sentAt`, `priority`, `retryCount`, `maxRetries`, `responseData`, `notes`, `isRecurring`, `recurrencePattern`, `nextReminderDate`, `createdBy`, `updatedBy`, `createdAt`, `updatedAt`) VALUES
(14, 'REM1768546949437841', 58, 'Md Aminul Islam ', '01711266326', 'aminul@gmail.com', 'Internet', '10 Mbps - 10 Mbps (Price: 350.00/- BDT)', 500.00, '2026-01-31 00:00:00', 'Payment Due', 'Email & System', 'Dear Md Aminul Islam , your payment of BDT 50.00 for 10 Mbps - 10 Mbps (Price: 350.00/- BDT) is due on 1/31/2026. Please make payment to avoid service interruption.', 'Pending', '2026-01-16 06:53:00', NULL, 'High', 0, 3, NULL, 'Dear CLient, Please pay January Due Internet bill by 31/01/2026. Thanks. - Ring Tel', 0, 'Monthly', NULL, 'admin', NULL, '2026-01-16 07:02:29', '2026-01-16 07:02:29');

-- --------------------------------------------------------

--
-- Table structure for table `role-permissions`
--

CREATE TABLE `role-permissions` (
  `id` int NOT NULL,
  `roleName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `permissions` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `salaries`
--

CREATE TABLE `salaries` (
  `id` int NOT NULL,
  `employeeId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `employeeName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `department` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `designation` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `salaryMonth` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `salaryYear` int DEFAULT NULL,
  `basicSalary` decimal(10,2) NOT NULL DEFAULT '0.00',
  `houseRent` decimal(10,2) NOT NULL DEFAULT '0.00',
  `medicalAllowance` decimal(10,2) NOT NULL DEFAULT '0.00',
  `travelAllowance` decimal(10,2) NOT NULL DEFAULT '0.00',
  `otherAllowances` decimal(10,2) NOT NULL DEFAULT '0.00',
  `providentFund` decimal(10,2) NOT NULL DEFAULT '0.00',
  `taxDeduction` decimal(10,2) NOT NULL DEFAULT '0.00',
  `otherDeductions` decimal(10,2) NOT NULL DEFAULT '0.00',
  `totalWorkingDays` int NOT NULL DEFAULT '26',
  `presentDays` decimal(5,2) NOT NULL DEFAULT '0.00',
  `absentDays` int NOT NULL DEFAULT '0',
  `paidLeaves` int NOT NULL DEFAULT '0',
  `unpaidLeaves` int NOT NULL DEFAULT '0',
  `overtimeHours` decimal(5,2) NOT NULL DEFAULT '0.00',
  `overtimeRate` decimal(10,2) NOT NULL DEFAULT '200.00',
  `overtimeAmount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `performanceBonus` decimal(10,2) NOT NULL DEFAULT '0.00',
  `festivalBonus` decimal(10,2) NOT NULL DEFAULT '0.00',
  `otherBonuses` decimal(10,2) NOT NULL DEFAULT '0.00',
  `grossSalary` decimal(10,2) NOT NULL DEFAULT '0.00',
  `totalDeductions` decimal(10,2) NOT NULL DEFAULT '0.00',
  `netSalary` decimal(10,2) NOT NULL DEFAULT '0.00',
  `paymentStatus` enum('pending','paid','failed','cancelled') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'pending',
  `paymentDate` datetime DEFAULT NULL,
  `paymentMethod` enum('bank','cash','mobile_banking') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'bank',
  `bankAccount` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '',
  `salaryId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `createdBy` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'admin',
  `note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `salaries`
--

INSERT INTO `salaries` (`id`, `employeeId`, `employeeName`, `department`, `designation`, `salaryMonth`, `salaryYear`, `basicSalary`, `houseRent`, `medicalAllowance`, `travelAllowance`, `otherAllowances`, `providentFund`, `taxDeduction`, `otherDeductions`, `totalWorkingDays`, `presentDays`, `absentDays`, `paidLeaves`, `unpaidLeaves`, `overtimeHours`, `overtimeRate`, `overtimeAmount`, `performanceBonus`, `festivalBonus`, `otherBonuses`, `grossSalary`, `totalDeductions`, `netSalary`, `paymentStatus`, `paymentDate`, `paymentMethod`, `bankAccount`, `salaryId`, `createdBy`, `note`, `createdAt`, `updatedAt`) VALUES
(13, 'shamim9489@ringtel', 'Shamim Rony', 'Manager', 'manager', NULL, NULL, 5000.00, 0.00, 0.00, 500.00, 0.00, 0.00, 0.00, 0.00, 26, 0.00, 0, 0, 0, 0.00, 200.00, 0.00, 0.00, 2500.00, 0.00, 0.00, 0.00, 8000.00, 'pending', NULL, 'mobile_banking', '01788111105', 'SAL000001', 'admin', '', '2026-01-10 18:43:13', '2026-01-10 18:43:13');

-- --------------------------------------------------------

--
-- Table structure for table `salary_assignments`
--

CREATE TABLE `salary_assignments` (
  `id` int NOT NULL,
  `salaryId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `employeeId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `employeeName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `department` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `designation` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `salaryMonth` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `salaryYear` int NOT NULL,
  `basicSalary` float NOT NULL DEFAULT '0',
  `houseRent` float NOT NULL DEFAULT '0',
  `medicalAllowance` float NOT NULL DEFAULT '0',
  `travelAllowance` float NOT NULL DEFAULT '0',
  `otherAllowances` float NOT NULL DEFAULT '0',
  `providentFund` float NOT NULL DEFAULT '0',
  `taxDeduction` float NOT NULL DEFAULT '0',
  `otherDeductions` float NOT NULL DEFAULT '0',
  `totalWorkingDays` int NOT NULL,
  `presentDays` int NOT NULL,
  `absentDays` int NOT NULL,
  `paidLeaves` int NOT NULL DEFAULT '0',
  `unpaidLeaves` int NOT NULL DEFAULT '0',
  `overtimeHours` float NOT NULL DEFAULT '0',
  `overtimeRate` float NOT NULL DEFAULT '0',
  `overtimeAmount` float NOT NULL DEFAULT '0',
  `performanceBonus` float NOT NULL DEFAULT '0',
  `festivalBonus` float NOT NULL DEFAULT '0',
  `otherBonuses` float NOT NULL DEFAULT '0',
  `grossSalary` float DEFAULT NULL,
  `totalDeductions` float DEFAULT NULL,
  `netSalary` float DEFAULT NULL,
  `paymentStatus` enum('pending','paid','failed','cancelled') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'pending',
  `paymentDate` datetime DEFAULT NULL,
  `paymentMethod` enum('bank','cash','mobile_banking') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `bankAccount` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `createdBy` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tickets`
--

CREATE TABLE `tickets` (
  `id` int NOT NULL,
  `ticketMadeBy` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `ticketId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'pending',
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `assignedTo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int NOT NULL,
  `userId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `trxId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `amount` float NOT NULL,
  `billingMonth` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `billingYear` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `phoneNumber` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'pending',
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `approvedBy` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'User ID or name of the person who approved this transaction',
  `approvedAt` datetime DEFAULT NULL COMMENT 'Timestamp when the transaction was approved',
  `approvalRemark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Additional remarks from approver',
  `rejectedBy` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `rejectedAt` datetime DEFAULT NULL,
  `rejectionReason` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `userId`, `trxId`, `amount`, `billingMonth`, `billingYear`, `phoneNumber`, `status`, `remark`, `approvedBy`, `approvedAt`, `approvalRemark`, `rejectedBy`, `rejectedAt`, `rejectionReason`, `createdAt`, `updatedAt`) VALUES
(2, '35', 'fghdfsg', 600, 'August', '2026', 'fghfgh', 'pending', 'Payment for August 2026', NULL, NULL, NULL, NULL, NULL, NULL, '2026-01-15 20:20:38', '2026-01-15 20:20:38');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `mobileNumber` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `dateOfBirth` date NOT NULL,
  `gender` enum('male','female','other') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `role` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'user',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `zones`
--

CREATE TABLE `zones` (
  `id` int NOT NULL,
  `zoneName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `city` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `zoneDetails` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Active',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `zones`
--

INSERT INTO `zones` (`id`, `zoneName`, `city`, `zoneDetails`, `status`, `createdAt`, `updatedAt`) VALUES
(2, 'Wapda Road', 'Savar', 'From Mukti Pharmacy to Legend College', 'Active', '2026-01-10 17:53:50', '2026-01-10 17:54:18'),
(3, 'Banpukur', 'Savar', 'From Angali Jewelers to Banpukur Mosque', 'Active', '2026-01-10 17:56:20', '2026-01-10 17:56:20'),
(4, 'Still Goli', 'Savar', 'From Dipi Madam Home to behind Shingair Press', 'Active', '2026-01-10 17:57:00', '2026-01-10 17:57:00'),
(5, 'Bazar Road', 'Savar', 'From Palli Market to Nama Bazar', 'Active', '2026-01-10 17:57:36', '2026-01-10 17:57:36'),
(6, 'Dim Potti', 'Savar', 'From Habib Cosmetics Shop to Daruchini Hotel', 'Active', '2026-01-10 17:59:11', '2026-01-10 17:59:11'),
(7, 'Razzak Plaza', 'Savar', 'From Mollah Hotel to Shiraj Market', 'Active', '2026-01-10 17:59:58', '2026-01-10 17:59:58'),
(8, 'Hobi Plaza', 'Savar', 'Hobi Plaza Market', 'Active', '2026-01-10 18:00:26', '2026-01-10 18:00:26'),
(9, 'Nasir Plaza', 'Savar', 'Nasir Plaza Market\n', 'Active', '2026-01-10 18:00:47', '2026-01-10 18:00:47'),
(10, 'Shiraj Market', 'Savar', 'Shiraj Market', 'Active', '2026-01-12 16:47:15', '2026-01-12 16:47:15');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `authority-informations`
--
ALTER TABLE `authority-informations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `photo` (`photo`),
  ADD UNIQUE KEY `userId` (`userId`);

--
-- Indexes for table `bank_accounts`
--
ALTER TABLE `bank_accounts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `accountNumber` (`accountNumber`),
  ADD UNIQUE KEY `bank_accounts_account_number` (`accountNumber`),
  ADD KEY `bank_accounts_bank_name_branch_id` (`bankName`,`branchId`),
  ADD KEY `bank_accounts_account_holder_name` (`accountHolderName`),
  ADD KEY `bank_accounts_account_type_is_active` (`accountType`,`isActive`),
  ADD KEY `bank_accounts_created_at` (`createdAt`);

--
-- Indexes for table `benefits`
--
ALTER TABLE `benefits`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `benefits_type_is_active` (`type`,`isActive`),
  ADD KEY `benefits_category` (`category`),
  ADD KEY `benefits_start_date_end_date` (`startDate`,`endDate`);

--
-- Indexes for table `chatmessages`
--
ALTER TABLE `chatmessages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `messageId` (`messageId`),
  ADD KEY `chatmessages_chat_id_created_at` (`chatId`,`createdAt`),
  ADD KEY `chatmessages_sender_id` (`senderId`),
  ADD KEY `chatmessages_status` (`status`);

--
-- Indexes for table `chatparticipants`
--
ALTER TABLE `chatparticipants`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `chatparticipants_chat_id_user_id` (`chatId`,`userId`),
  ADD KEY `chatparticipants_user_id` (`userId`),
  ADD KEY `chatparticipants_last_seen_at` (`lastSeenAt`);

--
-- Indexes for table `chats`
--
ALTER TABLE `chats`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `chatId` (`chatId`),
  ADD KEY `chats_status` (`status`),
  ADD KEY `chats_created_by` (`createdBy`),
  ADD KEY `chats_assigned_to` (`assignedTo`),
  ADD KEY `chats_last_message_at` (`lastMessageAt`),
  ADD KEY `chats_priority` (`priority`);

--
-- Indexes for table `cities`
--
ALTER TABLE `cities`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `cityName` (`cityName`);

--
-- Indexes for table `client-informations`
--
ALTER TABLE `client-informations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `userId` (`userId`);

--
-- Indexes for table `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `emails`
--
ALTER TABLE `emails`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `appName` (`appName`);

--
-- Indexes for table `employeeattendances`
--
ALTER TABLE `employeeattendances`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `employeeattendances_employee_id_date` (`employeeId`,`date`);

--
-- Indexes for table `employee_bill_collection`
--
ALTER TABLE `employee_bill_collection`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `receiptNumber` (`receiptNumber`),
  ADD UNIQUE KEY `employee_bill_collection_receipt_number` (`receiptNumber`),
  ADD KEY `employee_bill_collection_client_id_billing_month` (`clientId`,`billingMonth`),
  ADD KEY `employee_bill_collection_employee_id` (`employeeId`),
  ADD KEY `employee_bill_collection_collection_date` (`collectionDate`);

--
-- Indexes for table `employee_salaries`
--
ALTER TABLE `employee_salaries`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `employee_salaries_employee_id_salary_month_salary_year` (`employeeId`,`salaryMonth`,`salaryYear`),
  ADD UNIQUE KEY `employee_salaries_employee_id` (`employeeId`),
  ADD UNIQUE KEY `salaryId` (`salaryId`),
  ADD KEY `employee_salaries_payment_status` (`paymentStatus`),
  ADD KEY `employee_salaries_salary_month` (`salaryMonth`),
  ADD KEY `employee_salaries_salary_year` (`salaryYear`);

--
-- Indexes for table `expenses`
--
ALTER TABLE `expenses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `expenseCode` (`expenseCode`),
  ADD UNIQUE KEY `expenses_expense_code` (`expenseCode`),
  ADD KEY `expenses_expense_category_id` (`expenseCategoryId`),
  ADD KEY `expenses_expense_subcategory_id` (`expenseSubcategoryId`),
  ADD KEY `expenses_date` (`date`),
  ADD KEY `expenses_status_payment_status` (`status`,`paymentStatus`),
  ADD KEY `expenses_is_active` (`isActive`),
  ADD KEY `expenses_created_at` (`createdAt`);

--
-- Indexes for table `expense_categories`
--
ALTER TABLE `expense_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `categoryCode` (`categoryCode`),
  ADD UNIQUE KEY `expense_categories_category_code` (`categoryCode`),
  ADD KEY `expense_categories_category_name` (`categoryName`),
  ADD KEY `expense_categories_is_active` (`isActive`),
  ADD KEY `expense_categories_requires_approval` (`requiresApproval`),
  ADD KEY `expense_categories_created_at` (`createdAt`);

--
-- Indexes for table `expense_payments`
--
ALTER TABLE `expense_payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `expenseId` (`expenseId`),
  ADD KEY `accountId` (`accountId`);

--
-- Indexes for table `expense_sub_categories`
--
ALTER TABLE `expense_sub_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `subCategoryCode` (`subCategoryCode`),
  ADD UNIQUE KEY `expense_sub_categories_sub_category_code` (`subCategoryCode`),
  ADD KEY `expense_sub_categories_sub_category_name` (`subCategoryName`),
  ADD KEY `expense_sub_categories_category_id` (`categoryId`),
  ADD KEY `expense_sub_categories_is_active` (`isActive`),
  ADD KEY `expense_sub_categories_requires_approval` (`requiresApproval`),
  ADD KEY `expense_sub_categories_created_at` (`createdAt`);

--
-- Indexes for table `ftp_servers`
--
ALTER TABLE `ftp_servers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `serverName` (`serverName`);

--
-- Indexes for table `job_categories`
--
ALTER TABLE `job_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `categoryName` (`categoryName`);

--
-- Indexes for table `packages`
--
ALTER TABLE `packages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `reminders`
--
ALTER TABLE `reminders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `reminderId` (`reminderId`),
  ADD KEY `reminders_customer_id_status` (`customerId`,`status`),
  ADD KEY `reminders_due_date` (`dueDate`),
  ADD KEY `reminders_scheduled_at_status` (`scheduledAt`,`status`),
  ADD KEY `reminders_reminder_type` (`reminderType`);

--
-- Indexes for table `role-permissions`
--
ALTER TABLE `role-permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `roleName` (`roleName`);

--
-- Indexes for table `salaries`
--
ALTER TABLE `salaries`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `employeeId` (`employeeId`),
  ADD UNIQUE KEY `salaryId` (`salaryId`),
  ADD UNIQUE KEY `salaries_employee_id` (`employeeId`),
  ADD KEY `salaries_payment_status` (`paymentStatus`),
  ADD KEY `salaries_department` (`department`),
  ADD KEY `salaries_designation` (`designation`),
  ADD KEY `salaries_salary_id` (`salaryId`),
  ADD KEY `salaries_salary_month_salary_year` (`salaryMonth`,`salaryYear`);

--
-- Indexes for table `salary_assignments`
--
ALTER TABLE `salary_assignments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `salaryId` (`salaryId`);

--
-- Indexes for table `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ticketId` (`ticketId`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `trxId` (`trxId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `zones`
--
ALTER TABLE `zones`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `zoneName` (`zoneName`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `authority-informations`
--
ALTER TABLE `authority-informations`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `bank_accounts`
--
ALTER TABLE `bank_accounts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `benefits`
--
ALTER TABLE `benefits`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `chatmessages`
--
ALTER TABLE `chatmessages`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `chatparticipants`
--
ALTER TABLE `chatparticipants`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `chats`
--
ALTER TABLE `chats`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `cities`
--
ALTER TABLE `cities`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `client-informations`
--
ALTER TABLE `client-informations`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT for table `contacts`
--
ALTER TABLE `contacts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `emails`
--
ALTER TABLE `emails`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `employeeattendances`
--
ALTER TABLE `employeeattendances`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `employee_bill_collection`
--
ALTER TABLE `employee_bill_collection`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `employee_salaries`
--
ALTER TABLE `employee_salaries`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `expenses`
--
ALTER TABLE `expenses`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `expense_categories`
--
ALTER TABLE `expense_categories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `expense_payments`
--
ALTER TABLE `expense_payments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `expense_sub_categories`
--
ALTER TABLE `expense_sub_categories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=82;

--
-- AUTO_INCREMENT for table `ftp_servers`
--
ALTER TABLE `ftp_servers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `job_categories`
--
ALTER TABLE `job_categories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT for table `packages`
--
ALTER TABLE `packages`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `reminders`
--
ALTER TABLE `reminders`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `role-permissions`
--
ALTER TABLE `role-permissions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `salaries`
--
ALTER TABLE `salaries`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `salary_assignments`
--
ALTER TABLE `salary_assignments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `tickets`
--
ALTER TABLE `tickets`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `zones`
--
ALTER TABLE `zones`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `chatmessages`
--
ALTER TABLE `chatmessages`
  ADD CONSTRAINT `chatmessages_ibfk_1` FOREIGN KEY (`chatId`) REFERENCES `chats` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `chatparticipants`
--
ALTER TABLE `chatparticipants`
  ADD CONSTRAINT `chatparticipants_ibfk_1` FOREIGN KEY (`chatId`) REFERENCES `chats` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `employeeattendances`
--
ALTER TABLE `employeeattendances`
  ADD CONSTRAINT `employeeattendances_ibfk_1` FOREIGN KEY (`employeeId`) REFERENCES `authority-informations` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `employee_bill_collection`
--
ALTER TABLE `employee_bill_collection`
  ADD CONSTRAINT `employee_bill_collection_ibfk_1` FOREIGN KEY (`clientId`) REFERENCES `client-informations` (`userId`),
  ADD CONSTRAINT `employee_bill_collection_ibfk_2` FOREIGN KEY (`employeeId`) REFERENCES `authority-informations` (`userId`);

--
-- Constraints for table `employee_salaries`
--
ALTER TABLE `employee_salaries`
  ADD CONSTRAINT `employee_salaries_ibfk_1` FOREIGN KEY (`employeeId`) REFERENCES `authority-informations` (`userId`);

--
-- Constraints for table `expenses`
--
ALTER TABLE `expenses`
  ADD CONSTRAINT `expenses_ibfk_1` FOREIGN KEY (`expenseCategoryId`) REFERENCES `expense_categories` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `expenses_ibfk_2` FOREIGN KEY (`expenseSubcategoryId`) REFERENCES `expense_sub_categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `expense_payments`
--
ALTER TABLE `expense_payments`
  ADD CONSTRAINT `expense_payments_ibfk_1` FOREIGN KEY (`expenseId`) REFERENCES `expenses` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `expense_payments_ibfk_2` FOREIGN KEY (`accountId`) REFERENCES `bank_accounts` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `expense_sub_categories`
--
ALTER TABLE `expense_sub_categories`
  ADD CONSTRAINT `expense_sub_categories_ibfk_1` FOREIGN KEY (`categoryId`) REFERENCES `expense_categories` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `salaries`
--
ALTER TABLE `salaries`
  ADD CONSTRAINT `salaries_ibfk_1` FOREIGN KEY (`employeeId`) REFERENCES `authority-informations` (`userId`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
