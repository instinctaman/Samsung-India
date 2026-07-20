-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 18, 2026 at 09:31 AM
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
-- Database: `tecsoui_tops_aman`
--
CREATE DATABASE IF NOT EXISTS `tecsoui_tops_aman` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `tecsoui_tops_aman`;

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `adminUid` varchar(100) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` bigint(10) DEFAULT NULL,
  `altPhone` bigint(10) DEFAULT NULL,
  `gender` varchar(50) DEFAULT NULL,
  `dob` varchar(50) DEFAULT NULL,
  `fatherName` varchar(180) DEFAULT NULL,
  `motherName` varchar(180) DEFAULT NULL,
  `localCity` varchar(180) DEFAULT NULL,
  `localDistrict` varchar(180) DEFAULT NULL,
  `localState` varchar(180) DEFAULT NULL,
  `localPinCode` varchar(180) DEFAULT NULL,
  `localLandmark` varchar(180) DEFAULT NULL,
  `permanentCity` varchar(180) DEFAULT NULL,
  `permanentDistrict` varchar(180) DEFAULT NULL,
  `permanentState` varchar(180) DEFAULT NULL,
  `permanentPinCode` varchar(180) DEFAULT NULL,
  `permanentLandmark` varchar(180) DEFAULT NULL,
  `aadharNo` varchar(100) DEFAULT NULL,
  `aadharImage` varchar(300) DEFAULT NULL,
  `profilePhoto` varchar(100) DEFAULT NULL,
  `about` longtext DEFAULT NULL,
  `resume` varchar(300) DEFAULT NULL,
  `otherDocument` varchar(300) DEFAULT NULL,
  `username` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `facebook` varchar(300) NOT NULL DEFAULT 'https://facebook.com/',
  `twitter` varchar(300) NOT NULL DEFAULT 'https://twitter.com/',
  `instagram` varchar(300) NOT NULL DEFAULT 'https://instagram.com/',
  `linkedin` varchar(300) NOT NULL DEFAULT 'https://www.linkedin.com/company/',
  `youtube` varchar(300) NOT NULL DEFAULT 'https://www.youtube.com/',
  `github` varchar(100) DEFAULT NULL,
  `jobStatus` varchar(100) NOT NULL DEFAULT 'Pending',
  `joinedOn` varchar(100) DEFAULT NULL,
  `company` varchar(100) DEFAULT NULL,
  `band` varchar(50) DEFAULT NULL,
  `reportingManager` varchar(100) DEFAULT NULL,
  `postedIn` varchar(100) DEFAULT NULL,
  `role` varchar(100) NOT NULL DEFAULT 'NA',
  `access` longtext DEFAULT NULL CHECK (json_valid(`access`)),
  `ui_preferences` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`ui_preferences`)),
  `designation` varchar(100) DEFAULT NULL,
  `salary` varchar(100) DEFAULT NULL,
  `companyEmail` varchar(100) DEFAULT NULL,
  `visitingCard` varchar(100) NOT NULL DEFAULT 'No',
  `idCard` varchar(100) NOT NULL DEFAULT 'No',
  `offerLetter` varchar(100) NOT NULL DEFAULT 'No',
  `letterHead` varchar(100) NOT NULL DEFAULT 'No',
  `promoCode` varchar(100) NOT NULL DEFAULT 'No',
  `updatedBy` varchar(100) DEFAULT NULL,
  `updationOn` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `isRead` varchar(50) NOT NULL DEFAULT 'No',
  `token` varchar(100) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` varchar(100) NOT NULL DEFAULT 'Pending',
  `remarks` mediumtext DEFAULT NULL,
  `securityDetails` longtext DEFAULT NULL,
  `masterRemarks` longtext DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `admin_sessions`
--

