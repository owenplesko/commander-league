CREATE TABLE `account` (
	`id` text PRIMARY KEY,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text,
	`password` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	CONSTRAINT `fk_account_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`)
);
--> statement-breakpoint
CREATE TABLE `card` (
	`name` text PRIMARY KEY,
	`data` blob NOT NULL
);
--> statement-breakpoint
CREATE TABLE `collection` (
	`id` integer PRIMARY KEY
);
--> statement-breakpoint
CREATE TABLE `collection_card` (
	`collection_id` integer NOT NULL,
	`card_name` text NOT NULL,
	`quantity` integer NOT NULL,
	CONSTRAINT `collection_card_pk` PRIMARY KEY(`collection_id`, `card_name`),
	CONSTRAINT `fk_collection_card_collection_id_collection_id_fk` FOREIGN KEY (`collection_id`) REFERENCES `collection`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_collection_card_card_name_card_name_fk` FOREIGN KEY (`card_name`) REFERENCES `card`(`name`),
	CONSTRAINT "collection_card_quantity_check" CHECK("quantity" > 0)
);
--> statement-breakpoint
CREATE TABLE `deck` (
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
CREATE TABLE `invite_code` (
	`code` text PRIMARY KEY,
	`league_id` integer NOT NULL,
	`active` integer NOT NULL,
	`uses` integer DEFAULT 0 NOT NULL,
	CONSTRAINT `fk_invite_code_league_id_league_id_fk` FOREIGN KEY (`league_id`) REFERENCES `league`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `league` (
	`id` integer PRIMARY KEY,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `league_member` (
	`league_id` integer NOT NULL,
	`user_id` text NOT NULL,
	`role` text NOT NULL,
	`collection_id` integer NOT NULL,
	CONSTRAINT `league_member_pk` PRIMARY KEY(`league_id`, `user_id`),
	CONSTRAINT `fk_league_member_league_id_league_id_fk` FOREIGN KEY (`league_id`) REFERENCES `league`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_league_member_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`),
	CONSTRAINT `fk_league_member_collection_id_collection_id_fk` FOREIGN KEY (`collection_id`) REFERENCES `collection`(`id`)
);
--> statement-breakpoint
CREATE TABLE `pack` (
	`id` integer PRIMARY KEY,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `pack_card_pool` (
	`id` text NOT NULL,
	`pack_id` integer NOT NULL,
	`collection_id` integer NOT NULL,
	CONSTRAINT `pack_card_pool_pk` PRIMARY KEY(`pack_id`, `id`),
	CONSTRAINT `fk_pack_card_pool_pack_id_pack_id_fk` FOREIGN KEY (`pack_id`) REFERENCES `pack`(`id`),
	CONSTRAINT `fk_pack_card_pool_collection_id_collection_id_fk` FOREIGN KEY (`collection_id`) REFERENCES `collection`(`id`)
);
--> statement-breakpoint
CREATE TABLE `pack_structure` (
	`index` integer NOT NULL,
	`pack_id` integer NOT NULL,
	`weight` integer NOT NULL,
	CONSTRAINT `pack_structure_pk` PRIMARY KEY(`pack_id`, `index`),
	CONSTRAINT `fk_pack_structure_pack_id_pack_id_fk` FOREIGN KEY (`pack_id`) REFERENCES `pack`(`id`),
	CONSTRAINT "pack_structure_weight_check" CHECK("weight" > 0)
);
--> statement-breakpoint
CREATE TABLE `pack_structure_slot` (
	`pack_id` integer NOT NULL,
	`structure_index` integer NOT NULL,
	`pool_id` integer NOT NULL,
	`count` integer NOT NULL,
	CONSTRAINT `pack_structure_slot_pk` PRIMARY KEY(`structure_index`, `pool_id`),
	CONSTRAINT `fk_pack_structure_slot_pack_id_structure_index_pack_structure_pack_id_index_fk` FOREIGN KEY (`pack_id`,`structure_index`) REFERENCES `pack_structure`(`pack_id`,`index`),
	CONSTRAINT `fk_pack_structure_slot_pack_id_pool_id_pack_card_pool_pack_id_id_fk` FOREIGN KEY (`pack_id`,`pool_id`) REFERENCES `pack_card_pool`(`pack_id`,`id`)
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY,
	`expires_at` integer NOT NULL,
	`token` text NOT NULL UNIQUE,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` text NOT NULL,
	CONSTRAINT `fk_session_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`)
);
--> statement-breakpoint
CREATE TABLE `trade_request` (
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
CREATE TABLE `user` (
	`id` text PRIMARY KEY,
	`name` text NOT NULL,
	`email` text NOT NULL UNIQUE,
	`email_verified` integer DEFAULT false NOT NULL,
	`image` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `verification` (
	`id` text PRIMARY KEY,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `account_userId_idx` ON `account` (`user_id`);--> statement-breakpoint
CREATE INDEX `session_userId_idx` ON `session` (`user_id`);--> statement-breakpoint
CREATE INDEX `verification_identifier_idx` ON `verification` (`identifier`);