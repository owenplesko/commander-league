CREATE TABLE `invite_code` (
	`league_id` integer NOT NULL,
	`code` text,
	`active` integer DEFAULT false NOT NULL,
	`uses` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`league_id`) REFERENCES `league`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
DROP INDEX `league_inviteCode_unique`;--> statement-breakpoint
ALTER TABLE `league` DROP COLUMN `inviteCode`;