CREATE TABLE `deck` (
	`id` integer PRIMARY KEY,
	`league_id` integer NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`display_card_name` text,
	CONSTRAINT `fk_deck_league_id_league_id_fk` FOREIGN KEY (`league_id`) REFERENCES `league`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_deck_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`),
	CONSTRAINT `fk_deck_display_card_name_card_name_fk` FOREIGN KEY (`display_card_name`) REFERENCES `card`(`name`)
);
--> statement-breakpoint
CREATE TABLE `deck_card` (
	`deck_id` integer NOT NULL,
	`card_name` text NOT NULL,
	`quantity` integer NOT NULL,
	CONSTRAINT `deck_card_pk` PRIMARY KEY(`deck_id`, `card_name`),
	CONSTRAINT `fk_deck_card_deck_id_deck_id_fk` FOREIGN KEY (`deck_id`) REFERENCES `deck`(`id`),
	CONSTRAINT `fk_deck_card_card_name_card_name_fk` FOREIGN KEY (`card_name`) REFERENCES `card`(`name`),
	CONSTRAINT "deck_card_quantity_check" CHECK("quantity" > 0)
);
--> statement-breakpoint
ALTER TABLE `trade_request` DROP COLUMN `updated_at`;