--liquibase formatted sql
--changeset buttpirate:1.0.sql
--comment Database changes for version 1.0

CREATE TABLE items (
    id BIGINT PRIMARY KEY,
    inv_number VARCHAR,
    name VARCHAR NOT NULL,
    circa VARCHAR,
    origin VARCHAR,
    placement VARCHAR,
    comment VARCHAR
);
CREATE SEQUENCE items_seq;
