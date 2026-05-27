CREATE TABLE `card_alias` (
	`card_name` text NOT NULL,
	`alias` text NOT NULL,
	CONSTRAINT `card_alias_pk` PRIMARY KEY(`alias`, `card_name`),
	CONSTRAINT `fk_card_alias_card_name_card_name_fk` FOREIGN KEY (`card_name`) REFERENCES `card`(`name`)
);
