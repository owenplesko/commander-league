CREATE TABLE `pack` (
	`id` integer PRIMARY KEY,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `pack_card_pool` (
	`index` integer NOT NULL,
	`pack_id` integer NOT NULL,
	`name` text NOT NULL,
	`collection_id` integer NOT NULL,
	CONSTRAINT `pack_card_pool_pk` PRIMARY KEY(`pack_id`, `index`),
	CONSTRAINT `fk_pack_card_pool_pack_id_pack_id_fk` FOREIGN KEY (`pack_id`) REFERENCES `pack`(`id`),
	CONSTRAINT `fk_pack_card_pool_collection_id_collection_id_fk` FOREIGN KEY (`collection_id`) REFERENCES `collection`(`id`)
);
--> statement-breakpoint
CREATE TABLE `pack_structure` (
	`index` integer NOT NULL,
	`pack_id` integer NOT NULL,
	`name` text NOT NULL,
	`weight` integer NOT NULL,
	CONSTRAINT `pack_structure_pk` PRIMARY KEY(`pack_id`, `index`),
	CONSTRAINT `fk_pack_structure_pack_id_pack_id_fk` FOREIGN KEY (`pack_id`) REFERENCES `pack`(`id`),
	CONSTRAINT "pack_structure_weight_check" CHECK("weight" > 0)
);
--> statement-breakpoint
CREATE TABLE `pack_structure_slot` (
	`pack_id` integer NOT NULL,
	`pack_structure_id` integer NOT NULL,
	`pool_id` integer NOT NULL,
	`count` integer NOT NULL,
	CONSTRAINT `pack_structure_slot_pk` PRIMARY KEY(`pack_structure_id`, `pool_id`),
	CONSTRAINT `fk_pack_structure_slot_pack_structure_id_pack_id_pack_structure_index_pack_id_fk` FOREIGN KEY (`pack_structure_id`,`pack_id`) REFERENCES `pack_structure`(`index`,`pack_id`),
	CONSTRAINT `fk_pack_structure_slot_pool_id_pack_id_pack_card_pool_index_pack_id_fk` FOREIGN KEY (`pool_id`,`pack_id`) REFERENCES `pack_card_pool`(`index`,`pack_id`)
);
