ALTER TABLE `deck` ADD `commander_card_name` text NOT NULL REFERENCES card(name);--> statement-breakpoint
ALTER TABLE `deck` ADD `partner_card_name` text REFERENCES card(name);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_deck` (
	`id` integer PRIMARY KEY,
	`league_id` integer NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`commander_card_name` text NOT NULL,
	`partner_card_name` text,
	`collection_id` integer NOT NULL,
	CONSTRAINT `fk_deck_league_id_league_id_fk` FOREIGN KEY (`league_id`) REFERENCES `league`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_deck_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`),
	CONSTRAINT `fk_deck_commander_card_name_card_name_fk` FOREIGN KEY (`commander_card_name`) REFERENCES `card`(`name`),
	CONSTRAINT `fk_deck_partner_card_name_card_name_fk` FOREIGN KEY (`partner_card_name`) REFERENCES `card`(`name`),
	CONSTRAINT `fk_deck_collection_id_collection_id_fk` FOREIGN KEY (`collection_id`) REFERENCES `collection`(`id`),
	CONSTRAINT `fk_deck_league_id_user_id_league_member_league_id_user_id_fk` FOREIGN KEY (`league_id`,`user_id`) REFERENCES `league_member`(`league_id`,`user_id`) ON DELETE CASCADE
);
--> statement-breakpoint
INSERT INTO `__new_deck`(`id`, `league_id`, `user_id`, `name`, `collection_id`) SELECT `id`, `league_id`, `user_id`, `name`, `collection_id` FROM `deck`;--> statement-breakpoint
DROP TABLE `deck`;--> statement-breakpoint
ALTER TABLE `__new_deck` RENAME TO `deck`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_trade_request` (
	`id` integer PRIMARY KEY,
	`league_id` integer NOT NULL,
	`requester_id` text NOT NULL,
	`requester_status` text DEFAULT 'pending' NOT NULL,
	`requester_collection_id` integer NOT NULL,
	`recipient_id` text NOT NULL,
	`recipient_status` text DEFAULT 'pending' NOT NULL,
	`recipient_collection_id` integer NOT NULL,
	CONSTRAINT `fk_trade_request_requester_collection_id_collection_id_fk` FOREIGN KEY (`requester_collection_id`) REFERENCES `collection`(`id`),
	CONSTRAINT `fk_trade_request_recipient_collection_id_collection_id_fk` FOREIGN KEY (`recipient_collection_id`) REFERENCES `collection`(`id`),
	CONSTRAINT `requester_fkey` FOREIGN KEY (`league_id`,`requester_id`) REFERENCES `league_member`(`league_id`,`user_id`),
	CONSTRAINT `recipient_fkey` FOREIGN KEY (`league_id`,`recipient_id`) REFERENCES `league_member`(`league_id`,`user_id`)
);
--> statement-breakpoint
INSERT INTO `__new_trade_request`(`id`, `league_id`, `requester_id`, `requester_status`, `requester_collection_id`, `recipient_id`, `recipient_status`, `recipient_collection_id`) SELECT `id`, `league_id`, `requester_id`, `requester_status`, `requester_collection_id`, `recipient_id`, `recipient_status`, `recipient_collection_id` FROM `trade_request`;--> statement-breakpoint
DROP TABLE `trade_request`;--> statement-breakpoint
ALTER TABLE `__new_trade_request` RENAME TO `trade_request`;--> statement-breakpoint
PRAGMA foreign_keys=ON;