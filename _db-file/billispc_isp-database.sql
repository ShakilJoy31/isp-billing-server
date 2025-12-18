-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 17, 2025 at 04:00 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

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
  `photo` varchar(5000) DEFAULT NULL,
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
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `authority-informations`
--

INSERT INTO `authority-informations` (`id`, `address`, `age`, `bloodGroup`, `dateOfBirth`, `email`, `photo`, `fatherOrSpouseName`, `fullName`, `jobCategory`, `jobType`, `maritalStatus`, `mobileNo`, `nidOrPassportNo`, `religion`, `role`, `sex`, `userId`, `password`, `status`, `baseSalary`, `createdAt`, `updatedAt`) VALUES
(2, 'Dhaka', 44, 'O-', '2025-12-07 00:00:00', 'shakil@gmail.com', NULL, 'Abdur Rohman', 'Shakil Vai', 'None', 'Contractual', 'Unmarried', '017546546', '543654654654', 'Islam', 'manager', 'Male', 'SV9477', '017546546', 'active', 75000.00, '2025-12-07 18:42:41', '2025-12-07 18:42:41'),
(3, 'House 45, Road 12, Dhanmondi, Dhaka 1209, Bangladesh', 31, 'B+', '1992-11-25 00:00:00', 'abdul.rahman1@example.com', 'https//fhgsdjifgdfsgdfg', 'Mohammed Ali Khan', 'Abdul Rahman Khan', 'IT Department', 'Full Time', 'Married', '+8801712345678', '1234567890123', 'Islam', 'admin', 'Male', 'ARK2116', '+8801712345678', 'active', 55000.00, '2025-12-07 19:11:27', '2025-12-07 19:11:27'),
(4, 'dfgghdfgh', 44, 'O+', '1981-12-07 00:00:00', 'dfg@gmail.com', '', 'dfgfdfgf', 'dfsgfd', 'jhfgj', 'Full Time', 'Unmarried', '017854343534', '5465646456', 'Christianity', 'staff', 'Male', 'D8892', '017854343534', 'active', 25000.00, '2025-12-07 19:33:57', '2025-12-07 19:33:57'),
(5, 'Dhaka', 55, 'O-', '1970-12-07 00:00:00', 'jjh@gmail.com', '', 'dfgfd', 'gdfsgfd', 'dtryt', 'Contractual', 'Unmarried', '01776437542', '4656757465', 'Buddhism', 'support', 'Male', 'G2850', '01776437542', 'active', 40000.00, '2025-12-07 19:47:50', '2025-12-07 19:47:50'),
(6, 'fghdfgh', 43, 'B-', '1982-12-07 00:00:00', 'fghnn@gmail.com', 'http://localhost:2000//uploads/f5c7d7d3e6e1de48.jpeg', 'kjh', 'Supervisor2', '54fghgh', 'Full Time', 'Unmarried', '0546785443', '456546', 'Christianity', 'supervisor', 'Male', 'G2369', '111111', 'active', 50000.00, '2025-12-07 19:54:05', '2025-12-10 18:53:08'),
(7, 'House 45, Road 12, Dhanmondi, Dhaka 1209, Bangladesh', 31, 'B+', '1992-11-25 00:00:00', 'abdul.rahman@example.com', 'https//fhgsdjifgdfsgdfg', 'Mohammed Ali Khan', 'Abdul Rahman Khan', 'IT Department', 'Full Time', 'Married', '+8801712345678', '1234567890123', 'Islam', 'admin', 'Male', 'abdul6516@ringtel', '+8801712345678', 'active', 55000.00, '2025-12-15 18:19:16', '2025-12-15 18:19:16'),
(8, 'Dhaka', 22, 'AB+', '2003-12-16 00:00:00', 'abid@gmail.com', 'https://server.billisp.com/uploads/469961eba90a3002.JPG', 'Rejoyan', 'Abid Morshed', 'Bill Collection', 'Full Time', 'Unmarried', '01777777777', '564635463', 'Islam', 'staff', 'Male', 'abid1264@ringtel', '01777777777', 'active', 21999.99, '2025-12-17 13:33:05', '2025-12-17 13:33:05');

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
(3, 'Dutch Bangla Bank', 'Shakidul Islam Shakil', 'DBBL', '30398875465465', 'Bank', 2332, 'Mirpur', '612', '121212112', 'None', 15000.00, 24750.01, 'BDT', 1, 0, '2025-12-11 16:41:18', 5000.00, 50000.00, 4999999.99, 'এই একাউন্ট থেকে বিদ্যুৎ বিল দেওয়া হবে।', 'admin', 'admin', '2025-12-11 12:05:41', '2025-12-11 16:41:18'),
(4, 'Bkash', 'Shamim', 'Brac', '01761043883', 'MobileBanking', NULL, '', '', '', '', 1000.00, 1050.00, 'BDT', 1, 0, '2025-12-11 16:41:18', 1000.00, 10000.00, 99999.99, 'এই একাউন্ট থেকে খাওয়া দাওয়া বাবদ খরচ হবে। ', 'admin', 'admin', '2025-12-11 16:38:23', '2025-12-11 16:41:18');

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
  `currency` varchar(255) NOT NULL DEFAULT 'BDT',
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
  `features` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`features`)),
  `termsConditions` text DEFAULT NULL,
  `createdBy` varchar(255) NOT NULL DEFAULT 'admin',
  `updatedBy` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `benefits`
--

