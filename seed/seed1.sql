INSERT INTO authors (author_id, name, description) VALUES
(1, 'John Doe', 'Tech enthusiast and AI expert.'),
(2, 'Jane Smith', 'Travel blogger and adventurer.'),
(3, 'Mark Jones', 'Data scientist and visualization guru.');

INSERT INTO categories (category_id, category, description) VALUES
(1, 'Technology', 'Exploring the latest tech trends.'),
(2, 'Travel', 'Adventures around the globe.'),
(3, 'Data Science', 'Unveiling insights from data.');

INSERT INTO posts (id, title, content, date) VALUES
(1, 'The Future of AI', 'The field of AI is rapidly evolving...', '2023-10-26'),
(2, 'Backpacking SE Asia', 'Southeast Asia is a vibrant region...', '2023-10-20'),
(3, 'Data Visualization', 'Data visualization is key for insights...', '2023-10-15');


INSERT INTO post_auhtor (post_id, author_id) VALUES
(1, 1),
(2, 2),
(3, 3);

INSERT INTO post_category (post_id, category_id) VALUES
(1, 1),  -- Post 1 is in the Technology category
(2, 2),  -- Post 2 is in the Travel category
(3, 3);  -- Post 3 is in the Data Science category

INSERT INTO tags (tag_id, tag, post_id) VALUES
(1, 'Artificial Intelligence', 1),
(2, 'Machine Learning', 1),
(3, 'Travel Tips', 2),
(4, 'Backpacking', 2),
(5, 'Data Visualization', 3),
(6, 'Data Analysis', 3);


INSERT INTO comments (comment_id, comment, post_id) VALUES
(1, 'Great article on AI!', 1),
(2, 'Inspiring travel blog!', 2),
(3, 'Informative data viz guide!', 3);