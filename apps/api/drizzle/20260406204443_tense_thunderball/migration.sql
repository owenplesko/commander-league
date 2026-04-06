PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_deck_card` (
	`deck_id` integer NOT NULL,
	`card_name` text NOT NULL,
	`quantity` integer NOT NULL,
	CONSTRAINT `deck_card_pk` PRIMARY KEY(`deck_id`, `card_name`),
	CONSTRAINT `fk_deck_card_deck_id_deck_id_fk` FOREIGN KEY (`deck_id`) REFERENCES `deck`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_deck_card_card_name_card_name_fk` FOREIGN KEY (`card_name`) REFERENCES `card`(`name`),
	CONSTRAINT "deck_card_quantity_check" CHECK("quantity" > 0)
);
--> statement-breakpoint
INSERT INTO `__new_deck_card`(`deck_id`, `card_name`, `quantity`) SELECT `deck_id`, `card_name`, `quantity` FROM `deck_card`;--> statement-breakpoint
DROP TABLE `deck_card`;--> statement-breakpoint
ALTER TABLE `__new_deck_card` RENAME TO `deck_card`;--> statement-breakpoint
PRAGMA foreign_keys=ON;