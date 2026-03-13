PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_collection_card` (
	`user_id` text NOT NULL,
	`league_id` integer NOT NULL,
	`card_name` text NOT NULL,
	`quantity` integer NOT NULL,
	CONSTRAINT `collection_card_pk` PRIMARY KEY(`user_id`, `league_id`, `card_name`),
	CONSTRAINT `collection_card_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`),
	CONSTRAINT `collection_card_league_id_league_id_fk` FOREIGN KEY (`league_id`) REFERENCES `league`(`id`) ON DELETE CASCADE,
	CONSTRAINT `collection_card_card_name_card_name_fk` FOREIGN KEY (`card_name`) REFERENCES `card`(`name`),
	CONSTRAINT "collection_card_quantity_check" CHECK("quantity" > 0)
);
--> statement-breakpoint
INSERT INTO `__new_collection_card`(`user_id`, `league_id`, `card_name`, `quantity`) SELECT `user_id`, `league_id`, `card_name`, `quantity` FROM `collection_card`;--> statement-breakpoint
DROP TABLE `collection_card`;--> statement-breakpoint
ALTER TABLE `__new_collection_card` RENAME TO `collection_card`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_trade_item_card` (
	`trade_id` integer NOT NULL,
	`user_id` text NOT NULL,
	`card_name` text NOT NULL,
	`quantity` integer NOT NULL,
	CONSTRAINT `trade_item_card_pk` PRIMARY KEY(`trade_id`, `user_id`, `card_name`),
	CONSTRAINT `fk_trade_item_card_card_name_card_name_fk` FOREIGN KEY (`card_name`) REFERENCES `card`(`name`),
	CONSTRAINT `fk_trade_item_card_trade_id_user_id_trade_side_trade_id_user_id_fk` FOREIGN KEY (`trade_id`,`user_id`) REFERENCES `trade_side`(`trade_id`,`user_id`) ON DELETE CASCADE,
	CONSTRAINT "trade_item_card_quantity_check" CHECK("quantity" > 0)
);
--> statement-breakpoint
INSERT INTO `__new_trade_item_card`(`trade_id`, `user_id`, `card_name`, `quantity`) SELECT `trade_id`, `user_id`, `card_name`, `quantity` FROM `trade_item_card`;--> statement-breakpoint
DROP TABLE `trade_item_card`;--> statement-breakpoint
ALTER TABLE `__new_trade_item_card` RENAME TO `trade_item_card`;--> statement-breakpoint
PRAGMA foreign_keys=ON;