-- DropForeignKey
ALTER TABLE `items` DROP FOREIGN KEY `items_ibfk_1`;

-- DropForeignKey
ALTER TABLE `stores` DROP FOREIGN KEY `stores_ibfk_1`;

-- AddForeignKey
ALTER TABLE `Items` ADD CONSTRAINT `items_ibfk_1` FOREIGN KEY (`storeId`) REFERENCES `Stores`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Stores` ADD CONSTRAINT `stores_ibfk_1` FOREIGN KEY (`companyId`) REFERENCES `Companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
