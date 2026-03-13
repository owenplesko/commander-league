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
PRAGMA foreign_keys=ON;