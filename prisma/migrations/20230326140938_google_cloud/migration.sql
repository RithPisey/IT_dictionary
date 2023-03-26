-- CreateTable
CREATE TABLE `Keyword` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `keyword` JSON NOT NULL,
    `start_letter` CHAR(1) NOT NULL,
    `is_new` BOOLEAN NOT NULL,
    `explanation` VARCHAR(191) NOT NULL,
    `description_by_commitee` VARCHAR(191) NULL,
    `picture` VARCHAR(191) NULL,
    `equation` VARCHAR(191) NULL,
    `approved_date_by_commitee` DATETIME(3) NULL,
    `description_by_councile` LONGTEXT NOT NULL,
    `finally_approvied_date_by_council` DATETIME(3) NULL,
    `attributesId` INTEGER NULL,
    `responsible_PeopleId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Attributes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `attribute_name_eng` VARCHAR(191) NOT NULL,
    `attribute_name_kh` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Responsible_People` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `responsible_name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `hash` VARCHAR(191) NOT NULL,
    `salt` VARCHAR(191) NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Keyword` ADD CONSTRAINT `Keyword_attributesId_fkey` FOREIGN KEY (`attributesId`) REFERENCES `Attributes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Keyword` ADD CONSTRAINT `Keyword_responsible_PeopleId_fkey` FOREIGN KEY (`responsible_PeopleId`) REFERENCES `Responsible_People`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
