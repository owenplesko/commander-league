PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_pack_offering` (
	`pack_id` text PRIMARY KEY,
	`cost` integer NOT NULL,
	CONSTRAINT `fk_pack_offering_pack_id_pack_id_fk` FOREIGN KEY (`pack_id`) REFERENCES `pack`(`id`) ON DELETE CASCADE,
	CONSTRAINT "pack_offering_cost" CHECK("cost" >= 0)
);
--> statement-breakpoint
INSERT INTO `__new_pack_offering`(`pack_id`, `cost`) SELECT `pack_id`, `cost` FROM `pack_offering`;--> statement-breakpoint
DROP TABLE `pack_offering`;--> statement-breakpoint
ALTER TABLE `__new_pack_offering` RENAME TO `pack_offering`;--> statement-breakpoint
PRAGMA foreign_keys=ON;