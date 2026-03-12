ALTER TABLE `trade_item_card` ADD `trade_id` integer NOT NULL REFERENCES trade_side(trade_id);--> statement-breakpoint
ALTER TABLE `trade_item_card` ADD `user_id` text NOT NULL REFERENCES user(id);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_trade_side` (
	`trade_id` integer NOT NULL,
	`user_id` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	CONSTRAINT `trade_side_pk` PRIMARY KEY(`trade_id`, `user_id`),
	CONSTRAINT `fk_trade_side_trade_id_trade_request_id_fk` FOREIGN KEY (`trade_id`) REFERENCES `trade_request`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_trade_side_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`)
);
--> statement-breakpoint
INSERT INTO `__new_trade_side`(`trade_id`, `user_id`, `status`) SELECT `trade_id`, `user_id`, `status` FROM `trade_side`;--> statement-breakpoint
DROP TABLE `trade_side`;--> statement-breakpoint
ALTER TABLE `__new_trade_side` RENAME TO `trade_side`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_account` (
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
INSERT INTO `__new_account`(`id`, `account_id`, `provider_id`, `user_id`, `access_token`, `refresh_token`, `id_token`, `access_token_expires_at`, `refresh_token_expires_at`, `scope`, `password`, `created_at`, `updated_at`) SELECT `id`, `account_id`, `provider_id`, `user_id`, `access_token`, `refresh_token`, `id_token`, `access_token_expires_at`, `refresh_token_expires_at`, `scope`, `password`, `created_at`, `updated_at` FROM `account`;--> statement-breakpoint
DROP TABLE `account`;--> statement-breakpoint
ALTER TABLE `__new_account` RENAME TO `account`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_league_member` (
	`league_id` integer NOT NULL,
	`user_id` text NOT NULL,
	`role` text NOT NULL,
	CONSTRAINT `league_member_pk` PRIMARY KEY(`league_id`, `user_id`),
	CONSTRAINT `league_member_league_id_league_id_fk` FOREIGN KEY (`league_id`) REFERENCES `league`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_league_member_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`)
);
--> statement-breakpoint
INSERT INTO `__new_league_member`(`league_id`, `user_id`, `role`) SELECT `league_id`, `user_id`, `role` FROM `league_member`;--> statement-breakpoint
DROP TABLE `league_member`;--> statement-breakpoint
ALTER TABLE `__new_league_member` RENAME TO `league_member`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_session` (
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
INSERT INTO `__new_session`(`id`, `expires_at`, `token`, `created_at`, `updated_at`, `ip_address`, `user_agent`, `user_id`) SELECT `id`, `expires_at`, `token`, `created_at`, `updated_at`, `ip_address`, `user_agent`, `user_id` FROM `session`;--> statement-breakpoint
DROP TABLE `session`;--> statement-breakpoint
ALTER TABLE `__new_session` RENAME TO `session`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_trade_item_card` (
	`trade_id` integer NOT NULL,
	`user_id` text NOT NULL,
	`card_name` text NOT NULL,
	`quantity` integer NOT NULL,
	CONSTRAINT `trade_item_card_pk` PRIMARY KEY(`trade_id`, `user_id`, `card_name`),
	CONSTRAINT `fk_trade_item_card_trade_id_trade_side_trade_id_fk` FOREIGN KEY (`trade_id`) REFERENCES `trade_side`(`trade_id`) ON DELETE CASCADE,
	CONSTRAINT `fk_trade_item_card_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`),
	CONSTRAINT `fk_trade_item_card_card_name_card_name_fk` FOREIGN KEY (`card_name`) REFERENCES `card`(`name`)
);
--> statement-breakpoint
DROP TABLE `trade_item_card`;--> statement-breakpoint
ALTER TABLE `__new_trade_item_card` RENAME TO `trade_item_card`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `account_userId_idx` ON `account` (`user_id`);--> statement-breakpoint
CREATE INDEX `session_userId_idx` ON `session` (`user_id`);
