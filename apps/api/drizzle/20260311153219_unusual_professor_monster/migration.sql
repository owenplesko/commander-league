ALTER TABLE `trade_request` ADD `requesterStatus` text DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE `trade_request` ADD `recipientStatus` text DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE `trade_request` DROP COLUMN `requesterAccept`;--> statement-breakpoint
ALTER TABLE `trade_request` DROP COLUMN `recipientAccept`;