CREATE TABLE `admin_sessions` (
  `id` bigint(20) NOT NULL,
  `admin_id` int(11) DEFAULT NULL,
  `session_token` varchar(255) DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `device_info` text DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `checkin_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `checkout_time` timestamp NULL DEFAULT NULL,
  `biometric_proof_path` varchar(500) DEFAULT NULL,
  `status` enum('Active','Terminated') DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `advertising`
--

CREATE TABLE `advertising` (
  `id` int(11) NOT NULL,
  `advertisingUid` varchar(100) DEFAULT NULL,
  `agencyUid` varchar(100) DEFAULT NULL,
  `adsType` varchar(100) DEFAULT NULL,
  `actionButtonText` varchar(100) DEFAULT NULL,
  `actionButtonTarget` varchar(200) DEFAULT NULL,
  `blueTick` varchar(100) DEFAULT NULL,
  `title` varchar(100) DEFAULT NULL,
  `summary` mediumtext DEFAULT NULL,
  `image` varchar(300) DEFAULT NULL,
  `thumbnails` varchar(300) DEFAULT NULL,
  `video` varchar(300) DEFAULT NULL,
  `promoCode` varchar(100) DEFAULT NULL,
  `expiredOn` varchar(100) DEFAULT NULL,
  `postingDate` varchar(100) DEFAULT NULL,
  `isRead` varchar(100) DEFAULT NULL,
  `updatedBy` varchar(100) DEFAULT NULL,
  `updatedOn` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `token` varchar(100) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` varchar(100) NOT NULL DEFAULT 'Pending',
  `visibleOnWeb` varchar(50) NOT NULL DEFAULT 'No',
  `remarks` longtext DEFAULT NULL,
  `securityDetails` longtext DEFAULT NULL,
  `masterRemarks` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `agency`
--

CREATE TABLE `agency` (
  `id` int(11) NOT NULL,
  `agencyUid` char(100) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` bigint(10) DEFAULT NULL,
  `companyName` varchar(200) DEFAULT NULL,
  `website` varchar(200) DEFAULT NULL,
  `logo` varchar(300) DEFAULT NULL,
  `authenticationDocs` varchar(300) DEFAULT NULL,
  `certificateNo` varchar(300) DEFAULT NULL,
  `localCity` varchar(100) DEFAULT NULL,
  `localDistrict` varchar(100) DEFAULT NULL,
  `localState` varchar(100) DEFAULT NULL,
  `localPinCode` varchar(100) DEFAULT NULL,
  `localLandmark` varchar(200) DEFAULT NULL,
  `permanentCity` varchar(100) DEFAULT NULL,
  `permanentDistrict` varchar(100) DEFAULT NULL,
  `permanentState` varchar(100) DEFAULT NULL,
  `permanentPinCode` varchar(100) DEFAULT NULL,
  `permanentLandmark` varchar(200) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `approvedBy` varchar(100) DEFAULT NULL,
  `managementFee` varchar(100) DEFAULT NULL,
  `aboutAgency` longtext DEFAULT NULL,
  `facebook` varchar(100) NOT NULL DEFAULT 'https://facebook.com/',
  `twitter` varchar(100) NOT NULL DEFAULT 'https://twitter.com/',
  `instagram` varchar(100) NOT NULL DEFAULT 'https://instagram.com/',
  `linkedin` varchar(100) NOT NULL DEFAULT 'https://www.linkedin.com/company/',
  `youtube` varchar(100) NOT NULL DEFAULT 'https://www.youtube.com/',
  `isRead` varchar(50) DEFAULT NULL,
  `updatedBy` varchar(50) DEFAULT NULL,
  `updatedOn` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `contractExpired` varchar(100) NOT NULL DEFAULT 'Not Expired',
  `token` varchar(100) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` varchar(100) NOT NULL DEFAULT 'Pending',
  `remarks` longtext DEFAULT NULL,
  `securityDetails` longtext DEFAULT NULL,
  `masterRemarks` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `agencyteam`
--

CREATE TABLE `agencyteam` (
  `id` int(11) NOT NULL,
  `agencyTeamUid` varchar(100) DEFAULT NULL,
  `companyUid` varchar(100) DEFAULT NULL,
  `company` varchar(150) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` bigint(10) DEFAULT NULL,
  `altPhone` bigint(10) DEFAULT NULL,
  `officialEmail` varchar(100) DEFAULT NULL,
  `dob` varchar(50) DEFAULT NULL,
  `gender` varchar(50) DEFAULT NULL,
  `offerId` varchar(100) DEFAULT NULL,
  `designation` varchar(100) DEFAULT NULL,
  `role` varchar(100) DEFAULT NULL,
  `jobCity` varchar(100) DEFAULT NULL,
  `jobState` varchar(100) DEFAULT NULL,
  `jobPincode` varchar(50) DEFAULT NULL,
  `profilePhoto` varchar(250) NOT NULL DEFAULT 'defaultfile.png',
  `username` varchar(100) DEFAULT NULL,
  `password` varchar(100) NOT NULL DEFAULT '$2y$10$qDSaaJA.3/PPItCLB2xdt.xFZaGa7IfHLhCq.EQGILTEZzaj3wRju',
  `filePath` varchar(100) DEFAULT NULL,
  `logPath` varchar(100) DEFAULT NULL,
  `excelUploadedOn` varchar(100) DEFAULT NULL,
  `updatedBy` varchar(100) DEFAULT NULL,
  `updationOn` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `isRead` varchar(50) NOT NULL DEFAULT 'No',
  `token` varchar(50) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` varchar(50) NOT NULL DEFAULT 'Pending',
  `remarks` mediumtext DEFAULT NULL,
  `securityDetails` longtext DEFAULT NULL,
  `masterRemarks` longtext DEFAULT NULL,
  `agency_location_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `agency_banks`
--

CREATE TABLE `agency_banks` (
  `id` bigint(20) NOT NULL,
  `agency_id` bigint(20) DEFAULT NULL,
  `agency_location_id` bigint(20) DEFAULT NULL,
  `bank_name` varchar(150) DEFAULT NULL,
  `account_holder_name` varchar(150) DEFAULT NULL,
  `account_number` varchar(100) DEFAULT NULL,
  `ifsc_code` varchar(20) DEFAULT NULL,
  `account_type` enum('Current','Savings','Virtual') DEFAULT 'Current',
  `swift_code` varchar(50) DEFAULT NULL,
  `upi_id` varchar(100) DEFAULT NULL,
  `qr_image_path` varchar(500) DEFAULT NULL,
  `is_primary` enum('Yes','No') DEFAULT 'No',
  `verification_status` enum('Pending','Verified','Rejected') DEFAULT 'Pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `agency_contacts`
--

CREATE TABLE `agency_contacts` (
  `id` bigint(20) NOT NULL,
  `agency_id` bigint(20) DEFAULT NULL,
  `agency_location_id` bigint(20) DEFAULT NULL,
  `contact_name` varchar(150) DEFAULT NULL,
  `designation` varchar(100) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `alt_phone` varchar(50) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `is_primary` enum('Yes','No') DEFAULT 'No',
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `agency_documents`
--

CREATE TABLE `agency_documents` (
  `id` bigint(20) NOT NULL,
  `agency_id` bigint(20) DEFAULT NULL,
  `subcategory_id` int(11) DEFAULT NULL,
  `document_number` varchar(150) DEFAULT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `file_path` varchar(500) DEFAULT NULL,
  `file_type` varchar(50) DEFAULT NULL,
  `file_size_kb` int(11) DEFAULT 0,
  `issue_date` date DEFAULT NULL,
  `valid_until` date DEFAULT NULL,
  `verification_status` enum('Pending','Verified','Rejected','Expired') DEFAULT 'Pending',
  `uploaded_by` bigint(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `agency_gst_profiles`
--

CREATE TABLE `agency_gst_profiles` (
  `id` bigint(20) NOT NULL,
  `agency_id` bigint(20) DEFAULT NULL,
  `state_name` varchar(100) DEFAULT NULL,
  `state_code` varchar(10) DEFAULT NULL,
  `gst_number` varchar(50) DEFAULT NULL,
  `billing_address` text DEFAULT NULL,
  `billing_email` varchar(255) DEFAULT NULL,
  `billing_phone` varchar(50) DEFAULT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_primary` varchar(5) DEFAULT 'No'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `agency_locations`
--

CREATE TABLE `agency_locations` (
  `id` bigint(20) NOT NULL,
  `agency_id` bigint(20) DEFAULT NULL,
  `gst_profile_id` bigint(20) DEFAULT NULL,
  `branch_name` varchar(150) DEFAULT NULL,
  `is_headquarters` enum('Yes','No') DEFAULT 'No',
  `address_line` text DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `district` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `pincode` varchar(20) DEFAULT NULL,
  `zone` varchar(50) DEFAULT NULL,
  `region` varchar(50) DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `google_map_link` text DEFAULT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `agency_master`
--

CREATE TABLE `agency_master` (
  `id` bigint(20) NOT NULL,
  `agencyUid` varchar(100) DEFAULT NULL,
  `subcategory_id` int(11) DEFAULT NULL,
  `registered_name` varchar(255) DEFAULT NULL,
  `trade_name` varchar(255) DEFAULT NULL,
  `pan_number` varchar(50) DEFAULT NULL,
  `tan_number` varchar(50) DEFAULT NULL,
  `msme_status` enum('Yes','No') DEFAULT 'No',
  `msme_number` varchar(100) DEFAULT NULL,
  `business_metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`business_metadata`)),
  `credit_days` int(11) DEFAULT 0,
  `commission_percentage` decimal(5,2) DEFAULT 0.00,
  `portal_username` varchar(100) DEFAULT NULL,
  `portal_password` varchar(255) DEFAULT NULL,
  `portal_access` enum('Granted','Revoked') DEFAULT 'Revoked',
  `token` varchar(255) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'Active',
  `remarks` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `assessment`
--

CREATE TABLE `assessment` (
  `id` int(11) NOT NULL,
  `assessmentUid` varchar(100) DEFAULT NULL,
  `assessmentSuiteUid` varchar(100) DEFAULT NULL,
  `conferenceUid` varchar(100) DEFAULT NULL,
  `traineeUid` varchar(100) DEFAULT NULL,
  `questionId` varchar(100) DEFAULT NULL,
  `selectedOption` longtext DEFAULT NULL,
  `filePath` varchar(100) DEFAULT NULL,
  `logPath` varchar(100) DEFAULT NULL,
  `excelUploadedOn` varchar(100) DEFAULT NULL,
  `updatedBy` varchar(100) DEFAULT NULL,
  `updationOn` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `isRead` varchar(100) DEFAULT NULL,
  `token` varchar(100) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` varchar(50) NOT NULL DEFAULT 'Approved',
  `remarks` longtext DEFAULT NULL,
  `securityDetails` longtext DEFAULT NULL,
  `masterRemarks` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `assessmentsuite`
--

CREATE TABLE `assessmentsuite` (
  `id` int(11) NOT NULL,
  `assessmentSuiteUid` varchar(100) DEFAULT NULL,
  `courseUid` varchar(100) DEFAULT NULL,
  `courseName` varchar(100) DEFAULT NULL,
  `examTitle` mediumtext DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  `assessment_type` varchar(50) DEFAULT 'Quiz',
  `settings` longtext DEFAULT NULL COMMENT 'Stores Global Quiz Settings (Shuffle, Progress Bar, etc.)',
  `theme` longtext DEFAULT NULL COMMENT 'Stores Theme Colors, Fonts, Backgrounds',
  `noOfQuestion` int(11) DEFAULT 0,
  `testTime` varchar(50) DEFAULT NULL,
  `filePath` varchar(100) DEFAULT NULL,
  `logPath` varchar(100) DEFAULT NULL,
  `excelUploadedOn` varchar(100) DEFAULT NULL,
  `updatedBy` varchar(100) DEFAULT NULL,
  `updationOn` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `isRead` varchar(100) DEFAULT NULL,
  `token` varchar(100) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` varchar(50) NOT NULL DEFAULT 'Pending',
  `remarks` longtext DEFAULT NULL,
  `securityDetails` longtext DEFAULT NULL,
  `masterRemarks` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `assessment_results`
--

CREATE TABLE `assessment_results` (
  `id` int(11) NOT NULL,
  `resultUid` varchar(50) DEFAULT NULL,
  `conferenceUid` varchar(50) DEFAULT NULL,
  `traineeUid` varchar(50) DEFAULT NULL,
  `assessmentSuiteUid` varchar(50) DEFAULT NULL,
  `attemptNumber` int(11) DEFAULT 1 COMMENT '1st try, 2nd try, etc.',
  `totalScore` decimal(10,2) DEFAULT 0.00,
  `maxScore` decimal(10,2) DEFAULT 0.00,
  `percentage` decimal(5,2) DEFAULT 0.00,
  `startedAt` datetime DEFAULT NULL,
  `submittedAt` datetime DEFAULT NULL,
  `durationSeconds` int(11) DEFAULT 0 COMMENT 'Time taken in seconds',
  `status` varchar(20) DEFAULT 'Started' COMMENT 'Started, Submitted, Timeout',
  `answersSnapshot` longtext DEFAULT NULL COMMENT 'JSON dump of all answers for quick viewing',
  `ipAddress` varchar(45) DEFAULT NULL,
  `deviceInfo` varchar(255) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

CREATE TABLE `attendance` (
  `id` int(11) NOT NULL,
  `attendanceUid` varchar(100) DEFAULT NULL,
  `conferenceUid` varchar(100) DEFAULT NULL,
  `trainerUid` varchar(100) DEFAULT NULL,
  `traineeUid` varchar(100) DEFAULT NULL,
  `phone` bigint(20) DEFAULT NULL,
  `markedOn` varchar(50) DEFAULT NULL,
  `filePath` varchar(100) DEFAULT NULL,
  `logPath` varchar(100) DEFAULT NULL,
  `excelUploadedOn` varchar(100) DEFAULT NULL,
  `updatedBy` varchar(100) DEFAULT NULL,
  `updationOn` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `isRead` varchar(50) DEFAULT NULL,
  `token` varchar(50) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` varchar(100) NOT NULL DEFAULT 'Pending',
  `checkInPhoto` varchar(300) DEFAULT NULL,
  `checkOutPhoto` varchar(300) DEFAULT NULL,
  `checkOutTime` datetime DEFAULT NULL,
  `checkInDistance` varchar(50) DEFAULT NULL COMMENT 'E.g., 45 meters',
  `geofenceBypass` tinyint(1) DEFAULT 0 COMMENT '1=Bypassed by Trainer',
  `bypassRemark` text DEFAULT NULL,
  `attemptCount` int(11) DEFAULT 1,
  `isTheftLocked` tinyint(1) DEFAULT 0 COMMENT '0=Unlocked, 1=Locked',
  `remarks` longtext DEFAULT NULL,
  `securityDetails` longtext DEFAULT NULL,
  `sessionMeta` longtext DEFAULT NULL,
  `masterRemarks` longtext DEFAULT NULL,
  `theftAttemptsLeft` int(11) DEFAULT 3 COMMENT 'Countdown from 3 to 0',
  `theftRemarks` longtext DEFAULT NULL COMMENT 'Log of tab switches'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `attendance_logs`
--

CREATE TABLE `attendance_logs` (
  `id` int(11) NOT NULL,
  `logUid` varchar(50) DEFAULT NULL,
  `conferenceUid` varchar(50) DEFAULT NULL,
  `traineeUid` varchar(50) DEFAULT NULL,
  `moduleId` varchar(100) DEFAULT NULL,
  `markedAt` datetime DEFAULT current_timestamp(),
  `status` varchar(20) DEFAULT 'Present',
  `ipAddress` varchar(45) DEFAULT NULL,
  `deviceInfo` varchar(255) DEFAULT NULL,
  `locationData` text DEFAULT NULL COMMENT 'Lat,Long if GeoFencing on'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `blogs`
--

CREATE TABLE `blogs` (
  `id` int(11) NOT NULL,
  `blogsUid` varchar(100) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` bigint(10) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `categoryUid` varchar(100) DEFAULT NULL,
  `subCategoryUid` varchar(100) DEFAULT NULL,
  `title` varchar(100) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `summary` longtext DEFAULT NULL,
  `tags` mediumtext DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  `image` varchar(300) DEFAULT NULL,
  `thumbnails` varchar(300) DEFAULT NULL,
  `video` varchar(300) DEFAULT NULL,
  `onTranding` varchar(100) NOT NULL DEFAULT 'No',
  `trandingTill` varchar(100) NOT NULL DEFAULT '00/00/00',
  `latest` varchar(100) NOT NULL DEFAULT 'No',
  `newsFlash` varchar(100) NOT NULL DEFAULT 'No',
  `featuredStories` varchar(100) NOT NULL DEFAULT 'No',
  `visibleOnWeb` varchar(100) NOT NULL DEFAULT 'No',
  `isRead` varchar(100) NOT NULL DEFAULT 'No',
  `updatedBy` varchar(100) DEFAULT NULL,
  `updatedOn` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `token` varchar(100) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` varchar(100) NOT NULL DEFAULT 'Pending',
  `remarks` mediumtext DEFAULT NULL,
  `securityDetails` longtext DEFAULT NULL,
  `masterRemarks` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `booking`
--

CREATE TABLE `booking` (
  `id` bigint(20) NOT NULL,
  `bookingUid` varchar(100) DEFAULT NULL,
  `masterBookingUid` varchar(100) DEFAULT NULL,
  `conferenceUid` varchar(100) DEFAULT NULL,
  `bookingType` varchar(50) DEFAULT NULL,
  `passenger_type` varchar(50) DEFAULT NULL COMMENT 'admin, agencyteam, trainee, or guest',
  `passenger_uid` varchar(100) DEFAULT NULL,
  `passenger_name` varchar(150) DEFAULT NULL,
  `supplier_id` bigint(20) DEFAULT NULL,
  `supplier_location_id` bigint(20) DEFAULT NULL,
  `finance_id` bigint(20) DEFAULT NULL,
  `checkin_date` datetime DEFAULT NULL,
  `checkout_date` datetime DEFAULT NULL,
  `booking_attributes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`booking_attributes`)),
  `status` varchar(50) DEFAULT 'Pending',
  `created_by` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_by` varchar(100) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_by` varchar(100) DEFAULT NULL,
  `masterRemarks` longtext DEFAULT NULL COMMENT 'Append-only JSON log of all changes' CHECK (json_valid(`masterRemarks`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `booking_attributes_values`
--

CREATE TABLE `booking_attributes_values` (
  `id` bigint(20) NOT NULL,
  `booking_id` bigint(20) DEFAULT NULL,
  `subcategory_id` int(11) DEFAULT NULL,
  `attr_value` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `branch`
--

CREATE TABLE `branch` (
  `id` int(11) NOT NULL,
  `branchUid` varchar(100) DEFAULT NULL,
  `branchTitle` varchar(100) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `altEmail` varchar(50) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `altPhone` varchar(50) DEFAULT NULL,
  `whatsAppNo` varchar(50) DEFAULT NULL,
  `bankName` varchar(100) DEFAULT NULL,
  `accountNo` varchar(50) DEFAULT NULL,
  `ifscCode` varchar(50) DEFAULT NULL,
  `micrCode` varchar(50) DEFAULT NULL,
  `accountHolderName` varchar(100) DEFAULT NULL,
  `bankAddress` varchar(100) DEFAULT NULL,
  `upi` varchar(50) DEFAULT NULL,
  `qrCode` varchar(200) DEFAULT NULL,
  `street` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `district` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `pinCode` varchar(100) DEFAULT NULL,
  `landmark` varchar(200) DEFAULT NULL,
  `maplink` varchar(300) DEFAULT NULL,
  `latitude` varchar(50) DEFAULT NULL,
  `longitude` varchar(50) DEFAULT NULL,
  `token` varchar(10) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `visibleOnWeb` varchar(100) NOT NULL DEFAULT 'No',
  `status` varchar(50) NOT NULL DEFAULT 'Pending',
  `remarks` mediumtext DEFAULT NULL,
  `securityDetails` longtext DEFAULT NULL,
  `masterRemarks` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `career`
--

CREATE TABLE `career` (
  `id` int(11) NOT NULL,
  `careerUid` varchar(100) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` bigint(10) DEFAULT NULL,
  `altPhone` bigint(10) DEFAULT NULL,
  `gender` varchar(50) DEFAULT NULL,
  `dob` varchar(50) DEFAULT NULL,
  `fatherName` varchar(180) DEFAULT NULL,
  `motherName` varchar(180) DEFAULT NULL,
  `expertisedIn` varchar(150) DEFAULT NULL,
  `currPostion` varchar(150) DEFAULT NULL,
  `yearsOfExperience` varchar(150) DEFAULT NULL,
  `intrestedField` varchar(150) DEFAULT NULL,
  `localCity` varchar(180) DEFAULT NULL,
  `localDistrict` varchar(180) DEFAULT NULL,
  `localState` varchar(180) DEFAULT NULL,
  `localPinCode` varchar(180) DEFAULT NULL,
  `localLandmark` varchar(180) DEFAULT NULL,
  `permanentCity` varchar(180) DEFAULT NULL,
  `permanentDistrict` varchar(180) DEFAULT NULL,
  `permanentState` varchar(180) DEFAULT NULL,
  `permanentPinCode` varchar(180) DEFAULT NULL,
  `permanentLandmark` varchar(180) DEFAULT NULL,
  `aadharNo` varchar(100) DEFAULT NULL,
  `aadharImage` varchar(300) DEFAULT NULL,
  `profilePhoto` varchar(300) DEFAULT NULL,
  `coverLetter` longtext DEFAULT NULL,
  `resume` varchar(300) DEFAULT NULL,
  `otherDocument` varchar(300) DEFAULT NULL,
  `username` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `about` longtext DEFAULT NULL,
  `role` varchar(100) NOT NULL DEFAULT 'NA',
  `facebook` varchar(300) NOT NULL DEFAULT 'https://facebook.com/',
  `twitter` varchar(300) NOT NULL DEFAULT 'https://twitter.com/',
  `instagram` varchar(300) NOT NULL DEFAULT 'https://instagram.com/',
  `linkedin` varchar(300) NOT NULL DEFAULT 'https://www.linkedin.com/company/',
  `youtube` varchar(300) NOT NULL DEFAULT 'https://www.youtube.com/',
  `promoCode` varchar(100) DEFAULT NULL,
  `updatedBy` varchar(100) DEFAULT NULL,
  `updationOn` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `isRead` varchar(50) NOT NULL DEFAULT 'No',
  `token` varchar(100) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` varchar(100) NOT NULL DEFAULT 'Pending',
  `remarks` mediumtext DEFAULT NULL,
  `securityDetails` longtext DEFAULT NULL,
  `masterRemarks` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `categoryUid` varchar(100) DEFAULT NULL,
  `name` varchar(200) DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  `visibleOnWeb` varchar(100) NOT NULL DEFAULT 'No',
  `updatedBy` varchar(100) DEFAULT NULL,
  `updatedOn` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `token` varchar(100) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` varchar(100) NOT NULL DEFAULT 'Pending',
  `remarks` longtext DEFAULT NULL,
  `securityDetails` longtext DEFAULT NULL,
  `masterRemarks` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `companydetails`
--

CREATE TABLE `companydetails` (
  `id` int(11) NOT NULL,
  `companyUid` varchar(200) DEFAULT NULL,
  `ownerName` varchar(200) DEFAULT NULL,
  `shortName` varchar(50) DEFAULT NULL,
  `companyName` varchar(200) DEFAULT NULL,
  `registrationDate` varchar(200) DEFAULT NULL,
  `registrationNumber` varchar(200) DEFAULT NULL,
  `cin` varchar(200) DEFAULT NULL,
  `moa` varchar(200) DEFAULT NULL,
  `aoa` varchar(200) DEFAULT NULL,
  `udyamNumber` varchar(200) DEFAULT NULL,
  `panNumber` varchar(100) DEFAULT NULL,
  `bankName` varchar(200) DEFAULT NULL,
  `accountNo` varchar(100) DEFAULT NULL,
  `ifscCode` varchar(100) DEFAULT NULL,
  `micrCode` varchar(100) DEFAULT NULL,
  `accountHolderName` varchar(100) DEFAULT NULL,
  `bankAddress` mediumtext DEFAULT NULL,
  `upi` varchar(100) DEFAULT NULL,
  `qrCode` varchar(400) DEFAULT NULL,
  `websiteUrl` varchar(100) DEFAULT NULL,
  `metaLogo` varchar(300) DEFAULT NULL,
  `logo` varchar(400) DEFAULT NULL,
  `feviconpng` varchar(400) DEFAULT NULL,
  `feviconico` varchar(400) DEFAULT NULL,
  `companyMobNo` bigint(10) DEFAULT NULL,
  `companyEmail` varchar(100) DEFAULT NULL,
  `street` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `district` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `pinCode` varchar(100) DEFAULT NULL,
  `landmark` varchar(100) DEFAULT NULL,
  `maplink` varchar(400) DEFAULT NULL,
  `facebook` varchar(100) DEFAULT NULL,
  `instagram` varchar(100) DEFAULT NULL,
  `youtube` varchar(100) DEFAULT NULL,
  `twitter` varchar(150) DEFAULT NULL,
  `whatsaap` varchar(100) DEFAULT NULL,
  `googleTag` longtext DEFAULT NULL,
  `gtagjs` longtext DEFAULT NULL,
  `siteVerificationGoogle` varchar(200) DEFAULT NULL,
  `siteVerificationfacebook` varchar(200) DEFAULT NULL,
  `facebookPageId` varchar(200) DEFAULT NULL,
  `captchaCode` varchar(200) DEFAULT NULL,
  `metaKeywords` mediumtext DEFAULT NULL,
  `metaDescription` mediumtext DEFAULT NULL,
  `metaSubject` varchar(300) DEFAULT NULL,
  `metaCopyright` varchar(300) DEFAULT NULL,
  `metaLanguage` varchar(300) DEFAULT NULL,
  `metaRevised` varchar(300) DEFAULT NULL,
  `metaAbstract` varchar(300) DEFAULT NULL,
  `metaTopic` varchar(200) DEFAULT NULL,
  `metaSummary` mediumtext DEFAULT NULL,
  `metaClassification` varchar(200) DEFAULT NULL,
  `metaTagline` varchar(200) DEFAULT NULL,
  `chatBotScript` longtext DEFAULT NULL,
  `removeBrandingTawk` longtext DEFAULT NULL,
  `disableInspact` longtext DEFAULT NULL,
  `latitude` varchar(200) DEFAULT NULL,
  `longitude` varchar(200) DEFAULT NULL,
  `pageRefresh` varchar(100) NOT NULL DEFAULT '600',
  `token` varchar(100) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` varchar(100) NOT NULL DEFAULT 'Pending',
  `remarks` longtext DEFAULT NULL,
  `securityDetails` longtext DEFAULT NULL,
  `masterRemarks` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `conference`
--

CREATE TABLE `conference` (
  `id` int(11) NOT NULL,
  `conferenceUid` varchar(100) DEFAULT NULL,
  `zone` varchar(120) DEFAULT NULL,
  `region` varchar(150) DEFAULT NULL,
  `company` varchar(100) DEFAULT NULL,
  `requestedBy` varchar(100) DEFAULT NULL,
  `trainerEmployeeId` varchar(100) DEFAULT NULL,
  `trainerName` varchar(100) DEFAULT NULL,
  `conferenceType` varchar(100) NOT NULL DEFAULT 'Non Residential Conference',
  `conferenceDate` varchar(100) DEFAULT NULL,
  `conferenceEndsOn` varchar(100) DEFAULT NULL,
  `conferenceTime` varchar(100) DEFAULT NULL,
  `conferenceStatus` varchar(100) NOT NULL DEFAULT 'Scheduled',
  `activeModuleId` varchar(50) DEFAULT NULL,
  `liveQuizState` varchar(50) NOT NULL DEFAULT 'IDLE' COMMENT 'IDLE, WAITING, QUESTION_LIVE, LEADERBOARD, FINISHED',
  `liveQuestionId` varchar(100) DEFAULT NULL COMMENT 'Stores the UID of the active question',
  `liveTimerEndsAt` bigint(20) DEFAULT 0,
  `actualStartedAt` datetime DEFAULT NULL,
  `actualEndedAt` datetime DEFAULT NULL,
  `enableCheckIn` tinyint(1) DEFAULT 0 COMMENT '1=Enabled, 0=Disabled',
  `trainingHub` varchar(100) DEFAULT NULL,
  `audience` varchar(150) DEFAULT NULL,
  `sessionType` varchar(150) DEFAULT NULL,
  `trainingType` varchar(100) DEFAULT NULL,
  `batchSize` varchar(150) DEFAULT NULL,
  `confirmedPax` varchar(150) DEFAULT '0',
  `attendanceSheetPax` varchar(100) NOT NULL DEFAULT '0',
  `state` varchar(150) DEFAULT NULL,
  `district` varchar(150) DEFAULT NULL,
  `venueUid` varchar(150) DEFAULT NULL,
  `geoLatitude` decimal(10,8) DEFAULT NULL,
  `geoLongitude` decimal(11,8) DEFAULT NULL,
  `geoRadius` int(11) DEFAULT 100 COMMENT 'Radius in meters',
  `assessmentFor` varchar(100) DEFAULT NULL,
  `suiteTitle` mediumtext DEFAULT NULL,
  `preAssessmentUid` varchar(100) DEFAULT NULL COMMENT 'Stores UID for Pre-Test',
  `postAssessmentUid` varchar(100) DEFAULT NULL COMMENT 'Stores UID for Post-Test',
  `surveyUid` varchar(100) DEFAULT NULL COMMENT 'Stores UID for Feedback/Survey',
  `noOfQuestion` varchar(100) NOT NULL DEFAULT '1',
  `sessionConfig` longtext DEFAULT NULL COMMENT 'JSON: Stores timings, geofencing & check-in rules for Attendance, Pre, Post & Survey',
  `checklistUid` varchar(255) DEFAULT NULL COMMENT 'Comma-separated SubCategory IDs',
  `purchaseTariff` decimal(10,2) NOT NULL DEFAULT 0.00,
  `purchaseTax` varchar(10) NOT NULL DEFAULT 'Nett',
  `totalTax` decimal(10,2) NOT NULL DEFAULT 0.00,
  `totalPurchase` decimal(10,2) NOT NULL DEFAULT 0.00,
  `totalWithTax` decimal(10,2) NOT NULL DEFAULT 0.00,
  `commissionFromPartner` decimal(10,2) NOT NULL DEFAULT 0.00,
  `TDSRate` varchar(10) NOT NULL DEFAULT 'Nett',
  `TDS` decimal(10,2) NOT NULL DEFAULT 0.00,
  `finalBillValue` decimal(10,2) NOT NULL DEFAULT 0.00,
  `salesTariff` decimal(10,2) NOT NULL DEFAULT 0.00,
  `salesTax` varchar(10) NOT NULL DEFAULT 'Nett',
  `totalSalesTax` decimal(10,2) NOT NULL DEFAULT 0.00,
  `totalSales` decimal(10,2) NOT NULL DEFAULT 0.00,
  `totalSalesWithTax` decimal(10,2) NOT NULL DEFAULT 0.00,
  `discounts` decimal(10,2) NOT NULL DEFAULT 0.00,
  `finalSaleValue` decimal(10,2) NOT NULL DEFAULT 0.00,
  `attendanceSheet` varchar(300) DEFAULT NULL,
  `hotelBill` varchar(300) DEFAULT NULL,
  `conferenceImage` varchar(300) DEFAULT NULL,
  `startConferenceImage` varchar(300) DEFAULT NULL,
  `hotelInvoiceFile` varchar(300) DEFAULT NULL,
  `travelInvoiceFile` varchar(300) DEFAULT NULL,
  `saleInvoiceFile` varchar(300) DEFAULT NULL,
  `paymentReceiptFile` varchar(300) DEFAULT NULL,
  `tdsCertificateFile` varchar(300) DEFAULT NULL,
  `filePath` varchar(200) DEFAULT NULL,
  `logPath` varchar(200) DEFAULT NULL,
  `excelUploadedOn` varchar(200) DEFAULT NULL,
  `updatedBy` varchar(100) DEFAULT NULL,
  `updationOn` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `isRead` varchar(50) DEFAULT NULL,
  `token` varchar(100) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` varchar(100) NOT NULL DEFAULT 'Pending',
  `auditStatus` varchar(50) DEFAULT 'Pending',
  `auditRemarks` longtext DEFAULT NULL,
  `auditBy` varchar(100) DEFAULT NULL,
  `auditDate` timestamp NULL DEFAULT NULL,
  `remarks` longtext DEFAULT NULL,
  `securityDetails` longtext DEFAULT NULL,
  `masterRemarks` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `conference_activity_log`
--

CREATE TABLE `conference_activity_log` (
  `id` int(11) NOT NULL,
  `conferenceUid` varchar(100) DEFAULT NULL,
  `moduleId` varchar(255) DEFAULT '',
  `action` enum('STARTED','STOPPED') DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `performedBy` varchar(100) DEFAULT NULL,
  `trainerLat` decimal(10,8) DEFAULT NULL,
  `trainerLng` decimal(11,8) DEFAULT NULL,
  `locationRemark` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `data_scopes`
--

CREATE TABLE `data_scopes` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `table_type` enum('admin','agencyteam','trainee') DEFAULT NULL,
  `scope_type` enum('zone','state','region','district','trainer_id') DEFAULT NULL,
  `scope_value` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `faq`
--

CREATE TABLE `faq` (
  `id` int(11) NOT NULL,
  `faqUid` varchar(100) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` bigint(10) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `categoryUid` varchar(100) DEFAULT NULL,
  `subCategoryUid` varchar(100) DEFAULT NULL,
  `question` mediumtext DEFAULT NULL,
  `answer` longtext DEFAULT NULL,
  `visibleOnWeb` varchar(50) NOT NULL DEFAULT 'No',
  `updatedBy` varchar(100) DEFAULT NULL,
  `updatedOn` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `token` varchar(100) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` varchar(100) NOT NULL DEFAULT 'Pending',
  `remarks` longtext DEFAULT NULL,
  `masterRemarks` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `finance_details`
--

CREATE TABLE `finance_details` (
  `id` bigint(20) NOT NULL,
  `finance_id` bigint(20) DEFAULT NULL,
  `ledger_type` enum('Sale','Purchase') DEFAULT 'Sale',
  `charge_category` varchar(100) DEFAULT 'Tariff' COMMENT 'Tariff, Commission, TDS, Conv Fee, Misc, Seat Fee, Meal Fee',
  `description` varchar(255) DEFAULT NULL,
  `base_rate` decimal(18,2) DEFAULT 0.00,
  `quantity` decimal(10,2) DEFAULT 1.00,
  `tax_percent` decimal(5,2) DEFAULT 0.00,
  `tax_amount` decimal(18,2) DEFAULT 0.00,
  `total_amount` decimal(18,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `finance_documents`
--

CREATE TABLE `finance_documents` (
  `id` bigint(20) NOT NULL,
  `finance_id` bigint(20) DEFAULT NULL,
  `document_type` varchar(100) DEFAULT 'Proforma Invoice' COMMENT 'PO, PI, Tax Invoice, Information Invoice, Receipt',
  `doc_number` varchar(100) DEFAULT NULL,
  `doc_date` date DEFAULT NULL,
  `doc_amount` decimal(18,2) DEFAULT 0.00,
  `file_path` varchar(500) DEFAULT NULL,
  `generated_by` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `finance_master`
--

CREATE TABLE `finance_master` (
  `id` bigint(20) NOT NULL,
  `booking_id` bigint(20) DEFAULT NULL,
  `sale_invoice_value` decimal(18,2) DEFAULT 0.00,
  `purchase_invoice_value` decimal(18,2) DEFAULT 0.00,
  `gross_margin` decimal(18,2) DEFAULT 0.00,
  `client_payment_status` varchar(50) DEFAULT 'Pending' COMMENT 'Pending, Partial, Cleared',
  `supplier_payment_status` varchar(50) DEFAULT 'Pending' COMMENT 'Pending, Partial, Cleared',
  `sale_document_status` varchar(100) DEFAULT 'No Document' COMMENT 'PI Generated, Information Invoice Generated, Tax Invoice Generated',
  `purchase_document_status` varchar(100) DEFAULT 'No Document' COMMENT 'PO Issued, Supplier Bill Received',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `finance_transactions`
--

CREATE TABLE `finance_transactions` (
  `id` bigint(20) NOT NULL,
  `finance_id` bigint(20) DEFAULT NULL,
  `transaction_type` enum('Money_Received','Money_Paid') DEFAULT 'Money_Received',
  `amount` decimal(18,2) DEFAULT 0.00,
  `payment_date` date DEFAULT NULL,
  `payment_mode` varchar(50) DEFAULT 'Bank Transfer' COMMENT 'NEFT, RTGS, Credit Card, Wallet, Cash',
  `reference_no` varchar(100) DEFAULT NULL,
  `logged_by` varchar(100) DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `heroimage`
--

CREATE TABLE `heroimage` (
  `id` int(11) NOT NULL,
  `heroUid` varchar(100) DEFAULT NULL,
  `heroImage` varchar(300) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `subCategory` varchar(100) DEFAULT NULL,
  `shortTitle` varchar(100) DEFAULT NULL,
  `referralLink` varchar(300) DEFAULT NULL,
  `activeStatus` varchar(100) NOT NULL DEFAULT 'Pending',
  `visibleOnWeb` varchar(100) DEFAULT NULL,
  `approvedBy` varchar(100) DEFAULT NULL,
  `updatedBy` varchar(100) DEFAULT NULL,
  `updatedOn` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `token` varchar(100) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` varchar(100) NOT NULL DEFAULT 'Pending',
  `remarks` mediumtext DEFAULT NULL,
  `securityDetails` longtext DEFAULT NULL,
  `masterRemarks` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `logsmaster`
--

CREATE TABLE `logsmaster` (
  `id` int(11) NOT NULL,
  `logsUid` varchar(100) DEFAULT NULL,
  `username` varchar(100) DEFAULT NULL,
  `securedPassword` varchar(100) DEFAULT NULL,
  `password` varchar(200) DEFAULT NULL,
  `role` varchar(100) DEFAULT NULL,
  `login_IP` varchar(200) DEFAULT NULL,
  `updatedBy` varchar(100) DEFAULT NULL,
  `updatedOn` varchar(100) DEFAULT NULL,
  `loginTime` varchar(100) DEFAULT NULL,
  `logoutTime` varchar(100) DEFAULT NULL,
  `token` varchar(100) DEFAULT NULL,
  `filePath` varchar(100) DEFAULT NULL,
  `logPath` varchar(100) DEFAULT NULL,
  `excelUploadedOn` varchar(100) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` varchar(100) DEFAULT NULL,
  `remarks` longtext DEFAULT NULL,
  `securityDetails` longtext DEFAULT NULL,
  `masterRemarks` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `newsletter`
--

CREATE TABLE `newsletter` (
  `id` int(11) NOT NULL,
  `newsletterUid` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` bigint(10) DEFAULT NULL,
  `updatedBy` varchar(150) DEFAULT NULL,
  `updatedOn` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `token` varchar(100) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` varchar(100) NOT NULL DEFAULT 'Pending',
  `isread` varchar(50) NOT NULL DEFAULT 'No',
  `remarks` varchar(200) DEFAULT NULL,
  `securityDetails` longtext DEFAULT NULL,
  `masterRemarks` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pincode`
--

CREATE TABLE `pincode` (
  `id` int(11) NOT NULL,
  `pincodeUid` varchar(100) DEFAULT NULL,
  `circleName` varchar(100) DEFAULT NULL,
  `regionName` varchar(100) DEFAULT NULL,
  `divisionName` varchar(100) DEFAULT NULL,
  `officeName` varchar(100) DEFAULT NULL,
  `pincode` varchar(100) DEFAULT NULL,
  `officeType` varchar(100) DEFAULT NULL,
  `delivery` varchar(100) DEFAULT NULL,
  `district` varchar(100) DEFAULT NULL,
  `stateName` varchar(100) DEFAULT NULL,
  `latitude` varchar(100) DEFAULT NULL,
  `longitude` varchar(100) DEFAULT NULL,
  `filePath` varchar(200) DEFAULT NULL,
  `logPath` varchar(200) DEFAULT NULL,
  `excelUploadedOn` varchar(100) DEFAULT NULL,
  `updatedBy` varchar(100) DEFAULT NULL,
  `updationOn` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `isRead` varchar(50) DEFAULT NULL,
  `token` varchar(100) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` varchar(50) NOT NULL DEFAULT 'Pending',
  `remarks` mediumtext DEFAULT NULL,
  `securityDetails` longtext DEFAULT NULL,
  `masterRemarks` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `portfolio`
--

CREATE TABLE `portfolio` (
  `id` int(11) NOT NULL,
  `portfolioUid` varchar(100) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` bigint(10) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `categoryUid` varchar(100) DEFAULT NULL,
  `subCategoryUid` varchar(100) DEFAULT NULL,
  `title` varchar(100) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `summary` longtext DEFAULT NULL,
  `tags` mediumtext DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  `image` varchar(300) DEFAULT NULL,
  `thumbnails` varchar(300) DEFAULT NULL,
  `video` varchar(300) DEFAULT NULL,
  `onTranding` varchar(100) NOT NULL DEFAULT 'No',
  `trandingTill` varchar(100) NOT NULL DEFAULT '00/00/00',
  `latest` varchar(100) NOT NULL DEFAULT 'No',
  `newsFlash` varchar(100) NOT NULL DEFAULT 'No',
  `featuredStories` varchar(100) NOT NULL DEFAULT 'No',
  `visibleOnWeb` varchar(100) NOT NULL DEFAULT 'No',
  `isRead` varchar(100) NOT NULL DEFAULT 'No',
  `updatedBy` varchar(100) DEFAULT NULL,
  `updatedOn` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `token` varchar(100) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` varchar(100) NOT NULL DEFAULT 'Pending',
  `remarks` mediumtext DEFAULT NULL,
  `securityDetails` longtext DEFAULT NULL,
  `masterRemarks` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `query`
--

CREATE TABLE `query` (
  `id` int(10) NOT NULL,
  `queryUid` varchar(100) DEFAULT NULL,
  `name` varchar(200) DEFAULT NULL,
  `email` varchar(200) DEFAULT NULL,
  `phone` bigint(10) DEFAULT NULL,
  `subject` varchar(200) DEFAULT NULL,
  `message` mediumtext DEFAULT NULL,
  `updatedBy` varchar(150) DEFAULT NULL,
  `updatedOn` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `token` varchar(100) DEFAULT NULL,
  `remarks` varchar(300) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` varchar(50) NOT NULL DEFAULT 'Pending',
  `isRead` varchar(100) DEFAULT 'No',
  `securityDetails` longtext DEFAULT NULL,
  `masterRemarks` mediumtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `questions`
--

CREATE TABLE `questions` (
  `id` int(11) NOT NULL,
  `assessmentSuiteUid` varchar(100) DEFAULT NULL,
  `question` longtext DEFAULT NULL,
  `question_type` varchar(50) NOT NULL DEFAULT 'multiple_choice',
  `sort_order` int(11) DEFAULT 0,
  `options` longtext DEFAULT NULL,
  `correct_answer` longtext DEFAULT NULL,
  `points` int(11) DEFAULT 0,
  `settings` longtext DEFAULT NULL COMMENT 'Stores JSON for timer, required toggle, etc',
  `descriptions` longtext DEFAULT NULL,
  `filePath` varchar(100) DEFAULT NULL,
  `logPath` varchar(100) DEFAULT NULL,
  `excelUploadedOn` varchar(100) DEFAULT NULL,
  `updatedBy` varchar(100) DEFAULT NULL,
  `updationOn` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `token` varchar(100) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` varchar(50) NOT NULL DEFAULT 'Approved',
  `remarks` longtext DEFAULT NULL,
  `masterRemarks` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `salarysheet`
--

CREATE TABLE `salarysheet` (
  `id` int(11) NOT NULL,
  `salarySheetUid` varchar(100) DEFAULT NULL,
  `band` varchar(50) DEFAULT NULL,
  `salary` varchar(50) DEFAULT NULL,
  `convenceFee` varchar(50) DEFAULT NULL,
  `targetAmount` varchar(50) DEFAULT NULL,
  `netGST` varchar(50) DEFAULT NULL,
  `netAssociate` varchar(50) DEFAULT NULL,
  `updatedBy` varchar(100) DEFAULT NULL,
  `updationOn` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `isRead` varchar(50) NOT NULL DEFAULT 'No',
  `token` varchar(50) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` varchar(50) NOT NULL DEFAULT 'Pending',
  `remarks` mediumtext DEFAULT NULL,
  `securityDetails` longtext DEFAULT NULL,
  `masterRemarks` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `seo`
--

CREATE TABLE `seo` (
  `id` int(11) NOT NULL,
  `seoUid` varchar(50) NOT NULL DEFAULT 'SEO01001',
  `url` varchar(300) DEFAULT NULL,
  `title` varchar(300) DEFAULT NULL,
  `description` varchar(300) DEFAULT NULL,
  `keywords` varchar(300) DEFAULT NULL,
  `subject` varchar(300) DEFAULT NULL,
  `canonical` varchar(300) DEFAULT NULL,
  `OGTitle` varchar(200) DEFAULT NULL,
  `siteSchema` longtext DEFAULT NULL,
  `robots` varchar(300) DEFAULT NULL,
  `pageRefresh` varchar(300) DEFAULT NULL,
  `updatedBy` varchar(100) DEFAULT NULL,
  `updationOn` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `token` varchar(300) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` varchar(300) NOT NULL DEFAULT 'Approved',
  `securityDetails` longtext DEFAULT NULL,
  `remarks` longtext DEFAULT NULL,
  `masterRemarks` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `id` int(11) NOT NULL,
  `servicesUid` varchar(100) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` bigint(10) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `categoryUid` varchar(100) DEFAULT NULL,
  `subCategoryUid` varchar(100) DEFAULT NULL,
  `title` varchar(100) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `summary` longtext DEFAULT NULL,
  `tags` mediumtext DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  `image` varchar(300) DEFAULT NULL,
  `thumbnails` varchar(300) DEFAULT NULL,
  `video` varchar(300) DEFAULT NULL,
  `onTranding` varchar(100) NOT NULL DEFAULT 'No',
  `trandingTill` varchar(100) NOT NULL DEFAULT '00/00/00',
  `latest` varchar(100) NOT NULL DEFAULT 'No',
  `newsFlash` varchar(100) NOT NULL DEFAULT 'No',
  `featuredStories` varchar(100) NOT NULL DEFAULT 'No',
  `visibleOnWeb` varchar(100) NOT NULL DEFAULT 'No',
  `isRead` varchar(100) NOT NULL DEFAULT 'No',
  `updatedBy` varchar(100) DEFAULT NULL,
  `updatedOn` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `token` varchar(100) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` varchar(100) NOT NULL DEFAULT 'Pending',
  `remarks` mediumtext DEFAULT NULL,
  `securityDetails` longtext DEFAULT NULL,
  `masterRemarks` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `site_assets`
--

CREATE TABLE `site_assets` (
  `id` int(11) NOT NULL,
  `asset_key` varchar(100) DEFAULT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `file_location` varchar(255) NOT NULL DEFAULT 'uploads',
  `description` text DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `subcategory`
--

CREATE TABLE `subcategory` (
  `id` int(11) NOT NULL,
  `subCategoryUid` varchar(100) DEFAULT NULL,
  `categoryUid` varchar(100) DEFAULT NULL,
  `subCategory` varchar(200) DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  `visibleOnWeb` varchar(100) NOT NULL DEFAULT 'No',
  `updatedBy` varchar(100) DEFAULT NULL,
  `updatedOn` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `token` varchar(100) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` varchar(100) NOT NULL DEFAULT 'Pending',
  `remarks` longtext DEFAULT NULL,
  `securityDetails` longtext DEFAULT NULL,
  `masterRemarks` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `supplier_banks`
--

CREATE TABLE `supplier_banks` (
  `id` bigint(20) NOT NULL,
  `supplier_id` bigint(20) DEFAULT NULL,
  `supplier_location_id` bigint(20) DEFAULT NULL,
  `bank_name` varchar(150) DEFAULT NULL,
  `account_holder_name` varchar(150) DEFAULT NULL,
  `account_number` varchar(100) DEFAULT NULL,
  `ifsc_code` varchar(20) DEFAULT NULL,
  `account_type` enum('Current','Savings','Virtual') DEFAULT 'Current',
  `swift_code` varchar(50) DEFAULT NULL,
  `upi_id` varchar(100) DEFAULT NULL,
  `qr_image_path` varchar(500) DEFAULT NULL,
  `is_primary` enum('Yes','No') DEFAULT 'No',
  `verification_status` enum('Pending','Verified','Rejected') DEFAULT 'Pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `supplier_contacts`
--

CREATE TABLE `supplier_contacts` (
  `id` bigint(20) NOT NULL,
  `supplier_id` bigint(20) DEFAULT NULL,
  `supplier_location_id` bigint(20) DEFAULT NULL,
  `contact_name` varchar(150) DEFAULT NULL,
  `designation` varchar(100) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `alt_phone` varchar(50) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `is_primary` enum('Yes','No') DEFAULT 'No',
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `supplier_documents`
--

CREATE TABLE `supplier_documents` (
  `id` bigint(20) NOT NULL,
  `supplier_id` bigint(20) DEFAULT NULL,
  `subcategory_id` int(11) DEFAULT NULL,
  `document_number` varchar(150) DEFAULT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `file_path` varchar(500) DEFAULT NULL,
  `file_type` varchar(50) DEFAULT NULL,
  `file_size_kb` int(11) DEFAULT 0,
  `issue_date` date DEFAULT NULL,
  `valid_until` date DEFAULT NULL,
  `verification_status` enum('Pending','Verified','Rejected','Expired') DEFAULT 'Pending',
  `uploaded_by` bigint(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `supplier_gst_profiles`
--

CREATE TABLE `supplier_gst_profiles` (
  `id` bigint(20) NOT NULL,
  `supplier_id` bigint(20) DEFAULT NULL,
  `state_name` varchar(100) DEFAULT NULL,
  `state_code` varchar(10) DEFAULT NULL,
  `gst_number` varchar(50) DEFAULT NULL,
  `billing_address` text DEFAULT NULL,
  `billing_email` varchar(255) DEFAULT NULL,
  `billing_phone` varchar(50) DEFAULT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `supplier_locations`
--

CREATE TABLE `supplier_locations` (
  `id` bigint(20) NOT NULL,
  `supplier_id` bigint(20) DEFAULT NULL,
  `gst_profile_id` bigint(20) DEFAULT NULL,
  `branch_name` varchar(150) DEFAULT NULL,
  `address_line` text DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `district` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `pincode` varchar(20) DEFAULT NULL,
  `zone` varchar(50) DEFAULT NULL,
  `region` varchar(50) DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `google_map_link` text DEFAULT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `supplier_master`
--

CREATE TABLE `supplier_master` (
  `id` bigint(20) NOT NULL,
  `supplierUid` varchar(100) DEFAULT NULL,
  `subcategory_id` int(11) DEFAULT NULL,
  `registered_name` varchar(255) DEFAULT NULL,
  `trade_name` varchar(255) DEFAULT NULL,
  `pan_number` varchar(50) DEFAULT NULL,
  `tan_number` varchar(50) DEFAULT NULL,
  `msme_status` enum('Yes','No') DEFAULT 'No',
  `msme_number` varchar(100) DEFAULT NULL,
  `business_metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`business_metadata`)),
  `credit_days` int(11) DEFAULT 0,
  `commission_percentage` decimal(5,2) DEFAULT 0.00,
  `portal_username` varchar(100) DEFAULT NULL,
  `portal_password` varchar(255) DEFAULT NULL,
  `portal_access` enum('Granted','Revoked') DEFAULT 'Revoked',
  `token` varchar(255) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'Active',
  `remarks` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `system_modules`
--

CREATE TABLE `system_modules` (
  `id` int(11) NOT NULL,
  `module_key` varchar(50) DEFAULT NULL,
  `module_name` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `trainee`
--

CREATE TABLE `trainee` (
  `id` int(11) NOT NULL,
  `traineeUid` varchar(100) DEFAULT NULL,
  `zone` varchar(100) DEFAULT NULL,
  `region` varchar(100) DEFAULT NULL,
  `company` varchar(100) DEFAULT NULL,
  `requestedBy` varchar(100) DEFAULT NULL,
  `trainerEmployeeId` varchar(100) DEFAULT NULL,
  `trainerName` varchar(100) DEFAULT NULL,
  `supervisorUid` varchar(100) DEFAULT NULL,
  `supervisorName` varchar(100) DEFAULT NULL,
  `supervisorDesignation` varchar(150) DEFAULT NULL,
  `uid` varchar(100) DEFAULT NULL,
  `agencyId` varchar(150) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `designation` varchar(150) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` bigint(10) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `gender` varchar(50) DEFAULT NULL,
  `district` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `profilePhoto` varchar(255) DEFAULT 'default.png',
  `address` text DEFAULT NULL,
  `altPhone` varchar(20) DEFAULT NULL,
  `altEmail` varchar(100) DEFAULT NULL,
  `joinedOn` date DEFAULT NULL,
  `jobCity` varchar(100) DEFAULT NULL,
  `jobState` varchar(100) DEFAULT NULL,
  `jobPincode` varchar(10) DEFAULT NULL,
  `resignedOn` date DEFAULT NULL,
  `jobStatus` varchar(50) DEFAULT 'Active',
  `username` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `filePath` varchar(100) DEFAULT NULL,
  `logPath` varchar(100) DEFAULT NULL,
  `excelUploadedOn` varchar(100) DEFAULT NULL,
  `updatedBy` varchar(100) DEFAULT NULL,
  `updationOn` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `isRead` varchar(50) DEFAULT NULL,
  `token` varchar(50) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` varchar(100) NOT NULL DEFAULT 'Pending',
  `remarks` longtext DEFAULT NULL,
  `securityDetails` longtext DEFAULT NULL,
  `masterRemarks` longtext DEFAULT NULL,
  `agency_location_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_permissions`
--

CREATE TABLE `user_permissions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `table_type` enum('admin','agencyteam','trainee') DEFAULT NULL,
  `module_id` int(11) DEFAULT NULL,
  `can_read` tinyint(1) DEFAULT 0,
  `can_write` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `adminUid` (`adminUid`);

--
-- Indexes for table `admin_sessions`
--
ALTER TABLE `admin_sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_session_admin` (`admin_id`);

--
-- Indexes for table `advertising`
--
ALTER TABLE `advertising`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `advertisingUid` (`advertisingUid`);

--
-- Indexes for table `agency`
--
ALTER TABLE `agency`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `agencyUid` (`agencyUid`),
  ADD UNIQUE KEY `email` (`email`,`phone`,`certificateNo`);

--
-- Indexes for table `agencyteam`
--
ALTER TABLE `agencyteam`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uid` (`agencyTeamUid`),
  ADD UNIQUE KEY `email` (`email`,`phone`,`officialEmail`,`offerId`),
  ADD KEY `idx_supervisor_lookup` (`companyUid`,`role`,`status`),
  ADD KEY `fk_team_agency_loc` (`agency_location_id`);

--
-- Indexes for table `agency_banks`
--
ALTER TABLE `agency_banks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_bank_agency` (`agency_id`),
  ADD KEY `fk_bank_location_ag` (`agency_location_id`);

--
-- Indexes for table `agency_contacts`
--
ALTER TABLE `agency_contacts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_contact_agency` (`agency_id`),
  ADD KEY `fk_contact_location_ag` (`agency_location_id`);

--
-- Indexes for table `agency_documents`
--
ALTER TABLE `agency_documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_doc_agency` (`agency_id`),
  ADD KEY `fk_doc_subcat_ag` (`subcategory_id`);

--
-- Indexes for table `agency_gst_profiles`
--
ALTER TABLE `agency_gst_profiles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_state_gst_agency` (`agency_id`,`state_name`);

--
-- Indexes for table `agency_locations`
--
ALTER TABLE `agency_locations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_loc_agency` (`agency_id`),
  ADD KEY `fk_loc_gst_ag` (`gst_profile_id`);

--
-- Indexes for table `agency_master`
--
ALTER TABLE `agency_master`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `agencyUid` (`agencyUid`),
  ADD UNIQUE KEY `pan_number` (`pan_number`),
  ADD UNIQUE KEY `portal_username` (`portal_username`),
  ADD KEY `fk_agency_subcat` (`subcategory_id`);

--
-- Indexes for table `assessment`
--
ALTER TABLE `assessment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_live_quiz_fast_lookup` (`conferenceUid`,`assessmentSuiteUid`,`traineeUid`);

--
-- Indexes for table `assessmentsuite`
--
ALTER TABLE `assessmentsuite`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `assessmentSuiteUid` (`assessmentSuiteUid`);

--
-- Indexes for table `assessment_results`
--
ALTER TABLE `assessment_results`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_attempt` (`traineeUid`,`assessmentSuiteUid`,`attemptNumber`),
  ADD KEY `idx_conf_suite` (`conferenceUid`,`assessmentSuiteUid`);

--
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `attendanceUid` (`attendanceUid`),
  ADD UNIQUE KEY `unique_session_attendance` (`conferenceUid`,`traineeUid`),
  ADD KEY `idx_conf_uid` (`conferenceUid`),
  ADD KEY `idx_trainee_uid` (`traineeUid`);

--
-- Indexes for table `attendance_logs`
--
ALTER TABLE `attendance_logs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_checkin` (`conferenceUid`,`traineeUid`,`moduleId`),
  ADD KEY `idx_lookup` (`conferenceUid`,`traineeUid`);

--
-- Indexes for table `blogs`
--
ALTER TABLE `blogs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `slug` (`slug`);

--
-- Indexes for table `booking`
--
ALTER TABLE `booking`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `bookingUid` (`bookingUid`),
  ADD KEY `fk_booking_finance` (`finance_id`),
  ADD KEY `idx_booking_type` (`bookingType`),
  ADD KEY `idx_booking_status` (`status`),
  ADD KEY `fk_booking_supplier_master` (`supplier_id`),
  ADD KEY `fk_booking_supplier_loc` (`supplier_location_id`);

--
-- Indexes for table `booking_attributes_values`
--
ALTER TABLE `booking_attributes_values`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_booking_attr` (`booking_id`),
  ADD KEY `fk_subcat_attr` (`subcategory_id`);

--
-- Indexes for table `branch`
--
ALTER TABLE `branch`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `branchUid` (`branchUid`);

--
-- Indexes for table `career`
--
ALTER TABLE `career`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `adminUid` (`careerUid`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `companydetails`
--
ALTER TABLE `companydetails`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `companyId` (`companyUid`);

--
-- Indexes for table `conference`
--
ALTER TABLE `conference`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `conferenceUid` (`conferenceUid`);

--
-- Indexes for table `conference_activity_log`
--
ALTER TABLE `conference_activity_log`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `data_scopes`
--
ALTER TABLE `data_scopes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_lookup` (`user_id`,`table_type`);

--
-- Indexes for table `faq`
--
ALTER TABLE `faq`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uid` (`faqUid`);

--
-- Indexes for table `finance_details`
--
ALTER TABLE `finance_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_finance_details_lookup` (`finance_id`,`ledger_type`);

--
-- Indexes for table `finance_documents`
--
ALTER TABLE `finance_documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_finance_docs_lookup` (`finance_id`);

--
-- Indexes for table `finance_master`
--
ALTER TABLE `finance_master`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idx_booking_finance` (`booking_id`);

--
-- Indexes for table `finance_transactions`
--
ALTER TABLE `finance_transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_finance_trans_lookup` (`finance_id`,`transaction_type`);

--
-- Indexes for table `heroimage`
--
ALTER TABLE `heroimage`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `heroUid` (`heroUid`);

--
-- Indexes for table `logsmaster`
--
ALTER TABLE `logsmaster`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `logUid` (`logsUid`);

--
-- Indexes for table `newsletter`
--
ALTER TABLE `newsletter`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `pincode`
--
ALTER TABLE `pincode`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `pincodeUid` (`pincodeUid`);

--
-- Indexes for table `portfolio`
--
ALTER TABLE `portfolio`
  ADD PRIMARY KEY (`id`),
  ADD KEY `slug` (`slug`);

--
-- Indexes for table `query`
--
ALTER TABLE `query`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `salarysheet`
--
ALTER TABLE `salarysheet`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `salarySheetUid` (`salarySheetUid`);

--
-- Indexes for table `seo`
--
ALTER TABLE `seo`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`),
  ADD KEY `slug` (`slug`);

--
-- Indexes for table `site_assets`
--
ALTER TABLE `site_assets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `asset_key` (`asset_key`);

--
-- Indexes for table `subcategory`
--
ALTER TABLE `subcategory`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `supplier_banks`
--
ALTER TABLE `supplier_banks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_bank_supplier_new` (`supplier_id`),
  ADD KEY `fk_bank_location_new` (`supplier_location_id`);

--
-- Indexes for table `supplier_contacts`
--
ALTER TABLE `supplier_contacts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_contact_supplier_new` (`supplier_id`),
  ADD KEY `fk_contact_location_new` (`supplier_location_id`);

--
-- Indexes for table `supplier_documents`
--
ALTER TABLE `supplier_documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_doc_supplier_new` (`supplier_id`),
  ADD KEY `fk_doc_subcat_new` (`subcategory_id`);

--
-- Indexes for table `supplier_gst_profiles`
--
ALTER TABLE `supplier_gst_profiles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_state_gst` (`supplier_id`,`state_name`);

--
-- Indexes for table `supplier_locations`
--
ALTER TABLE `supplier_locations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_loc_supplier` (`supplier_id`),
  ADD KEY `fk_loc_gst` (`gst_profile_id`);

--
-- Indexes for table `supplier_master`
--
ALTER TABLE `supplier_master`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `supplierUid` (`supplierUid`),
  ADD UNIQUE KEY `pan_number` (`pan_number`),
  ADD UNIQUE KEY `portal_username` (`portal_username`),
  ADD KEY `fk_supplier_subcat` (`subcategory_id`);

--
-- Indexes for table `system_modules`
--
ALTER TABLE `system_modules`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `module_key` (`module_key`);

--
-- Indexes for table `trainee`
--
ALTER TABLE `trainee`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `traineeUID` (`traineeUid`),
  ADD UNIQUE KEY `phone` (`phone`),
  ADD UNIQUE KEY `uid` (`uid`,`email`),
  ADD UNIQUE KEY `username_unique` (`username`),
  ADD KEY `idx_supervisorUid` (`supervisorUid`),
  ADD KEY `idx_trainee_status` (`status`),
  ADD KEY `fk_trainee_agency_loc` (`agency_location_id`);

--
-- Indexes for table `user_permissions`
--
ALTER TABLE `user_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_module_unique` (`user_id`,`table_type`,`module_id`),
  ADD KEY `module_id` (`module_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `admin_sessions`
--
ALTER TABLE `admin_sessions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `advertising`
--
ALTER TABLE `advertising`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `agency`
--
ALTER TABLE `agency`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `agencyteam`
--
ALTER TABLE `agencyteam`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `agency_banks`
--
ALTER TABLE `agency_banks`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `agency_contacts`
--
ALTER TABLE `agency_contacts`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `agency_documents`
--
ALTER TABLE `agency_documents`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `agency_gst_profiles`
--
ALTER TABLE `agency_gst_profiles`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `agency_locations`
--
ALTER TABLE `agency_locations`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `agency_master`
--
ALTER TABLE `agency_master`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `assessment`
--
ALTER TABLE `assessment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `assessmentsuite`
--
ALTER TABLE `assessmentsuite`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `assessment_results`
--
ALTER TABLE `assessment_results`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `attendance`
--
ALTER TABLE `attendance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `attendance_logs`
--
ALTER TABLE `attendance_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `blogs`
--
ALTER TABLE `blogs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `booking`
--
ALTER TABLE `booking`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `booking_attributes_values`
--
ALTER TABLE `booking_attributes_values`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `branch`
--
ALTER TABLE `branch`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `career`
--
ALTER TABLE `career`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `companydetails`
--
ALTER TABLE `companydetails`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `conference`
--
ALTER TABLE `conference`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `conference_activity_log`
--
ALTER TABLE `conference_activity_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `data_scopes`
--
ALTER TABLE `data_scopes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `faq`
--
ALTER TABLE `faq`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `finance_details`
--
ALTER TABLE `finance_details`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `finance_documents`
--
ALTER TABLE `finance_documents`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `finance_master`
--
ALTER TABLE `finance_master`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `finance_transactions`
--
ALTER TABLE `finance_transactions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `heroimage`
--
ALTER TABLE `heroimage`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `logsmaster`
--
ALTER TABLE `logsmaster`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `newsletter`
--
ALTER TABLE `newsletter`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pincode`
--
ALTER TABLE `pincode`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `portfolio`
--
ALTER TABLE `portfolio`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `query`
--
ALTER TABLE `query`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `questions`
--
ALTER TABLE `questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `salarysheet`
--
ALTER TABLE `salarysheet`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `seo`
--
ALTER TABLE `seo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `site_assets`
--
ALTER TABLE `site_assets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `subcategory`
--
ALTER TABLE `subcategory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `supplier_banks`
--
ALTER TABLE `supplier_banks`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `supplier_contacts`
--
ALTER TABLE `supplier_contacts`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `supplier_documents`
--
ALTER TABLE `supplier_documents`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `supplier_gst_profiles`
--
ALTER TABLE `supplier_gst_profiles`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `supplier_locations`
--
ALTER TABLE `supplier_locations`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `supplier_master`
--
ALTER TABLE `supplier_master`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `system_modules`
--
ALTER TABLE `system_modules`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `trainee`
--
ALTER TABLE `trainee`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_permissions`
--
ALTER TABLE `user_permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admin_sessions`
--
ALTER TABLE `admin_sessions`
  ADD CONSTRAINT `fk_session_admin` FOREIGN KEY (`admin_id`) REFERENCES `admin` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `agencyteam`
--
ALTER TABLE `agencyteam`
  ADD CONSTRAINT `fk_team_agency_loc` FOREIGN KEY (`agency_location_id`) REFERENCES `agency_locations` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `agency_banks`
--
ALTER TABLE `agency_banks`
  ADD CONSTRAINT `fk_bank_agency` FOREIGN KEY (`agency_id`) REFERENCES `agency_master` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_bank_location_ag` FOREIGN KEY (`agency_location_id`) REFERENCES `agency_locations` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `agency_contacts`
--
ALTER TABLE `agency_contacts`
  ADD CONSTRAINT `fk_contact_agency` FOREIGN KEY (`agency_id`) REFERENCES `agency_master` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_contact_location_ag` FOREIGN KEY (`agency_location_id`) REFERENCES `agency_locations` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `agency_documents`
--
ALTER TABLE `agency_documents`
  ADD CONSTRAINT `fk_doc_agency` FOREIGN KEY (`agency_id`) REFERENCES `agency_master` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_doc_subcat_ag` FOREIGN KEY (`subcategory_id`) REFERENCES `subcategory` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `agency_gst_profiles`
--
ALTER TABLE `agency_gst_profiles`
  ADD CONSTRAINT `fk_gst_agency` FOREIGN KEY (`agency_id`) REFERENCES `agency_master` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `agency_locations`
--
ALTER TABLE `agency_locations`
  ADD CONSTRAINT `fk_loc_agency` FOREIGN KEY (`agency_id`) REFERENCES `agency_master` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_loc_gst_ag` FOREIGN KEY (`gst_profile_id`) REFERENCES `agency_gst_profiles` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `agency_master`
--
ALTER TABLE `agency_master`
  ADD CONSTRAINT `fk_agency_subcat` FOREIGN KEY (`subcategory_id`) REFERENCES `subcategory` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `booking`
--
ALTER TABLE `booking`
  ADD CONSTRAINT `fk_booking_finance` FOREIGN KEY (`finance_id`) REFERENCES `finance_master` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_booking_supplier_loc` FOREIGN KEY (`supplier_location_id`) REFERENCES `supplier_locations` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_booking_supplier_master` FOREIGN KEY (`supplier_id`) REFERENCES `supplier_master` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `booking_attributes_values`
--
ALTER TABLE `booking_attributes_values`
  ADD CONSTRAINT `fk_booking_attr` FOREIGN KEY (`booking_id`) REFERENCES `booking` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_subcat_attr` FOREIGN KEY (`subcategory_id`) REFERENCES `subcategory` (`id`);

--
-- Constraints for table `finance_details`
--
ALTER TABLE `finance_details`
  ADD CONSTRAINT `fk_finance_details_master` FOREIGN KEY (`finance_id`) REFERENCES `finance_master` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `finance_documents`
--
ALTER TABLE `finance_documents`
  ADD CONSTRAINT `fk_finance_docs_master` FOREIGN KEY (`finance_id`) REFERENCES `finance_master` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `finance_transactions`
--
ALTER TABLE `finance_transactions`
  ADD CONSTRAINT `fk_finance_trans_master` FOREIGN KEY (`finance_id`) REFERENCES `finance_master` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `supplier_banks`
--
ALTER TABLE `supplier_banks`
  ADD CONSTRAINT `fk_bank_location_new` FOREIGN KEY (`supplier_location_id`) REFERENCES `supplier_locations` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_bank_supplier_new` FOREIGN KEY (`supplier_id`) REFERENCES `supplier_master` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `supplier_contacts`
--
ALTER TABLE `supplier_contacts`
  ADD CONSTRAINT `fk_contact_location_new` FOREIGN KEY (`supplier_location_id`) REFERENCES `supplier_locations` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_contact_supplier_new` FOREIGN KEY (`supplier_id`) REFERENCES `supplier_master` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `supplier_documents`
--
ALTER TABLE `supplier_documents`
  ADD CONSTRAINT `fk_doc_subcat_new` FOREIGN KEY (`subcategory_id`) REFERENCES `subcategory` (`id`),
  ADD CONSTRAINT `fk_doc_supplier_new` FOREIGN KEY (`supplier_id`) REFERENCES `supplier_master` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `supplier_gst_profiles`
--
ALTER TABLE `supplier_gst_profiles`
  ADD CONSTRAINT `fk_gst_supplier` FOREIGN KEY (`supplier_id`) REFERENCES `supplier_master` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `supplier_locations`
--
ALTER TABLE `supplier_locations`
  ADD CONSTRAINT `fk_loc_gst` FOREIGN KEY (`gst_profile_id`) REFERENCES `supplier_gst_profiles` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_loc_supplier` FOREIGN KEY (`supplier_id`) REFERENCES `supplier_master` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `supplier_master`
--
ALTER TABLE `supplier_master`
  ADD CONSTRAINT `fk_supplier_subcat` FOREIGN KEY (`subcategory_id`) REFERENCES `subcategory` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `trainee`
--
ALTER TABLE `trainee`
  ADD CONSTRAINT `fk_trainee_agency_loc` FOREIGN KEY (`agency_location_id`) REFERENCES `agency_locations` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `user_permissions`
--
ALTER TABLE `user_permissions`
  ADD CONSTRAINT `fk_up_module` FOREIGN KEY (`module_id`) REFERENCES `system_modules` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
