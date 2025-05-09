-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 13, 2024 at 11:33 PM
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
-- Database: `playlish`
--

-- --------------------------------------------------------

--
-- Table structure for table `genre`
--

CREATE TABLE `genre` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `genre`
--

INSERT INTO `genre` (`id`, `name`) VALUES
(1, 'POP'),
(2, 'ROCK'),
(3, 'RAP'),
(4, 'JAZZ'),
(5, 'METAL');

-- --------------------------------------------------------

--
-- Table structure for table `playlists`
--

CREATE TABLE `playlists` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `total_length` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `playlists`
--

INSERT INTO `playlists` (`id`, `user_id`, `name`, `created_at`, `total_length`) VALUES
(1, 14, 'First playlist ', '2024-06-13 14:05:43', 0),
(2, 14, 'second playlist', '2024-06-13 14:18:50', 0),
(3, 14, 'Third playlist', '2024-06-13 14:44:34', 0),
(4, 14, 'fourth playlist', '2024-06-13 14:44:47', 0),
(8, 14, 'fifth playlist', '2024-06-13 14:58:33', 0),
(10, 14, 'sixth playlist', '2024-06-13 15:30:59', 0),
(11, 14, 'eight playlist', '2024-06-13 15:31:11', 0),
(12, 14, 'ninth playlist', '2024-06-13 15:31:27', 0),
(13, 14, 'tenth playlist', '2024-06-13 15:31:41', 0);

-- --------------------------------------------------------

--
-- Table structure for table `playlist_song`
--

CREATE TABLE `playlist_song` (
  `id` int(11) NOT NULL,
  `playlist_id` int(11) NOT NULL,
  `song_id` int(11) NOT NULL,
  `added_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `playlist_song`
--

INSERT INTO `playlist_song` (`id`, `playlist_id`, `song_id`, `added_at`) VALUES
(1, 3, 13, '2024-06-13 19:58:23'),
(2, 4, 13, '2024-06-13 19:58:23'),
(3, 8, 13, '2024-06-13 19:58:23'),
(4, 3, 8, '2024-06-13 20:33:03');

-- --------------------------------------------------------

--
-- Table structure for table `songs`
--

CREATE TABLE `songs` (
  `id` int(11) NOT NULL,
  `song_name` varchar(255) NOT NULL,
  `artist_name` varchar(255) NOT NULL,
  `genre_id` int(11) NOT NULL,
  `image_path` varchar(255) NOT NULL,
  `music_path` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `songs`
--

INSERT INTO `songs` (`id`, `song_name`, `artist_name`, `genre_id`, `image_path`, `music_path`, `created_at`, `updated_at`) VALUES
(6, 'Top Model 3', 'Marso', 4, 'uploads/images/marso.jpeg', 'uploads/music/MARSO - TOP MODEL - ТОП МОДЕЛ [OFFICIAL 4K VIDEO] 2023 (320).mp3', '2024-06-03 12:55:11', '2024-06-03 12:55:11'),
(7, 'Dior', 'Pop Smoke', 3, 'uploads/images/pop_smoke_dior.jpg', 'uploads/music/POP SMOKE - DIOR (OFFICIAL VIDEO) (320).mp3', '2024-06-04 15:40:01', '2024-06-04 15:40:01'),
(8, 'Hot Nigga', 'Bobby Shmurda', 3, 'uploads/images/bobby_hotniggajpg.jpg', 'uploads/music/Bobby Shmurda - Hot N_gga (Official Music Video) (320).mp3', '2024-06-04 15:44:04', '2024-06-04 15:44:04'),
(13, 'Top Model 3', 'Marso', 1, 'uploads/images/marso.jpeg', 'uploads/music/MARSO - TOP MODEL - ТОП МОДЕЛ [OFFICIAL 4K VIDEO] 2023 (320).mp3', '2024-06-13 15:16:26', '2024-06-13 15:16:26'),
(14, 'Moy Merak', 'Simona & Mirela', 1, 'uploads/images/simona_moy_merak.jpg', 'uploads/music/SIMONA × MIRELA - MOY SI MERAK - СИМОНА × МИРЕЛА - МОЙ СИ МЕРАК [OFFICIAL VIDEO] 2024 (320).mp3', '2024-06-13 15:35:02', '2024-06-13 15:35:02'),
(15, 'Moy Merak', 'Simona', 1, 'uploads/images/simona_moy_merak.jpg', 'uploads/music/SIMONA × MIRELA - MOY SI MERAK - СИМОНА × МИРЕЛА - МОЙ СИ МЕРАК [OFFICIAL VIDEO] 2024 (320).mp3', '2024-06-13 21:07:30', '2024-06-13 21:07:30'),
(16, 'Hot Nigga', 'Bobby Shmurda', 3, 'uploads/images/bobby_hotniggajpg.jpg', 'uploads/music/Bobby Shmurda - Hot N_gga (Official Music Video) (320).mp3', '2024-06-13 21:07:55', '2024-06-13 21:07:55'),
(17, 'Top Model', 'Marso', 3, 'uploads/images/marso.jpeg', 'uploads/music/MARSO - TOP MODEL - ТОП МОДЕЛ [OFFICIAL 4K VIDEO] 2023 (320).mp3', '2024-06-13 21:09:41', '2024-06-13 21:09:41');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(256) NOT NULL,
  `email` varchar(100) NOT NULL,
  `RegisteredOn` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `email`, `RegisteredOn`) VALUES
(14, 'Tsvetomir Galabov', '$2y$10$5mIwUUCnecEG3Thv4/xLJ.ZgOZxQe8a3JM7wuxvyFHUfaWL76TWfa', 'galabovtsvetomir1@gmail.com', '2024-06-01');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `genre`
--
ALTER TABLE `genre`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `playlists`
--
ALTER TABLE `playlists`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `playlist_song`
--
ALTER TABLE `playlist_song`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `playlist_id` (`playlist_id`,`song_id`),
  ADD KEY `song_id` (`song_id`);

--
-- Indexes for table `songs`
--
ALTER TABLE `songs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `genre_id` (`genre_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`username`),
  ADD UNIQUE KEY `id` (`id`,`username`,`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `genre`
--
ALTER TABLE `genre`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `playlists`
--
ALTER TABLE `playlists`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `playlist_song`
--
ALTER TABLE `playlist_song`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `songs`
--
ALTER TABLE `songs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `playlists`
--
ALTER TABLE `playlists`
  ADD CONSTRAINT `playlists_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `playlist_song`
--
ALTER TABLE `playlist_song`
  ADD CONSTRAINT `playlist_song_ibfk_1` FOREIGN KEY (`playlist_id`) REFERENCES `playlists` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `playlist_song_ibfk_2` FOREIGN KEY (`song_id`) REFERENCES `songs` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `songs`
--
ALTER TABLE `songs`
  ADD CONSTRAINT `songs_ibfk_1` FOREIGN KEY (`genre_id`) REFERENCES `genre` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
