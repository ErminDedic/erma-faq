<?php

declare(strict_types=1);

namespace Erma\Faq\Infrastructure\Migration;

use Doctrine\DBAL\Connection;
use Shopware\Core\Framework\Log\Package;
use Shopware\Core\Framework\Migration\MigrationStep;

/**
 * @internal
 */
#[Package('framework')]
class Migration1736000001CreateFaqCategoryTranslationTable extends MigrationStep
{
    public function getCreationTimestamp(): int
    {
        return 1736000001;
    }

    public function update(Connection $connection): void
    {
        $connection->executeStatement('
            CREATE TABLE IF NOT EXISTS `faq_category_translation` (
                `faq_category_id` BINARY(16)  NOT NULL,
                `language_id`     BINARY(16)  NOT NULL,
                `name`            VARCHAR(255) NOT NULL,
                `created_at`      DATETIME(3) NOT NULL,
                `updated_at`      DATETIME(3) NULL,
                PRIMARY KEY (`faq_category_id`, `language_id`),
                CONSTRAINT `fk.faq_category_translation.faq_category_id` FOREIGN KEY (`faq_category_id`)
                    REFERENCES `faq_category` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
                CONSTRAINT `fk.faq_category_translation.language_id` FOREIGN KEY (`language_id`)
                    REFERENCES `language` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ');
    }

    public function updateDestructive(Connection $connection): void
    {
    }
}
