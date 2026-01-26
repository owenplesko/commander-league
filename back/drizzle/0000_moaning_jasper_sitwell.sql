-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `card` (
	`name` text PRIMARY KEY NOT NULL,
	`data` blob NOT NULL,
	CONSTRAINT "league_player_check_1" CHECK(role IN ('owner', 'admin', 'player'),
	CONSTRAINT "collection_card_check_2" CHECK(quantity > 0)
);
--> statement-breakpoint
CREATE TABLE `player` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	CONSTRAINT "league_player_check_1" CHECK(role IN ('owner', 'admin', 'player'),
	CONSTRAINT "collection_card_check_2" CHECK(quantity > 0)
);
--> statement-breakpoint
CREATE TABLE `league` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	CONSTRAINT "league_player_check_1" CHECK(role IN ('owner', 'admin', 'player'),
	CONSTRAINT "collection_card_check_2" CHECK(quantity > 0)
);
--> statement-breakpoint
CREATE TABLE `league_player` (
	`league_id` integer NOT NULL,
	`player_id` integer NOT NULL,
	`role` text NOT NULL,
	PRIMARY KEY(`league_id`, `player_id`),
	FOREIGN KEY (`player_id`) REFERENCES `player`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`league_id`) REFERENCES `league`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "league_player_check_1" CHECK(role IN ('owner', 'admin', 'player'),
	CONSTRAINT "collection_card_check_2" CHECK(quantity > 0)
);
--> statement-breakpoint
CREATE TABLE `collection_card` (
	`player_id` integer NOT NULL,
	`league_id` integer NOT NULL,
	`card_name` integer NOT NULL,
	`quantity` integer NOT NULL,
	PRIMARY KEY(`player_id`, `league_id`, `card_name`),
	FOREIGN KEY (`card_name`) REFERENCES `card`(`name`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`player_id`) REFERENCES `player`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`league_id`) REFERENCES `league`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "league_player_check_1" CHECK(role IN ('owner', 'admin', 'player'),
	CONSTRAINT "collection_card_check_2" CHECK(quantity > 0)
);
--> statement-breakpoint
CREATE TABLE `deck` (
	`id` integer PRIMARY KEY NOT NULL,
	`player_id` integer NOT NULL,
	`league_id` integer NOT NULL,
	`name` text NOT NULL,
	FOREIGN KEY (`player_id`) REFERENCES `player`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`league_id`) REFERENCES `league`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "league_player_check_1" CHECK(role IN ('owner', 'admin', 'player'),
	CONSTRAINT "collection_card_check_2" CHECK(quantity > 0)
);
--> statement-breakpoint
CREATE TABLE `deck_card` (
	`deck_id` integer NOT NULL,
	`card_name` integer NOT NULL,
	PRIMARY KEY(`deck_id`, `card_name`),
	FOREIGN KEY (`card_name`) REFERENCES `card`(`name`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`deck_id`) REFERENCES `deck`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "league_player_check_1" CHECK(role IN ('owner', 'admin', 'player'),
	CONSTRAINT "collection_card_check_2" CHECK(quantity > 0)
);

*/