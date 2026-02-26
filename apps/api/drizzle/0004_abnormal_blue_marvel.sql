PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_league_player` (
	`league_id` integer NOT NULL,
	`player_id` text NOT NULL,
	`role` text NOT NULL,
	PRIMARY KEY(`league_id`, `player_id`),
	FOREIGN KEY (`league_id`) REFERENCES `league`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`player_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "league_player_check_1" CHECK(role IN ('owner', 'admin', 'player'))
);
--> statement-breakpoint
INSERT INTO `__new_league_player`("league_id", "player_id", "role") SELECT "league_id", "player_id", "role" FROM `league_player`;--> statement-breakpoint
DROP TABLE `league_player`;--> statement-breakpoint
ALTER TABLE `__new_league_player` RENAME TO `league_player`;--> statement-breakpoint
PRAGMA foreign_keys=ON;