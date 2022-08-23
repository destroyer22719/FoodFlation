-- drop category column and allow storeId to be null
ALTER TABLE items
    DROP COLUMN category,
    MODIFY storeId varchar(255) NULL;
-- set itemId to allow null
ALTER TABLE prices
    MODIFY itemId varchar(255) NULL;
-- set companyId to allow null
ALTER TABLE stores
    MODIFY companyId varchar(255) NULL;