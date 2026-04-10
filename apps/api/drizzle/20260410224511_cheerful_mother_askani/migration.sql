CREATE TABLE `account` (
	`id` text PRIMARY KEY,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text,
	`password` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	CONSTRAINT `fk_account_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`)
);
--> statement-breakpoint
CREATE TABLE `card` (
	`name` text PRIMARY KEY,
	`data` blob NOT NULL
);
--> statement-breakpoint
CREATE TABLE `collection` (
	`id` integer PRIMARY KEY
);
--> statement-breakpoint
CREATE TABLE `collection_card` (
	`collection_id` integer NOT NULL,
	`card_name` text NOT NULL,
	`quantity` integer NOT NULL,
	CONSTRAINT `collection_card_pk` PRIMARY KEY(`collection_id`, `card_name`),
	CONSTRAINT `fk_collection_card_collection_id_collection_id_fk` FOREIGN KEY (`collection_id`) REFERENCES `collection`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_collection_card_card_name_card_name_fk` FOREIGN KEY (`card_name`) REFERENCES `card`(`name`),
	CONSTRAINT "collection_card_quantity_check" CHECK("quantity" > 0)
);
--> statement-breakpoint
CREATE TABLE `deck` (
	`id` integer PRIMARY KEY,
	`league_id` integer NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`display_card_name` text,
	`collection_id` integer NOT NULL,
	CONSTRAINT `fk_deck_league_id_league_id_fk` FOREIGN KEY (`league_id`) REFERENCES `league`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_deck_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`),
	CONSTRAINT `fk_deck_display_card_name_card_name_fk` FOREIGN KEY (`display_card_name`) REFERENCES `card`(`name`),
	CONSTRAINT `fk_deck_collection_id_collection_id_fk` FOREIGN KEY (`collection_id`) REFERENCES `collection`(`id`),
	CONSTRAINT `fk_deck_league_id_user_id_league_member_league_id_user_id_fk` FOREIGN KEY (`league_id`,`user_id`) REFERENCES `league_member`(`league_id`,`user_id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `invite_code` (
	`code` text PRIMARY KEY,
	`league_id` integer NOT NULL,
	`active` integer NOT NULL,
	`uses` integer DEFAULT 0 NOT NULL,
	CONSTRAINT `fk_invite_code_league_id_league_id_fk` FOREIGN KEY (`league_id`) REFERENCES `league`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `league` (
	`id` integer PRIMARY KEY,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `league_member` (
	`league_id` integer NOT NULL,
	`user_id` text NOT NULL,
	`role` text NOT NULL,
	`collection_id` integer NOT NULL,
	CONSTRAINT `league_member_pk` PRIMARY KEY(`league_id`, `user_id`),
	CONSTRAINT `fk_league_member_league_id_league_id_fk` FOREIGN KEY (`league_id`) REFERENCES `league`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_league_member_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`),
	CONSTRAINT `fk_league_member_collection_id_collection_id_fk` FOREIGN KEY (`collection_id`) REFERENCES `collection`(`id`)
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY,
	`expires_at` integer NOT NULL,
	`token` text NOT NULL UNIQUE,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` text NOT NULL,
	CONSTRAINT `fk_session_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`)
);
--> statement-breakpoint
CREATE TABLE `trade_request` (
	`id` integer PRIMARY KEY,
	`league_id` integer NOT NULL,
	`owner_id` text NOT NULL,
	CONSTRAINT `fk_trade_request_league_id_league_id_fk` FOREIGN KEY (`league_id`) REFERENCES `league`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_trade_request_owner_id_user_id_fk` FOREIGN KEY (`owner_id`) REFERENCES `user`(`id`)
);
--> statement-breakpoint
CREATE TABLE `trade_side` (
	`trade_id` integer NOT NULL,
	`user_id` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`collection_id` integer NOT NULL,
	CONSTRAINT `trade_side_pk` PRIMARY KEY(`trade_id`, `user_id`),
	CONSTRAINT `fk_trade_side_trade_id_trade_request_id_fk` FOREIGN KEY (`trade_id`) REFERENCES `trade_request`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_trade_side_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`),
	CONSTRAINT `fk_trade_side_collection_id_collection_id_fk` FOREIGN KEY (`collection_id`) REFERENCES `collection`(`id`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY,
	`name` text NOT NULL,
	`email` text NOT NULL UNIQUE,
	`email_verified` integer DEFAULT false NOT NULL,
	`image` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `verification` (
	`id` text PRIMARY KEY,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `account_userId_idx` ON `account` (`user_id`);--> statement-breakpoint
CREATE INDEX `session_userId_idx` ON `session` (`user_id`);--> statement-breakpoint
CREATE INDEX `verification_identifier_idx` ON `verification` (`identifier`);