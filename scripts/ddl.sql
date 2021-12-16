
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
	id serial4 NOT NULL,
	title varchar(100) NOT NULL,
	price int4 NOT NULL,
	imageUrl varchar(100) NOT NULL,
	description varchar(355) NOT NULL,
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

-- add foreign keys
-- userId to the product 
ALTER TABLE scp.product ADD user_id serial4 NOT NULL;
ALTER TABLE scp.product  ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES scp.user(user_id);

-- cartId to cart Items
ALTER TABLE scp.cartitem ADD cart_id serial4 NOT NULL;
ALTER TABLE scp.cartitem  ADD CONSTRAINT fk_cart_id FOREIGN KEY (cart_id) REFERENCES scp.cart(cart_id);

-- productId to cart Items
ALTER TABLE scp.cartitem ADD product_id serial4 NOT NULL;
ALTER TABLE scp.cartitem  ADD CONSTRAINT fk_product_id FOREIGN KEY (product_id) REFERENCES scp.product(product_id);


--userId to order
ALTER TABLE scp."order" ADD user_id serial4 NOT NULL;
ALTER TABLE scp."order"  ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES scp.user(user_id);

-- orderId to order Items 
ALTER TABLE scp.orderitem ADD order_id serial4 NOT NULL;
ALTER TABLE scp.orderitem  ADD CONSTRAINT fk_order_id FOREIGN KEY (order_id) REFERENCES scp.order(order_id);

--product ID to order Items
ALTER TABLE scp.orderitem ADD product_id serial4 NOT NULL;
ALTER TABLE scp.orderitem  ADD CONSTRAINT fk_product_id FOREIGN KEY (product_id) REFERENCES scp.product(product_id);
