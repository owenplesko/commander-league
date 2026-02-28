CREATE TABLE `trade_item_card` (
	`trade_item_id` integer NOT NULL,
	`card_name` text NOT NULL,
	`quantity` integer NOT NULL,
	CONSTRAINT `trade_item_card_pk` PRIMARY KEY(`trade_item_id`, `card_name`),
	CONSTRAINT `fk_trade_item_card_trade_item_id_trade_items_id_fk` FOREIGN KEY (`trade_item_id`) REFERENCES `trade_items`(`id`),
	CONSTRAINT `fk_trade_item_card_card_name_card_name_fk` FOREIGN KEY (`card_name`) REFERENCES `card`(`name`)
);
--> statement-breakpoint
CREATE TABLE `trade_items` (
	`id` integer PRIMARY KEY,
	`trade_id` integer NOT NULL,
	`role` text NOT NULL,
	CONSTRAINT `fk_trade_items_trade_id_trade_request_id_fk` FOREIGN KEY (`trade_id`) REFERENCES `trade_request`(`id`),
	CONSTRAINT `trade_items_trade_id_role_unique` UNIQUE(`trade_id`,`role`)
);
--> statement-breakpoint
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
	CONSTRAINT `session_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
INSERT INTO `__new_session`(`id`, `expires_at`, `token`, `created_at`, `updated_at`, `ip_address`, `user_agent`, `user_id`) SELECT `id`, `expires_at`, `token`, `created_at`, `updated_at`, `ip_address`, `user_agent`, `user_id` FROM `session`;--> statement-breakpoint
DROP TABLE `session`;--> statement-breakpoint
ALTER TABLE `__new_session` RENAME TO `session`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_user` (
	`id` text PRIMARY KEY,
	`name` text NOT NULL,
	`email` text NOT NULL UNIQUE,
	`email_verified` integer DEFAULT false NOT NULL,
	`image` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_user`(`id`, `name`, `email`, `email_verified`, `image`, `created_at`, `updated_at`) SELECT `id`, `name`, `email`, `email_verified`, `image`, `created_at`, `updated_at` FROM `user`;--> statement-breakpoint
DROP TABLE `user`;--> statement-breakpoint
ALTER TABLE `__new_user` RENAME TO `user`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
DROP INDEX IF EXISTS `session_token_unique`;--> statement-breakpoint
DROP INDEX IF EXISTS `user_email_unique`;--> statement-breakpoint
CREATE INDEX `session_userId_idx` ON `session` (`user_id`);--> statement-breakpoint
DROP TABLE `trade_request_card`;