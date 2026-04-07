CREATE TABLE `collection` (
	`id` integer PRIMARY KEY
);
--> statement-breakpoint
ALTER TABLE `collection_card` ADD `collection_id` integer NOT NULL REFERENCES collection(id);--> statement-breakpoint
ALTER TABLE `deck` ADD `collection_id` integer NOT NULL REFERENCES collection(id);--> statement-breakpoint
ALTER TABLE `league_member` ADD `collection_id` integer NOT NULL REFERENCES collection(id);--> statement-breakpoint
ALTER TABLE `trade_side` ADD `collection_id` integer NOT NULL REFERENCES collection(id);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_deck` (
	`id` integer PRIMARY KEY,
	`league_id` integer NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`display_card_name` text,
	`collection_id` integer NOT NULL,
	CONSTRAINT `fk_deck_league_id_league_id_fk` FOREIGN KEY (`league_id`) REFERENCES `league`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_deck_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`),
	CONSTRAINT `fk_deck_display_card_name_card_name_fk` FOREIGN KEY (`display_card_name`) REFERENCES `card`(`name`),
	CONSTRAINT `fk_deck_collection_id_collection_id_fk` FOREIGN KEY (`collection_id`) REFERENCES `collection`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_deck_league_id_user_id_league_member_league_id_user_id_fk` FOREIGN KEY (`league_id`,`user_id`) REFERENCES `league_member`(`league_id`,`user_id`) ON DELETE CASCADE
);
--> statement-breakpoint
INSERT INTO `__new_deck`(`id`, `league_id`, `user_id`, `name`, `display_card_name`) SELECT `id`, `league_id`, `user_id`, `name`, `display_card_name` FROM `deck`;--> statement-breakpoint
DROP TABLE `deck`;--> statement-breakpoint
ALTER TABLE `__new_deck` RENAME TO `deck`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_collection_card` (
	`collection_id` integer NOT NULL,
	`card_name` text NOT NULL,
	`quantity` integer NOT NULL,
	CONSTRAINT `collection_card_pk` PRIMARY KEY(`collection_id`, `card_name`),
	CONSTRAINT `fk_collection_card_collection_id_collection_id_fk` FOREIGN KEY (`collection_id`) REFERENCES `collection`(`id`) ON DELETE CASCADE,
	CONSTRAINT `collection_card_card_name_card_name_fk` FOREIGN KEY (`card_name`) REFERENCES `card`(`name`),
	CONSTRAINT "collection_card_quantity_check" CHECK("quantity" > 0)
);
--> statement-breakpoint
INSERT INTO `__new_collection_card`(`card_name`, `quantity`) SELECT `card_name`, `quantity` FROM `collection_card`;--> statement-breakpoint
DROP TABLE `collection_card`;--> statement-breakpoint
ALTER TABLE `__new_collection_card` RENAME TO `collection_card`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
DROP TABLE `deck_card`;--> statement-breakpoint
DROP TABLE `trade_item_card`;