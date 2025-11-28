CREATE TABLE "map_markers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"address" text,
	"lat" double precision NOT NULL,
	"lng" double precision NOT NULL,
	"description" text,
	"event_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
