ALTER TABLE `league` ADD `inviteCode` text;--> statement-breakpoint
CREATE UNIQUE INDEX `league_inviteCode_unique` ON `league` (`inviteCode`);