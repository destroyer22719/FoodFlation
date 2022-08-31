ALTER TABLE stores
    MODIFY postalCode varchar(255) NOT NULL,
    DROP COLUMN province,
    DROP COLUMN state,
    DROP COLUMN zipCode,
    DROP COLUMN country;