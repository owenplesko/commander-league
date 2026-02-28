ALTER TABLE `league_player` RENAME TO `league_member`;--> statement-breakpoint
ALTER TABLE `league_member` RENAME COLUMN "player_id" TO "user_id";--> statement-breakpoint
CREATE TABLE `trade_request` (
	`id` integer PRIMARY KEY NOT NULL,
	`league_id` integer NOT NULL,
	`requester_id` text NOT NULL,
	`requesterAccept` integer DEFAULT false NOT NULL,
	`recipient_id` text NOT NULL,
	`recipientAccept` integer DEFAULT false NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`league_id`) REFERENCES `league`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`requester_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`recipient_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `trade_request_card` (
	`trade_id` integer NOT NULL,
	`card_name` text NOT NULL,
	`role` text NOT NULL,
	`quantity` integer NOT NULL,
	PRIMARY KEY(`trade_id`, `card_name`, `role`),
	FOREIGN KEY (`trade_id`) REFERENCES `trade_request`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`card_name`) REFERENCES `card`(`name`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
DROP TABLE `deck`;--> statement-breakpoint
DROP TABLE `deck_card`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_league_member` (
	`league_id` integer NOT NULL,
	`user_id` text NOT NULL,
	`role` text NOT NULL,
	PRIMARY KEY(`league_id`, `user_id`),
	FOREIGN KEY (`league_id`) REFERENCES `league`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_league_member`("league_id", "user_id", "role") SELECT "league_id", "user_id", "role" FROM `league_member`;--> statement-breakpoint
DROP TABLE `league_member`;--> statement-breakpoint
ALTER TABLE `__new_league_member` RENAME TO `league_member`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_collection_card` (
	`user_id` text NOT NULL,
	`league_id` integer NOT NULL,
	`card_name` text NOT NULL,
	`quantity` integer NOT NULL,
	PRIMARY KEY(`user_id`, `league_id`, `card_name`),
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`league_id`) REFERENCES `league`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`card_name`) REFERENCES `card`(`name`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "collection_card_quantity_check" CHECK(quantity > 0)
);
--> statement-breakpoint
INSERT INTO `__new_collection_card`("user_id", "league_id", "card_name", "quantity") SELECT "user_id", "league_id", "card_name", "quantity" FROM `collection_card`;--> statement-breakpoint
DROP TABLE `collection_card`;--> statement-breakpoint
ALTER TABLE `__new_collection_card` RENAME TO `collection_card`;