ALTER TABLE `trade_request` ADD `requester_id` text NOT NULL;--> statement-breakpoint
ALTER TABLE `trade_request` ADD `requester_status` text NOT NULL;--> statement-breakpoint
ALTER TABLE `trade_request` ADD `requester_collection_id` integer NOT NULL REFERENCES collection(id);--> statement-breakpoint
ALTER TABLE `trade_request` ADD `recipient_id` text NOT NULL;--> statement-breakpoint
ALTER TABLE `trade_request` ADD `recipient_status` text NOT NULL;--> statement-breakpoint
ALTER TABLE `trade_request` ADD `recipient_collection_id` integer NOT NULL REFERENCES collection(id);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_trade_request` (
	`id` integer PRIMARY KEY,
	`league_id` integer NOT NULL,
	`requester_id` text NOT NULL,
	`requester_status` text NOT NULL,
	`requester_collection_id` integer NOT NULL,
	`recipient_id` text NOT NULL,
	`recipient_status` text NOT NULL,
	`recipient_collection_id` integer NOT NULL,
	CONSTRAINT `fk_trade_request_requester_collection_id_collection_id_fk` FOREIGN KEY (`requester_collection_id`) REFERENCES `collection`(`id`),
	CONSTRAINT `fk_trade_request_recipient_collection_id_collection_id_fk` FOREIGN KEY (`recipient_collection_id`) REFERENCES `collection`(`id`),
	CONSTRAINT `requester_fkey` FOREIGN KEY (`league_id`,`requester_id`) REFERENCES `league_member`(`league_id`,`user_id`),
	CONSTRAINT `recipient_fkey` FOREIGN KEY (`league_id`,`recipient_id`) REFERENCES `league_member`(`league_id`,`user_id`)
);
--> statement-breakpoint
INSERT INTO `__new_trade_request`(`id`, `league_id`) SELECT `id`, `league_id` FROM `trade_request`;--> statement-breakpoint
DROP TABLE `trade_request`;--> statement-breakpoint
ALTER TABLE `__new_trade_request` RENAME TO `trade_request`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
DROP TABLE `trade_side`;