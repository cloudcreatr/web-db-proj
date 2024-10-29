CREATE TABLE `notifications` (
	`notification_id` int AUTO_INCREMENT NOT NULL,
	`payload` json NOT NULL,
	CONSTRAINT `notifications_notification_id` PRIMARY KEY(`notification_id`)
);
