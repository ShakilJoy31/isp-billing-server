-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 12, 2024 at 07:00 AM
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
-- Database: `business_portfolio`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `parentId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `client_feedbacks`
--

CREATE TABLE `client_feedbacks` (
  `id` int(11) NOT NULL,
  `clientName` varchar(255) NOT NULL,
  `clientProfession` varchar(255) NOT NULL,
  `feedback` text NOT NULL,
  `profilePicture` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `client_feedbacks`
--

INSERT INTO `client_feedbacks` (`id`, `clientName`, `clientProfession`, `feedback`, `profilePicture`, `createdAt`, `updatedAt`) VALUES
(1, 'John Doe updated', 'Software Developer', 'The service was fantastic! Highly recommend to anyone looking for a reliable solution.', 'https://example.com/profile_pics/john_doe.jpg', '2024-12-10 14:07:18', '2024-12-10 14:07:52'),
(2, 'John Doe', 'Software Developer', 'The service was fantastic! Highly recommend to anyone looking for a reliable solution.', 'https://example.com/profile_pics/john_doe.jpg', '2024-12-10 14:07:28', '2024-12-10 14:07:28'),
(3, 'John Doe', 'Software Developer', 'The service was fantastic! Highly recommend to anyone looking for a reliable solution.', 'https://example.com/profile_pics/john_doe.jpg', '2024-12-10 15:16:05', '2024-12-10 15:16:05');

-- --------------------------------------------------------

--
-- Table structure for table `education_experiences`
--

CREATE TABLE `education_experiences` (
  `id` int(11) NOT NULL,
  `experience` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`experience`)),
  `education` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`education`)),
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `education_experiences`
--

INSERT INTO `education_experiences` (`id`, `experience`, `education`, `createdAt`, `updatedAt`) VALUES
(1, '[{\"organization\":\"Themeforest\",\"role\":\"Web Designer2\",\"startYear\":\"2021\",\"endYear\":\"Present\"},{\"organization\":\"Themeforest\",\"role\":\"Web Designer2\",\"startYear\":\"2021\",\"endYear\":\"Present\"},{\"organization\":\"Envato Theme Developer\",\"role\":\"Web\",\"startYear\":\"2021\",\"endYear\":\"2023\"},{\"organization\":\"Marketing Expert GRP\",\"role\":\"Web Developer & Business Partner\",\"startYear\":\"2021\",\"endYear\":\"Present\"}]', '[{\"degree\":\"Bachelor Degree of Information Technology\",\"institution\":\"State University Bangladesh\",\"startYear\":\"2021\",\"endYear\":\"Present\"},{\"degree\":\"Higher Secondary Education\",\"institution\":\"Premium College United VC\",\"startYear\":\"2021\",\"endYear\":\"2023\"},{\"degree\":\"Higher Secondary Education\",\"institution\":\"Premium College United VC\",\"startYear\":\"2021\",\"endYear\":\"2023\"}]', '2024-12-09 15:13:29', '2024-12-09 15:18:16');

-- --------------------------------------------------------

--
-- Table structure for table `footer_settings`
--

CREATE TABLE `footer_settings` (
  `id` int(11) NOT NULL,
  `copyright` varchar(255) NOT NULL,
  `rightsReserved` varchar(255) NOT NULL,
  `craftedBy` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `footer_settings`
--

INSERT INTO `footer_settings` (`id`, `copyright`, `rightsReserved`, `craftedBy`, `createdAt`, `updatedAt`) VALUES
(1, '© 2025, Dorh', 'All Rights Reserved.', 'Crafted with ❤️ by Themesvila', '2024-12-11 06:55:43', '2024-12-11 16:52:50');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `clientName` varchar(255) NOT NULL,
  `clientEmail` varchar(255) NOT NULL,
  `clientMessage` text NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `clientName`, `clientEmail`, `clientMessage`, `createdAt`, `updatedAt`) VALUES
(1, 'Abdul Basher', 'abdul@gmail.com', 'Hi, I am Abdul Basher. I hope this message finds you well. I am reaching out to discuss a project I have in mind. I would like you to create a detailed and visually appealing design for my home, incorporating modern aesthetics and functionality. Your expertise and creativity would bring immense value to this project. I am eagerly awaiting your response to discuss this further and explore how we can work together to bring this vision to life.', '2024-12-11 06:13:48', '2024-12-11 06:13:48'),
(2, 'Abdul Kuddus', 'abdul@gmail.com', 'Hi, I dont want to work with you in this moment.', '2024-12-11 06:14:01', '2024-12-11 06:15:01'),
(3, 'Abdul Kuddus', 'abdul@gmail.com', 'Hi, I am Abdul Basher. I hope this message finds you well. I am reaching out to discuss a project I have in mind. I would like you to create a detailed and visually appealing design for my home, incorporating modern aesthetics and functionality. Your expertise and creativity would bring immense value to this project. I am eagerly awaiting your response to discuss this further and explore how we can work together to bring this vision to life.', '2024-12-11 16:49:11', '2024-12-11 16:49:11');

-- --------------------------------------------------------

--
-- Table structure for table `pages`
--

CREATE TABLE `pages` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  `views` int(11) DEFAULT 0,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `subCategoryId` int(11) DEFAULT NULL,
  `message` varchar(255) DEFAULT '',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `authorId` int(11) DEFAULT NULL,
  `categoryId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pricing_informations`
--

CREATE TABLE `pricing_informations` (
  `id` int(11) NOT NULL,
  `pricingType` varchar(255) NOT NULL,
  `cost` float NOT NULL,
  `pricingDescription` varchar(255) NOT NULL,
  `features` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`features`)),
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pricing_informations`
--

