-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Feb 19, 2026 at 11:48 AM
-- Server version: 11.4.8-MariaDB-cll-lve
-- PHP Version: 8.4.16

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
  `id` int(11) NOT NULL,
  `address` varchar(255) NOT NULL,
  `age` int(11) NOT NULL,
  `bloodGroup` varchar(255) DEFAULT '',
  `dateOfBirth` datetime NOT NULL,
  `email` varchar(255) NOT NULL,
  `photo` varchar(255) NOT NULL,
  `fatherOrSpouseName` varchar(255) NOT NULL,
  `fullName` varchar(255) NOT NULL,
  `jobCategory` varchar(255) DEFAULT '',
  `jobType` varchar(255) NOT NULL,
  `maritalStatus` varchar(255) NOT NULL,
  `mobileNo` varchar(255) NOT NULL,
  `nidOrPassportNo` varchar(255) NOT NULL,
  `religion` varchar(255) DEFAULT '',
  `role` varchar(255) NOT NULL,
  `sex` varchar(255) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `status` enum('active','inactive','pending') NOT NULL DEFAULT 'pending',
  `baseSalary` decimal(10,2) DEFAULT 0.00,
  `joinedThroughName` varchar(255) NOT NULL,
  `joinedThroughMobileNo` varchar(255) NOT NULL,
  `joinedThroughRelation` varchar(255) NOT NULL,
  `joinedThroughAddress` varchar(255) DEFAULT '',
  `emergencyContactName` varchar(255) NOT NULL,
  `emergencyContactMobileNo` varchar(255) NOT NULL,
  `emergencyContactRelation` varchar(255) NOT NULL,
  `emergencyContactAddress` varchar(255) DEFAULT '',
  `nidPhotoFrontSide` text NOT NULL,
  `nidPhotoBackSide` text NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `authority-informations`
--

INSERT INTO `authority-informations` (`id`, `address`, `age`, `bloodGroup`, `dateOfBirth`, `email`, `photo`, `fatherOrSpouseName`, `fullName`, `jobCategory`, `jobType`, `maritalStatus`, `mobileNo`, `nidOrPassportNo`, `religion`, `role`, `sex`, `userId`, `password`, `status`, `baseSalary`, `joinedThroughName`, `joinedThroughMobileNo`, `joinedThroughRelation`, `joinedThroughAddress`, `emergencyContactName`, `emergencyContactMobileNo`, `emergencyContactRelation`, `emergencyContactAddress`, `nidPhotoFrontSide`, `nidPhotoBackSide`, `createdAt`, `updatedAt`) VALUES
(1, '3/2, Wapda Road, Savar, Dhaka - 1340', 38, 'B+', '1987-09-12 00:00:00', 'shamim.rony@yandex.com', 'https://server.billisp.com/uploads/2e950cf49989fe6b.jpg', 'Tafazzal Hossain', 'Shamim Rony', 'Manager', 'Full Time', 'Unmarried', '01684175551', '00', 'Islam', 'manager', 'Male', 'shamim9489@ringtel', '01684175551', 'active', 5000.00, 'Mahabub Robi', '01689203297', 'Brother', '3/2, Wapda Road, Savar, Dhaka - 1340', 'Mahabub Robi', '01689203297', 'Brother', '3/2, Wapda Road, Savar, Dhaka - 1340', '', '', '2026-01-10 18:31:38', '2026-01-10 18:31:38'),
(2, 'Malancha Market, Savar, Dhaka - 1340', 44, '', '1982-01-21 00:00:00', 'emran@gmail.com', 'https://server.billisp.com/uploads/95e65d71a1b13b72.jpeg', 'N/A', 'Emran Khan', 'Proprietor', 'Full Time', 'Married', '01777180394', '123', 'Islam', 'seller', 'Male', 'emran3183@ringtel', '01777180394', 'active', 0.00, 'Shamim', '01684175551', 'Neighbor', '3/2, Wapda Road, Savar, Dhaka - 1340', 'N/A', 'N/A', 'Other', 'N/A', '', '', '2026-01-22 04:25:26', '2026-01-22 04:25:26'),
(3, '3/2, Wapda Road, Savar, Dhaka - 1340', 28, '', '1997-08-15 00:00:00', 'tanvir.016891@gmail.com', 'https://server.billisp.com/uploads/213652dfce76999c.jpg', 'Md Tafazzal Hossain', 'Md Tanvir Hossan', 'Billing Officer', 'Full Time', 'Unmarried', '01515657935', '1951768595', 'Islam', 'staff', 'Male', 'md9423@ringtel', '01781666692', 'active', 3000.00, 'Shamim', '01684175551', 'Neighbor', '3/2, Wapda Road, Savar, Dhaka - 1340', 'N/A', 'N/A', 'Other', 'N/A', 'https://server.billisp.com/uploads/13652dfce76999cb.jpg', 'https://server.billisp.com/uploads/3652dfce76999cb8.jpg', '2026-01-22 04:47:45', '2026-02-06 12:07:35'),
(4, 'Nasir Plaza, Savar, Dhaka - 1340', 53, '', '1972-07-09 00:00:00', 'mohanaent2006@gmail.com', 'https://server.billisp.com/uploads/4cdcbafe2df778d8.jpg', 'Md Solaiman', 'Md Mokhlesur Rahman', 'Proprietor', 'Full Time', 'Married', '01911037137', '1002128328', 'Islam', 'seller', 'Male', 'md4633@ringtel', '01911037137', 'active', 0.00, 'Shamim', '01684175551', 'Colleague', '3/2, Wapda Road, Savar, Dhaka - 1340', 'N/A', 'N/A', 'Other', 'N/A', 'https://server.billisp.com/uploads/cdcbafe2df778d85.jpg', 'https://server.billisp.com/uploads/dcbafe2df778d85a.jpg', '2026-01-22 08:02:35', '2026-01-22 08:02:35');

-- --------------------------------------------------------

--
-- Table structure for table `bank_accounts`
--