INSERT INTO `benefits` (`id`, `name`, `description`, `type`, `category`, `basePrice`, `discountPrice`, `currency`, `billingCycle`, `internetSpeed`, `dataLimit`, `uploadSpeed`, `downloadSpeed`, `includesTv`, `includesPhone`, `includesWifi`, `tvChannels`, `phoneMinutes`, `contractLength`, `installationFee`, `equipmentFee`, `startDate`, `endDate`, `isActive`, `isFeatured`, `minContractLength`, `eligibilityCriteria`, `features`, `termsConditions`, `createdBy`, `updatedBy`, `createdAt`, `updatedAt`) VALUES
(1, 'Premium Internet 4000 Mbps', 'High-speed internet for gaming and streaming', 'Internet Package', 'Residential', 2500.00, 1999.00, 'BDT', 'Monthly', '200 Mbps', 'Unlimited', '50 Mbps', '200 Mbps', 0, 0, 1, NULL, NULL, 12, 500.00, NULL, '2024-01-01 00:00:00', '2025-01-01 00:00:00', 0, 1, NULL, NULL, '{\"simultaneousDevices\":15,\"gamingOptimized\":true,\"streamingQuality\":\"8K\",\"discountPercent\":20}', '12-month contract. Free installation for limited time.', 'admin', 'admin', '2025-11-30 09:48:27', '2025-11-30 10:00:52'),
(3, 'Premium Internet 300 Mbps', 'High-speed internet for gaming and streaming', 'Internet Package', 'Residential', 2500.00, 1999.00, 'BDT', 'Monthly', '200 Mbps', 'Unlimited', '50 Mbps', '200 Mbps', 0, 0, 1, NULL, NULL, 12, 500.00, NULL, '2024-01-01 00:00:00', '2025-01-01 00:00:00', 1, 1, NULL, NULL, '{\"simultaneousDevices\":15,\"gamingOptimized\":true,\"streamingQuality\":\"4K\",\"discountPercent\":20}', '12-month contract. Free installation for limited time.', 'admin', NULL, '2025-11-30 09:48:50', '2025-11-30 09:48:50'),
(4, 'Premium Internet 400 Mbps', 'High-speed internet for gaming and streaming', 'Internet Package', 'Residential', 2500.00, 1999.00, 'BDT', 'Monthly', '200 Mbps', 'Unlimited', '50 Mbps', '200 Mbps', 0, 0, 1, NULL, NULL, 12, 500.00, NULL, '2024-01-01 00:00:00', '2025-01-01 00:00:00', 1, 1, NULL, NULL, '{\"simultaneousDevices\":15,\"gamingOptimized\":true,\"streamingQuality\":\"4K\",\"discountPercent\":20}', '12-month contract. Free installation for limited time.', 'admin', NULL, '2025-11-30 09:49:00', '2025-11-30 09:49:00'),
(5, 'Premium Internet 980 Mbps', 'High-speed internet for gaming and streaming', 'Internet Package', 'Residential', 2500.00, 1999.00, 'BDT', 'Monthly', '200 Mbps', 'Unlimited', '50 Mbps', '200 Mbps', 1, 1, 1, 12, 120, 12, 500.00, 100.00, '2026-01-01 00:00:00', '2027-01-01 00:00:00', 1, 1, NULL, 'I don\'t know.', '{\"simultaneousDevices\":15,\"gamingOptimized\":true,\"streamingQuality\":\"4K\",\"discountPercent\":20}', '12-month contract. Free installation for limited time. haha', 'admin', 'admin', '2025-11-30 10:07:13', '2025-11-30 11:25:20'),
(6, 'Biryani treat from Ringtel', 'The person who will refer someone to use our internet will have a Biriyani Treat. Hurry Up! ', 'Promotional Offer', 'General', 1200.00, 1000.00, 'BDT', 'One-time', '5', '500', '50', '10', 0, 1, 1, NULL, 70, NULL, NULL, NULL, '2025-11-30 00:00:00', '2025-12-06 00:00:00', 1, 0, NULL, 'Everyone will be able to get this offer. ', '{\"discountPercent\":16.7}', 'Here is the terms and conditions.', 'admin', NULL, '2025-11-30 11:35:30', '2025-11-30 11:35:30'),
(7, 'Premium Internet 9000 Mbps', 'High-speed internet for gaming and streaming', 'Internet Package', 'Residential', 2500.00, 1999.00, 'BDT', 'Monthly', '200 Mbps', 'Unlimited', '50 Mbps', '200 Mbps', 0, 0, 1, NULL, NULL, 12, 500.00, NULL, '2026-01-01 00:00:00', '2027-01-01 00:00:00', 1, 1, NULL, NULL, '{\"simultaneousDevices\":15,\"gamingOptimized\":true,\"streamingQuality\":\"4K\",\"discountPercent\":20}', '12-month contract. Free installation for limited time.', 'admin', NULL, '2025-11-30 11:36:44', '2025-11-30 11:36:44'),
(8, 'Premium Internet 90000 Mbps', 'High-speed internet for gaming and streaming', 'Internet Package', 'Residential', 2500.00, 1999.00, 'BDT', 'Monthly', '200 Mbps', 'Unlimited', '50 Mbps', '200 Mbps', 0, 0, 1, NULL, NULL, 12, 500.00, NULL, '2026-01-01 00:00:00', '2027-01-01 00:00:00', 1, 1, NULL, NULL, '{\"simultaneousDevices\":15,\"gamingOptimized\":true,\"streamingQuality\":\"4K\",\"discountPercent\":20}', '12-month contract. Free installation for limited time.', 'admin', NULL, '2025-11-30 11:36:47', '2025-11-30 11:36:47'),
(9, 'Premium Internet 900000 Mbps', 'High-speed internet for gaming and streaming', 'Internet Package', 'Residential', 2500.00, 1999.00, 'BDT', 'Monthly', '200 Mbps', 'Unlimited', '50 Mbps', '200 Mbps', 0, 0, 1, NULL, NULL, 12, 500.00, NULL, '2026-01-01 00:00:00', '2027-01-01 00:00:00', 1, 1, NULL, NULL, '{\"simultaneousDevices\":15,\"gamingOptimized\":true,\"streamingQuality\":\"4K\",\"discountPercent\":20}', '12-month contract. Free installation for limited time.', 'admin', NULL, '2025-11-30 11:36:48', '2025-11-30 11:36:48'),
(10, 'Premium Internet 9000000 Mbps', 'High-speed internet for gaming and streaming', 'Internet Package', 'Residential', 2500.00, 1999.00, 'BDT', 'Monthly', '200 Mbps', 'Unlimited', '50 Mbps', '200 Mbps', 0, 0, 1, NULL, NULL, 12, 500.00, NULL, '2026-01-01 00:00:00', '2027-01-01 00:00:00', 1, 1, NULL, NULL, '{\"simultaneousDevices\":15,\"gamingOptimized\":true,\"streamingQuality\":\"4K\",\"discountPercent\":20}', '12-month contract. Free installation for limited time.', 'admin', NULL, '2025-11-30 11:36:50', '2025-11-30 11:36:50'),
(11, 'Premium Internet 90000000 Mbps', 'High-speed internet for gaming and streaming', 'Internet Package', 'Residential', 2500.00, 1999.00, 'BDT', 'Monthly', '200 Mbps', 'Unlimited', '50 Mbps', '200 Mbps', 0, 0, 1, NULL, NULL, 12, 500.00, NULL, '2026-01-01 00:00:00', '2027-01-01 00:00:00', 1, 1, NULL, NULL, '{\"simultaneousDevices\":15,\"gamingOptimized\":true,\"streamingQuality\":\"4K\",\"discountPercent\":20}', '12-month contract. Free installation for limited time.', 'admin', NULL, '2025-11-30 11:36:53', '2025-11-30 11:36:53'),
(12, 'Premium Internet 900000000 Mbps', 'High-speed internet for gaming and streaming', 'Internet Package', 'Residential', 2500.00, 1999.00, 'BDT', 'Monthly', '200 Mbps', 'Unlimited', '50 Mbps', '200 Mbps', 0, 0, 1, NULL, NULL, 12, 500.00, NULL, '2026-01-01 00:00:00', '2027-01-01 00:00:00', 1, 1, NULL, NULL, '{\"simultaneousDevices\":15,\"gamingOptimized\":true,\"streamingQuality\":\"4K\",\"discountPercent\":20}', '12-month contract. Free installation for limited time.', 'admin', NULL, '2025-11-30 11:37:02', '2025-11-30 11:37:02'),
(14, 'ghdfh', 'fghgf', 'Loyalty Benefit', 'Senior Citizen', 100.00, 10.00, 'BDT', 'Monthly', '5', '100', '6', '5', 1, 0, 1, 5, NULL, 54, 54.00, 0.00, '2025-12-03 00:00:00', '2025-12-11 00:00:00', 1, 0, NULL, 'ghf', '{\"discountPercent\":90}', 'fghgf', 'admin', NULL, '2025-12-02 17:58:56', '2025-12-02 17:58:56'),
(15, 'Price Money 500 Taka', 'Keu amader jonno refer korle take 500 taka dibo. ', 'Internet Package', 'General', 50.00, 10.00, 'BDT', 'One-time', '5', '500', '67', '67', 1, 0, 1, 5, NULL, 3, NULL, NULL, '2025-12-05 00:00:00', '2025-12-13 00:00:00', 1, 0, NULL, 'Zodi keu refer kore tailei pabe. ', '{\"discountPercent\":80}', 'dfsgfgdfgdfg', 'admin', 'admin', '2025-12-04 10:36:11', '2025-12-04 10:38:18');

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
  `attachments` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Array of file attachments with metadata' CHECK (json_valid(`attachments`)),
  `readBy` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Array of user IDs who read the message' CHECK (json_valid(`readBy`)),
  `deliveredTo` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Array of user IDs who received the message' CHECK (json_valid(`deliveredTo`)),
  `status` enum('Sent','Delivered','Read','Failed') NOT NULL DEFAULT 'Sent',
  `replyTo` int(11) DEFAULT NULL COMMENT 'Reference to replied message ID',
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
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
(1, 'MSG1764818565081873', 1, 1, 'User', 'Text', 'Vai apnader wifi service e tv add koren. ', NULL, '\"[2]\"', '[]', 'Sent', NULL, NULL, 0, NULL, NULL, NULL, '2025-12-04 03:22:45', '2025-12-04 03:36:15'),
(2, 'MSG1764819439426432', 1, 1, 'User', 'Text', 'Amar basay ajke tv kinche.', '[]', '\"[2]\"', '[1]', 'Sent', NULL, NULL, 0, NULL, NULL, NULL, '2025-12-04 03:37:19', '2025-12-04 03:37:24'),
(3, 'MSG1764819580138748', 1, 2, 'Support', 'Text', 'Ok amra tv laganor cesta korbo. Thanks', '[]', '\"[1]\"', '[2]', 'Sent', NULL, NULL, 0, NULL, NULL, NULL, '2025-12-04 03:39:40', '2025-12-04 03:39:42'),
(4, 'MSG1764841698272625', 2, 4, 'User', 'Text', 'Connection onek slow.', NULL, '\"[2]\"', '[]', 'Sent', NULL, NULL, 0, NULL, NULL, NULL, '2025-12-04 09:48:18', '2025-12-04 09:48:52'),
(5, 'MSG1764841751894558', 2, 2, 'Support', 'Text', 'Accha vai dekhtichi.', '[]', '\"[4]\"', '[2]', 'Sent', NULL, NULL, 0, NULL, NULL, NULL, '2025-12-04 09:49:11', '2025-12-04 09:49:18'),
(6, 'MSG1764841777200150', 2, 4, 'User', 'Text', 'Ok vai.', '[]', '\"[2]\"', '[4]', 'Sent', NULL, NULL, 0, NULL, NULL, NULL, '2025-12-04 09:49:37', '2025-12-04 09:49:45'),
(7, 'MSG1764846990207857', 3, 1, 'User', 'Text', 'Vai amar connection lageb. ', NULL, '\"[2]\"', '[]', 'Sent', NULL, NULL, 0, NULL, NULL, NULL, '2025-12-04 11:16:30', '2025-12-04 11:17:25'),
(8, 'MSG1764847071539214', 3, 2, 'Support', 'Text', 'Vai kon package niben?', '[]', '\"[1]\"', '[2]', 'Sent', NULL, NULL, 0, NULL, NULL, NULL, '2025-12-04 11:17:51', '2025-12-04 11:18:01'),
(9, 'MSG1764847116138551', 3, 1, 'User', 'Text', 'Ami 500 takar package nibo.', '[]', '\"[2]\"', '[1]', 'Sent', NULL, NULL, 0, NULL, NULL, NULL, '2025-12-04 11:18:36', '2025-12-04 11:18:43');

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
(1, 1, 1, 'User', 'Creator', '2025-12-04 03:22:45', '2025-12-04 11:14:09', 0, 0, '2025-12-04 03:22:45', '2025-12-04 11:14:09'),
(2, 1, 2, 'Support', 'Admin', '2025-12-04 03:36:14', '2025-12-04 11:15:14', 0, 0, '2025-12-04 03:36:14', '2025-12-04 11:15:14'),
(4, 2, 4, 'User', 'Creator', '2025-12-04 09:48:18', '2025-12-04 11:02:14', 0, 0, '2025-12-04 09:48:18', '2025-12-04 11:02:14'),
(5, 2, 2, 'Support', 'Admin', '2025-12-04 09:48:52', '2025-12-04 11:15:08', 0, 0, '2025-12-04 09:48:52', '2025-12-04 11:15:08'),
(7, 3, 1, 'User', 'Creator', '2025-12-04 11:16:30', '2025-12-04 11:18:36', 0, 0, '2025-12-04 11:16:30', '2025-12-04 11:18:36'),
(8, 3, 2, 'Support', 'Admin', '2025-12-04 11:17:25', '2025-12-08 13:03:03', 0, 0, '2025-12-04 11:17:25', '2025-12-08 13:03:03');

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
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Additional chat metadata' CHECK (json_valid(`metadata`)),
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chats`
--

INSERT INTO `chats` (`id`, `chatId`, `title`, `chatType`, `status`, `priority`, `category`, `lastMessageAt`, `createdBy`, `assignedTo`, `metadata`, `createdAt`, `updatedAt`) VALUES
(1, 'CHAT1764818565063562', 'TV adding', 'User-Support', 'Closed', 'High', 'Feedback', '2025-12-04 03:39:40', 1, NULL, NULL, '2025-12-04 03:22:45', '2025-12-04 11:15:18'),
(2, 'CHAT1764841698222380', 'Hello vai.', 'User-Support', 'Closed', 'High', 'Connection', '2025-12-04 09:49:37', 4, NULL, NULL, '2025-12-04 09:48:18', '2025-12-04 11:15:06'),
(3, 'CHAT1764846990189439', 'Need a new connection', 'User-Support', 'Active', 'Urgent', 'Connection', '2025-12-04 11:18:36', 1, NULL, NULL, '2025-12-04 11:16:30', '2025-12-04 11:18:36');

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
(1, 'Saver', 'North side of Dhaka updated.', 'Active', '2025-12-08 12:43:08', '2025-12-08 12:43:57'),
(2, 'Mirpur', 'Kaji para ', 'Active', '2025-12-08 13:54:43', '2025-12-08 13:54:43');

-- --------------------------------------------------------

--
-- Table structure for table `client-informations`
--

CREATE TABLE `client-informations` (
  `id` int(11) NOT NULL,
  `customerId` varchar(255) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `fullName` varchar(255) NOT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `fatherOrSpouseName` varchar(255) NOT NULL,
  `dateOfBirth` datetime DEFAULT NULL,
  `age` int(11) NOT NULL,
  `sex` varchar(255) NOT NULL,
  `maritalStatus` varchar(255) NOT NULL,
  `nidOrPassportNo` varchar(255) NOT NULL,
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
  `costForPackage` int(50) DEFAULT NULL,
  `referId` varchar(255) DEFAULT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'client',
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `password` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `client-informations`
--

INSERT INTO `client-informations` (`id`, `customerId`, `userId`, `fullName`, `photo`, `fatherOrSpouseName`, `dateOfBirth`, `age`, `sex`, `maritalStatus`, `nidOrPassportNo`, `jobPlaceName`, `jobCategory`, `jobType`, `mobileNo`, `email`, `customerType`, `package`, `location`, `area`, `flatAptNo`, `houseNo`, `roadNo`, `landmark`, `connectionDetails`, `costForPackage`, `referId`, `role`, `status`, `password`, `createdAt`, `updatedAt`) VALUES
(1, 'mdu@ringtel', 'residential_mdu@ringtel', 'Md. Test User', NULL, 'Md. Test Father', '1995-01-01 00:00:00', 29, 'Male', 'Unmarried', '1112223334445', NULL, NULL, 'Full Time', '01700000000', 'test@example.com', 'residential', 'Basic', 'Dhaka', 'Mirpur', '101', '25', '13', 'Block A', NULL, NULL, NULL, 'client', 'pending', 'mobileNo', '2025-12-07 21:21:09', '2025-12-07 21:21:09'),
(2, 'dsf@ringtel', 'residential_dsf@ringtel', 'dsf', 'https://server.billisp.com/uploads/6ba074f7b3c367d7.jpeg', 'dsf', '2025-12-26 00:00:00', 0, 'Male', 'Unmarried', '43545', 'dfgsg', 'dfgdfg', 'Full Time', '01761043883', 'dsfg@gmail.com', 'residential', 'Basic', 'Sylhet', 'Rural', 'fgh', '65', '65', 'hf', 'fghfg', NULL, NULL, 'client', 'active', '01761043883', '2025-12-07 21:33:36', '2025-12-07 21:35:56'),
(3, 'jabedk@ringtel', 'corporate_jabedk@ringtel', 'Jabed Khan', 'https://server.billisp.com/uploads/919d2a03102ee97d.jpeg', 'Vai', '2025-12-17 00:00:00', 33, 'Male', 'Unmarried', '435435435', 'Dhaka', 'adsfh', 'Full Time', '01746757435', 'dfgg@gmail.com', 'corporate', 'Family Plus 30 Mbps - Quarterly', 'Rajshahi', 'Suburban', 'dfg', '546', '546', '54dghhfg', 'dfgdf', NULL, NULL, 'client', 'pending', '01746757435', '2025-12-08 14:47:50', '2025-12-08 14:47:50'),
(5, 'shamim1@ringtel', 'shamim1@ringtel', 'Shamim Hasan', NULL, 'Md. Test Father', '1995-01-01 00:00:00', 29, 'Male', 'Unmarried', '1112223334445', 'dsf', NULL, 'Full Time', '01700000000', 'test1@example.com', 'residential', 'Basic', 'Dhaka', 'Mirpur', '101', '25', '13', 'Block A', NULL, NULL, NULL, 'Super-Admin', 'active', '01700000000', '2025-12-10 12:34:24', '2025-12-10 12:34:24'),
(8, 'abdur@ringtel', 'abdur@ringtel', 'Abdur Rahman', NULL, 'Md. Abdul Karim', '1992-05-15 00:00:00', 32, 'Male', 'Married', '1992051523456', 'Green Delta Insurance Company', 'Executive', 'Full Time', '01711223344', 'abdur.rahman@example.com', 'residential', 'Premium', 'Dhaka', 'Gulshan', '5B', '78', '12', 'Near Gulshan 1 Park', 'Fiber optic, Wi-Fi router included', NULL, 'REF789012', 'client', 'active', '01711223344', '2025-12-14 15:22:15', '2025-12-14 15:22:15'),
(10, 'fghdgh@ringtel', 'fghdgh@ringtel', 'fghdgh', NULL, 'fghfg', '1999-12-22 00:00:00', 25, 'Male', 'Unmarried', '567657', 'fghdfgh', 'fhgdh', 'Contractual', '01761043883', 'dfghg@gmail.com', 'corporate', 'Family Plus 30 Mbps - Quarterly', 'Mirpur', 'Downtown Zone7', 'dfg', 'dfg', 'dfg', 'dfg', 'dfsgdf', 200, NULL, 'client', 'pending', '7nhiA!O1%Pf0', '2025-12-14 15:46:18', '2025-12-14 15:46:18'),
(11, 'sadfdsf@ringtel', 'sadfdsf@ringtel', 'sadfdsf', NULL, 'sdf', '2019-07-10 00:00:00', 0, 'Male', 'Unmarried', '546546546', 'sadfg', 'fsadfsdf', 'Full Time', '01761043883', 'asjnj@gmai.com', 'residential', '1', 'Mirpur', 'Dokkhin para', 'fghfg', 'fgh', 'dfgh', 'dfsgdf', 'fdghdfg', 500, NULL, 'client', 'active', '01761043883', '2025-12-14 18:39:19', '2025-12-14 20:36:32'),
(12, 'shamim@ringtel', 'shamim@ringtel', 'Shamim', NULL, 'fgdsgdf', '2015-02-03 00:00:00', 0, 'Male', 'Unmarried', '5436546', 'dfgsdf', 'gdfsg', 'Part Time', '01700000000', 'shamim@gmail.com', 'commercial', '1', 'Mirpur', 'Downtown Zone7', '435', '435', 'hgdf', 'dfgh', 'fgdhg', 280, NULL, 'client', 'active', '01700000000', '2025-12-16 20:55:43', '2025-12-16 20:56:28'),
(13, 'shakil@ringtel', 'shakil@ringtel', 'Shakil', NULL, 'Dinislam', '2013-02-04 00:00:00', 0, 'Male', 'Unmarried', '465747657657', 'Motijhil', 'Engineer', 'Full Time', '01777777777', 'shakil@gmail.com', 'corporate', '1', 'Saver', 'Downtown Zone7', 'dfsg', '433', 'dfgh', 'drstgdfsg', 'Full speed connection', 300, 'shamim@ringtel', 'client', 'active', '01777777777', '2025-12-17 13:43:18', '2025-12-17 13:43:30'),
(14, 'dfsgdfghjgkjhgk@ringtel', 'dfsgdfghjgkjhgk@ringtel', 'dfsgdfghjgkjhgk', NULL, 'jhgkjhk', '2004-02-02 00:00:00', 21, 'Male', 'Unmarried', '567868', 'jgk', 'jhgkjhgkjhg', 'Full Time', '01744444444', 'hgfjfg@gmail.com', 'residential', '1', 'Saver', 'Downtown Zone7', 'sdf', 'dsaf', '435', 'dfsgdfg', 'fdsg', 400, 'shakil@ringtel', 'client', 'active', '01744444444', '2025-12-17 13:46:27', '2025-12-17 13:46:27');

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
  `additional_details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`additional_details`)),
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
(5, 'contact_info', 'Email Support', 'Email us anytime', NULL, NULL, 'info@ringtel.com', NULL, NULL, NULL, NULL, 'https://www.facebook.com/groups/brhi5', 'https://www.facebook.com/groups/brhi5', 'https://www.facebook.com/groups/brhi5', 'https://www.facebook.com/groups/brhi5', 'https://www.facebook.com/groups/brhi5', 'https://www.facebook.com/groups/brhi5', NULL, NULL, 'mail', 'from-purple-500 to-pink-400', 'bg-purple-500/10', 2, '[{\"label\":\"Technical Support\",\"value\":\"support@ringtel.com\"},{\"label\":\"Business Partnership\",\"value\":\"sales@ringtel.com\"},{\"label\":\"Communication\",\"value\":\"01761043883\"}]', 1, 'admin', 'admin', '2025-12-10 13:17:18', '2025-12-10 15:12:34'),
(6, 'contact_info', 'Our Location', 'Visit our headquarters', NULL, NULL, NULL, 'Abbot Favicon Kinney, New York, USA', 'New York', 'USA', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'map-pin', 'from-green-500 to-emerald-400', 'bg-green-500/10', 3, '[{\"label\":\"Head Office\",\"value\":\"Abbot Favicon Kinney\"},{\"label\":\"City & State\",\"value\":\"New York, USA\"},{\"label\":\"Postal Code\",\"value\":\"25423\"}]', 1, 'admin', NULL, '2025-12-10 13:17:18', '2025-12-10 13:17:18'),
(7, 'office_locations', 'Head Office', 'ddfgf', 'pagla', '(+1) 234-567-890', 'ny-office@ringtel.com', 'Abbot Favicon Kinney, New York, USA', 'New York', 'USA', 'Mon-Fri: 9AM-6PM', 'https://wa.me/1234567890', 'https://t.me/ringtel_support', 'https://facebook.com/ringtel', 'https://linkedin.com/company/ringtel', 'https://instagram.com/ringtel_official', NULL, 40.71280000, -74.00600000, 'phone', 'from-blue-500 to-cyan-400', 'bg-blue-500/10', 1, '[]', 1, 'admin', 'admin', '2025-12-10 13:17:18', '2025-12-10 13:36:33'),
(8, 'office_locations', 'Branch Office', NULL, NULL, '(+1) 987-654-321', 'ca-branch@ringtel.com', '123 Tech Street, Silicon Valley, CA', 'Silicon Valley', 'USA', 'Mon-Sat: 8AM-7PM', 'https://wa.me/1987654321', 'https://t.me/ringtel_california', 'https://facebook.com/ringtel_ca', NULL, 'https://instagram.com/ringtel_ca', NULL, 37.77490000, -122.41940000, 'phone', 'from-blue-500 to-cyan-400', 'bg-blue-500/10', 2, '[]', 1, 'admin', NULL, '2025-12-10 13:17:18', '2025-12-10 13:17:18'),
(9, 'office_locations', 'Support Center', NULL, NULL, '(+1) 800-123-456', 'support@ringtel.com', '456 Service Road, Austin, TX', 'Austin', 'USA', '24/7 Support', 'https://wa.me/1800123456', NULL, 'https://facebook.com/ringtel_texas', 'https://linkedin.com/company/ringtel-tx', NULL, 'https://imo.im/ringtel_support', 30.26720000, -97.74310000, 'phone', 'from-blue-500 to-cyan-400', 'bg-blue-500/10', 3, '[]', 1, 'admin', NULL, '2025-12-10 13:17:18', '2025-12-10 13:17:18'),
(10, 'contact_info', 'This is title', 'This is subtitle', 'This is description', '01766666666', 'support@gmail.com', NULL, NULL, NULL, NULL, 'https://github.com/ShakilJoy31/taste-hub-template/pull/1/commits/48b0e2da1639ba5e222ec66770bcf0e668c83515', 'https://github.com/ShakilJoy31/taste-hub-template/pull/1/commits/48b0e2da1639ba5e222ec66770bcf0e668c83515', 'https://github.com/ShakilJoy31/taste-hub-template/pull/1/commits/48b0e2da1639ba5e222ec66770bcf0e668c83515', 'https://github.com/ShakilJoy31/taste-hub-template/pull/1/commits/48b0e2da1639ba5e222ec66770bcf0e668c83515', 'https://github.com/ShakilJoy31/taste-hub-template/pull/1/commits/48b0e2da1639ba5e222ec66770bcf0e668c83515', 'https://github.com/ShakilJoy31/taste-hub-template/pull/1/commits/48b0e2da1639ba5e222ec66770bcf0e668c83515', NULL, NULL, 'phone', 'from-purple-500 to-pink-400', 'bg-indigo-500/10', 2, '[{\"label\":\"24/7 hotline\",\"value\":\"01766556565\"},{\"label\":\"At night call\",\"value\":\"01555555555\"},{\"label\":\"On weekend call\",\"value\":\"01333333333\"}]', 1, 'admin', NULL, '2025-12-10 13:43:56', '2025-12-10 13:43:56');

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
(9, 11, '10:37', '22:37', '2025-12-25', 'Present', 12, 0, 0, 'dfgsg', 'Super-Admin', '2025-12-02 14:38:21', '2025-12-02 14:38:21'),
(10, 10, '10:37', '22:37', '2025-12-25', 'Present', 12, 0, 0, 'dfgfd', 'Super-Admin', '2025-12-02 14:38:21', '2025-12-02 14:38:21'),
(11, 9, '10:37', '22:37', '2025-12-25', 'Present', 12, 0, 0, 'dfgf', 'Super-Admin', '2025-12-02 14:38:21', '2025-12-02 14:38:21'),
(13, 11, '08:56', '14:56', '2025-12-04', 'Present', 6, 0, 0, '', 'Super-Admin', '2025-12-02 14:57:03', '2025-12-02 14:57:03'),
(14, 11, '08:57', '17:57', '2025-12-06', 'Present', 9, 0, 0, '', 'Super-Admin', '2025-12-02 14:57:33', '2025-12-02 14:57:33'),
(15, 1, '09:00', '18:42', '2025-12-04', 'Present', 9.7, 0, 0, 'Good timing', 'Super-Admin', '2025-12-04 10:48:42', '2025-12-04 10:48:42'),
(16, 6, '09:00', '18:42', '2025-12-04', 'Present', 9.7, 0, 0, 'dfgdfsg', 'Super-Admin', '2025-12-04 10:48:42', '2025-12-04 10:48:42'),
(17, 7, '09:00', '18:42', '2025-12-04', 'Present', 9.7, 0, 0, 'dfgdfg', 'Super-Admin', '2025-12-04 10:48:42', '2025-12-04 10:48:42');

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
  `paymentMethod` enum('cash','bkash','nagad','rocket','card','bank_transfer') NOT NULL DEFAULT 'cash',
  `transactionId` varchar(255) DEFAULT NULL COMMENT 'Transaction ID for mobile banking/bank transfers',
  `referenceNote` text DEFAULT NULL,
  `collectionDate` datetime NOT NULL,
  `collectionTime` time DEFAULT NULL,
  `receiptNumber` varchar(255) NOT NULL,
  `status` enum('collected','verified','deposited','cancelled','refunded') NOT NULL DEFAULT 'collected',
  `notes` text DEFAULT NULL,
  `attachment` varchar(255) DEFAULT NULL COMMENT 'Receipt/transaction slip image path',
  `verifiedBy` varchar(255) DEFAULT NULL,
  `verifiedAt` datetime DEFAULT NULL,
  `verificationRemark` varchar(255) DEFAULT NULL,
  `depositedBy` varchar(255) DEFAULT NULL,
  `depositedAt` datetime DEFAULT NULL,
  `depositSlipNumber` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employee_bill_collection`
--

INSERT INTO `employee_bill_collection` (`id`, `clientId`, `clientName`, `clientPhone`, `clientAddress`, `employeeId`, `employeeName`, `invoiceId`, `billingMonth`, `amount`, `paymentMethod`, `transactionId`, `referenceNote`, `collectionDate`, `collectionTime`, `receiptNumber`, `status`, `notes`, `attachment`, `verifiedBy`, `verifiedAt`, `verificationRemark`, `depositedBy`, `depositedAt`, `depositSlipNumber`, `createdAt`, `updatedAt`) VALUES
(1, 'sadfdsf@ringtel', 'sadfdsf', '01761043883', 'fghfg, fgh, dfgh, Dokkhin para', 'abdul6516@ringtel', 'Abdul Rahman Khan', 'INV-2025-01-sadfdsf@ringtel', '2025-01', 1500.00, 'cash', NULL, 'January bill collected in person', '2025-12-16 12:11:20', '18:11:20', 'RCT-2025-12-000001', 'collected', 'Customer paid full amount, no issues', 'receipts/image_001.jpg', NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-16 12:11:20', '2025-12-16 12:11:20'),
(2, 'sadfdsf@ringtel', 'sadfdsf', '01761043883', 'fghfg, fgh, dfgh, Dokkhin para', 'abdul6516@ringtel', 'Abdul Rahman Khan', 'INV-2025-12-sadfdsf@ringtel', '2025-12', 500.00, 'cash', '', 'ggdfs', '2025-12-16 17:12:09', '23:12:09', 'RCT-2025-12-000002', 'deposited', 'dfgdf', 'https://server.billisp.com/uploads/90b3e529abceae7f.jpg', 'abdul6516@ringtel', '2025-12-16 17:12:47', 'I get it. ', 'abdul6516@ringtel', '2025-12-16 17:12:58', 'sdfa', '2025-12-16 17:12:09', '2025-12-16 17:12:58'),
(3, 'sadfdsf@ringtel', 'sadfdsf', '01761043883', 'fghfg, fgh, dfgh, Dokkhin para', 'G2369', 'Supervisor2', 'INV-2025-08-sadfdsf@ringtel', '2025-08', 500.00, 'bkash', 'fgsdfgdf', 'dfgfsg', '2025-12-16 18:17:52', '00:17:52', 'RCT-2025-12-000003', 'deposited', 'dfgdf', 'https://server.billisp.com/uploads/816f48669098f851.jpeg', 'shamim1@ringtel', '2025-12-16 18:18:16', 'jhgfjfhgj', 'shamim1@ringtel', '2025-12-16 18:18:25', 'fgjhhgj', '2025-12-16 18:17:52', '2025-12-16 18:18:25'),
(4, 'sadfdsf@ringtel', 'sadfdsf', '01761043883', 'fghfg, fgh, dfgh, Dokkhin para', 'G2369', 'Supervisor2', 'INV-2025-06-sadfdsf@ringtel', '2025-06', 500.00, 'cash', '', 'fdgsdf', '2025-12-16 18:47:57', '00:47:57', 'RCT-2025-12-000004', 'verified', 'dfgdf', '', 'shamim1@ringtel', '2025-12-17 14:36:34', 'Paichi vai', NULL, NULL, NULL, '2025-12-16 18:47:57', '2025-12-17 14:36:34'),
(5, 'shakil@ringtel', 'Shakil', '01777777777', 'dfsg, 433, dfgh, Downtown Zone7', 'abid1264@ringtel', 'Abid Morshed', 'INV-2025-08-shakil@ringtel', '2025-08', 300.00, 'bkash', '6574657657', 'dsfghdfgh', '2025-12-17 14:13:29', '20:13:29', 'RCT-2025-12-000005', 'verified', 'fgh', '', 'shamim1@ringtel', '2025-12-17 14:54:23', 'The second test.', NULL, NULL, NULL, '2025-12-17 14:13:29', '2025-12-17 14:54:23');

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
  `approvedAt` datetime DEFAULT NULL,
  `rejectionReason` text DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `expenses`
--

INSERT INTO `expenses` (`id`, `expenseCode`, `note`, `expenseCategoryId`, `expenseSubcategoryId`, `totalAmount`, `date`, `image`, `status`, `paymentStatus`, `approvedBy`, `approvedAt`, `rejectionReason`, `isActive`, `createdAt`, `updatedAt`) VALUES
(9, 'EXP-279508-153', 'asdfdsfdsf', 3, 2, 300.00, '2025-12-11', 'https://server.billisp.com/uploads/016e0b403f526961.jpg', 'Pending', 'Pending', NULL, NULL, NULL, 1, '2025-12-11 20:01:19', '2025-12-11 20:01:19');

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
(3, 'Internet Buying', '660568', NULL, 50000.00, 1, 0, 'admin', NULL, '2025-12-11 18:56:20', '2025-12-11 18:56:20');

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
(6, 9, 4, 100.00, 'Pending', NULL, NULL, 'admin', '2025-12-11 20:01:19', '2025-12-11 20:01:19'),
(7, 9, 3, 200.00, 'Pending', NULL, NULL, 'admin', '2025-12-11 20:01:19', '2025-12-11 20:01:19');

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
(2, 'Buy Cable', '616658', 'The raw internet.', 10000.00, 1, 0, 3, 'admin', 'admin', '2025-12-11 18:57:22', '2025-12-11 18:57:50');

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
(1, 'Starter', '10 Mbps', 800.00, '', '24/7 Support, Free Installation', 'Residential', 'Monthly', '1 Mbps', '1 Mbps', '100 GB', 199.99, 0.00, 'Active', '2025-12-14 18:36:47', '2025-12-14 18:36:47');

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
  `reminderMethod` enum('SMS','Email','Both','System Only') NOT NULL DEFAULT 'SMS',
  `message` text NOT NULL,
  `status` enum('Pending','Sent','Failed','Cancelled') NOT NULL DEFAULT 'Pending',
  `scheduledAt` datetime NOT NULL,
  `sentAt` datetime DEFAULT NULL,
  `priority` enum('Low','Medium','High','Urgent') NOT NULL DEFAULT 'Medium',
  `retryCount` int(11) NOT NULL DEFAULT 0,
  `maxRetries` int(11) NOT NULL DEFAULT 3,
  `responseData` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`responseData`)),
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
(17, 'REM1764769882469396', 1, 'fghdfgh', '4353543', 'ff@gmail.com', 'Internet', 'dfgdfs - dfgfd (Price: 544/- BDT)', 544.00, '2025-12-24 00:00:00', 'Payment Due', 'SMS', 'Dear fghdfgh, your payment of BDT 544.00 for dfgdfs - dfgfd (Price: 544/- BDT) is due on 12/3/2025. Please make payment to avoid service interruption.', 'Pending', '2025-12-03 13:53:00', NULL, 'Medium', 0, 3, NULL, 'bfgjhdfghfgh', 0, 'Monthly', NULL, 'admin', NULL, '2025-12-03 13:51:22', '2025-12-03 13:51:22'),
(18, 'REM1764845773988595', 4, 'Afsar Molla', '01766554432', 'aauthor@gmail.com', 'Internet', 'RingTel Standard - 12 (Price: 590/- BDT)', 590.00, '2025-12-08 00:00:00', 'Payment Due', 'System Only', 'Dear Afsar Molla, your payment of BDT 590.00 for RingTel Standard - 12 (Price: 590/- BDT) is due on 12/8/2025. Please make payment to avoid service interruption.', 'Pending', '2025-12-04 10:57:00', NULL, 'High', 0, 3, NULL, 'jhghfgkjhfhjfhgd', 1, 'Monthly', '2026-01-08 00:00:00', 'admin', NULL, '2025-12-04 10:56:13', '2025-12-04 10:56:13'),
(19, 'REM1765821837955866', 8, 'Abdur Rahman', '01711223344', 'abdur.rahman@example.com', 'Internet', 'Starter - 10 Mbps (Price: 800.00/- BDT)', 800.00, '2025-12-20 00:00:00', 'Payment Due', 'SMS', 'Dear Abdur Rahman, your payment of BDT 800.00 for Starter - 10 Mbps (Price: 800.00/- BDT) is due on 12/20/2025. Please make payment to avoid service interruption.', 'Pending', '2025-12-15 18:05:00', NULL, 'Medium', 0, 3, NULL, 'dgfhdfgh', 0, 'Monthly', NULL, 'admin', NULL, '2025-12-15 18:03:57', '2025-12-15 18:03:57');

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

--
-- Dumping data for table `role-permissions`
--

INSERT INTO `role-permissions` (`id`, `roleName`, `permissions`, `createdAt`, `updatedAt`) VALUES
(1, 'Technical', '[{\"permissionName\":\"Add User\",\"checked\":true},{\"permissionName\":\"Delete User\",\"checked\":true},{\"permissionName\":\"Edit User\",\"checked\":true},{\"permissionName\":\"Add Doctor\",\"checked\":false},{\"permissionName\":\"Delete Doctor\",\"checked\":false},{\"permissionName\":\"Edit Doctor\",\"checked\":false},{\"permissionName\":\"Manage Appointments\",\"checked\":false},{\"permissionName\":\"Manage Hospital Gallery\",\"checked\":false},{\"permissionName\":\"Manage Home Page Data\",\"checked\":false},{\"permissionName\":\"Manage Billing\",\"checked\":false},{\"permissionName\":\"Manage Staff\",\"checked\":false},{\"permissionName\":\"View Reports\",\"checked\":false}]', '2025-11-28 17:30:13', '2025-11-30 15:28:44');

-- --------------------------------------------------------

--
-- Table structure for table `salaries`
--

CREATE TABLE `salaries` (
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
  `grossSalary` float NOT NULL,
  `totalDeductions` float NOT NULL,
  `netSalary` float NOT NULL,
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
-- Dumping data for table `salaries`
--

INSERT INTO `salaries` (`id`, `salaryId`, `employeeId`, `employeeName`, `department`, `designation`, `salaryMonth`, `salaryYear`, `basicSalary`, `houseRent`, `medicalAllowance`, `travelAllowance`, `otherAllowances`, `providentFund`, `taxDeduction`, `otherDeductions`, `totalWorkingDays`, `presentDays`, `absentDays`, `paidLeaves`, `unpaidLeaves`, `overtimeHours`, `overtimeRate`, `overtimeAmount`, `performanceBonus`, `festivalBonus`, `otherBonuses`, `grossSalary`, `totalDeductions`, `netSalary`, `paymentStatus`, `paymentDate`, `paymentMethod`, `bankAccount`, `createdBy`, `note`, `createdAt`, `updatedAt`) VALUES
(1, 'SAL-2024-03-685', 'EMP-001', 'John Doe', 'Technical', 'Network Engineer', '2024-03', 2024, 25000, 12500, 1500, 1000, 2000, 2500, 1500, 500, 26, 24, 1, 1, 0, 8, 200, 1600, 2000, 0, 0, 44000, 4500, 39500, 'paid', NULL, 'bank', 'XXXXXX1234', 'admin', 'Regular salary for March', '2025-11-29 13:53:35', '2025-11-29 13:53:35'),
(6, 'SAL-2024-04-868', 'EMP-001', 'John Doe', 'Technical', 'Network Engineer', '2024-04', 2024, 25000, 12500, 1500, 1000, 2000, 2500, 1500, 500, 26, 24, 1, 1, 0, 8, 200, 1600, 2000, 0, 0, 44000, 4500, 39500, 'paid', NULL, 'bank', 'XXXXXX1234', 'admin', 'Regular salary for March', '2025-11-29 15:10:29', '2025-11-29 15:10:29'),
(7, 'SAL-2024-04-376', 'EMP-002', 'John Doe', 'Technical', 'Network Engineer', '2024-04', 2024, 25000, 12500, 1500, 1000, 2000, 2500, 1500, 500, 26, 24, 1, 1, 0, 8, 200, 1600, 2000, 0, 0, 44000, 4500, 39500, 'paid', NULL, 'bank', 'XXXXXX1234', 'admin', 'Regular salary for March', '2025-11-29 15:10:34', '2025-11-29 15:10:34'),
(9, 'SAL-2024-04-303', 'EMP-004', 'John Doe', 'Technical', 'Network Engineer', '2024-04', 2024, 25000, 12500, 1500, 1000, 2000, 2500, 1500, 500, 26, 24, 1, 1, 0, 8, 200, 1600, 2000, 0, 0, 44000, 4500, 39500, 'paid', NULL, 'bank', 'XXXXXX1234', 'admin', 'Regular salary for March', '2025-11-29 15:10:44', '2025-11-29 15:10:44'),
(11, 'SAL-2024-04-758', 'EMP-006', 'John Doe', 'Technical', 'Network Engineer', '2024-04', 2024, 25000, 12500, 1500, 1000, 2000, 2500, 1500, 500, 26, 24, 1, 1, 0, 8, 200, 1600, 2000, 0, 0, 44000, 4500, 39500, 'paid', NULL, 'bank', 'XXXXXX1234', 'admin', 'Regular salary for March', '2025-11-29 15:10:51', '2025-11-29 15:10:51'),
(15, 'SAL-2024-04-850', 'EMP-010', 'John Doe', 'Technical', 'Network Engineer', '2024-04', 2024, 25000, 12500, 1500, 1000, 2000, 2500, 1500, 500, 26, 24, 1, 1, 0, 8, 200, 1600, 2000, 0, 0, 44000, 4500, 39500, 'paid', NULL, 'bank', 'XXXXXX1234', 'admin', 'Regular salary for March', '2025-11-29 15:11:08', '2025-11-29 15:11:08'),
(16, 'SAL-2024-04-855', 'EMP-011', 'John Doe', 'Technical', 'Network Engineer', '2024-04', 2024, 25000, 12500, 1500, 1000, 2000, 2500, 1500, 500, 26, 24, 1, 1, 0, 8, 200, 1600, 2000, 0, 0, 44000, 4500, 39500, 'paid', NULL, 'bank', 'XXXXXX1234', 'admin', 'Regular salary for March', '2025-11-29 15:11:12', '2025-11-29 15:11:12'),
(18, 'SAL-2025-10-896', 'EMP-012', 'Amar Vai', 'Methor', 'Teacher', '2025-10', 2025, 564, 45654, 546, 45654, 54654, 55, 55, 55, 44, 44, 44, 44, 44, 45654, 546, 24927100, 543654, 456, 55, 25618300, 165, 25618200, 'paid', '2025-11-24 00:00:00', 'mobile_banking', '01761043883', 'admin', 'The additional note.', '2025-11-29 18:15:50', '2025-11-29 19:28:38'),
(19, 'SAL-2025-11-064', 'EMP-012', 'Amar Valo vai', 'dsfa', 'dfgdfsg', '2025-11', 2025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'pending', NULL, 'bank', '', 'admin', '', '2025-11-29 19:17:41', '2025-11-29 19:17:41'),
(20, 'SAL-2025-08-542', 'sohelk2@ringtel', 'Sohel Khan', 'Technical', 'Admin', '2025-08', 2025, 54654, 546, 546, 546, 546, 56, 546, 546, 456, 456, 456, 546, 456, 546, 54, 29484, 54, 546, 54, 86976, 1148, 85828, 'pending', '2025-12-18 00:00:00', 'cash', '', 'admin', 'fsggd', '2025-12-02 13:32:14', '2025-12-02 13:32:14'),
(21, 'SAL-2025-12-377', 'sohelk3@ringtel', 'Sohel Khan', 'Technical', 'Admin', '2025-12', 2025, 43543, 435, 345, 34, 43, 43, 43, 43, 23, 3, 4, 3, 2, 43, 34, 1462, 43, 34, 43, 45982, 129, 45853, 'paid', '2025-12-03 00:00:00', 'bank', '43', 'admin', 'dfghghfgh', '2025-12-02 17:15:31', '2025-12-02 17:15:31'),
(22, 'SAL-2026-01-986', 'sohelk@ringtel', 'Sohel Khan', 'Technical', 'Admin', '2026-01', 2026, 25000, 100, 100, 100, 100, 100, 100, 99, 22, 12, 1, 2, 1, 9, 12, 108, 100, 100, 100, 25808, 299, 25509, 'paid', '2025-12-06 00:00:00', 'mobile_banking', '01761043883', 'admin', 'Note....', '2025-12-04 10:12:49', '2025-12-04 10:14:20');

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

--
-- Dumping data for table `tickets`
--

INSERT INTO `tickets` (`id`, `ticketMadeBy`, `ticketId`, `status`, `title`, `description`, `assignedTo`, `createdAt`, `updatedAt`) VALUES
(1, '4', '961180', 'pending', 'Connected but No Internet Access', 'dfghgdfhfg', 'admin1@example.com', '2025-12-02 05:49:25', '2025-12-02 05:49:25'),
(2, '4', '447539', 'pending', 'Connected but No Internet Access', 'dfghgdfhfg', 'admin3@example.com', '2025-12-02 05:49:31', '2025-12-02 05:49:31'),
(3, '4', '332715', 'pending', 'Connected but No Internet Access', 'dfghgdfhfg', 'admin2@example.com', '2025-12-02 05:49:31', '2025-12-02 05:49:31'),
(4, '4', '821892', 'pending', 'Connected but No Internet Access', 'dfghgdfhfg', 'admin2@example.com', '2025-12-02 05:49:32', '2025-12-02 05:49:32'),
(5, '4', '209612', 'pending', 'Connected but No Internet Access', 'dfghgdfhfg', 'admin3@example.com', '2025-12-02 05:49:33', '2025-12-02 05:49:33'),
(6, '4', '242364', 'pending', 'Connected but No Internet Access', 'dfghgdfhfg', 'admin2@example.com', '2025-12-02 05:49:33', '2025-12-02 05:49:33'),
(7, '4', '497141', 'pending', 'Connected but No Internet Access', 'dfghgdfhfg', 'admin3@example.com', '2025-12-02 05:49:33', '2025-12-02 05:49:33'),
(8, '4', '383821', 'pending', 'Connected but No Internet Access', 'dfghgdfhfg', 'admin1@example.com', '2025-12-02 05:49:33', '2025-12-02 05:49:33'),
(9, '4', '489711', 'pending', 'Router To TV Problem', 'dfghsg', 'admin2@example.com', '2025-12-02 06:15:42', '2025-12-02 06:15:42'),
(10, '4', '960841', 'pending', 'Router To TV Problem', 'dfghsg', 'admin3@example.com', '2025-12-02 06:15:42', '2025-12-02 06:15:42'),
(11, '4', '534557', 'pending', 'Router To TV Problem', 'dfghsg', 'admin3@example.com', '2025-12-02 06:15:42', '2025-12-02 06:15:42'),
(12, '4', '178279', 'pending', 'Router To TV Problem', 'dfghsg', 'admin1@example.com', '2025-12-02 06:15:43', '2025-12-02 06:15:43'),
(13, '4', '155181', 'pending', 'Router To TV Problem', 'dfghsg', 'admin2@example.com', '2025-12-02 06:15:43', '2025-12-02 06:15:43'),
(14, '4', '256556', 'pending', 'Router To TV Problem', 'dfghsg', 'admin1@example.com', '2025-12-02 06:15:43', '2025-12-02 06:15:43'),
(15, '4', '697100', 'pending', 'Router To TV Problem', 'dfghsg', 'admin3@example.com', '2025-12-02 06:15:44', '2025-12-02 06:15:44'),
(16, '4', '377708', 'pending', 'Router To TV Problem', 'dfghsg', 'admin1@example.com', '2025-12-02 06:15:44', '2025-12-02 06:15:44'),
(17, '4', '703287', 'pending', 'Router To TV Problem', 'dfghsg', 'admin3@example.com', '2025-12-02 06:15:44', '2025-12-02 06:15:44'),
(18, '4', '657234', 'pending', 'Router To TV Problem', 'dfghsg', 'admin1@example.com', '2025-12-02 06:15:44', '2025-12-02 06:15:44'),
(19, '4', '188601', 'pending', 'Router To TV Problem', 'dfghsg', 'admin1@example.com', '2025-12-02 06:15:44', '2025-12-02 06:15:44'),
(20, '4', '563417', 'pending', 'Router To TV Problem', 'dfghsg', 'admin1@example.com', '2025-12-02 06:15:44', '2025-12-02 06:15:44'),
(21, '4', '552503', 'pending', 'Router To TV Problem', 'dfghsg', 'admin3@example.com', '2025-12-02 06:15:45', '2025-12-02 06:15:45'),
(22, '4', '118070', 'pending', 'Router To TV Problem', 'dfghsg', 'admin1@example.com', '2025-12-02 06:15:45', '2025-12-02 06:15:45'),
(23, '4', '696484', 'pending', 'Router To TV Problem', 'dfghsg', 'admin3@example.com', '2025-12-02 06:15:45', '2025-12-02 06:15:45'),
(24, '4', '199305', 'pending', 'Router To TV Problem', 'dfghsg', 'admin3@example.com', '2025-12-02 06:15:45', '2025-12-02 06:15:45'),
(25, '4', '366225', 'pending', 'Router To TV Problem', 'dfghsg', 'admin2@example.com', '2025-12-02 06:15:45', '2025-12-02 06:15:45');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `trxId` varchar(255) NOT NULL,
  `amount` float NOT NULL,
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

INSERT INTO `transactions` (`id`, `userId`, `trxId`, `amount`, `phoneNumber`, `status`, `remark`, `approvedBy`, `approvedAt`, `approvalRemark`, `rejectedBy`, `rejectedAt`, `rejectionReason`, `createdAt`, `updatedAt`) VALUES
(1, '11', 'fgdhgh', 500, '4675657', 'approved', '', '5', '2025-12-14 22:51:29', 'Paichi vai.', NULL, NULL, NULL, '2025-12-14 21:48:07', '2025-12-14 22:51:29'),
(2, '12', 'dfsgdfdfg', 280, '01743543', 'approved', '', '5', '2025-12-16 21:57:06', '', NULL, NULL, NULL, '2025-12-16 21:14:15', '2025-12-16 21:57:06'),
(4, '13', 'RCT-2025-12-000005', 300, '01777777777', 'approved', 'The second test.', NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-17 14:54:23', '2025-12-17 14:54:23');

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
(1, 'Downtown Zone7', 'Saver', 'The central business district of the city.', 'Active', '2025-11-28 17:54:40', '2025-11-28 17:54:40'),
(2, 'Dokkhin para', 'Motijhil', 'dfsgfgdf', 'Active', '2025-12-04 10:05:08', '2025-12-04 10:05:08'),
(3, 'Shamim Shoroni', 'Mirpur', 'Beside Panir Pamp', 'Active', '2025-12-08 13:57:55', '2025-12-08 13:57:55');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `authority-informations`
--
ALTER TABLE `authority-informations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `email` (`email`),
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
  ADD KEY `chat_messages_chat_id_created_at` (`chatId`,`createdAt`),
  ADD KEY `chat_messages_sender_id` (`senderId`),
  ADD KEY `chat_messages_status` (`status`),
  ADD KEY `chatmessages_chat_id_created_at` (`chatId`,`createdAt`),
  ADD KEY `chatmessages_sender_id` (`senderId`),
  ADD KEY `chatmessages_status` (`status`);

