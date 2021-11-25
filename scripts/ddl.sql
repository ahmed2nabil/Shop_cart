
CREATE SCHEMA scp;


-- bms.book definition

-- Drop table

-- DROP TABLE bms.book;

CREATE TABLE scp.user (
	user_id serial4 NOT NULL,
	username varchar(100) NOT NULL,
	password varchar(100) NOT NULL,
	email varchar(355) NOT NULL,
	CONSTRAINT user_pkey PRIMARY KEY (user_id)
);

CREATE TABLE scp.product (
	product_id serial4 NOT NULL,
	product_title varchar(100) NOT NULL,
	product_ price int4 NOT NULL,
	product_imageUrl varchar(100) NOT NULL,
	product_description varchar(355) NOT NULL,
	CONSTRAINT product_pkey PRIMARY KEY (product_id)
);

CREATE TABLE scp.order (
	order_id serial4 NOT NULL,
	CONSTRAINT order_pkey PRIMARY KEY (order_id)
);

CREATE TABLE scp.cart (
	cart_id serial4 NOT NULL,
	CONSTRAINT cart_pkey PRIMARY KEY (cart_id)
);

CREATE TABLE scp.orderItem (
	orderItem_id serial4 NOT NULL,
	quantity int4 NOT NULL,
	CONSTRAINT orderItem_pkey PRIMARY KEY (orderItem_id)
);

CREATE TABLE scp.cartItem (
	cartItem_id serial4 NOT NULL,
	quantity int4 NOT NULL,
	CONSTRAINT cartItem_pkey PRIMARY KEY (cartItem_id)
);