CREATE TABLE `bank_accounts` (
  `id` int(11) NOT NULL,
  `bankName` varchar(255) NOT NULL,
  `accountHolderName` varchar(255) NOT NULL,
  `accountName` varchar(255) NOT NULL,
  `accountNumber` varchar(255) NOT NULL,
  `accountType` enum('Bank','MobileBanking','AgentBanking','DigitalWallet','Other') NOT NULL DEFAULT 'Bank',
  `branchId` int(11) DEFAULT NULL,
  `branchName` varchar(255) DEFAULT NULL,
  `routingNumber` varchar(255) DEFAULT NULL,
  `swiftCode` varchar(255) DEFAULT NULL,
  `iban` varchar(255) DEFAULT NULL,
  `openingBalance` decimal(15,2) NOT NULL DEFAULT 0.00,
  `currentBalance` decimal(15,2) NOT NULL DEFAULT 0.00,
  `currency` varchar(255) NOT NULL DEFAULT 'BDT',
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `isPrimary` tinyint(1) NOT NULL DEFAULT 0,
  `lastTransactionDate` datetime DEFAULT NULL,
  `transactionLimit` decimal(15,2) DEFAULT NULL,
  `dailyLimit` decimal(15,2) DEFAULT NULL,
  `monthlyLimit` decimal(15,2) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `createdBy` varchar(255) NOT NULL DEFAULT 'admin',
  `updatedBy` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bank_accounts`
--

INSERT INTO `bank_accounts` (`id`, `bankName`, `accountHolderName`, `accountName`, `accountNumber`, `accountType`, `branchId`, `branchName`, `routingNumber`, `swiftCode`, `iban`, `openingBalance`, `currentBalance`, `currency`, `isActive`, `isPrimary`, `lastTransactionDate`, `transactionLimit`, `dailyLimit`, `monthlyLimit`, `notes`, `createdBy`, `updatedBy`, `createdAt`, `updatedAt`) VALUES
(9, 'Bkash', 'Md Shamim Hossan Rony', 'SRS Technology', '01684175551', 'MobileBanking', NULL, '', '', '', '', 10.00, 4410.00, 'BDT', 1, 1, '2026-02-18 14:01:58', NULL, NULL, NULL, '', 'admin', 'admin', '2026-01-22 04:26:59', '2026-02-18 14:01:58'),
(10, 'Hand Cash', 'Md Shamim Hossan Rony', 'Cash In Hand', 'CashInHand', 'Other', NULL, '', '', '', '', 100.00, 13325.00, 'BDT', 1, 0, '2026-02-15 16:11:20', NULL, NULL, NULL, '', 'admin', 'admin', '2026-01-23 07:54:37', '2026-02-15 16:11:20');

-- --------------------------------------------------------

--
-- Table structure for table `benefits`
--

CREATE TABLE `benefits` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `type` enum('Internet Package','Bundle Offer','Promotional Offer','Loyalty Benefit','Seasonal Offer','Corporate Package','Custom Package') NOT NULL,
  `category` enum('Residential','Business','Student','Senior Citizen','Low Income','General') NOT NULL DEFAULT 'General',
  `basePrice` decimal(10,2) NOT NULL,
  `discountPrice` decimal(10,2) DEFAULT NULL,
  `billingCycle` enum('Monthly','Quarterly','Yearly','One-time') NOT NULL DEFAULT 'Monthly',
  `internetSpeed` varchar(255) DEFAULT NULL,
  `dataLimit` varchar(255) DEFAULT NULL,
  `uploadSpeed` varchar(255) DEFAULT NULL,
  `downloadSpeed` varchar(255) DEFAULT NULL,
  `includesTv` tinyint(1) NOT NULL DEFAULT 0,
  `includesPhone` tinyint(1) NOT NULL DEFAULT 0,
  `includesWifi` tinyint(1) NOT NULL DEFAULT 1,
  `tvChannels` int(11) DEFAULT NULL,
  `phoneMinutes` int(11) DEFAULT NULL,
  `contractLength` int(11) DEFAULT NULL,
  `installationFee` decimal(10,2) DEFAULT NULL,
  `equipmentFee` decimal(10,2) DEFAULT NULL,
  `startDate` datetime NOT NULL,
  `endDate` datetime DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `isFeatured` tinyint(1) NOT NULL DEFAULT 0,
  `minContractLength` int(11) DEFAULT NULL,
  `eligibilityCriteria` text DEFAULT NULL,
  `features` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `termsConditions` text DEFAULT NULL,
  `createdBy` varchar(255) NOT NULL DEFAULT 'admin',
  `updatedBy` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `benefits`
--

INSERT INTO `benefits` (`id`, `name`, `description`, `type`, `category`, `basePrice`, `discountPrice`, `billingCycle`, `internetSpeed`, `dataLimit`, `uploadSpeed`, `downloadSpeed`, `includesTv`, `includesPhone`, `includesWifi`, `tvChannels`, `phoneMinutes`, `contractLength`, `installationFee`, `equipmentFee`, `startDate`, `endDate`, `isActive`, `isFeatured`, `minContractLength`, `eligibilityCriteria`, `features`, `termsConditions`, `createdBy`, `updatedBy`, `createdAt`, `updatedAt`) VALUES
(1, 'Valentine Offe', '', 'Bundle Offer', 'General', 1500.00, NULL, 'Monthly', '40mbps', '', '', '', 1, 0, 1, 61, NULL, 12, 0.00, NULL, '2026-02-01 00:00:00', '2026-02-14 00:00:00', 1, 0, NULL, '', '{}', '', 'admin', NULL, '2026-02-01 07:28:57', '2026-02-01 07:28:57');

-- --------------------------------------------------------

--
-- Table structure for table `chatmessages`
--

CREATE TABLE `chatmessages` (
  `id` int(11) NOT NULL,
  `messageId` varchar(255) NOT NULL,
  `chatId` int(11) NOT NULL,
  `senderId` int(11) NOT NULL,
  `senderType` enum('User','Support','System') NOT NULL DEFAULT 'User',
  `messageType` enum('Text','Image','File','Location','System') NOT NULL DEFAULT 'Text',
  `content` text DEFAULT NULL COMMENT 'Text content or caption for media messages',
  `attachments` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Array of file attachments with metadata',
  `readBy` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Array of user IDs who read the message',
  `deliveredTo` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Array of user IDs who received the message',
  `status` enum('Sent','Delivered','Read','Failed') NOT NULL DEFAULT 'Sent',
  `replyTo` int(11) DEFAULT NULL COMMENT 'Reference to replied message ID',
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `isEdited` tinyint(1) DEFAULT 0,
  `editedAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `deletedBy` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chatmessages`
--

INSERT INTO `chatmessages` (`id`, `messageId`, `chatId`, `senderId`, `senderType`, `messageType`, `content`, `attachments`, `readBy`, `deliveredTo`, `status`, `replyTo`, `metadata`, `isEdited`, `editedAt`, `deletedAt`, `deletedBy`, `createdAt`, `updatedAt`) VALUES
(1, 'MSG1769930621006136', 1, 95, 'User', 'Text', 'taka dite parteci na', NULL, '\"[28]\"', '[]', 'Sent', NULL, NULL, 0, NULL, NULL, NULL, '2026-02-01 07:23:41', '2026-02-01 07:23:52'),
(2, 'MSG1769930636359320', 1, 28, 'Support', 'Text', 'ok vai', '[]', '\"[95]\"', '[28]', 'Sent', NULL, NULL, 0, NULL, NULL, NULL, '2026-02-01 07:23:56', '2026-02-01 07:24:12'),
(3, 'MSG1769930640868139', 1, 28, 'Support', 'Text', '23  din pore diyen', '[]', '\"[95]\"', '[28]', 'Sent', NULL, NULL, 0, NULL, NULL, NULL, '2026-02-01 07:24:00', '2026-02-01 07:24:12'),
(4, 'MSG1769931594912385', 1, 95, 'User', 'Text', 'Bill Mistake', '[]', '\"[28]\"', '[95]', 'Sent', NULL, NULL, 0, NULL, NULL, NULL, '2026-02-01 07:39:54', '2026-02-01 07:40:01'),
(5, 'MSG1770215170360503', 1, 28, 'Support', 'Text', 'Ei nen vai.', '[]', '[]', '[28]', 'Sent', NULL, NULL, 0, NULL, NULL, NULL, '2026-02-04 14:26:10', '2026-02-04 14:26:10'),
(6, 'MSG1770215181359167', 1, 28, 'Support', 'Text', 'dfsgfdgsdfg', '[]', '[]', '[28]', 'Sent', NULL, NULL, 0, NULL, NULL, NULL, '2026-02-04 14:26:21', '2026-02-04 14:26:21'),
(7, 'MSG1770217241817772', 2, 94, 'User', 'Text', 'I want to give payment after one month.', NULL, '\"[28]\"', '[]', 'Sent', NULL, NULL, 0, NULL, NULL, NULL, '2026-02-04 15:00:41', '2026-02-04 15:01:06'),
(8, 'MSG1770217276485542', 2, 28, 'Support', 'Text', 'Ok vai thik ache.', '[]', '\"[94]\"', '[28]', 'Sent', NULL, NULL, 0, NULL, NULL, NULL, '2026-02-04 15:01:16', '2026-02-04 15:01:41'),
(9, 'MSG1770217323526160', 2, 94, 'User', 'Text', 'Here you go.', '[]', '\"[28]\"', '[94]', 'Sent', NULL, NULL, 0, NULL, NULL, NULL, '2026-02-04 15:02:03', '2026-02-04 15:02:07'),
(10, 'MSG177021753950266', 2, 94, 'User', 'Text', 'Vai', '[]', '\"[28]\"', '[94]', 'Sent', NULL, NULL, 0, NULL, NULL, NULL, '2026-02-04 15:05:39', '2026-02-04 18:40:59'),
(11, 'MSG1770479614352624', 2, 28, 'Support', 'Text', 'vai koi achen?', '[]', '[]', '[28]', 'Sent', NULL, NULL, 0, NULL, NULL, NULL, '2026-02-07 15:53:34', '2026-02-07 15:53:34');

-- --------------------------------------------------------

--
-- Table structure for table `chatparticipants`
--

CREATE TABLE `chatparticipants` (
  `id` int(11) NOT NULL,
  `chatId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `userType` enum('User','Support','Admin') NOT NULL DEFAULT 'User',
  `role` enum('Member','Admin','Creator') NOT NULL DEFAULT 'Member',
  `joinedAt` datetime DEFAULT NULL,
  `lastSeenAt` datetime DEFAULT NULL,
  `isMuted` tinyint(1) DEFAULT 0,
  `isArchived` tinyint(1) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chatparticipants`
--

INSERT INTO `chatparticipants` (`id`, `chatId`, `userId`, `userType`, `role`, `joinedAt`, `lastSeenAt`, `isMuted`, `isArchived`, `createdAt`, `updatedAt`) VALUES
(1, 1, 95, 'User', 'Creator', '2026-02-01 07:23:41', '2026-02-01 07:49:36', 0, 0, '2026-02-01 07:23:41', '2026-02-01 07:49:36'),
(2, 1, 28, 'Support', 'Admin', '2026-02-01 07:23:52', '2026-02-07 15:52:18', 0, 0, '2026-02-01 07:23:52', '2026-02-07 15:52:18'),
(3, 2, 94, 'User', 'Creator', '2026-02-04 15:00:41', '2026-02-04 15:11:03', 0, 0, '2026-02-04 15:00:41', '2026-02-04 15:11:03'),
(4, 2, 28, 'Support', 'Admin', '2026-02-04 15:01:06', '2026-02-07 15:53:34', 0, 0, '2026-02-04 15:01:06', '2026-02-07 15:53:34');

-- --------------------------------------------------------

--
-- Table structure for table `chats`
--

CREATE TABLE `chats` (
  `id` int(11) NOT NULL,
  `chatId` varchar(255) NOT NULL,
  `title` varchar(255) DEFAULT NULL COMMENT 'Chat title for group chats or custom naming',
  `chatType` enum('User-Support','User-User','Group','Broadcast') NOT NULL DEFAULT 'User-Support',
  `status` enum('Active','Resolved','Closed','Archived') NOT NULL DEFAULT 'Active',
  `priority` enum('Low','Normal','High','Urgent') NOT NULL DEFAULT 'Normal',
  `category` enum('Billing','Technical','Connection','Package','Speed','General','Complaint','Feedback') NOT NULL DEFAULT 'General',
  `lastMessageAt` datetime DEFAULT NULL,
  `createdBy` int(11) NOT NULL COMMENT 'User ID who created the chat',
  `assignedTo` int(11) DEFAULT NULL COMMENT 'Support agent/Admin assigned to handle',
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Additional chat metadata',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chats`
--

INSERT INTO `chats` (`id`, `chatId`, `title`, `chatType`, `status`, `priority`, `category`, `lastMessageAt`, `createdBy`, `assignedTo`, `metadata`, `createdAt`, `updatedAt`) VALUES
(1, 'CHAT1769930620990565', 'fsfsfs', 'User-Support', 'Active', 'Urgent', 'Billing', '2026-02-04 14:26:21', 95, NULL, NULL, '2026-02-01 07:23:40', '2026-02-04 14:26:21'),
(2, 'CHAT1770217241800144', '1 month letter payment', 'User-Support', 'Active', 'High', 'Billing', '2026-02-07 15:53:34', 94, NULL, NULL, '2026-02-04 15:00:41', '2026-02-07 15:53:34');

-- --------------------------------------------------------

--
-- Table structure for table `cities`
--

CREATE TABLE `cities` (
  `id` int(11) NOT NULL,
  `cityName` varchar(255) NOT NULL,
  `cityDetails` text DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
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
  `id` int(11) NOT NULL,
  `customerId` varchar(255) DEFAULT NULL,
  `userId` varchar(255) NOT NULL,
  `fullName` varchar(255) NOT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `fatherOrSpouseName` varchar(255) NOT NULL,
  `dateOfBirth` datetime DEFAULT NULL,
  `age` int(11) NOT NULL,
  `sex` varchar(255) NOT NULL,
  `maritalStatus` varchar(255) NOT NULL,
  `nidOrPassportNo` varchar(255) NOT NULL,
  `isFreeClient` tinyint(1) DEFAULT 0,
  `jobPlaceName` varchar(255) DEFAULT NULL,
  `jobCategory` varchar(255) DEFAULT NULL,
  `jobType` varchar(255) NOT NULL,
  `mobileNo` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `customerType` varchar(255) NOT NULL,
  `package` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `area` varchar(255) NOT NULL,
  `flatAptNo` varchar(255) NOT NULL,
  `houseNo` varchar(255) NOT NULL,
  `roadNo` varchar(255) NOT NULL,
  `landmark` varchar(255) NOT NULL,
  `connectionDetails` text DEFAULT NULL,
  `costForPackage` int(11) DEFAULT NULL,
  `referId` varchar(255) DEFAULT NULL,
  `nidPhotoBackSide` text NOT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'client',
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `nidPhotoFrontSide` text NOT NULL,
  `password` varchar(255) NOT NULL,
  `userAddedBy` text DEFAULT NULL,
  `routerLoginId` varchar(255) DEFAULT NULL,
  `routerLoginPassword` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `client-informations`
--

INSERT INTO `client-informations` (`id`, `customerId`, `userId`, `fullName`, `photo`, `fatherOrSpouseName`, `dateOfBirth`, `age`, `sex`, `maritalStatus`, `nidOrPassportNo`, `isFreeClient`, `jobPlaceName`, `jobCategory`, `jobType`, `mobileNo`, `email`, `customerType`, `package`, `location`, `area`, `flatAptNo`, `houseNo`, `roadNo`, `landmark`, `connectionDetails`, `costForPackage`, `referId`, `nidPhotoBackSide`, `role`, `status`, `nidPhotoFrontSide`, `password`, `userAddedBy`, `routerLoginId`, `routerLoginPassword`, `createdAt`, `updatedAt`) VALUES
(28, '675469854654', 'shamim@ringtel', 'Shamim Rony', NULL, 'Md. Abdul Karim', '1992-05-15 00:00:00', 32, 'Male', 'Married', '1992051523456', 0, 'Green Delta Insurance Company', 'Executive', 'Full Time', '01700000000', 'shamim@gmail.com', 'residential', 'Premium', 'Dhaka', 'Gulshan', '5B', '78', '12', 'Near Gulshan 1 Park', 'Fiber optic, Wi-Fi router included', 850, 'REF789012', '', 'Super-Admin', 'active', '', '01700000000', '', NULL, NULL, '2026-01-10 17:35:20', '2026-01-10 17:35:20'),
(64, '9001', 'ring@ringtel', 'Ring Tel', 'https://server.billisp.com/uploads/5e65d71a1b13b72f.jpg', 'N/A', '1988-01-21 00:00:00', 38, 'Male', 'Unmarried', '0', 1, 'Ring Tel', 'System & Server Administrator', 'Full Time', '01601997701', 'ringtel.isp@gmail.com', 'commercial', '10 Mbps', 'Savar', 'Wapda Road', '2D', '3/2', 'Wapda Road, Savar, Dhaka - 1340', 'N/A', NULL, 350, NULL, '', 'client', 'active', '', '01601997701', NULL, 'rtel@ringtel', '123456', '2026-01-22 04:33:05', '2026-01-23 11:53:19'),
(65, '9002', 'md@ringtel', 'Md Raju Hossain', 'https://server.billisp.com/uploads/d71a1b13b72f5d84.jpg', 'Md Saiful Islam', '2000-11-01 00:00:00', 25, 'Male', 'Married', '2412933083', 0, 'Perfect Furniture Ltd.', 'Sales & Marketing Executive', 'Full Time', '01924772120', 'rajuhossain120k@gmail.com', 'residential', '3', 'Savar', 'Dim Potti', '3A', '3', 'Wapda Road, Savar, Dhaka - 1340', 'N/A', NULL, 500, NULL, 'https://server.billisp.com/uploads/1a1b13b72f5d84ae.jpg', 'client', 'active', 'https://server.billisp.com/uploads/71a1b13b72f5d84a.jpg', '01924772120', NULL, 'raju@ringtel', '123456', '2026-01-22 04:52:35', '2026-01-22 04:52:35'),
(66, '9003', 'md1@ringtel', 'Md Ratan Khan', 'https://server.billisp.com/uploads/a1b13b72f5d84ae0.jpg', 'Md Makbul Khan', '1994-11-13 00:00:00', 31, 'Male', 'Married', '9144901767', 0, 'Super Star Board (Pvt.) Ltd.', 'Sales & Marketing Executive', 'Full Time', '01515252805', 'ratan@gmail.com', 'residential', '10 Mbps', 'Savar', 'Still Goli', '1A', '0', 'Malancha R/A, Savar, Dhaka - 1340', 'N/A', NULL, 700, NULL, 'https://server.billisp.com/uploads/b13b72f5d84ae016.jpg', 'client', 'active', 'https://server.billisp.com/uploads/1b13b72f5d84ae01.jpg', '01515252805', NULL, 'ratan01@ringtel', '123456', '2026-01-22 04:56:41', '2026-02-11 08:42:07'),
(67, '9004', 'md2@ringtel', 'Md Arafat Hossen', 'https://server.billisp.com/uploads/13b72f5d84ae016c.jpg', 'Md Mokter Hossen', '2000-12-02 00:00:00', 25, 'Male', 'Unmarried', '3311039238', 0, 'Anik Electronics', 'Sales & Marketing Executive', 'Full Time', '01704503771', 'arafatrahman01628@gmail.com', 'residential', '3', 'Savar', 'Wapda Road', '3B', '3/2', 'Wapda Road, Savar, Dhaka - 1340', 'N/A', NULL, 500, NULL, 'https://server.billisp.com/uploads/b72f5d84ae016c9d.jpg', 'client', 'active', 'https://server.billisp.com/uploads/3b72f5d84ae016c9.jpg', '01704503771', NULL, 'arafat@ringtel', '123456', '2026-01-22 06:23:18', '2026-01-22 06:23:18'),
(68, '9005', 'md3@ringtel', 'Md Mohidur Rahman', 'https://server.billisp.com/uploads/72f5d84ae016c9d4.jpeg', 'Md Ohidur Rahman', '1971-01-21 00:00:00', 55, 'Male', 'Married', '7787650527', 0, 'Sara Fashion', 'Proprietor', 'Full Time', '01819423812', 'mohidur@gmail.com', 'commercial', '3', 'Savar', 'Dim Potti', '0', 'Shop: 05', 'Malancha Market, Savar, Dhaka - 1340', 'N/A', NULL, 500, NULL, '', 'client', 'active', '', '01819423812', NULL, 'sara@ringtel', '123456', '2026-01-22 06:54:14', '2026-01-22 06:54:14'),
(69, '9006', 'md4@ringtel', 'Md Robin', 'https://server.billisp.com/uploads/2f5d84ae016c9d4c.jpg', 'Md Abdur Razzak', '1994-02-17 00:00:00', 31, 'Male', 'Married', '9161471033', 0, 'Pabna Cosmetics', 'Proprietor', 'Full Time', '01845312323', 'surjaskhan@gmail.com', 'commercial', '3', 'Savar', 'Dim Potti', '0', 'Shop: 02', 'Wapda Road, Savar, Dhaka - 1340', 'N/A', NULL, 500, NULL, 'https://server.billisp.com/uploads/5d84ae016c9d4cdc.jpg', 'client', 'active', 'https://server.billisp.com/uploads/f5d84ae016c9d4cd.jpg', '01845312323', NULL, 'shamim@ringtel', '123456', '2026-01-22 07:03:46', '2026-01-22 07:03:46'),
(70, '9007', 'md5@ringtel', 'Md Reza', 'https://server.billisp.com/uploads/10f6892797b96042.png', 'Momin Farazi', '1994-02-04 00:00:00', 31, 'Male', 'Married', '8712556912', 0, 'Dutch Bangla Bank Plc.', 'Office Assistant', 'Full Time', '01620676740', 'reza@gmail.com', 'residential', '3', 'Savar', 'Wapda Road', '4B', '3/2', 'Wapda Road, Savar, Dhaka - 1340', 'N/A', NULL, 600, NULL, 'https://server.billisp.com/uploads/f6892797b96042e6.png', 'client', 'active', 'https://server.billisp.com/uploads/0f6892797b96042e.jpg', '01620676740', NULL, 'reza@ringtel', '123456', '2026-01-22 07:07:56', '2026-01-24 05:15:59'),
(71, '9008', 'md6@ringtel', 'Md Azaharul Islam', 'https://server.billisp.com/uploads/84ae016c9d4cdcba.jpg', 'Abdur Razzak', '1985-01-01 00:00:00', 41, 'Male', 'Married', '1923867905', 0, NULL, NULL, 'Full Time', '01743787174', 'azahar@gmail.com', 'residential', '3', 'Savar', 'Wapda Road', '5C', '3/2', 'Wapda Road, Savar, Dhaka - 1340', 'N/A', NULL, 500, NULL, 'https://server.billisp.com/uploads/ae016c9d4cdcbafe.jpg', 'client', 'active', 'https://server.billisp.com/uploads/4ae016c9d4cdcbaf.jpg', '01743787174', NULL, 'fifthfloor@ringtel', '123456', '2026-01-22 07:12:11', '2026-01-22 07:12:11'),
(72, '9009', 'fahim@ringtel', 'Fahim Reza', 'https://server.billisp.com/uploads/e016c9d4cdcbafe2.jpeg', 'Nurul Islam', '1990-09-27 00:00:00', 35, 'Male', 'Married', '5988679394', 0, NULL, NULL, 'Full Time', '01670141373', 'frbdcanada@gmail.com', 'residential', '3', 'Savar', 'Wapda Road', '3A', '2/3,', 'Wapda Road, Savar, Dhaka - 1340', 'N/A', NULL, 500, NULL, 'https://server.billisp.com/uploads/16c9d4cdcbafe2df.jpeg', 'client', 'active', 'https://server.billisp.com/uploads/016c9d4cdcbafe2d.jpeg', '01670141373', NULL, 'fahim@ringtel', '123456', '2026-01-22 07:42:07', '2026-01-22 07:42:07'),
(73, '9010', 'md7@ringtel', 'Md Sumon Akon', 'https://server.billisp.com/uploads/6c9d4cdcbafe2df7.jpg', 'Md Kalam Akon', '1992-01-01 00:00:00', 34, 'Male', 'Married', '5574165865', 0, 'Liton Birany House', 'Proprietor', 'Full Time', '01301262600', 'mj4039742@gmail.com', 'commercial', '3', 'Savar', 'Wapda Road', 'Shop: 03 - 06', '3/2,', 'Wapda Road, Savar, Dhaka - 1340', 'N/A', NULL, 500, NULL, 'https://server.billisp.com/uploads/9d4cdcbafe2df778.png', 'client', 'active', 'https://server.billisp.com/uploads/c9d4cdcbafe2df77.png', '01301262600', NULL, 'shop01@ringtel', '123456', '2026-01-22 07:48:36', '2026-01-22 07:48:36'),
(74, '9011', 'hafiza@ringtel', 'Hafiza', 'https://server.billisp.com/uploads/d4cdcbafe2df778d.JPG', 'N/A', '1999-01-21 00:00:00', 27, 'Female', 'Married', '000', 0, NULL, NULL, 'Full Time', '01790844239', 'hafiza@gmail.com', 'residential', '3', 'Savar', 'Dim Potti', '4A', 'N/A', 'Malancha Market, Savar, Dhaka - 1340', 'N/A', NULL, 500, NULL, '', 'client', 'active', '', '01790844239', NULL, 'hafiza@ringtel', '123456', '2026-01-22 07:55:57', '2026-01-22 07:55:57'),
(75, '9012', 'md8@ringtel', 'Md Masudur Rahman Talukder', 'https://server.billisp.com/uploads/cbafe2df778d85a0.png', 'Abdul Jobbar Talukder', '1978-01-01 00:00:00', 48, 'Male', 'Married', '5542947576', 0, 'Saifur\'s', 'Managing Director', 'Full Time', '01713432031', 'masud@gmail.com', 'commercial', '3', 'Savar', 'Razzak Plaza', '2A', 'N/A', 'Nasir Plaza, Savar, Dhaka - 1340', 'N/A', 'N/A', 500, 'N/A', 'https://server.billisp.com/uploads/afe2df778d85a057.jpg', 'client', 'active', 'https://server.billisp.com/uploads/bafe2df778d85a05.jpg', '01713432031', 'mohanaent2006@gmail.com', 'masud@ringtel', '123456', '2026-01-22 08:07:31', '2026-01-22 08:10:52'),
(76, '9013', 'md9@ringtel', 'Md Asik Parvej', 'https://server.billisp.com/uploads/fe2df778d85a0579.JPG', 'Idris Munshi', '1999-02-11 00:00:00', 26, 'Male', 'Married', '8267568049', 0, 'Ekota Cosmetics', 'Proprietor', 'Full Time', '01910035661', 'mk9772234@gmail.com', 'commercial', '3', 'Savar', 'Wapda Road', 'Shop: 19', '3/2,', 'Wapda Road, Savar, Dhaka - 1340', 'N/A', NULL, 500, NULL, 'https://server.billisp.com/uploads/2df778d85a05792a.jpg', 'client', 'active', 'https://server.billisp.com/uploads/e2df778d85a05792.jpg', '01910035661', NULL, 'shop02@ringtel', '123456', '2026-01-23 05:28:15', '2026-01-23 05:28:15'),
(77, '9014', 'md10@ringtel', 'Md Zakaria', 'https://server.billisp.com/uploads/df778d85a05792ab.JPG', 'Md Zahangir', '2004-01-22 00:00:00', 22, 'Male', 'Unmarried', '8723784651', 0, 'Zakaria Cosmetics', 'Proprietor', 'Full Time', '01623623074', 'mdjakariaislam@gmail.com', 'residential', '4', 'Savar', 'Dim Potti', '4B', '3', 'Wapda Road, Savar, Dhaka - 1340', 'N/A', NULL, 700, NULL, '', 'client', 'active', '', '01623623074', NULL, 'zakaria@ringtel', '123456', '2026-01-23 05:41:30', '2026-01-23 05:41:30'),
(78, '9015', 'tanvir@ringtel', 'Tanvir Hossan', 'https://server.billisp.com/uploads/f778d85a05792abe.jpg', 'Md Tafazzal Hossain ', '1997-08-15 00:00:00', 28, 'Male', 'Unmarried', '1951768595', 1, NULL, NULL, 'Full Time', '01515657935', 'tanvir.016891@gmail.com', 'residential', '3', 'Savar', 'Wapda Road', '2A', '3/2,', 'Wapda Road, Savar, Dhaka - 1340', 'N/A', NULL, 350, NULL, 'https://server.billisp.com/uploads/78d85a05792abe2d.jpg', 'client', 'active', 'https://server.billisp.com/uploads/778d85a05792abe2.jpg', '01515657935', NULL, 'home@ringtel', '123456', '2026-01-23 05:44:22', '2026-01-23 05:44:22'),
(79, '9016', 'g@ringtel', 'G M Ziaul Haque', 'https://server.billisp.com/uploads/8d85a05792abe2d2.jpg', 'G M Alauddin ', '1985-02-07 00:00:00', 40, 'Male', 'Married', '2838749402', 0, 'Legend School', 'Principal', 'Full Time', '01708881666', 'legendschoolbd@gmail.com', 'commercial', '3', 'Savar', 'Wapda Road', '1A', 'A/2,', 'Wapda Road, Savar, Dhaka - 1340', 'N/A', NULL, 500, NULL, 'https://server.billisp.com/uploads/85a05792abe2d260.jpg', 'client', 'active', 'https://server.billisp.com/uploads/d85a05792abe2d26.jpg', '01708881666', NULL, 'legend@ringtel', '123456', '2026-01-23 05:47:25', '2026-01-23 05:47:25'),
(80, '9017', 'md11@ringtel', 'Md Ratan Khan', 'https://server.billisp.com/uploads/e2d260a966cea311.jpg', 'Md Makbul Khan', '1994-11-13 00:00:00', 31, 'Male', 'Married', '09144901767', 1, 'Super Star (Pvt.) Ltd.', 'Sales & Marketing Executive', 'Full Time', '01515252806', 'ratan02@gmail.com', 'residential', '3', 'Savar', 'Still Goli', '4A', 'N/A', 'Malancha R/A, Savar, Dhaka - 1340', 'N/A', NULL, 350, NULL, 'https://server.billisp.com/uploads/d260a966cea3115a.jpg', 'client', 'active', 'https://server.billisp.com/uploads/2d260a966cea3115.jpg', '01515252806', NULL, 'ratan02@ringtel', '123456', '2026-01-23 06:05:40', '2026-02-11 08:50:22'),
(81, '9018', 'elias@ringtel', 'Elias Jabed', 'https://server.billisp.com/uploads/260a966cea3115a4.jpg', 'Abed Ali', '1981-01-07 00:00:00', 45, 'Male', 'Married', '6438634054', 0, 'Nantu Gosto Bitan', 'Proprietor', 'Full Time', '01715507037', 'elias@gmail.com', 'residential', '3', 'Savar', 'Still Goli', '3A', 'N/A', 'Press Goli, Malancha R/A, Savar, Dhaka - 1340', 'N/A', 'N/A', 500, 'N/A', 'https://server.billisp.com/uploads/0a966cea3115a440.jpg', 'client', 'active', 'https://server.billisp.com/uploads/60a966cea3115a44.jpg', '01715507037', 'emran@gmail.com', 'elias@ringtel', '123456', '2026-01-23 06:08:02', '2026-01-23 06:10:26'),
(82, '9019', 'md12@ringtel', 'Md Aminul Islam ', 'https://server.billisp.com/uploads/a966cea3115a440a.jpg', 'Lokman Gazi', '1973-01-01 00:00:00', 53, 'Male', 'Married', '5537550088', 0, 'Gazi Bosraloy', NULL, 'Full Time', '01711266326', 'aminul@gmail.com', 'commercial', '3', 'Savar', 'Hobi Plaza', 'Shop: 2, ', 'N/A', 'Shop: 2, Hobi Plaza, Savar, Dhaka - 1340 ', 'N/A', NULL, 500, NULL, 'https://server.billisp.com/uploads/66cea3115a440a0a.jpg', 'client', 'active', 'https://server.billisp.com/uploads/966cea3115a440a0.jpg', '01711266326', NULL, 'gazi@ringtel', '123456', '2026-01-23 06:18:53', '2026-01-23 06:18:53'),
(83, '9020', 'md13@ringtel', 'Md Manik Mia', 'https://server.billisp.com/uploads/6cea3115a440a0a3.jpg', 'Tazul Islam', '1988-05-02 00:00:00', 37, 'Male', 'Married', '8689144700', 0, NULL, NULL, 'Full Time', '01781666692', 'manik.zim@gmail.com', 'residential', '3', 'Savar', 'Dim Potti', '2A', 'N/A', 'Malancha Market, Savar, Dhaka - 1340', 'N/A', NULL, 800, NULL, 'https://server.billisp.com/uploads/ea3115a440a0a3e1.jpg', 'client', 'active', 'https://server.billisp.com/uploads/cea3115a440a0a3e.jpg', '01781666692', NULL, 'manik@ringtel', '123456', '2026-01-23 06:23:15', '2026-01-23 06:23:15'),
(84, '9021', 'md14@ringtel', 'Md Shahadat Hossain Shamol', 'https://server.billisp.com/uploads/a3115a440a0a3e1c.jpeg', 'Md Shohidul Islam', '1984-10-21 00:00:00', 41, 'Male', 'Married', '9550870431', 0, 'Shahadat Shoes', 'Proprietor', 'Full Time', '01921088100', 'nushu4321@gmail.com', 'commercial', '3', 'Savar', 'Shiraj Market', 'Shop: 03', 'N/A', 'Shiraj Market, Aricha Highway, Savar, Dhaka - 1340', 'N/A', NULL, 500, NULL, 'https://server.billisp.com/uploads/115a440a0a3e1cc9.jpeg', 'client', 'active', 'https://server.billisp.com/uploads/3115a440a0a3e1cc.jpeg', '01921088100', NULL, 'iqbal@ringtel', '123456', '2026-01-23 06:27:54', '2026-01-23 06:27:54'),
(85, '9022', 'md15@ringtel', 'Md Mokhlesur Rahman', 'https://server.billisp.com/uploads/15a440a0a3e1cc91.jpg', 'Md Solaiman', '1972-07-09 00:00:00', 53, 'Male', 'Married', '1002128328', 0, 'Insaf Press', 'Managing Partner', 'Full Time', '01911037137', 'spp.bd17@gmail.com', 'commercial', '3', 'Savar', 'Still Goli', 'Shop: 01', 'N/A', 'Malancha R/A, Savar, Dhaka - 1340', 'N/A', 'N/A', 500, 'N/A', 'https://server.billisp.com/uploads/a440a0a3e1cc9111.jpg', 'client', 'active', 'https://server.billisp.com/uploads/5a440a0a3e1cc911.jpg', '01911037137', 'mohanaent2006@gmail.com', 'insafp@ringtel', '123456', '2026-01-23 06:34:46', '2026-01-23 06:45:45'),
(86, '9023', 'md16@ringtel', 'Md Mahabub Hossain Robi', 'https://server.billisp.com/uploads/0a0a3e1cc911182b.jpg', 'Md Tafazzal Hossain', '1987-02-08 00:00:00', 38, 'Male', 'Married', '19872627203000211', 1, NULL, NULL, 'Full Time', '01515206120', 'blackster.rony@gmail.com', 'corporate', '15 Mbps', 'Savar', 'Wapda Road', '2D', '3/2,', 'Wapda Road, Savar, Dhaka - 1340', 'N/A', NULL, 430, NULL, 'https://server.billisp.com/uploads/40a0a3e1cc911182.jpg', 'client', 'active', 'https://server.billisp.com/uploads/440a0a3e1cc91118.jpg', '01515206120', NULL, 'robi@ringtel', '123456', '2026-01-23 06:45:02', '2026-01-23 06:45:36'),
(87, '9024', 'md17@ringtel', 'Md Mosharof', 'https://server.billisp.com/uploads/a0a3e1cc911182b3.png', 'Md Abdul Momin', '1997-12-27 00:00:00', 28, 'Male', 'Married', '5107977760', 0, 'ePark Electronics', 'Managing Partner', 'Full Time', '01711775453', 'mosharofhossainemu@gmail.com', 'commercial', '4', 'Savar', 'Bazar Road', 'Shop: 01', '01', 'Bazar Road, Savar, Dhaka - 1340', 'Mabi Watch Bhaban', NULL, 1000, NULL, 'https://server.billisp.com/uploads/a3e1cc911182b373.jpg', 'client', 'active', 'https://server.billisp.com/uploads/0a3e1cc911182b37.jpg', '01711775453', NULL, 'epark@ringtel', '123456', '2026-01-23 06:49:21', '2026-01-23 06:49:21'),
(88, '9025', 'md18@ringtel', 'Md Mahabub Hossain', 'https://server.billisp.com/uploads/cc911182b373ffb3.jpg', 'Md Tafazzal Hossain', '1987-02-08 00:00:00', 38, 'Male', 'Married', '2627203000211', 0, NULL, NULL, 'Full Time', '01689203297', 'hossain.mahabub@hotmail.co.uk', 'residential', '3', 'Savar', 'Wapda Road', '2A', '3/2, ', 'Wapda Road, Savar, Dhaka - 1340', 'N/A', NULL, 500, NULL, 'https://server.billisp.com/uploads/911182b373ffb3b1.jpg', 'client', 'active', 'https://server.billisp.com/uploads/c911182b373ffb3b.jpg', '01689203297', NULL, 'mahabub@ringtel', '123456', '2026-01-23 06:52:23', '2026-01-23 06:52:23'),
(89, '9026', 'amjad@ringtel', 'Amjad Hossan', 'https://server.billisp.com/uploads/11182b373ffb3b1e.jpeg', 'Monir Ahmed', '1993-12-21 00:00:00', 32, 'Male', 'Unmarried', '5544710477', 0, 'Dutch Bangla Agent Banking', 'Sales & Marketing Executive', 'Full Time', '01639423623', 'amjadhossain13576@gmail.com', 'residential', '4', 'Savar', 'Dim Potti', '3A', '0', 'Malancha Market, Savar, Dhaka - 1340', 'Selim vai er Basha', NULL, 800, 'md13@ringtel', '', 'client', 'active', 'https://server.billisp.com/uploads/1182b373ffb3b1e1.jpeg', '01639423623', NULL, 'amjad@ringtel', '123456', '2026-01-23 06:59:47', '2026-01-23 07:03:23'),
(90, '9027', 'md19@ringtel', 'Md Saiful Islam ', 'https://server.billisp.com/uploads/182b373ffb3b1e12.jpg', 'Md Tomser Ali', '1998-03-01 00:00:00', 27, 'Male', 'Unmarried', '3304236114', 0, 'Nirob Wood Furniture', 'Sales & Marketing Executive', 'Full Time', '01945988529', 'saiful@gmail.com', 'commercial', '3', 'Savar', 'Bazar Road', 'Shop: 01', 'A-18,', 'Savar Bazar Bus Stand, Savar, Dhaka - 1340', 'N/A', NULL, 500, NULL, 'https://server.billisp.com/uploads/2b373ffb3b1e12f0.jpg', 'client', 'active', 'https://server.billisp.com/uploads/82b373ffb3b1e12f.jpg', '01945988529', NULL, 'saiful@ringtel', '123456', '2026-01-23 07:07:04', '2026-01-23 07:07:04'),
(91, '9028', 'md20@ringtel', 'Md Asik Parvej', 'https://server.billisp.com/uploads/b373ffb3b1e12f06.jpg', 'Idris Munshi', '1999-02-11 00:00:00', 26, 'Male', 'Married', '19998267568049', 0, 'Ekota Cosmetics', 'Proprietor', 'Full Time', '01960657413', 'mk977223@gmail.com', 'residential', '3', 'Savar', 'Still Goli', '4A', 'N/A', 'Malancha R/A, Savar, Dhaka - 1340', 'N/A', NULL, 500, 'md9@ringtel', 'https://server.billisp.com/uploads/73ffb3b1e12f0671.jpg', 'client', 'active', 'https://server.billisp.com/uploads/373ffb3b1e12f067.jpg', '01960657413', NULL, 'ashik@ringtel', '123456', '2026-01-23 07:11:43', '2026-01-23 16:44:33'),
(92, '9029', 'amir@ringtel', 'Amir Hossain', 'https://server.billisp.com/uploads/3ffb3b1e12f0671e.jpg', 'Abdul Matin Bepary', '1988-10-25 00:00:00', 37, 'Male', 'Married', '1483819148', 0, 'Mollah Hotel', 'Proprietor', 'Full Time', '01748644644', 'amir@gmail.com', 'commercial', '15 Mbps', 'Savar', 'Razzak Plaza', 'Shop: 01', 'N/A', 'Razzak Plaza, Savar, Dhaka - 1340', 'N/A', NULL, 1000, 'md21@ringtel', 'https://server.billisp.com/uploads/fb3b1e12f0671e2e.jpg', 'client', 'active', 'https://server.billisp.com/uploads/ffb3b1e12f0671e2.jpg', '01748644644', NULL, 'amir@ringtel', '123456', '2026-01-23 07:18:33', '2026-01-23 12:04:49'),
(93, '9030', 'smity@ringtel', 'Smity Das', 'https://server.billisp.com/uploads/b3b1e12f0671e2e5.jpg', 'Roton Das', '2004-04-08 00:00:00', 21, 'Female', 'Married', '6019068557', 0, NULL, NULL, 'Full Time', '01627201045', 'smityakhter45@gmail.com', 'residential', '3', 'Savar', 'Wapda Road', '5A', '3/2,', 'Wapda Road, Savar, Dhaka - 1340', 'N/A', NULL, 500, NULL, 'https://server.billisp.com/uploads/b1e12f0671e2e541.jpg', 'client', 'active', 'https://server.billisp.com/uploads/3b1e12f0671e2e54.jpg', '01627201045', NULL, 'mariam@ringtel', '123456', '2026-01-23 07:27:39', '2026-01-23 07:27:39'),
(94, '9031', 'md21@ringtel', 'Md Rajib Hossain', 'https://server.billisp.com/uploads/1e12f0671e2e5412.jpg', 'Kodom Ali', '1998-02-10 00:00:00', 27, 'Male', 'Unmarried', '7830173584', 0, 'Nurjahan Medicine Corner', 'Proprietor', 'Full Time', '01648499250', 'rajibhossenkader@gmail.com', 'commercial', '3', 'Savar', 'Nasir Plaza', 'Shop: 01', 'B-119/1', 'Nasir Plaza, Savar, Dhaka - 1340', 'N/A', NULL, 500, NULL, 'https://server.billisp.com/uploads/12f0671e2e541246.jpg', 'client', 'active', 'https://server.billisp.com/uploads/e12f0671e2e54124.jpg', '01648499250', NULL, 'rajib@ringtel', '123456', '2026-01-23 07:33:12', '2026-01-23 07:40:15'),
(95, '9032', 'md22@ringtel', 'Md Mosharof Hossain Emu', 'https://server.billisp.com/uploads/71e2e5412469ebc8.png', 'Md Abdul Momin', '1997-12-07 00:00:00', 28, 'Male', 'Married', '19975107977760', 0, 'ePark Electronics', 'Managing Partner', 'Full Time', '01681271909', 'emu@gmail.com', 'residential', '3', 'Savar', 'Bazar Road', '4A', '01', 'Bazar Road, Savar, Dhaka - 1340', 'N/A', NULL, 500, 'md17@ringtel', 'https://server.billisp.com/uploads/e2e5412469ebc80a.jpg', 'client', 'active', 'https://server.billisp.com/uploads/1e2e5412469ebc80.jpg', '01681271909', NULL, 'emu@ringtel', '123456', '2026-01-23 16:44:00', '2026-02-04 03:48:24'),
(96, '9034', 'shamim1@ringtel', 'Shamim Hossain ', 'https://server.billisp.com/uploads/70b49f0b6b1dd627.jpeg', 'Md Sad Ahmed Dhali', '1992-05-15 00:00:00', 33, 'Male', 'Married', '2401650789', 0, 'Garments', 'Office Assistant', 'Full Time', '01677858523', 'hossain@gmail.com', 'residential', '3', 'Savar', 'Dim Potti', '4C', '1', 'Molla Hotel, Savar, Dhaka - 1340', 'Behind Razzak Plaza', NULL, 500, 'md@ringtel', '', 'client', 'active', 'https://server.billisp.com/uploads/0b49f0b6b1dd6276.png', '01677858523', NULL, 'hossain@ringtel', '123456', '2026-02-15 16:05:21', '2026-02-15 16:05:21');

-- --------------------------------------------------------

--
-- Table structure for table `contacts`
--

CREATE TABLE `contacts` (
  `id` int(11) NOT NULL,
  `section` enum('contact_info','office_locations') NOT NULL,
  `title` varchar(255) NOT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `working_hours` varchar(255) DEFAULT NULL,
  `whatsapp` varchar(255) DEFAULT NULL,
  `telegram` varchar(255) DEFAULT NULL,
  `facebook` varchar(255) DEFAULT NULL,
  `linkedin` varchar(255) DEFAULT NULL,
  `instagram` varchar(255) DEFAULT NULL,
  `imo` varchar(255) DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `icon` varchar(255) DEFAULT 'phone',
  `color` varchar(255) DEFAULT 'from-blue-500 to-cyan-400',
  `bg_color` varchar(255) DEFAULT 'bg-blue-500/10',
  `display_order` int(11) NOT NULL DEFAULT 0,
  `additional_details` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` varchar(255) NOT NULL DEFAULT 'admin',
  `updated_by` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contacts`
--

INSERT INTO `contacts` (`id`, `section`, `title`, `subtitle`, `description`, `phone`, `email`, `address`, `city`, `country`, `working_hours`, `whatsapp`, `telegram`, `facebook`, `linkedin`, `instagram`, `imo`, `latitude`, `longitude`, `icon`, `color`, `bg_color`, `display_order`, `additional_details`, `is_active`, `created_by`, `updated_by`, `createdAt`, `updatedAt`) VALUES
(2, 'contact_info', 'Phone', 'Phone', 'Phone No.', '0222 444 2004', 'ringtel.isp@gmail.com', NULL, NULL, NULL, NULL, 'https://wa.me/qr/D3CL2YRIORKLO1', 'https://rtel.com.bd/', 'https://www.facebook.com/ringtelnet', 'https://rtel.com.bd/', 'https://rtel.com.bd/', 'https://rtel.com.bd/', NULL, NULL, 'phone', 'from-blue-500 to-cyan-400', 'bg-blue-500/10', 1, '[{\"label\":\"Phone\",\"value\":\"0222 444 2004\"}]', 1, 'admin', 'admin', '2026-01-30 20:02:44', '2026-02-02 16:32:31'),
(3, 'contact_info', 'Email', 'Email', '', '', 'ringtel.isp@gmail.com', NULL, NULL, NULL, NULL, 'https://admin.billisp.com/authority/account-management/collected-bills', 'https://admin.billisp.com/authority/account-management/collected-bills', 'https://admin.billisp.com/authority/account-management/collected-bills', 'https://admin.billisp.com/authority/account-management/collected-bills', 'https://admin.billisp.com/authority/account-management/collected-bills', 'https://admin.billisp.com/authority/account-management/collected-bills', NULL, NULL, 'mail', 'from-red-500 to-pink-400', 'bg-purple-500/10', 3, '[{\"label\":\"Email\",\"value\":\"ringtel.isp@gmail.com\"}]', 1, 'admin', 'admin', '2026-01-30 20:03:28', '2026-02-02 16:34:26'),
(4, 'contact_info', 'Mobile', 'Mobile', '', 'Mobile', 'dsfgdf@gmail.com', NULL, NULL, NULL, NULL, 'https://admin.billisp.com/authority/account-management/collected-bills', 'https://admin.billisp.com/authority/account-management/collected-bills', 'https://admin.billisp.com/authority/account-management/collected-bills', 'https://admin.billisp.com/authority/account-management/collected-bills', 'https://admin.billisp.com/authority/account-management/collected-bills', 'https://admin.billisp.com/authority/account-management/collected-bills', NULL, NULL, 'phone', 'from-indigo-500 to-purple-400', 'bg-indigo-500/10', 2, '[{\"label\":\"Mobile\",\"value\":\"+88 01601 997 701\"}]', 1, 'admin', 'admin', '2026-01-30 20:04:27', '2026-02-02 16:33:45');

-- --------------------------------------------------------

--
-- Table structure for table `emails`
--

CREATE TABLE `emails` (
  `id` int(11) NOT NULL,
  `appName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `emailAppPassword` varchar(255) NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `emails`
--

INSERT INTO `emails` (`id`, `appName`, `email`, `emailAppPassword`, `isActive`, `createdAt`, `updatedAt`) VALUES
(2, 'Ring Tel', 'ringtel.isp@gmail.com', 'lqsqqkbfuimdtcdi', 1, '2026-01-10 13:55:42', '2026-02-04 19:52:34');

-- --------------------------------------------------------

--
-- Table structure for table `employeeattendances`
--

CREATE TABLE `employeeattendances` (
  `id` int(11) NOT NULL,
  `employeeId` int(11) NOT NULL,
  `checkIn` varchar(255) DEFAULT NULL,
  `checkOut` varchar(255) DEFAULT NULL,
  `date` date NOT NULL,
  `status` enum('Present','Absent','Leave','Half Day') NOT NULL DEFAULT 'Present',
  `workingHours` float DEFAULT NULL,
  `lateMinutes` int(11) NOT NULL DEFAULT 0,
  `earlyDeparture` int(11) NOT NULL DEFAULT 0,
  `note` text DEFAULT NULL,
  `createdBy` varchar(255) NOT NULL DEFAULT 'Super-Admin',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employeeattendances`
--

INSERT INTO `employeeattendances` (`id`, `employeeId`, `checkIn`, `checkOut`, `date`, `status`, `workingHours`, `lateMinutes`, `earlyDeparture`, `note`, `createdBy`, `createdAt`, `updatedAt`) VALUES
(7, 1, '10:00', '17:32', '2026-01-01', 'Present', 7.53, 0, 0, '', 'Super-Admin', '2026-01-31 14:33:24', '2026-01-31 14:33:24'),
(9, 1, '10:04', '18:04', '2026-01-03', 'Present', 8, 0, 0, '', 'Super-Admin', '2026-02-01 08:05:25', '2026-02-01 08:05:25'),
(10, 1, '10:02', '18:10', '2026-01-04', 'Present', 8.13, 0, 0, '', 'Super-Admin', '2026-02-01 08:07:52', '2026-02-01 08:07:52'),
(11, 1, '10:00', '18:13', '2026-01-05', 'Present', 8.22, 0, 0, '', 'Super-Admin', '2026-02-01 08:08:10', '2026-02-01 08:08:10'),
(12, 1, '10:02', '18:30', '2026-01-06', 'Present', 8.47, 0, 0, '', 'Super-Admin', '2026-02-01 08:08:32', '2026-02-01 08:08:32'),
(13, 1, '10:00', '18:24', '2026-01-07', 'Present', 8.4, 0, 0, '', 'Super-Admin', '2026-02-01 08:09:03', '2026-02-01 08:09:03'),
(14, 1, '10:00', '18:30', '2026-01-08', 'Present', 8.5, 0, 0, '', 'Super-Admin', '2026-02-01 08:09:35', '2026-02-01 08:09:35'),
(15, 1, '10:00', '18:30', '2026-01-10', 'Present', 8.5, 0, 0, '', 'Super-Admin', '2026-02-01 08:09:54', '2026-02-01 08:09:54'),
(16, 1, '10:02', '18:15', '2026-01-11', 'Present', 8.22, 0, 0, '', 'Super-Admin', '2026-02-01 08:10:16', '2026-02-01 08:10:16'),
(17, 1, '10:02', '18:30', '2026-01-12', 'Present', 8.47, 0, 0, '', 'Super-Admin', '2026-02-01 08:10:39', '2026-02-01 08:10:39'),
(18, 1, '10:02', '18:37', '2026-01-13', 'Present', 8.58, 0, 0, '', 'Super-Admin', '2026-02-01 08:11:58', '2026-02-01 08:11:58'),
(19, 1, '10:01', '18:28', '2026-01-14', 'Present', 8.45, 0, 0, '', 'Super-Admin', '2026-02-01 08:12:18', '2026-02-01 08:12:18'),
(20, 1, '10:03', '18:34', '2026-01-15', 'Present', 8.52, 0, 0, '', 'Super-Admin', '2026-02-01 08:12:47', '2026-02-01 08:12:47'),
(21, 1, '10:01', '18:40', '2026-01-17', 'Present', 8.65, 0, 0, '', 'Super-Admin', '2026-02-01 08:13:08', '2026-02-01 08:13:08'),
(22, 1, '10:01', '18:40', '2026-01-18', 'Present', 8.65, 0, 0, '', 'Super-Admin', '2026-02-01 08:13:25', '2026-02-01 08:13:25'),
(23, 1, '10:35', '18:30', '2026-01-19', 'Present', 7.92, 0, 0, '', 'Super-Admin', '2026-02-01 08:13:46', '2026-02-01 08:13:46'),
(24, 1, '10:01', '18:35', '2026-01-20', 'Present', 8.56667, 0, 0, '', 'Super-Admin', '2026-02-01 08:14:04', '2026-02-01 08:14:35'),
(25, 1, '10:03', '18:20', '2026-01-21', 'Present', 8.28, 0, 0, '', 'Super-Admin', '2026-02-01 08:14:54', '2026-02-01 08:14:54'),
(26, 1, '10:02', '18:36', '2026-01-22', 'Present', 8.57, 0, 0, '', 'Super-Admin', '2026-02-01 08:15:17', '2026-02-01 08:15:17'),
(27, 1, '10:03', '18:35', '2026-01-24', 'Present', 8.53, 0, 0, '', 'Super-Admin', '2026-02-01 08:15:41', '2026-02-01 08:15:41'),
(28, 1, '10:02', '18:40', '2026-01-25', 'Present', 8.63, 0, 0, '', 'Super-Admin', '2026-02-01 08:15:59', '2026-02-01 08:15:59'),
(29, 1, '10:01', '18:30', '2026-01-26', 'Present', 8.48, 0, 0, '', 'Super-Admin', '2026-02-01 08:16:28', '2026-02-01 08:16:28'),
(30, 1, '10:01', '18:38', '2026-01-27', 'Present', 8.62, 0, 0, '', 'Super-Admin', '2026-02-01 08:16:51', '2026-02-01 08:16:51'),
(31, 1, '10:01', '18:39', '2026-01-28', 'Present', 8.63, 0, 0, '', 'Super-Admin', '2026-02-01 08:17:15', '2026-02-01 08:17:15'),
(32, 1, '10:03', '18:50', '2026-01-29', 'Present', 8.78, 0, 0, '', 'Super-Admin', '2026-02-01 08:17:35', '2026-02-01 08:17:35'),
(33, 1, '10:02', '18:27', '2026-01-31', 'Present', 8.42, 0, 0, '', 'Super-Admin', '2026-02-01 08:17:58', '2026-02-01 08:17:58'),
(34, 1, '10:01', '18:47', '2026-02-01', 'Present', 8.77, 0, 0, '', 'Super-Admin', '2026-02-02 04:52:42', '2026-02-02 04:52:42'),
(35, 1, '10:01', '18:44', '2026-02-02', 'Present', 8.71667, 0, 0, '', 'Super-Admin', '2026-02-02 04:53:07', '2026-02-04 17:22:35'),
(36, 1, '10:00', '18:34', '2026-02-03', 'Present', 8.57, 0, 0, '', 'Super-Admin', '2026-02-04 17:20:22', '2026-02-04 17:20:22'),
(37, 1, '10:01', '18:20', '2026-02-04', 'Present', 8.32, 0, 0, '', 'Super-Admin', '2026-02-04 17:20:55', '2026-02-04 17:20:55'),
(38, 1, '09:20', '06:32', '2026-02-05', 'Present', 0, 0, 0, '', 'Super-Admin', '2026-02-05 03:47:10', '2026-02-07 04:16:45'),
(39, 1, '10:04', '', '2026-02-07', 'Present', 0, 0, 0, '', 'Super-Admin', '2026-02-07 04:16:36', '2026-02-07 04:16:36');

-- --------------------------------------------------------

--
-- Table structure for table `employee_bill_collection`
--

CREATE TABLE `employee_bill_collection` (
  `id` int(11) NOT NULL,
  `clientId` varchar(255) NOT NULL,
  `clientName` varchar(255) NOT NULL,
  `clientPhone` varchar(255) NOT NULL,
  `clientAddress` text DEFAULT NULL,
  `employeeId` varchar(255) NOT NULL,
  `employeeName` varchar(255) NOT NULL,
  `invoiceId` varchar(255) DEFAULT NULL COMMENT 'Optional invoice ID for reference',
  `billingMonth` varchar(255) NOT NULL COMMENT 'Format: YYYY-MM e.g., 2025-01',
  `amount` decimal(10,2) NOT NULL,
  `paymentMethod` text NOT NULL,
  `transactionId` varchar(255) DEFAULT NULL COMMENT 'Transaction ID for mobile banking/bank transfers',
  `referenceNote` text DEFAULT NULL,
  `collectionDate` datetime NOT NULL,
  `collectionTime` time DEFAULT NULL,
  `receiptNumber` varchar(255) NOT NULL,
  `status` enum('collected','verified','deposited','cancelled','refunded') NOT NULL DEFAULT 'collected',
  `paymentAccount` int(11) NOT NULL,
  `notes` text DEFAULT NULL,
  `attachment` varchar(255) DEFAULT NULL COMMENT 'Receipt/transaction slip image path',
  `verifiedBy` varchar(255) DEFAULT NULL,
  `verifiedAt` datetime DEFAULT NULL,
  `verificationRemark` varchar(255) DEFAULT NULL,
  `depositedBy` varchar(255) DEFAULT NULL,
  `depositedAt` datetime DEFAULT NULL,
  `depositSlipNumber` varchar(255) DEFAULT NULL,
  `discount` float NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employee_bill_collection`
--

INSERT INTO `employee_bill_collection` (`id`, `clientId`, `clientName`, `clientPhone`, `clientAddress`, `employeeId`, `employeeName`, `invoiceId`, `billingMonth`, `amount`, `paymentMethod`, `transactionId`, `referenceNote`, `collectionDate`, `collectionTime`, `receiptNumber`, `status`, `paymentAccount`, `notes`, `attachment`, `verifiedBy`, `verifiedAt`, `verificationRemark`, `depositedBy`, `depositedAt`, `depositSlipNumber`, `discount`, `createdAt`, `updatedAt`) VALUES
(41, 'md22@ringtel', 'Md Mosharof Hossain Emu', '01681271909', '4A, 01, Bazar Road, Savar, Dhaka - 1340, Bazar Road', 'shamim9489@ringtel', 'Shamim Rony', 'INV-January-2026-9032', 'January 2026', 500.00, 'Hand Cash | Shamim', '', '', '2026-01-24 09:12:31', '15:12:31', 'RCT-2026-01-000002', 'deposited', 10, '', '', 'shamim@ringtel', '2026-01-24 09:16:42', 'Cash Recieved.', 'shamim@ringtel', '2026-01-24 09:18:01', 'N/A', 0, '2026-01-24 09:12:31', '2026-01-24 09:18:01'),
(42, 'md22@ringtel', 'Md Mosharof Hossain Emu', '01681271909', '4A, 01, Bazar Road, Savar, Dhaka - 1340, Bazar Road', 'shamim9489@ringtel', 'Shamim Rony', 'INV-February-2026-9032', 'February 2026', 500.00, 'Hand Cash | Shamim', '', '', '2026-01-24 09:15:07', '15:15:07', 'RCT-2026-01-000003', 'deposited', 10, '', '', 'shamim@ringtel', '2026-01-24 09:18:19', 'Cash Received.', 'shamim@ringtel', '2026-01-24 09:18:32', 'N/A', 0, '2026-01-24 09:15:07', '2026-01-24 09:18:32'),
(43, 'md6@ringtel', 'Md Azaharul Islam', '01743787174', '5C, 3/2, Wapda Road, Savar, Dhaka - 1340, Wapda Road', 'shamim9489@ringtel', 'Shamim Rony', 'INV-January-2026-9008', 'January 2026', 500.00, 'Hand Cash | Shamim', '', '', '2026-01-25 14:01:42', '20:01:42', 'RCT-2026-01-000004', 'deposited', 10, '', '', 'shamim@ringtel', '2026-01-26 04:14:34', '', 'shamim@ringtel', '2026-01-26 04:14:55', 'Cash Received.', 0, '2026-01-25 14:01:42', '2026-01-26 04:14:55'),
(44, 'md7@ringtel', 'Md Sumon Akon', '01301262600', 'Shop: 03 - 06, 3/2,, Wapda Road, Savar, Dhaka - 1340, Wapda Road', 'shamim9489@ringtel', 'Shamim Rony', 'INV-January-2026-9010', 'January 2026', 500.00, 'Hand Cash | Shamim', '', '', '2026-01-25 14:02:13', '20:02:13', 'RCT-2026-01-000005', 'deposited', 10, '', '', 'shamim@ringtel', '2026-01-26 04:14:31', '', 'shamim@ringtel', '2026-01-26 04:15:02', 'Cash Received.', 0, '2026-01-25 14:02:13', '2026-01-26 04:15:02'),
(45, 'md17@ringtel', 'Md Mosharof', '01711775453', 'Shop: 01, 01, Bazar Road, Savar, Dhaka - 1340, Bazar Road', 'shamim9489@ringtel', 'Shamim Rony', 'INV-January-2026-9024', 'January 2026', 1000.00, 'Hand Cash | Shamim', '', '', '2026-01-25 14:02:44', '20:02:44', 'RCT-2026-01-000006', 'deposited', 10, '', '', 'shamim@ringtel', '2026-01-26 04:14:29', '', 'shamim@ringtel', '2026-01-26 04:15:11', 'Cash Received.', 0, '2026-01-25 14:02:44', '2026-01-26 04:15:11'),
(46, 'md3@ringtel', 'Md Mohidur Rahman', '01819423812', '0, Shop: 05, Malancha Market, Savar, Dhaka - 1340, Dim Potti', 'shamim9489@ringtel', 'Shamim Rony', 'INV-January-2026-9005', 'January 2026', 500.00, 'Hand Cash | Shamim', '', '', '2026-01-25 14:03:08', '20:03:08', 'RCT-2026-01-000007', 'deposited', 10, '', '', 'shamim@ringtel', '2026-01-26 04:14:23', '', 'shamim@ringtel', '2026-01-26 04:16:46', 'Cash Received.', 0, '2026-01-25 14:03:08', '2026-01-26 04:16:46'),
(47, 'hafiza@ringtel', 'Hafiza', '01790844239', '4A, N/A, Malancha Market, Savar, Dhaka - 1340, Dim Potti', 'shamim9489@ringtel', 'Shamim Rony', 'INV-January-2026-9011', 'January 2026', 500.00, 'Hand Cash | Shamim', '', '', '2026-01-25 14:03:28', '20:03:28', 'RCT-2026-01-000008', 'deposited', 10, '', '', 'shamim@ringtel', '2026-01-26 04:14:21', '', 'shamim@ringtel', '2026-01-26 04:16:50', 'Cash Received.', 0, '2026-01-25 14:03:28', '2026-01-26 04:16:50'),
(48, 'md2@ringtel', 'Md Arafat Hossen', '01704503771', '3B, 3/2, Wapda Road, Savar, Dhaka - 1340, Wapda Road', 'shamim9489@ringtel', 'Shamim Rony', 'INV-January-2026-9004', 'January 2026', 500.00, 'Hand Cash | Shamim', '', '', '2026-01-25 14:07:08', '20:07:08', 'RCT-2026-01-000009', 'deposited', 10, '', '', 'shamim@ringtel', '2026-01-26 04:14:18', '', 'shamim@ringtel', '2026-01-26 04:16:54', 'Cash Received.', 0, '2026-01-25 14:07:08', '2026-01-26 04:16:54'),
(49, 'md5@ringtel', 'Md Reza', '01620676740', '4B, 3/2, Wapda Road, Savar, Dhaka - 1340, Wapda Road', 'shamim9489@ringtel', 'Shamim Rony', 'INV-January-2026-9007', 'January 2026', 600.00, 'Hand Cash | Shamim', '', '', '2026-01-25 14:07:30', '20:07:30', 'RCT-2026-01-000010', 'deposited', 10, '', '', 'shamim@ringtel', '2026-01-26 04:14:15', '', 'shamim@ringtel', '2026-01-26 04:16:57', 'Cash Received.', 0, '2026-01-25 14:07:30', '2026-01-26 04:16:57'),
(50, 'md4@ringtel', 'Md Robin', '01845312323', '0, Shop: 02, Wapda Road, Savar, Dhaka - 1340, Dim Potti', 'shamim9489@ringtel', 'Shamim Rony', 'INV-January-2026-9006', 'January 2026', 500.00, 'Hand Cash | Shamim', '', '', '2026-01-25 14:08:03', '20:08:03', 'RCT-2026-01-000011', 'deposited', 10, '', '', 'shamim@ringtel', '2026-01-26 04:14:13', '', 'shamim@ringtel', '2026-01-26 04:16:59', 'Cash Received.', 0, '2026-01-25 14:08:03', '2026-01-26 04:16:59'),
(51, 'elias@ringtel', 'Elias Jabed', '01715507037', '3A, N/A, Press Goli, Malancha R/A, Savar, Dhaka - 1340, Still Goli', 'shamim9489@ringtel', 'Shamim Rony', 'INV-January-2026-9018', 'January 2026', 500.00, 'Hand Cash | Shamim', '', '', '2026-01-25 14:09:02', '20:09:02', 'RCT-2026-01-000012', 'deposited', 10, '', '', 'shamim@ringtel', '2026-01-26 04:14:10', '', 'shamim@ringtel', '2026-01-26 04:17:02', 'Cash Received.', 0, '2026-01-25 14:09:02', '2026-01-26 04:17:02'),
(52, 'md9@ringtel', 'Md Asik Parvej', '01910035661', 'Shop: 19, 3/2,, Wapda Road, Savar, Dhaka - 1340, Wapda Road', 'shamim9489@ringtel', 'Shamim Rony', 'INV-January-2026-9013', 'January 2026', 500.00, 'Hand Cash | Shamim', '', '', '2026-01-25 14:09:59', '20:09:59', 'RCT-2026-01-000013', 'deposited', 10, '', '', 'shamim@ringtel', '2026-01-26 04:14:08', '', 'shamim@ringtel', '2026-01-26 04:17:04', 'Cash Received.', 0, '2026-01-25 14:09:59', '2026-01-26 04:17:04'),
(53, 'smity@ringtel', 'Smity Das', '01627201045', '5A, 3/2,, Wapda Road, Savar, Dhaka - 1340, Wapda Road', 'shamim9489@ringtel', 'Shamim Rony', 'INV-January-2026-9030', 'January 2026', 500.00, 'Hand Cash | Shamim', '', '', '2026-01-25 14:10:28', '20:10:28', 'RCT-2026-01-000014', 'deposited', 10, '', '', 'shamim@ringtel', '2026-01-26 04:14:06', '', 'shamim@ringtel', '2026-01-26 04:17:07', 'Cash Received.', 0, '2026-01-25 14:10:28', '2026-01-26 04:17:07'),
(54, 'amjad@ringtel', 'Amjad Hossan', '01639423623', '3A, 0, Malancha Market, Savar, Dhaka - 1340, Dim Potti', 'shamim9489@ringtel', 'Shamim Rony', 'INV-January-2026-9026', 'January 2026', 800.00, 'Hand Cash | Shamim', '', '', '2026-01-25 14:21:05', '20:21:05', 'RCT-2026-01-000015', 'deposited', 10, '', '', 'shamim@ringtel', '2026-01-26 04:14:03', '', 'shamim@ringtel', '2026-01-26 04:17:09', 'Cash Received.', 0, '2026-01-25 14:21:05', '2026-01-26 04:17:09'),
(55, 'md13@ringtel', 'Md Manik Mia', '01781666692', '2A, N/A, Malancha Market, Savar, Dhaka - 1340, Dim Potti', 'shamim9489@ringtel', 'Shamim Rony', 'INV-January-2026-9020', 'January 2026', 800.00, 'Hand Cash | Shamim', '', '', '2026-01-25 15:13:54', '21:13:54', 'RCT-2026-01-000016', 'deposited', 10, '', '', 'shamim@ringtel', '2026-01-26 04:13:50', '', 'shamim@ringtel', '2026-01-26 04:17:12', 'Cash Received.', 0, '2026-01-25 15:13:54', '2026-01-26 04:17:12'),
(56, 'md17@ringtel', 'Md Mosharof', '01711775453', 'Shop: 01, 01, Bazar Road, Savar, Dhaka - 1340, Bazar Road', 'shamim9489@ringtel', 'Shamim Rony', 'INV-February-2026-9024', 'February 2026', 1000.00, 'Hand Cash | Shamim', '', '', '2026-02-06 11:16:23', '17:16:23', 'RCT-2026-02-000001', 'deposited', 10, '', '', 'shamim@ringtel', '2026-02-06 11:17:21', 'Received by Tanvir.', 'shamim@ringtel', '2026-02-06 11:19:29', 'Cash received by Tanvir', 0, '2026-02-06 11:16:23', '2026-02-06 11:19:29'),
(58, 'md7@ringtel', 'Md Sumon Akon', '01301262600', 'Shop: 03 - 06, 3/2,, Wapda Road, Savar, Dhaka - 1340, Wapda Road', 'shamim9489@ringtel', 'Shamim Rony', 'INV-February-2026-9010', 'February 2026', 500.00, 'Hand Cash | Shamim', '', '', '2026-02-08 16:55:27', '22:55:27', 'RCT-2026-02-000003', 'deposited', 10, '', '', 'shamim@ringtel', '2026-02-08 16:57:00', '', 'shamim@ringtel', '2026-02-08 16:57:08', 'Cash Received', 0, '2026-02-08 16:55:27', '2026-02-08 16:57:08'),
(59, 'smity@ringtel', 'Smity Das', '01627201045', '5A, 3/2,, Wapda Road, Savar, Dhaka - 1340, Wapda Road', 'shamim9489@ringtel', 'Shamim Rony', 'INV-February-2026-9030', 'February 2026', 500.00, 'Hand Cash | Shamim', '', '', '2026-02-08 16:59:43', '22:59:43', 'RCT-2026-02-000004', 'deposited', 10, '', '', 'shamim@ringtel', '2026-02-08 17:00:12', '', 'shamim@ringtel', '2026-02-08 17:00:22', 'Cash Received', 0, '2026-02-08 16:59:43', '2026-02-08 17:00:22'),
(60, 'amjad@ringtel', 'Amjad Hossan', '01639423623', '3A, 0, Malancha Market, Savar, Dhaka - 1340, Dim Potti', 'shamim9489@ringtel', 'Shamim Rony', 'INV-February-2026-9026', 'February 2026', 800.00, 'Hand Cash | Shamim', '', '', '2026-02-09 15:10:05', '21:10:05', 'RCT-2026-02-000005', 'deposited', 10, '', '', 'shamim@ringtel', '2026-02-09 15:15:50', '', 'shamim@ringtel', '2026-02-09 15:17:26', 'Cash Received.', 0, '2026-02-09 15:10:05', '2026-02-09 15:17:26'),
(61, 'amjad@ringtel', 'Amjad Hossan', '01639423623', '3A, 0, Malancha Market, Savar, Dhaka - 1340, Dim Potti', 'shamim9489@ringtel', 'Shamim Rony', 'INV-March-2026-9026', 'March 2026', 800.00, 'Hand Cash | Shamim', '', '', '2026-02-09 15:11:34', '21:11:34', 'RCT-2026-02-000006', 'deposited', 10, '', '', 'shamim@ringtel', '2026-02-09 15:16:05', '', 'shamim@ringtel', '2026-02-09 15:17:40', 'Cash Received.', 0, '2026-02-09 15:11:34', '2026-02-09 15:17:40'),
(62, 'md5@ringtel', 'Md Reza', '01620676740', '4B, 3/2, Wapda Road, Savar, Dhaka - 1340, Wapda Road', 'shamim9489@ringtel', 'Shamim Rony', 'INV-February-2026-9007', 'February 2026', 600.00, 'Hand Cash | Shamim', '', '', '2026-02-09 17:04:54', '23:04:54', 'RCT-2026-02-000007', 'deposited', 10, '', '', 'shamim@ringtel', '2026-02-09 17:06:51', '', 'shamim@ringtel', '2026-02-09 17:07:04', 'Cash Received ', 0, '2026-02-09 17:04:54', '2026-02-09 17:07:04'),
(63, 'md14@ringtel', 'Md Shahadat Hossain Shamol', '01921088100', 'Shop: 03, N/A, Shiraj Market, Aricha Highway, Savar, Dhaka - 1340, Shiraj Market', 'shamim9489@ringtel', 'Shamim Rony', 'INV-February-2026-9021', 'February 2026', 500.00, 'Hand Cash | Shamim', '', '', '2026-02-10 11:37:19', '17:37:19', 'RCT-2026-02-000008', 'deposited', 10, '', '', 'shamim@ringtel', '2026-02-10 11:51:25', '', 'shamim@ringtel', '2026-02-10 11:51:59', ' Cash Received', 0, '2026-02-10 11:37:19', '2026-02-10 11:51:59'),
(64, 'hafiza@ringtel', 'Hafiza', '01790844239', '4A, N/A, Malancha Market, Savar, Dhaka - 1340, Dim Potti', 'shamim9489@ringtel', 'Shamim Rony', 'INV-February-2026-9011', 'February 2026', 500.00, 'Hand Cash | Shamim', '', '', '2026-02-10 11:39:12', '17:39:12', 'RCT-2026-02-000009', 'deposited', 10, '', '', 'shamim@ringtel', '2026-02-10 11:51:27', '', 'shamim@ringtel', '2026-02-10 11:52:11', ' Cash Received', 0, '2026-02-10 11:39:12', '2026-02-10 11:52:11'),
(65, 'amir@ringtel', 'Amir Hossain', '01748644644', 'Shop: 01, N/A, Razzak Plaza, Savar, Dhaka - 1340, Razzak Plaza', 'shamim9489@ringtel', 'Shamim Rony', 'INV-January-2026-9029', 'January 2026', 1000.00, 'Hand Cash | Shamim', '', '', '2026-02-10 12:33:57', '18:33:57', 'RCT-2026-02-000010', 'deposited', 10, '', '', 'shamim@ringtel', '2026-02-10 12:45:47', '', 'shamim@ringtel', '2026-02-10 12:46:29', 'Cash Received', 0, '2026-02-10 12:33:57', '2026-02-10 12:46:29'),
(66, 'md20@ringtel', 'Md Asik Parvej', '01960657413', '4A, N/A, Malancha R/A, Savar, Dhaka - 1340, Still Goli', 'shamim9489@ringtel', 'Shamim Rony', 'INV-January-2026-9028', 'January 2026', 500.00, 'Hand Cash | Shamim', '', '', '2026-02-10 12:38:52', '18:38:52', 'RCT-2026-02-000011', 'deposited', 10, '', '', 'shamim@ringtel', '2026-02-10 12:45:49', '', 'shamim@ringtel', '2026-02-10 12:46:31', 'Cash Received', 0, '2026-02-10 12:38:52', '2026-02-10 12:46:31'),
(67, 'g@ringtel', 'G M Ziaul Haque', '01708881666', '1A, A/2,, Wapda Road, Savar, Dhaka - 1340, Wapda Road', 'shamim9489@ringtel', 'Shamim Rony', 'INV-January-2026-9016', 'January 2026', 500.00, 'Hand Cash | Shamim', '', '', '2026-02-10 12:41:11', '18:41:11', 'RCT-2026-02-000012', 'deposited', 10, '', '', 'shamim@ringtel', '2026-02-10 12:45:51', '', 'shamim@ringtel', '2026-02-10 12:46:33', 'Cash Received', 0, '2026-02-10 12:41:11', '2026-02-10 12:46:33'),
(68, 'fahim@ringtel', 'Fahim Reza', '01670141373', '3A, 2/3,, Wapda Road, Savar, Dhaka - 1340, Wapda Road', 'shamim9489@ringtel', 'Shamim Rony', 'INV-January-2026-9009', 'January 2026', 500.00, 'Hand Cash | Shamim', '', '', '2026-02-10 12:42:23', '18:42:23', 'RCT-2026-02-000013', 'deposited', 10, '', '', 'shamim@ringtel', '2026-02-10 12:45:52', '', 'shamim@ringtel', '2026-02-10 12:46:35', 'Cash Received', 0, '2026-02-10 12:42:23', '2026-02-10 12:46:35'),
(69, 'md@ringtel', 'Md Raju Hossain', '01924772120', '3A, 3, Wapda Road, Savar, Dhaka - 1340, Dim Potti', 'shamim9489@ringtel', 'Shamim Rony', 'INV-January-2026-9002', 'January 2026', 500.00, 'Hand Cash | Shamim', '', '', '2026-02-10 12:45:10', '18:45:10', 'RCT-2026-02-000014', 'deposited', 10, '', '', 'shamim@ringtel', '2026-02-10 12:45:53', '', 'shamim@ringtel', '2026-02-10 12:46:37', 'Cash Received', 0, '2026-02-10 12:45:10', '2026-02-10 12:46:37'),
(70, 'md4@ringtel', 'Md Robin', '01845312323', '0, Shop: 02, Wapda Road, Savar, Dhaka - 1340, Dim Potti', 'shamim9489@ringtel', 'Shamim Rony', 'INV-February-2026-9006', 'February 2026', 500.00, 'Hand Cash | Shamim', '', '', '2026-02-11 08:39:38', '14:39:38', 'RCT-2026-02-000015', 'deposited', 10, '', '', 'shamim@ringtel', '2026-02-11 08:51:13', '', 'shamim@ringtel', '2026-02-11 08:51:34', 'Cash Received', 0, '2026-02-11 08:39:38', '2026-02-11 08:51:34'),
(71, 'md@ringtel', 'Md Raju Hossain', '01924772120', '3A, 3, Wapda Road, Savar, Dhaka - 1340, Dim Potti', 'shamim9489@ringtel', 'Shamim Rony', 'INV-February-2026-9002', 'February 2026', 500.00, 'Hand Cash | Shamim', '', '', '2026-02-11 08:39:55', '14:39:55', 'RCT-2026-02-000016', 'deposited', 10, '', '', 'shamim@ringtel', '2026-02-11 08:51:16', '', 'shamim@ringtel', '2026-02-11 08:51:37', 'Cash Received', 0, '2026-02-11 08:39:55', '2026-02-11 08:51:37'),
(72, 'md21@ringtel', 'Md Rajib Hossain', '01648499250', 'Shop: 01, B-119/1, Nasir Plaza, Savar, Dhaka - 1340, Nasir Plaza', 'shamim9489@ringtel', 'Shamim Rony', 'INV-February-2026-9031', 'February 2026', 500.00, 'Hand Cash | Shamim', '', '', '2026-02-11 08:40:11', '14:40:11', 'RCT-2026-02-000017', 'deposited', 10, '', '', 'shamim@ringtel', '2026-02-11 08:51:19', '', 'shamim@ringtel', '2026-02-11 08:51:40', 'Cash Received', 0, '2026-02-11 08:40:11', '2026-02-11 08:51:40'),
(73, 'md9@ringtel', 'Md Asik Parvej', '01910035661', 'Shop: 19, 3/2,, Wapda Road, Savar, Dhaka - 1340, Wapda Road', 'shamim9489@ringtel', 'Shamim Rony', 'INV-February-2026-9013', 'February 2026', 500.00, 'Hand Cash | Shamim', '', '', '2026-02-11 08:40:41', '14:40:41', 'RCT-2026-02-000018', 'deposited', 10, '', '', 'shamim@ringtel', '2026-02-11 08:51:22', '', 'shamim@ringtel', '2026-02-11 08:51:42', 'Cash Received', 0, '2026-02-11 08:40:41', '2026-02-11 08:51:42'),
(74, 'md2@ringtel', 'Md Arafat Hossen', '01704503771', '3B, 3/2, Wapda Road, Savar, Dhaka - 1340, Wapda Road', 'shamim9489@ringtel', 'Shamim Rony', 'INV-February-2026-9004', 'February 2026', 500.00, 'Hand Cash | Shamim', '', '', '2026-02-14 16:58:47', '22:58:47', 'RCT-2026-02-000019', 'deposited', 10, '', '', 'shamim@ringtel', '2026-02-15 15:36:58', '', 'shamim@ringtel', '2026-02-15 15:37:22', 'Cash Received', 0, '2026-02-14 16:58:47', '2026-02-15 15:37:22'),
(75, 'md12@ringtel', 'Md Aminul Islam ', '01711266326', 'Shop: 2, , N/A, Shop: 2, Hobi Plaza, Savar, Dhaka - 1340 , Hobi Plaza', 'shamim9489@ringtel', 'Shamim Rony', 'INV-January-2026-9019', 'January 2026', 500.00, 'Hand Cash | Shamim', '', '', '2026-02-15 04:26:06', '10:26:06', 'RCT-2026-02-000020', 'deposited', 10, '', '', 'shamim@ringtel', '2026-02-15 15:37:00', '', 'shamim@ringtel', '2026-02-15 15:37:28', 'Cash Received', 0, '2026-02-15 04:26:06', '2026-02-15 15:37:28'),
(76, 'md3@ringtel', 'Md Mohidur Rahman', '01819423812', '0, Shop: 05, Malancha Market, Savar, Dhaka - 1340, Dim Potti', 'shamim9489@ringtel', 'Shamim Rony', 'INV-February-2026-9005', 'February 2026', 500.00, 'Hand Cash | Shamim', '', '', '2026-02-15 04:28:36', '10:28:36', 'RCT-2026-02-000021', 'deposited', 10, '', '', 'shamim@ringtel', '2026-02-15 15:37:01', '', 'shamim@ringtel', '2026-02-15 15:37:31', 'Cash Received', 0, '2026-02-15 04:28:36', '2026-02-15 15:37:31'),
(77, 'g@ringtel', 'G M Ziaul Haque', '01708881666', '1A, A/2,, Wapda Road, Savar, Dhaka - 1340, Wapda Road', 'shamim9489@ringtel', 'Shamim Rony', 'INV-February-2026-9016', 'February 2026', 500.00, 'Bkash | Md Shamim Hossan Rony', 'DBA60XRSOO', '', '2026-02-15 15:13:04', '21:13:04', 'RCT-2026-02-000022', 'deposited', 0, '', '', 'shamim@ringtel', '2026-02-15 15:37:03', '', 'shamim@ringtel', '2026-02-15 15:37:41', 'bKash Received', 0, '2026-02-15 15:13:04', '2026-02-15 15:37:41'),
(78, 'elias@ringtel', 'Elias Jabed', '01715507037', '3A, N/A, Press Goli, Malancha R/A, Savar, Dhaka - 1340, Still Goli', 'shamim9489@ringtel', 'Shamim Rony', 'INV-February-2026-9018', 'February 2026', 500.00, 'Hand Cash | Shamim', '', '', '2026-02-15 15:13:56', '21:13:56', 'RCT-2026-02-000023', 'deposited', 10, '', '', 'shamim@ringtel', '2026-02-15 15:37:04', '', 'shamim@ringtel', '2026-02-15 15:37:45', 'Cash Received', 0, '2026-02-15 15:13:56', '2026-02-15 15:37:45'),
(79, 'md10@ringtel', 'Md Zakaria', '01623623074', '4B, 3, Wapda Road, Savar, Dhaka - 1340, Dim Potti', 'shamim9489@ringtel', 'Shamim Rony', 'INV-January-2026-9014', 'January 2026', 700.00, 'Bkash | Md Shamim Hossan Rony', 'DBE14B9JGH', '', '2026-02-15 15:15:29', '21:15:29', 'RCT-2026-02-000024', 'deposited', 0, '', '', 'shamim@ringtel', '2026-02-15 15:37:06', '', 'shamim@ringtel', '2026-02-15 15:37:56', 'bKash Received', 0, '2026-02-15 15:15:29', '2026-02-15 15:37:56'),
(80, 'shamim1@ringtel', 'Shamim Hossain ', '01677858523', '4C, 1, Molla Hotel, Savar, Dhaka - 1340, Dim Potti', 'shamim9489@ringtel', 'Shamim Rony', 'INV-February-2026-9034', 'February 2026', 500.00, 'Hand Cash | Shamim', '', '', '2026-02-15 16:10:25', '22:10:25', 'RCT-2026-02-000025', 'deposited', 10, '', '', 'shamim@ringtel', '2026-02-15 16:11:12', '', 'shamim@ringtel', '2026-02-15 16:11:20', 'Cash Received', 0, '2026-02-15 16:10:25', '2026-02-15 16:11:20'),
(81, 'md13@ringtel', 'Md Manik Mia', '01781666692', '2A, N/A, Malancha Market, Savar, Dhaka - 1340, Dim Potti', 'shamim9489@ringtel', 'Shamim Rony', 'INV-February-2026-9020', 'February 2026', 800.00, 'Bkash | Md Shamim Hossan Rony', '74Y4PQGC', '', '2026-02-18 14:01:00', '20:01:00', 'RCT-2026-02-000026', 'deposited', 0, '', '', 'shamim@ringtel', '2026-02-18 14:01:34', '', 'shamim@ringtel', '2026-02-18 14:01:58', 'Received via Nagad App', 0, '2026-02-18 14:01:00', '2026-02-18 14:01:58');

-- --------------------------------------------------------

--
-- Table structure for table `employee_salaries`
--

CREATE TABLE `employee_salaries` (
  `id` int(11) NOT NULL,
  `employeeId` varchar(255) NOT NULL,
  `employeeName` varchar(255) NOT NULL,
  `department` varchar(255) NOT NULL,
  `designation` varchar(255) NOT NULL,
  `salaryMonth` varchar(255) NOT NULL,
  `salaryYear` int(11) NOT NULL,
  `basicSalary` decimal(10,2) NOT NULL DEFAULT 0.00,
  `houseRent` decimal(10,2) NOT NULL DEFAULT 0.00,
  `medicalAllowance` decimal(10,2) NOT NULL DEFAULT 0.00,
  `travelAllowance` decimal(10,2) NOT NULL DEFAULT 0.00,
  `otherAllowances` decimal(10,2) NOT NULL DEFAULT 0.00,
  `providentFund` decimal(10,2) NOT NULL DEFAULT 0.00,
  `taxDeduction` decimal(10,2) NOT NULL DEFAULT 0.00,
  `otherDeductions` decimal(10,2) NOT NULL DEFAULT 0.00,
  `totalWorkingDays` int(11) NOT NULL DEFAULT 0,
  `presentDays` decimal(5,2) NOT NULL DEFAULT 0.00,
  `absentDays` int(11) NOT NULL DEFAULT 0,
  `paidLeaves` int(11) NOT NULL DEFAULT 0,
  `unpaidLeaves` int(11) NOT NULL DEFAULT 0,
  `overtimeHours` decimal(5,2) NOT NULL DEFAULT 0.00,
  `overtimeRate` decimal(10,2) NOT NULL DEFAULT 0.00,
  `overtimeAmount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `performanceBonus` decimal(10,2) NOT NULL DEFAULT 0.00,
  `festivalBonus` decimal(10,2) NOT NULL DEFAULT 0.00,
  `otherBonuses` decimal(10,2) NOT NULL DEFAULT 0.00,
  `grossSalary` decimal(10,2) NOT NULL DEFAULT 0.00,
  `totalDeductions` decimal(10,2) NOT NULL DEFAULT 0.00,
  `netSalary` decimal(10,2) NOT NULL DEFAULT 0.00,
  `paymentStatus` enum('pending','paid','failed','cancelled') NOT NULL DEFAULT 'pending',
  `paymentDate` datetime DEFAULT NULL,
  `paymentMethod` enum('bank','cash','mobile_banking') NOT NULL DEFAULT 'bank',
  `bankAccount` varchar(255) DEFAULT '',
  `salaryId` varchar(255) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `expenses`
--

CREATE TABLE `expenses` (
  `id` int(11) NOT NULL,
  `expenseCode` varchar(255) NOT NULL,
  `note` text DEFAULT NULL,
  `expenseCategoryId` int(11) NOT NULL,
  `expenseSubcategoryId` int(11) DEFAULT NULL,
  `totalAmount` decimal(15,2) NOT NULL,
  `date` date NOT NULL,
  `image` varchar(500) DEFAULT NULL,
  `status` enum('Pending','Approved','Rejected','Partially_Paid','Paid') NOT NULL DEFAULT 'Pending',
  `paymentStatus` enum('Pending','Partially_Paid','Paid') NOT NULL DEFAULT 'Pending',
  `approvedBy` varchar(255) DEFAULT NULL,
  `isClientExpense` tinyint(1) NOT NULL,
  `clientId` int(11) DEFAULT NULL,
  `approvedAt` datetime DEFAULT NULL,
  `rejectionReason` text DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `expenses`
--

INSERT INTO `expenses` (`id`, `expenseCode`, `note`, `expenseCategoryId`, `expenseSubcategoryId`, `totalAmount`, `date`, `image`, `status`, `paymentStatus`, `approvedBy`, `isClientExpense`, `clientId`, `approvedAt`, `rejectionReason`, `isActive`, `createdAt`, `updatedAt`) VALUES
(3, 'EXP-676356-616', 'Speed Net Recharge', 6, 38, 3500.00, '2026-01-26', NULL, 'Approved', 'Paid', 'admin', 0, 0, '2026-01-26 04:28:25', NULL, 1, '2026-01-26 04:27:56', '2026-01-26 04:28:25'),
(4, 'EXP-001573-128', 'Speed Net Recharge. ', 6, 38, 5100.00, '2026-01-15', NULL, 'Approved', 'Paid', 'admin', 0, 0, '2026-01-26 04:33:36', NULL, 1, '2026-01-26 04:33:21', '2026-01-26 04:33:36'),
(5, 'EXP-190221-432', 'Raju & Selim Connection fee.', 3, 16, 500.00, '2026-01-16', NULL, 'Approved', 'Paid', 'admin', 0, 0, '2026-01-26 04:37:11', NULL, 1, '2026-01-26 04:36:30', '2026-01-26 04:37:11'),
(8, 'EXP-575572-281', NULL, 3, 16, 600.00, '2026-01-28', NULL, 'Approved', 'Paid', 'admin', 1, 95, '2026-02-01 07:55:29', NULL, 1, '2026-01-31 13:36:15', '2026-02-01 07:55:29'),
(13, 'EXP-699160-161', 'Raju & Selim Splicer bill', 3, 16, 650.00, '2026-01-18', NULL, 'Approved', 'Paid', 'admin', 1, 89, '2026-02-04 17:05:21', NULL, 1, '2026-02-04 17:04:59', '2026-02-05 03:22:54'),
(14, 'EXP-055799-774', 'Jan\'26 TnT Bill ', 6, 35, 175.00, '2026-01-30', NULL, 'Approved', 'Paid', 'admin', 0, NULL, '2026-02-05 03:28:25', NULL, 1, '2026-02-05 03:27:35', '2026-02-05 03:28:25');

-- --------------------------------------------------------

--
-- Table structure for table `expense_categories`
--

CREATE TABLE `expense_categories` (
  `id` int(11) NOT NULL,
  `categoryName` varchar(255) NOT NULL,
  `categoryCode` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `budgetLimit` decimal(15,2) NOT NULL DEFAULT 0.00,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `requiresApproval` tinyint(1) NOT NULL DEFAULT 0,
  `createdBy` varchar(255) NOT NULL DEFAULT 'admin',
  `updatedBy` varchar(255) DEFAULT NULL,
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
  `id` int(11) NOT NULL,
  `expenseId` int(11) NOT NULL,
  `accountId` int(11) NOT NULL,
  `paymentAmount` decimal(15,2) NOT NULL,
  `status` enum('Pending','Processed','Failed') NOT NULL DEFAULT 'Pending',
  `processedAt` datetime DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `createdBy` varchar(255) NOT NULL DEFAULT 'admin',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `expense_payments`
--

INSERT INTO `expense_payments` (`id`, `expenseId`, `accountId`, `paymentAmount`, `status`, `processedAt`, `notes`, `createdBy`, `createdAt`, `updatedAt`) VALUES
(7, 3, 9, 3500.00, 'Processed', '2026-01-26 04:28:25', NULL, 'admin', '2026-01-26 04:27:56', '2026-01-26 04:28:25'),
(8, 4, 10, 5100.00, 'Processed', '2026-01-26 04:33:36', NULL, 'admin', '2026-01-26 04:33:21', '2026-01-26 04:33:36'),
(10, 5, 10, 500.00, 'Processed', '2026-01-26 04:37:11', NULL, 'admin', '2026-01-26 04:37:02', '2026-01-26 04:37:11'),
(14, 8, 10, 600.00, 'Processed', '2026-02-01 07:55:29', NULL, 'admin', '2026-01-31 13:36:15', '2026-02-01 07:55:29'),
(20, 13, 10, 650.00, 'Pending', NULL, NULL, 'admin', '2026-02-05 03:22:54', '2026-02-05 03:22:54'),
(21, 14, 10, 175.00, 'Processed', '2026-02-05 03:28:25', NULL, 'admin', '2026-02-05 03:27:35', '2026-02-05 03:28:25');

-- --------------------------------------------------------

--
-- Table structure for table `expense_sub_categories`
--

CREATE TABLE `expense_sub_categories` (
  `id` int(11) NOT NULL,
  `subCategoryName` varchar(255) NOT NULL,
  `subCategoryCode` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `budgetLimit` decimal(15,2) NOT NULL DEFAULT 0.00,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `requiresApproval` tinyint(1) NOT NULL DEFAULT 0,
  `categoryId` int(11) NOT NULL,
  `createdBy` varchar(255) NOT NULL DEFAULT 'admin',
  `updatedBy` varchar(255) DEFAULT NULL,
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
  `id` int(11) NOT NULL,
  `serverName` varchar(255) NOT NULL,
  `serverLink` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
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
  `id` int(11) NOT NULL,
  `categoryName` varchar(255) NOT NULL,
  `categoryDetails` text DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
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
  `id` int(11) NOT NULL,
  `packageName` varchar(255) NOT NULL,
  `packageBandwidth` varchar(255) NOT NULL,
  `packagePrice` decimal(10,2) NOT NULL,
  `packageDetails` text DEFAULT NULL,
  `packageFeatures` text DEFAULT NULL,
  `packageType` varchar(255) NOT NULL DEFAULT 'Residential',
  `duration` varchar(255) NOT NULL DEFAULT 'Monthly',
  `downloadSpeed` varchar(255) DEFAULT NULL,
  `uploadSpeed` varchar(255) DEFAULT NULL,
  `dataLimit` varchar(255) DEFAULT 'Unlimited',
  `installationFee` decimal(10,2) DEFAULT 0.00,
  `discount` decimal(10,2) DEFAULT 0.00,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
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
-- Table structure for table `payment-methods`
--

CREATE TABLE `payment-methods` (
  `id` int(11) NOT NULL,
  `methodId` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `iconUrl` varchar(255) DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `merchantNumber` varchar(255) NOT NULL,
  `merchantName` varchar(255) NOT NULL,
  `paymentType` varchar(255) NOT NULL,
  `hasQRCode` tinyint(1) NOT NULL DEFAULT 0,
  `qrCodeUrl` varchar(255) DEFAULT NULL,
  `colors` text DEFAULT NULL,
  `appInstructions` text DEFAULT NULL,
  `manualInstructions` text DEFAULT NULL,
  `qrInstructions` text DEFAULT NULL,
  `importantNotes` text DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'active',
  `createdBy` varchar(255) DEFAULT NULL,
  `updatedBy` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payment-methods`
--

INSERT INTO `payment-methods` (`id`, `methodId`, `name`, `iconUrl`, `isActive`, `merchantNumber`, `merchantName`, `paymentType`, `hasQRCode`, `qrCodeUrl`, `colors`, `appInstructions`, `manualInstructions`, `qrInstructions`, `importantNotes`, `status`, `createdBy`, `updatedBy`, `createdAt`, `updatedAt`) VALUES
(1, 'bkash', 'bKash', 'https://server.billisp.com/uploads/ad03101c52cf4de5.png', 1, '01684175551', 'SRS Technology', 'Payment', 1, 'https://server.billisp.com/uploads/d03101c52cf4de52.jpeg', '{\"primary\":\"#e2136e\",\"secondary\":\"#e2136e99\",\"gradient\":\"linear-gradient(135deg, #e2136e 0%, #e2136e99 100%)\"}', '[\"Open bKash app on your phone\",\"Go to \'Payment\' section\",\"Enter Merchant Number: 01684175551\",\"Enter Amount: {totalAmount} BDT\",\"Enter Reference: {customerId}\",\"Enter your bKash PIN to complete\"]', '[\"Dial *247# from your mobile\",\"Select \'Payment\' (Option 3)\",\"Enter Merchant Number: 01684175551\",\"Enter Amount: {totalAmount} BDT\",\"Enter Reference: {customerId}\",\"Enter your bKash PIN to complete\"]', '{\"title\":\"bKash QR Code\",\"scanInstruction\":\"Scan with bKash app to pay\",\"steps\":[\"Open bKash app on your phone\",\"Tap on \'Scan QR Code\' option\",\"Point your camera at this QR code\",\"Confirm the payment details\",\"Enter your bKash PIN to complete\"],\"importantNote\":\"After scanning, verify the merchant name \'S R S Technology\' and amount \'{totalAmount}\' before confirming payment.\",\"colorClass\":\"text-pink-500\",\"bgGradient\":\"from-pink-100 to-pink-300\",\"borderColor\":\"border-pink-400\",\"buttonColor\":\"bg-pink-600 hover:bg-pink-700\",\"iconColor\":\"text-pink-600\"}', '[\"Keep transaction ID safely for future reference\",\"Use your registered phone number for payment\",\"Payment processing may take 5-10 minutes\",\"Make sure you have sufficient balance\"]', 'active', 'system', 'system', '2026-01-30 18:47:26', '2026-01-30 19:42:09'),
(2, 'nagad', 'Nagad', 'https://server.billisp.com/uploads/03101c52cf4de524.png', 1, '01684175551', 'S R S Technology', 'Payment', 0, NULL, '{\"primary\":\"#f8a61c\",\"secondary\":\"#f8a61c99\",\"gradient\":\"linear-gradient(135deg, #f8a61c 0%, #f8a61c99 100%)\"}', '[\"Open Nagad app on your phone\",\"Go to \'Send Money\' section\",\"Enter Account Number: 01684175551\",\"Enter Amount\",\"Add Reference:\",\"Enter your Nagad PIN to complete\"]', '[\"Dial *167# from your mobile\",\"Select \'Send Money\'\",\"Enter Account Number: 01684175551\",\"Enter Amount\",\"Enter Reference\",\"Enter your Nagad PIN to complete\"]', '{\"title\":\"\",\"scanInstruction\":\"\",\"steps\":[],\"importantNote\":\"\",\"colorClass\":\"\",\"bgGradient\":\"\",\"borderColor\":\"\",\"buttonColor\":\"\",\"iconColor\":\"\"}', '[\"Keep transaction ID safely for future reference\",\"Use your registered phone number for payment\",\"Payment processing may take 5-10 minutes\",\"Make sure you have sufficient balance\"]', 'active', 'system', 'system', '2026-01-30 18:50:52', '2026-01-30 18:50:52'),
(3, 'upay', 'UPay', 'https://server.billisp.com/uploads/3101c52cf4de5244.png', 1, '01684175551', 'S R S Technology', 'Payment', 1, 'https://server.billisp.com/uploads/101c52cf4de5244c.jpeg', '{\"primary\":\"#00a79d\",\"secondary\":\"#00a79d99\",\"gradient\":\"linear-gradient(135deg, #00a79d 0%, #00a79d99 100%)\"}', '[\"Open UPay app on your phone\",\"Go to \'Send Money\' or \'Payment\'\",\"Enter Merchant Number: 01684175551\",\"Enter Amount:\",\"Add Note: 9030\",\"Enter your UPay PIN to complete\"]', '[\"Dial *268# from your mobile\",\"Select \'Send Money\'\",\"Enter Account Number: 01684175551\",\"Enter Amount: 500 BDT\",\"Add Reference: 9030\",\"Enter your UPay PIN to complete\"]', '{\"title\":\"\",\"scanInstruction\":\"\",\"steps\":[\"Open UPay app on your phone\",\"Tap on \'Scan QR\' or \'Scan to Pay\'\",\"Point your camera at this QR code\",\"Verify payment amount and merchant\",\"Enter your UPay PIN to complete\"],\"importantNote\":\"After scanning, verify the merchant name \'S R S Technology\' and amount before confirming payment.\",\"colorClass\":\"#00a79d\",\"bgGradient\":\"#00a79d\",\"borderColor\":\"#00a79d\",\"buttonColor\":\"#00a79d\",\"iconColor\":\"#00a79d\"}', '[\"Keep transaction ID safely for future reference\",\"Use your registered phone number for payment\",\"Payment processing may take 5-10 minutes\",\"Make sure you have sufficient balance\",\"For QR code payment, scan with UPay app only\"]', 'active', 'system', 'system', '2026-01-30 18:55:51', '2026-01-30 18:55:51'),
(4, 'rocket', 'Rocket', 'https://server.billisp.com/uploads/01c52cf4de5244c8.jpeg', 1, '01684175551', 'S R S Technology', 'Payment', 0, NULL, '{\"primary\":\"#6a5acd\",\"secondary\":\"#6a5acd99\",\"gradient\":\"linear-gradient(135deg, #6a5acd 0%, #6a5acd99 100%)\"}', '[]', '[]', '{\"title\":\"\",\"scanInstruction\":\"\",\"steps\":[],\"importantNote\":\"\",\"colorClass\":\"\",\"bgGradient\":\"\",\"borderColor\":\"\",\"buttonColor\":\"\",\"iconColor\":\"\"}', '[]', 'coming_soon', 'system', 'system', '2026-01-30 18:57:47', '2026-01-30 18:57:47');

-- --------------------------------------------------------

--
-- Table structure for table `public_contacts`
--

CREATE TABLE `public_contacts` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `public_contacts`
--

INSERT INTO `public_contacts` (`id`, `name`, `email`, `phone`, `subject`, `message`, `created_at`, `updated_at`) VALUES
(3, 'Rohit Khan', 'shamim.srstech@gmail.com', '01533795050', 'Test MSG', 'Hi There, \n\nThis is a test msg from public contact form.\nRegards', '2026-02-13 13:43:54', '2026-02-13 13:43:54');

-- --------------------------------------------------------

--
-- Table structure for table `reminders`
--

CREATE TABLE `reminders` (
  `id` int(11) NOT NULL,
  `reminderId` varchar(255) NOT NULL,
  `customerId` int(11) NOT NULL,
  `customerName` varchar(255) NOT NULL,
  `customerPhone` varchar(255) NOT NULL,
  `customerEmail` varchar(255) DEFAULT NULL,
  `serviceType` enum('Internet','TV','Phone','Bundle','Installation','Maintenance','Other') NOT NULL DEFAULT 'Internet',
  `packageName` varchar(255) NOT NULL,
  `amountDue` decimal(10,2) NOT NULL,
  `dueDate` datetime NOT NULL,
  `reminderType` enum('Payment Due','Payment Overdue','Service Renewal','Contract Expiry','Special Offer','Maintenance Reminder','Custom') NOT NULL DEFAULT 'Payment Due',
  `reminderMethod` enum('SMS','Email','Email & System','System Only') NOT NULL DEFAULT 'SMS',
  `message` text NOT NULL,
  `status` enum('Pending','Sent','Failed','Cancelled') NOT NULL DEFAULT 'Pending',
  `scheduledAt` datetime NOT NULL,
  `sentAt` datetime DEFAULT NULL,
  `priority` enum('Low','Medium','High','Urgent') NOT NULL DEFAULT 'Medium',
  `retryCount` int(11) NOT NULL DEFAULT 0,
  `maxRetries` int(11) NOT NULL DEFAULT 3,
  `responseData` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `isRecurring` tinyint(1) NOT NULL DEFAULT 0,
  `recurrencePattern` enum('Daily','Weekly','Monthly','Yearly','Custom') DEFAULT NULL,
  `nextReminderDate` datetime DEFAULT NULL,
  `createdBy` varchar(255) NOT NULL DEFAULT 'admin',
  `updatedBy` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reminders`
--

INSERT INTO `reminders` (`id`, `reminderId`, `customerId`, `customerName`, `customerPhone`, `customerEmail`, `serviceType`, `packageName`, `amountDue`, `dueDate`, `reminderType`, `reminderMethod`, `message`, `status`, `scheduledAt`, `sentAt`, `priority`, `retryCount`, `maxRetries`, `responseData`, `notes`, `isRecurring`, `recurrencePattern`, `nextReminderDate`, `createdBy`, `updatedBy`, `createdAt`, `updatedAt`) VALUES
(17, 'REM1770263377311908', 78, 'Tanvir Hossan', '01515657935', 'tanvir.016891@gmail.com', 'Internet', '10 Mbps - 10 Mbps (Price: 350.00/- BDT)', 350.00, '2026-02-05 00:00:00', 'Payment Due', 'SMS', 'Dear Tanvir Hossan, your payment of BDT 350.00 for 10 Mbps - 10 Mbps (Price: 350.00/- BDT) is due on 2/5/2026. Please make payment to avoid service interruption.', 'Sent', '2026-02-05 03:49:00', '2026-02-05 03:55:52', 'High', 0, 3, '{\"sent\":true,\"timestamp\":\"2026-02-05T03:55:52.087Z\"}', 'Test Reminder', 0, 'Monthly', NULL, 'admin', 'admin', '2026-02-05 03:49:37', '2026-02-05 03:55:52'),
(18, 'REM1770478303702549', 84, 'Md Shahadat Hossain Shamol', '01921088100', 'nushu4321@gmail.com', 'Internet', '10 Mbps', 500.00, '2026-02-08 00:00:00', 'Payment Due', 'SMS', 'Dear Md Shahadat Hossain Shamol,\nYour payment of BDT 500.00 for 10 Mbps is due on 02/07/2026. Please make payment to avoid service interruption. Thank you.', 'Cancelled', '2026-02-07 15:34:00', NULL, 'Medium', 0, 3, NULL, '', 0, 'Monthly', NULL, 'admin', 'admin', '2026-02-07 15:31:43', '2026-02-13 12:44:26');

-- --------------------------------------------------------

--
-- Table structure for table `role-permissions`
--

CREATE TABLE `role-permissions` (
  `id` int(11) NOT NULL,
  `roleName` varchar(255) NOT NULL,
  `permissions` text NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `salaries`
--

CREATE TABLE `salaries` (
  `id` int(11) NOT NULL,
  `employeeId` varchar(255) NOT NULL,
  `employeeName` varchar(255) NOT NULL,
  `department` varchar(255) NOT NULL,
  `designation` varchar(255) NOT NULL,
  `salaryMonth` varchar(255) DEFAULT NULL,
  `salaryYear` int(11) DEFAULT NULL,
  `basicSalary` decimal(10,2) NOT NULL DEFAULT 0.00,
  `houseRent` decimal(10,2) NOT NULL DEFAULT 0.00,
  `medicalAllowance` decimal(10,2) NOT NULL DEFAULT 0.00,
  `travelAllowance` decimal(10,2) NOT NULL DEFAULT 0.00,
  `otherAllowances` decimal(10,2) NOT NULL DEFAULT 0.00,
  `providentFund` decimal(10,2) NOT NULL DEFAULT 0.00,
  `taxDeduction` decimal(10,2) NOT NULL DEFAULT 0.00,
  `otherDeductions` decimal(10,2) NOT NULL DEFAULT 0.00,
  `totalWorkingDays` int(11) NOT NULL DEFAULT 26,
  `presentDays` decimal(5,2) NOT NULL DEFAULT 0.00,
  `absentDays` int(11) NOT NULL DEFAULT 0,
  `paidLeaves` int(11) NOT NULL DEFAULT 0,
  `unpaidLeaves` int(11) NOT NULL DEFAULT 0,
  `overtimeHours` decimal(5,2) NOT NULL DEFAULT 0.00,
  `overtimeRate` decimal(10,2) NOT NULL DEFAULT 200.00,
  `overtimeAmount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `performanceBonus` decimal(10,2) NOT NULL DEFAULT 0.00,
  `festivalBonus` decimal(10,2) NOT NULL DEFAULT 0.00,
  `otherBonuses` decimal(10,2) NOT NULL DEFAULT 0.00,
  `grossSalary` decimal(10,2) NOT NULL DEFAULT 0.00,
  `totalDeductions` decimal(10,2) NOT NULL DEFAULT 0.00,
  `netSalary` decimal(10,2) NOT NULL DEFAULT 0.00,
  `paymentStatus` enum('pending','paid','failed','cancelled') NOT NULL DEFAULT 'pending',
  `paymentDate` datetime DEFAULT NULL,
  `paymentMethod` enum('bank','cash','mobile_banking') NOT NULL DEFAULT 'bank',
  `bankAccount` varchar(255) DEFAULT '',
  `salaryId` varchar(255) NOT NULL,
  `createdBy` varchar(255) DEFAULT 'admin',
  `note` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `salaries`
--

INSERT INTO `salaries` (`id`, `employeeId`, `employeeName`, `department`, `designation`, `salaryMonth`, `salaryYear`, `basicSalary`, `houseRent`, `medicalAllowance`, `travelAllowance`, `otherAllowances`, `providentFund`, `taxDeduction`, `otherDeductions`, `totalWorkingDays`, `presentDays`, `absentDays`, `paidLeaves`, `unpaidLeaves`, `overtimeHours`, `overtimeRate`, `overtimeAmount`, `performanceBonus`, `festivalBonus`, `otherBonuses`, `grossSalary`, `totalDeductions`, `netSalary`, `paymentStatus`, `paymentDate`, `paymentMethod`, `bankAccount`, `salaryId`, `createdBy`, `note`, `createdAt`, `updatedAt`) VALUES
(15, 'emran3183@ringtel', 'Emran Khan', 'Proprietor', 'seller', NULL, NULL, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 26, 0.00, 0, 0, 0, 0.00, 200.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 'pending', NULL, 'mobile_banking', '01777180394', 'SAL000001', 'admin', '', '2026-01-22 04:25:57', '2026-01-22 04:25:57'),
(16, 'md4633@ringtel', 'Md Mokhlesur Rahman', 'Proprietor', 'seller', NULL, NULL, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 26, 0.00, 0, 0, 0, 0.00, 200.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 'pending', NULL, 'mobile_banking', '01772828292', 'SAL000002', 'admin', '', '2026-01-22 08:04:44', '2026-01-22 08:04:44'),
(17, 'md9423@ringtel', 'Md Manik Mia', 'Proprietor', 'seller', NULL, NULL, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 26, 0.00, 0, 0, 0, 0.00, 200.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 'pending', NULL, 'mobile_banking', '01781666692', 'SAL000003', 'admin', '', '2026-01-22 08:05:16', '2026-01-22 08:05:16'),
(18, 'shamim9489@ringtel', 'Shamim Rony', 'Manager', 'manager', NULL, NULL, 5000.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 26, 0.00, 0, 0, 0, 0.00, 200.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 5000.00, 'pending', NULL, 'cash', '', 'SAL000004', 'admin', '', '2026-02-01 08:18:46', '2026-02-01 08:18:46');

-- --------------------------------------------------------

--
-- Table structure for table `salary_assignments`
--

CREATE TABLE `salary_assignments` (
  `id` int(11) NOT NULL,
  `salaryId` varchar(255) NOT NULL,
  `employeeId` varchar(255) NOT NULL,
  `employeeName` varchar(255) NOT NULL,
  `department` varchar(255) NOT NULL,
  `designation` varchar(255) NOT NULL,
  `salaryMonth` varchar(255) NOT NULL,
  `salaryYear` int(11) NOT NULL,
  `basicSalary` float NOT NULL DEFAULT 0,
  `houseRent` float NOT NULL DEFAULT 0,
  `medicalAllowance` float NOT NULL DEFAULT 0,
  `travelAllowance` float NOT NULL DEFAULT 0,
  `otherAllowances` float NOT NULL DEFAULT 0,
  `providentFund` float NOT NULL DEFAULT 0,
  `taxDeduction` float NOT NULL DEFAULT 0,
  `otherDeductions` float NOT NULL DEFAULT 0,
  `totalWorkingDays` int(11) NOT NULL,
  `presentDays` int(11) NOT NULL,
  `absentDays` int(11) NOT NULL,
  `paidLeaves` int(11) NOT NULL DEFAULT 0,
  `unpaidLeaves` int(11) NOT NULL DEFAULT 0,
  `overtimeHours` float NOT NULL DEFAULT 0,
  `overtimeRate` float NOT NULL DEFAULT 0,
  `overtimeAmount` float NOT NULL DEFAULT 0,
  `performanceBonus` float NOT NULL DEFAULT 0,
  `festivalBonus` float NOT NULL DEFAULT 0,
  `otherBonuses` float NOT NULL DEFAULT 0,
  `grossSalary` float DEFAULT NULL,
  `totalDeductions` float DEFAULT NULL,
  `netSalary` float DEFAULT NULL,
  `paymentStatus` enum('pending','paid','failed','cancelled') NOT NULL DEFAULT 'pending',
  `paymentDate` datetime DEFAULT NULL,
  `paymentMethod` enum('bank','cash','mobile_banking') DEFAULT NULL,
  `bankAccount` varchar(255) DEFAULT NULL,
  `createdBy` varchar(255) NOT NULL,
  `note` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `salary_assignments`
--

INSERT INTO `salary_assignments` (`id`, `salaryId`, `employeeId`, `employeeName`, `department`, `designation`, `salaryMonth`, `salaryYear`, `basicSalary`, `houseRent`, `medicalAllowance`, `travelAllowance`, `otherAllowances`, `providentFund`, `taxDeduction`, `otherDeductions`, `totalWorkingDays`, `presentDays`, `absentDays`, `paidLeaves`, `unpaidLeaves`, `overtimeHours`, `overtimeRate`, `overtimeAmount`, `performanceBonus`, `festivalBonus`, `otherBonuses`, `grossSalary`, `totalDeductions`, `netSalary`, `paymentStatus`, `paymentDate`, `paymentMethod`, `bankAccount`, `createdBy`, `note`, `createdAt`, `updatedAt`) VALUES
(37, 'SAL-2026-01-978', 'shamim9489@ringtel', 'Shamim Rony', 'Manager', 'manager', '2026-01', 2026, 5000, 0, 0, 0, 0, 0, 0, 0, 26, 0, 0, 0, 0, 0, 200, 0, 0, 0, 0, NULL, NULL, NULL, 'paid', '2026-02-02 00:00:00', 'cash', '', 'admin', '', '2026-02-02 04:54:38', '2026-02-02 04:54:49'),
(38, 'SAL-2026-02-683', 'shamim9489@ringtel', 'Shamim Rony', 'Manager', 'manager', '2026-02', 2026, 5000, 0, 0, 0, 0, 0, 0, 4990, 20, 7, 0, 0, 0, 0, 200, 0, 0, 0, 0, NULL, NULL, NULL, 'paid', '2026-02-07 15:44:51', 'cash', '', 'admin', '', '2026-02-07 15:44:20', '2026-02-07 15:44:56');

-- --------------------------------------------------------

--
-- Table structure for table `sms_configs`
--

CREATE TABLE `sms_configs` (
  `id` int(11) NOT NULL,
  `appName` varchar(255) NOT NULL,
  `apiKey` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL DEFAULT 'unicode',
  `senderId` varchar(255) NOT NULL,
  `service` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sms_configs`
--

INSERT INTO `sms_configs` (`id`, `appName`, `apiKey`, `type`, `senderId`, `service`, `message`, `createdAt`, `updatedAt`) VALUES
(1, 'New Client SMS', 'C400102369708eca4d1604.85945999', 'unicode', 'Ring Tel', 'Account Creation', 'প্রিয় গ্রাহক, Ring Tel এ আপনাকে স্বাগতম। আপনার একাউন্ট তৈরি হয়েছে। Software: https://admin.billisp.com Login ID: {email}, Password: {password}, প্যাকেজ: {package}, বিল: {billAmount} টাকা। ধন্যবাদ।', '2026-02-06 15:10:33', '2026-02-17 04:44:16'),
(2, 'Bill Collection SMS', 'C400102369708eca4d1604.85945999', 'unicode', 'Ring Tel', 'Bill collection', 'প্রিয় গ্রাহক, বিল পেয়েছি। ID: {routerLoginId}, মাসিক বিল: {billAmount} টাকা, ডিসকাউন্ট: {discount} টাকা, প্রাপ্তি: {receivedAmount} টাকা, মাস: {month}, তারিখ: {date}। ধন্যবাদ।', '2026-02-06 15:12:18', '2026-02-15 04:27:25'),
(3, 'Reminder SMS', 'C400102369708eca4d1604.85945999', 'unicode', 'Ring Tel', 'Reminder', 'প্রিয় {fullName}, আপনার নেট বিল বকেয়া রয়েছে। বকেয়া: {dueAmount} টাকা, প্যাকেজ: {packageName}, শেষ তারিখ: {dueDate}। Payment Link: https://admin.billisp.com/customer/pay-bill। ধন্যবাদ।', '2026-02-06 15:13:00', '2026-02-14 16:57:06'),
(5, 'Salary SMS', 'C400102369708eca4d1604.85945999', 'unicode', 'Ring Tel', 'Salary receive', 'প্রিয় {fullName}, আপনার স্যালারি {salaryAmount} টাকা প্রদান করা হয়েছে। কর্ম মাস: {salaryMonth} {salaryYear}, পদবী: {designation}। ধন্যবাদ।', '2026-02-13 13:09:18', '2026-02-18 06:45:27');

-- --------------------------------------------------------

--
-- Table structure for table `tickets`
--

CREATE TABLE `tickets` (
  `id` int(11) NOT NULL,
  `ticketMadeBy` varchar(255) NOT NULL,
  `ticketId` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `assignedTo` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `trxId` varchar(255) NOT NULL,
  `amount` float NOT NULL,
  `billingMonth` varchar(255) NOT NULL,
  `billingYear` varchar(255) NOT NULL,
  `phoneNumber` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `remark` varchar(255) NOT NULL DEFAULT '',
  `approvedBy` varchar(255) DEFAULT NULL COMMENT 'User ID or name of the person who approved this transaction',
  `approvedAt` datetime DEFAULT NULL COMMENT 'Timestamp when the transaction was approved',
  `approvalRemark` varchar(255) DEFAULT NULL COMMENT 'Additional remarks from approver',
  `rejectedBy` varchar(255) DEFAULT NULL,
  `rejectedAt` datetime DEFAULT NULL,
  `rejectionReason` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `userId`, `trxId`, `amount`, `billingMonth`, `billingYear`, `phoneNumber`, `status`, `remark`, `approvedBy`, `approvedAt`, `approvalRemark`, `rejectedBy`, `rejectedAt`, `rejectionReason`, `createdAt`, `updatedAt`) VALUES
(15, '94', 'DA91WNJY7L', 500, 'January', '2026', '01939557941', 'approved', '', '28', '2026-01-23 07:50:46', '', NULL, NULL, NULL, '2026-01-23 07:43:09', '2026-01-23 07:50:46'),
(16, '75', 'DAB01GMYPM', 500, 'January', '2026', '01615809095', 'approved', '', '28', '2026-01-23 07:50:21', '', NULL, NULL, NULL, '2026-01-23 07:48:14', '2026-01-23 07:50:21'),
(19, '84', 'DAA20ID8NK', 500, 'January', '2026', '01921088100', 'approved', '', '28', '2026-01-24 09:03:24', '', NULL, NULL, NULL, '2026-01-24 05:33:50', '2026-01-24 09:03:24'),
(20, '90', 'DAC22J4AT8', 500, 'January', '2026', '01408561806', 'approved', '', '28', '2026-01-24 09:03:11', '', NULL, NULL, NULL, '2026-01-24 05:39:25', '2026-01-24 09:03:11'),
(21, '85', 'DAD33F9L4B', 500, 'January', '2026', '01710302319', 'approved', '', '28', '2026-01-24 09:02:45', '', NULL, NULL, NULL, '2026-01-24 05:40:47', '2026-01-24 09:02:45'),
(22, '66', 'DAF861L9PG', 350, 'January', '2026', '01738241830', 'approved', '', '28', '2026-01-24 09:01:43', '', NULL, NULL, NULL, '2026-01-24 05:59:43', '2026-01-24 09:01:43'),
(24, '80', '02DAF861L9PG', 350, 'January', '2026', '01738241830', 'approved', '', '28', '2026-01-24 09:01:25', '', NULL, NULL, NULL, '2026-01-24 06:07:00', '2026-01-24 09:01:25'),
(25, '95', 'TRX46646ID', 500, 'March', '2026', '01515206120', 'rejected', '', NULL, NULL, NULL, '28', '2026-02-01 07:20:01', 'N/A', '2026-02-01 07:19:31', '2026-02-01 07:20:01'),
(26, '95', 'TRX7856ID', 500, 'March', '2026', '01515206120', 'rejected', '', NULL, NULL, NULL, '28', '2026-02-04 17:10:11', 'Didnt Get Paid', '2026-02-04 17:08:26', '2026-02-04 17:10:11'),
(27, '72', 'DB87W2FY3B', 500, 'February', '2026', '01723179173', 'approved', '', '28', '2026-02-08 07:16:11', 'Received by bKash', NULL, NULL, NULL, '2026-02-08 07:13:34', '2026-02-08 07:16:11'),
(28, '85', 'DBA40V78CG', 500, 'February', '2026', '01710302319', 'approved', '', '28', '2026-02-10 11:40:14', '', NULL, NULL, NULL, '2026-02-10 11:36:44', '2026-02-10 11:40:14'),
(29, '90', 'DBA60XRSOO', 500, 'February', '2026', '01408561806', 'approved', '', '28', '2026-02-10 11:40:30', '', NULL, NULL, NULL, '2026-02-10 11:38:44', '2026-02-10 11:40:30'),
(30, '66', 'DBA816HT9G', 700, 'February', '2026', '01738241830', 'approved', '', '28', '2026-02-11 08:52:23', '', NULL, NULL, NULL, '2026-02-11 08:43:38', '2026-02-11 08:52:23');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `mobileNumber` varchar(255) NOT NULL,
  `dateOfBirth` date NOT NULL,
  `gender` enum('male','female','other') NOT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'user',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `withdrawals`
--

CREATE TABLE `withdrawals` (
  `id` int(11) NOT NULL,
  `withdrawId` varchar(255) NOT NULL COMMENT 'Unique withdrawal ID like WDR_1768845150050',
  `amount` decimal(10,2) NOT NULL,
  `status` enum('pending','approved','rejected','completed','failed') NOT NULL DEFAULT 'pending',
  `requestDate` datetime NOT NULL,
  `paymentMethod` varchar(255) NOT NULL,
  `accountDetails` text NOT NULL COMMENT 'Bank account number, mobile banking number, or other payment details',
  `withdrawRequestBy` varchar(255) NOT NULL COMMENT 'Email of the requester',
  `withdrawRequestRole` enum('seller','client') NOT NULL,
  `approvedBy` varchar(255) DEFAULT NULL COMMENT 'Email of admin who approved/rejected',
  `approvedAt` datetime DEFAULT NULL,
  `rejectionReason` text DEFAULT NULL COMMENT 'Reason for rejection if applicable',
  `completedAt` datetime DEFAULT NULL,
  `notes` text DEFAULT NULL COMMENT 'Additional notes/comments',
  `transactionReference` varchar(255) DEFAULT NULL COMMENT 'Bank/Mobile banking transaction ID',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `withdrawals`
--

INSERT INTO `withdrawals` (`id`, `withdrawId`, `amount`, `status`, `requestDate`, `paymentMethod`, `accountDetails`, `withdrawRequestBy`, `withdrawRequestRole`, `approvedBy`, `approvedAt`, `rejectionReason`, `completedAt`, `notes`, `transactionReference`, `createdAt`, `updatedAt`) VALUES
(16, 'WDR_1769705017204', 200.00, 'approved', '2026-01-29 16:43:37', 'mobile_banking', '01777180394', 'emran@gmail.com', 'seller', 'shamim@gmail.com', '2026-01-30 11:51:52', NULL, NULL, 'N/A', 'TRX4589ID', '2026-01-29 16:43:37', '2026-01-30 11:51:52');

-- --------------------------------------------------------

--
-- Table structure for table `zones`
--

CREATE TABLE `zones` (
  `id` int(11) NOT NULL,
  `zoneName` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `zoneDetails` text DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
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
  ADD UNIQUE KEY `unique_bank_account_combination` (`bankName`,`accountNumber`),
  ADD KEY `bank_accounts_bank_name_branch_id` (`bankName`,`branchId`),
  ADD KEY `bank_accounts_account_holder_name` (`accountHolderName`),
  ADD KEY `bank_accounts_account_type_is_active` (`accountType`,`isActive`),
  ADD KEY `bank_accounts_created_at` (`createdAt`),
  ADD KEY `bank_accounts_bank_name` (`bankName`);

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
  ADD KEY `expenses_created_at` (`createdAt`),
  ADD KEY `expenses_is_client_expense` (`isClientExpense`),
  ADD KEY `expenses_client_id` (`clientId`);

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
-- Indexes for table `payment-methods`
--
ALTER TABLE `payment-methods`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `methodId` (`methodId`),
  ADD UNIQUE KEY `payment-methods_method_id` (`methodId`),
  ADD KEY `payment-methods_status` (`status`);

--
-- Indexes for table `public_contacts`
--
ALTER TABLE `public_contacts`
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
-- Indexes for table `sms_configs`
--
ALTER TABLE `sms_configs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `appName` (`appName`);

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
-- Indexes for table `withdrawals`
--
ALTER TABLE `withdrawals`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `withdrawId` (`withdrawId`),
  ADD UNIQUE KEY `withdrawals_withdraw_id` (`withdrawId`),
  ADD KEY `withdrawals_status` (`status`),
  ADD KEY `withdrawals_withdraw_request_by` (`withdrawRequestBy`),
  ADD KEY `withdrawals_request_date` (`requestDate`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `bank_accounts`
--
ALTER TABLE `bank_accounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `benefits`
--
ALTER TABLE `benefits`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `chatmessages`
--
ALTER TABLE `chatmessages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `chatparticipants`
--
ALTER TABLE `chatparticipants`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `chats`
--
ALTER TABLE `chats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `cities`
--
ALTER TABLE `cities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `client-informations`
--
ALTER TABLE `client-informations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=97;

--
-- AUTO_INCREMENT for table `contacts`
--
ALTER TABLE `contacts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `emails`
--
ALTER TABLE `emails`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `employeeattendances`
--
ALTER TABLE `employeeattendances`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `employee_bill_collection`
--
ALTER TABLE `employee_bill_collection`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=82;

--
-- AUTO_INCREMENT for table `employee_salaries`
--
ALTER TABLE `employee_salaries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `expenses`
--
ALTER TABLE `expenses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `expense_categories`
--
ALTER TABLE `expense_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `expense_payments`
--
ALTER TABLE `expense_payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `expense_sub_categories`
--
ALTER TABLE `expense_sub_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=82;

--
-- AUTO_INCREMENT for table `ftp_servers`
--
ALTER TABLE `ftp_servers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `job_categories`
--
ALTER TABLE `job_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT for table `packages`
--
ALTER TABLE `packages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `payment-methods`
--
ALTER TABLE `payment-methods`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `public_contacts`
--
ALTER TABLE `public_contacts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `reminders`
--
ALTER TABLE `reminders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `role-permissions`
--
ALTER TABLE `role-permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `salaries`
--
ALTER TABLE `salaries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `salary_assignments`
--
ALTER TABLE `salary_assignments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `sms_configs`
--
ALTER TABLE `sms_configs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `tickets`
--
ALTER TABLE `tickets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `withdrawals`
--
ALTER TABLE `withdrawals`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `zones`
--
ALTER TABLE `zones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

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
