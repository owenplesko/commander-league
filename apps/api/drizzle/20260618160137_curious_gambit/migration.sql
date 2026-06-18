CREATE TABLE `pack_offering` (
	`pack_id` text NOT NULL,
	`cost` integer NOT NULL,
	CONSTRAINT `fk_pack_offering_pack_id_pack_id_fk` FOREIGN KEY (`pack_id`) REFERENCES `pack`(`id`) ON DELETE CASCADE,
	CONSTRAINT "pack_offering_cost" CHECK("cost" >= 0)
);
--> statement-breakpoint
ALTER TABLE `league_member` ADD `pack_points` integer DEFAULT 0 NOT NULL;