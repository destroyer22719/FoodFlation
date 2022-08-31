ALTER TABLE stores
    MODIFY postalCode varchar(255) NULL,
    MODIFY province varchar(255) NULL,
    ADD COLUMN state varchar(255) NULL,
    ADD COLUMN zipCode varchar(255) NULL,
    ADD COLUMN country varchar(255) NOT NULL;

UPDATE stores
SET country = "Canada";

UPDATE stores
SET province = "Ontario",
    city = "Toronto"
WHERE city = "Toronto, Ontario";

UPDATE stores
SET province = "Quebec",
    city = "Montreal"
WHERE city = "Montreal, Quebec";

UPDATE stores
SET province = "Quebec",
    city = "Quebec"
WHERE city = "Québec, Quebec";

UPDATE stores
SET province = "Ontario",
    city = "East York"
WHERE city = "East York, Ontario";

UPDATE stores
SET province = "British Columbia",
    city = "Vancouver"
WHERE city = "Vancouver, British Columbia";


UPDATE stores
SET province = "Quebec",
    city = "Drummondville"
WHERE city = "Drummondville, Quebec";

UPDATE stores
SET province = "Ontario",
    city = "Sudbury"
WHERE city = "Sudbury, Ontario";


UPDATE stores
SET province = "Ontario",
    city = "London"
WHERE city = "London, Ontario";

UPDATE stores
SET province = "Ontario",
    city = "Timmins"
WHERE city = "Timmins, Ontario";

UPDATE stores
SET province = "Ontario",
    city = "Kingston"
WHERE city = "Kingston, Ontario";

UPDATE stores
SET province = "Ontario",
    city = "Ottawa"
WHERE city = "Ottawa, Ontario";

UPDATE stores
SET province = "Alberta",
    city = "Edmonton"
WHERE city = "Edmonton, Alberta";