INSERT INTO `pricing_informations` (`id`, `pricingType`, `cost`, `pricingDescription`, `features`, `createdAt`, `updatedAt`) VALUES
(1, 'Basateds', 999.99, 'Custom plan for large organizations with all premium features', '[\"Dedicated account manager\",\"Unlimited content and storage\",\"24/7 phone and email support\",\"Custom integrations\"]', '2024-12-10 13:41:19', '2024-12-10 15:15:47'),
(2, 'Basic', 999.99, 'Custom plan for large organizations with all premium features', '[\"Dedicated account manager\",\"Unlimited content and storage\",\"24/7 phone and email support\",\"Custom integrations\"]', '2024-12-10 13:41:32', '2024-12-10 13:41:32'),
(3, 'Premium', 999.99, 'Custom plan for large organizations with all premium features', '[\"Dedicated account manager\",\"Unlimited content and storage\",\"24/7 phone and email support\",\"Custom integrations\"]', '2024-12-10 15:15:31', '2024-12-10 15:15:31');

-- --------------------------------------------------------

--
-- Table structure for table `project_informations`
--

CREATE TABLE `project_informations` (
  `id` int(11) NOT NULL,
  `projectType` varchar(255) NOT NULL,
  `projectName` varchar(255) NOT NULL,
  `projectLink` varchar(255) DEFAULT NULL,
  `projectImages` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`projectImages`)),
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `project_informations`
--

INSERT INTO `project_informations` (`id`, `projectType`, `projectName`, `projectLink`, `projectImages`, `createdAt`, `updatedAt`) VALUES
(1, 'Development updated', 'International University management4', 'https://example.com/project-link', '[\"https://example.com/image1.jpg\",\"https://example.com/image2.jpg\",\"https://example.com/image3.jpg\"]', '2024-12-10 13:03:22', '2024-12-10 13:18:10'),
(2, 'Designing22222', 'International University', 'https://example.com/project-link', '[\"https://example.coage1.jpg\",\"https://example.com/image2.jpg\",\"https://example.com/image3.jpg\"]', '2024-12-10 13:03:30', '2024-12-10 15:12:58'),
(3, 'Development', 'International University management3', 'https://example.com/project-link', '[\"https://example.com/image1.jpg\",\"https://example.com/image2.jpg\",\"https://example.com/image3.jpg\"]', '2024-12-10 13:03:37', '2024-12-10 13:03:37'),
(4, 'Development', 'International University management4', 'https://example.com/project-link', '[\"https://example.com/image1.jpg\",\"https://example.com/image2.jpg\",\"https://example.com/image3.jpg\"]', '2024-12-10 13:03:49', '2024-12-10 13:03:49'),
(5, 'Development', 'International University management8', 'https://example.com/project-link', '[\"https://example.com/image1.jpg\",\"https://example.com/image2.jpg\",\"https://example.com/image3.jpg\"]', '2024-12-10 15:12:46', '2024-12-10 15:12:46');

