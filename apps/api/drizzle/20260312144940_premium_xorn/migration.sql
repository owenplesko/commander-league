ALTER TABLE `trade_items` RENAME TO `trade_side`;--> statement-breakpoint
ALTER TABLE `trade_item_card` RENAME COLUMN `trade_item_id` TO `trade_side_id`;--> statement-breakpoint
ALTER TABLE `trade_request` RENAME COLUMN `requester_id` TO `owner_id`;--> statement-breakpoint
ALTER TABLE `trade_side` ADD `user_id` text NOT NULL REFERENCES user(id);--> statement-breakpoint
ALTER TABLE `trade_side` ADD `status` text DEFAULT 'pending' NOT NULL;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_trade_side` (
	`id` integer PRIMARY KEY,
	`trade_id` integer NOT NULL,
	`user_id` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	CONSTRAINT `fk_trade_items_trade_id_trade_request_id_fk` FOREIGN KEY (`trade_id`) REFERENCES `trade_request`(`id`),
	CONSTRAINT `fk_trade_side_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`),
	CONSTRAINT `trade_side_trade_id_user_id_unique` UNIQUE(`trade_id`,`user_id`)
);
--> statement-breakpoint
INSERT INTO `__new_trade_side`(`id`, `trade_id`) SELECT `id`, `trade_id` FROM `trade_side`;--> statement-breakpoint
DROP TABLE `trade_side`;--> statement-breakpoint
ALTER TABLE `__new_trade_side` RENAME TO `trade_side`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_trade_request` (
	`id` integer PRIMARY KEY,
	`league_id` integer NOT NULL,
	`owner_id` text NOT NULL,
	`updated_at` integer NOT NULL,
	CONSTRAINT `trade_request_league_id_league_id_fk` FOREIGN KEY (`league_id`) REFERENCES `league`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_trade_request_owner_id_user_id_fk` FOREIGN KEY (`owner_id`) REFERENCES `user`(`id`)
);
--> statement-breakpoint
INSERT INTO `__new_trade_request`(`id`, `league_id`, `owner_id`, `updated_at`) SELECT `id`, `league_id`, `owner_id`, `updated_at` FROM `trade_request`;--> statement-breakpoint
DROP TABLE `trade_request`;--> statement-breakpoint
ALTER TABLE `__new_trade_request` RENAME TO `trade_request`;--> statement-breakpoint
PRAGMA foreign_keys=ON;