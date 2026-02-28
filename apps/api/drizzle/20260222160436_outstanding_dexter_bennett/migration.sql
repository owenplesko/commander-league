PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_invite_code` (
	`code` text PRIMARY KEY NOT NULL,
	`league_id` integer NOT NULL,
	`active` integer DEFAULT false NOT NULL,
	`uses` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`league_id`) REFERENCES `league`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_invite_code`("code", "league_id", "active", "uses") SELECT "code", "league_id", "active", "uses" FROM `invite_code`;--> statement-breakpoint
DROP TABLE `invite_code`;--> statement-breakpoint
ALTER TABLE `__new_invite_code` RENAME TO `invite_code`;--> statement-breakpoint
PRAGMA foreign_keys=ON;