-- --------------------------------------------------------

--
-- Table structure for table `service_informations`
--

CREATE TABLE `service_informations` (
  `id` int(11) NOT NULL,
  `serviceTitle` varchar(255) NOT NULL,
  `serviceName` varchar(255) NOT NULL,
  `serviceDescription` text NOT NULL,
  `serviceLogo` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `service_informations`
--

INSERT INTO `service_informations` (`id`, `serviceTitle`, `serviceName`, `serviceDescription`, `serviceLogo`, `createdAt`, `updatedAt`) VALUES
(1, 'Quality Services', 'Brand Identity Design', 'Dorbesh gives you the blocks & kits you need to create a true website within minutes.', 'https://easy-peasy.ai/cdn-cgi/image/quality=80,format=auto,width=700/https://fdczvxmwwjwpwbeeqcth.supabase.co/storage/v1/object/public/images/50dab922-5d48-4c6b-8725-7fd0755d9334/3a3f2d35-8167-4708-9ef0-bdaa980989f9.png', '2024-12-09 11:03:20', '2024-12-09 11:03:20'),
(2, 'Quality Services', 'Brand Identity Design', 'Dorbesh gives you the blocks & kits you need to create a true website within minutes.', 'https://easy-peasy.ai/cdn-cgi/image/quality=80,format=auto,width=700/https://fdczvxmwwjwpwbeeqcth.supabase.co/storage/v1/object/public/images/50dab922-5d48-4c6b-8725-7fd0755d9334/3a3f2d35-8167-4708-9ef0-bdaa980989f9.png', '2024-12-09 11:03:40', '2024-12-09 11:03:40');

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` int(11) NOT NULL,
  `client` text DEFAULT NULL,
  `admin` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `site_settings_business_portfolios`
--

CREATE TABLE `site_settings_business_portfolios` (
  `id` int(11) NOT NULL DEFAULT 1,
  `favicon` varchar(255) NOT NULL,
  `headerLogo` varchar(255) NOT NULL,
  `siteTitle` varchar(255) NOT NULL,
  `siteURL` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `site_settings_business_portfolios`
--

INSERT INTO `site_settings_business_portfolios` (`id`, `favicon`, `headerLogo`, `siteTitle`, `siteURL`, `createdAt`, `updatedAt`) VALUES
(1, 'sdfgsdffgdfs', 'dfgsggdfsg', 'dfsgdfsgdfsdsgfsdfg', 'hgjkhgfjhgjghfgddfsgdfsg', '2024-12-11 07:03:18', '2024-12-11 07:03:32');

-- --------------------------------------------------------

--
-- Table structure for table `skill_informations`
--

CREATE TABLE `skill_informations` (
  `id` int(11) NOT NULL,
  `proficiencyIn` varchar(255) NOT NULL,
  `capability` int(11) NOT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `skill_informations`
--

INSERT INTO `skill_informations` (`id`, `proficiencyIn`, `capability`, `logo`, `createdAt`, `updatedAt`) VALUES
(1, 'Web Designing', 60, '', '2024-12-10 09:39:23', '2024-12-10 09:39:23'),
(2, 'Web Designing', 60, 'mrunal thakur', '2024-12-10 09:42:23', '2024-12-10 09:42:23'),
(3, 'Web Designing', 60, 'mrunal thakur', '2024-12-10 09:42:50', '2024-12-10 09:42:50'),
(4, 'Web Designing', 60, 'mrunal thakur', '2024-12-10 09:45:27', '2024-12-10 09:45:27'),
(5, 'Web Designing', 60, 'mrunal thakur', '2024-12-10 09:45:30', '2024-12-10 09:45:30'),
(6, 'Web Designing', 60, 'mrunal thakur', '2024-12-10 09:45:31', '2024-12-10 09:45:31'),
(7, 'Web Designing', 60, 'mrunal thakur', '2024-12-10 09:46:46', '2024-12-10 09:46:46'),
(8, 'Web Designing', 60, 'mrunal thakur', '2024-12-10 09:46:49', '2024-12-10 09:46:49'),
(9, 'Graphs desinging', 70, 'mrunal thakur', '2024-12-10 10:07:28', '2024-12-10 10:07:28'),
(10, 'Graphs desging', 70, 'mrunal thakur', '2024-12-10 15:14:27', '2024-12-10 15:14:27');

-- --------------------------------------------------------

--
-- Table structure for table `stories`
--

CREATE TABLE `stories` (
  `id` int(11) NOT NULL,
  `storyTitle` varchar(255) NOT NULL,
  `date` varchar(255) NOT NULL,
  `client` varchar(255) NOT NULL,
  `service` varchar(255) NOT NULL,
  `projectType` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `images` text NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stories`
--

INSERT INTO `stories` (`id`, `storyTitle`, `date`, `client`, `service`, `projectType`, `description`, `images`, `createdAt`, `updatedAt`) VALUES
(1, 'Beautiful design for bra', '2024', 'Bento', 'Web Design', 'Creative', 'This is demo description', '[\"https://static.toiimg.com/photo/111460172/111460172.jpg?v=3\",\"https://static.toiimg.com/photo/111460172/111460172.jpg?v=3\",\"https://static.toiimg.com/photo/111460172/111460172.jpg?v=3\",\"https://static.toiimg.com/photo/111460172/111460172.jpg?v=3\"]', '2024-12-11 05:26:55', '2024-12-11 16:48:42'),
(2, 'Beautiful design for brand new Business', '2024', 'Bento Studio', 'Web Design', 'Creative', 'This is demo description', '[\"https://static.toiimg.com/photo/111460172/111460172.jpg?v=3\",\"https://static.toiimg.com/photo/111460172/111460172.jpg?v=3\",\"https://static.toiimg.com/photo/111460172/111460172.jpg?v=3\",\"https://static.toiimg.com/photo/111460172/111460172.jpg?v=3\"]', '2024-12-11 05:27:06', '2024-12-11 05:27:06'),
(3, 'Beautiful design for brand new Business', '2024', 'Bento Studio', 'Web Design', 'Creative', 'This is demo description', '[\"https://static.toiimg.com/photo/111460172/111460172.jpg?v=3\",\"https://static.toiimg.com/photo/111460172/111460172.jpg?v=3\",\"https://static.toiimg.com/photo/111460172/111460172.jpg?v=3\",\"https://static.toiimg.com/photo/111460172/111460172.jpg?v=3\"]', '2024-12-11 16:30:19', '2024-12-11 16:30:19'),
(4, 'Beautiful design for brand new Business', '2024', 'Bento Studio', 'Web Design', 'Creative', 'This is demo description', '[\"https://static.toiimg.com/photo/111460172/111460172.jpg?v=3\",\"https://static.toiimg.com/photo/111460172/111460172.jpg?v=3\",\"https://static.toiimg.com/photo/111460172/111460172.jpg?v=3\",\"https://static.toiimg.com/photo/111460172/111460172.jpg?v=3\"]', '2024-12-11 16:30:23', '2024-12-11 16:30:23');

-- --------------------------------------------------------

--
-- Table structure for table `user-informations`
--

CREATE TABLE `user-informations` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `profession` varchar(255) NOT NULL,
  `wordDescription` text DEFAULT NULL,
  `availableFor` varchar(255) NOT NULL,
  `biography` text NOT NULL,
  `cv` text DEFAULT NULL,
  `socialMedia` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`socialMedia`)),
  `password` varchar(255) NOT NULL,
  `profilePicture` varchar(255) DEFAULT NULL,
  `address` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user-informations`
--

INSERT INTO `user-informations` (`id`, `name`, `profession`, `wordDescription`, `availableFor`, `biography`, `cv`, `socialMedia`, `password`, `profilePicture`, `address`, `createdAt`, `updatedAt`) VALUES
(1, 'Dorbesh baba', 'Web designer', 'This is demo word description', 'Freelancing', 'I am a Web Designer based in San Francisco.', 'This is cv', '{\"facebook\":\"www.facebook.com\",\"twitter\":\"www.twitter.com\",\"linkedin\":\"www.linkedin.com\",\"github\":\"www.github.com\"}', 'demo@gmail.com', 'https://easy-peasy.ai/cdn-cgi/image/quality=80,format=auto,width=700/https://fdczvxmwwjwpwbeeqcth.supabase.co/storage/v1/object/public/images/50dab922-5d48-4c6b-8725-7fd0755d9334/3a3f2d35-8167-4708-9ef0-bdaa980989f9.png', 'Dhaka, Bangladesh', '2024-12-09 09:51:37', '2024-12-09 10:39:46');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `picture` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `postcode` varchar(255) DEFAULT NULL,
  `refresh_token` varchar(255) DEFAULT NULL,
  `access_token` varchar(255) DEFAULT NULL,
  `role` enum('admin') NOT NULL DEFAULT 'admin',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `phone`, `picture`, `city`, `address`, `postcode`, `refresh_token`, `access_token`, `role`, `createdAt`, `updatedAt`) VALUES
(1, 'Updated Demo User', 'demo@gmail.com', 'de1', '1234567890', NULL, 'San Francisco', '123 Demo Street', '94101', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6IiIsImlhdCI6MTczMzkzNjA2NSwiZXhwIjoxNzY1NDcyMDY1fQ.-6HBg-Et4GGh-FhuRBDytGNu8jJugIZ-_ojyx_5U-0U', NULL, '', '2024-12-07 15:55:28', '2024-12-11 16:54:25');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `client_feedbacks`
--
ALTER TABLE `client_feedbacks`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `education_experiences`
--
ALTER TABLE `education_experiences`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `footer_settings`
--
ALTER TABLE `footer_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pages`
--
ALTER TABLE `pages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `subCategoryId` (`subCategoryId`),
  ADD KEY `authorId` (`authorId`),
  ADD KEY `categoryId` (`categoryId`);

--
-- Indexes for table `pricing_informations`
--
ALTER TABLE `pricing_informations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `project_informations`
--
ALTER TABLE `project_informations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `service_informations`
--
ALTER TABLE `service_informations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `site_settings_business_portfolios`
--
ALTER TABLE `site_settings_business_portfolios`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `skill_informations`
--
ALTER TABLE `skill_informations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `stories`
--
ALTER TABLE `stories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user-informations`
--
ALTER TABLE `user-informations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `client_feedbacks`
--
ALTER TABLE `client_feedbacks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `education_experiences`
--
ALTER TABLE `education_experiences`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `pages`
--
ALTER TABLE `pages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pricing_informations`
--
ALTER TABLE `pricing_informations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `project_informations`
--
ALTER TABLE `project_informations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `service_informations`
--
ALTER TABLE `service_informations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `skill_informations`
--
ALTER TABLE `skill_informations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `stories`
--
ALTER TABLE `stories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `user-informations`
--
ALTER TABLE `user-informations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`subCategoryId`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `posts_ibfk_2` FOREIGN KEY (`authorId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `posts_ibfk_3` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
