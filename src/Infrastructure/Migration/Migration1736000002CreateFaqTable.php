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
class Migration1736000002CreateFaqTable extends MigrationStep
{
    public function getCreationTimestamp(): int
    {
        return 1736000002;
    }

    public function update(Connection $connection): void
    {
        $connection->executeStatement('
            CREATE TABLE IF NOT EXISTS `faq` (
                `id`             BINARY(16)  NOT NULL,
                `active`         TINYINT(1)  NOT NULL DEFAULT 0,
                `faq_category_id` BINARY(16)  NULL,
                `created_at`      DATETIME(3) NOT NULL,
                `updated_at`      DATETIME(3) NULL,
                PRIMARY KEY (`id`),
                CONSTRAINT `fk.faq.faq_category_id` FOREIGN KEY (`faq_category_id`)
                    REFERENCES `faq_category` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ');
    }

    public function updateDestructive(Connection $connection): void
    {
    }
}
