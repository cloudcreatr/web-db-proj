CREATE TABLE `post_auhtor` (
	`post_id` int NOT NULL,
	`author_id` int NOT NULL,
	CONSTRAINT `post_auhtor_post_id_author_id_pk` PRIMARY KEY(`post_id`,`author_id`)
);
--> statement-breakpoint
CREATE TABLE `authors` (
	`author_id` int AUTO_INCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	CONSTRAINT `authors_author_id` PRIMARY KEY(`author_id`)
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`category_id` int AUTO_INCREMENT NOT NULL,
	`category` text NOT NULL,
	`description` text NOT NULL,
	CONSTRAINT `categories_category_id` PRIMARY KEY(`category_id`)
);
--> statement-breakpoint
CREATE TABLE `comments` (
	`comment_id` int AUTO_INCREMENT NOT NULL,
	`comment` text NOT NULL,
	`post_id` int NOT NULL,
	CONSTRAINT `comments_comment_id` PRIMARY KEY(`comment_id`)
);
--> statement-breakpoint
CREATE TABLE `post_category` (
	`post_id` int NOT NULL,
	`category_id` int NOT NULL,
	CONSTRAINT `post_category_post_id_category_id_pk` PRIMARY KEY(`post_id`,`category_id`)
);
--> statement-breakpoint
CREATE TABLE `posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`date` text NOT NULL,
	CONSTRAINT `posts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`tag_id` int AUTO_INCREMENT NOT NULL,
	`tag` text NOT NULL,
	`post_id` int NOT NULL,
	CONSTRAINT `tags_tag_id` PRIMARY KEY(`tag_id`)
);
--> statement-breakpoint
ALTER TABLE `post_auhtor` ADD CONSTRAINT `post_auhtor_post_id_posts_id_fk` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `post_auhtor` ADD CONSTRAINT `post_auhtor_author_id_authors_author_id_fk` FOREIGN KEY (`author_id`) REFERENCES `authors`(`author_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `comments` ADD CONSTRAINT `comments_post_id_posts_id_fk` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `post_category` ADD CONSTRAINT `post_category_post_id_posts_id_fk` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `post_category` ADD CONSTRAINT `post_category_category_id_categories_category_id_fk` FOREIGN KEY (`category_id`) REFERENCES `categories`(`category_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tags` ADD CONSTRAINT `tags_post_id_posts_id_fk` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE no action ON UPDATE no action;