--
-- Indexes for table `chatparticipants`
--
ALTER TABLE `chatparticipants`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `chat_participants_chat_id_user_id` (`chatId`,`userId`),
  ADD UNIQUE KEY `chatparticipants_chat_id_user_id` (`chatId`,`userId`),
  ADD KEY `chat_participants_user_id` (`userId`),
  ADD KEY `chat_participants_last_seen_at` (`lastSeenAt`),
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
-- Indexes for table `employeeattendances`
--
ALTER TABLE `employeeattendances`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `employee_attendances_employee_id_date` (`employeeId`,`date`),
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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `bank_accounts`
--
ALTER TABLE `bank_accounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `benefits`
--
ALTER TABLE `benefits`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `chatmessages`
--
ALTER TABLE `chatmessages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `chatparticipants`
--
ALTER TABLE `chatparticipants`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `chats`
--
ALTER TABLE `chats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `cities`
--
ALTER TABLE `cities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `client-informations`
--
ALTER TABLE `client-informations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `contacts`
--
ALTER TABLE `contacts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `employeeattendances`
--
ALTER TABLE `employeeattendances`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `employee_bill_collection`
--
ALTER TABLE `employee_bill_collection`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `expenses`
--
ALTER TABLE `expenses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `expense_categories`
--
ALTER TABLE `expense_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `expense_payments`
--
ALTER TABLE `expense_payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `expense_sub_categories`
--
ALTER TABLE `expense_sub_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `packages`
--
ALTER TABLE `packages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `reminders`
--
ALTER TABLE `reminders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `role-permissions`
--
ALTER TABLE `role-permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `salaries`
--
ALTER TABLE `salaries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `tickets`
--
ALTER TABLE `tickets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `zones`
--
ALTER TABLE `zones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
-- Constraints for table `employee_bill_collection`
--
ALTER TABLE `employee_bill_collection`
  ADD CONSTRAINT `employee_bill_collection_ibfk_1` FOREIGN KEY (`clientId`) REFERENCES `client-informations` (`userId`),
  ADD CONSTRAINT `employee_bill_collection_ibfk_2` FOREIGN KEY (`employeeId`) REFERENCES `authority-informations` (`userId`);

--
-- Constraints for table `expenses`
--
ALTER TABLE `expenses`
  ADD CONSTRAINT `expenses_ibfk_1` FOREIGN KEY (`expenseCategoryId`) REFERENCES `expense_categories` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `expenses_ibfk_2` FOREIGN KEY (`expenseSubcategoryId`) REFERENCES `expense_sub_categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `expense_payments`
--
ALTER TABLE `expense_payments`
  ADD CONSTRAINT `expense_payments_ibfk_1` FOREIGN KEY (`expenseId`) REFERENCES `expenses` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `expense_payments_ibfk_2` FOREIGN KEY (`accountId`) REFERENCES `bank_accounts` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `expense_sub_categories`
--
ALTER TABLE `expense_sub_categories`
  ADD CONSTRAINT `expense_sub_categories_ibfk_1` FOREIGN KEY (`categoryId`) REFERENCES `expense_categories` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
