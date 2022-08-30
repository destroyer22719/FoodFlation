-- add category column and set storeId to not null
ALTER TABLE items
    ADD COLUMN category varchar(255) NOT NULL DEFAULT "Miscellaneous",
    MODIFY storeId varchar(255) NOT NULL;
-- set itemId to not null
ALTER TABLE prices
    MODIFY itemId varchar(255) NOT NULL;
-- set companyId to not null
ALTER TABLE stores
    MODIFY companyId varchar(255) NOT NULL;