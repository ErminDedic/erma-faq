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
class Migration1736000003CreateFaqTranslationTable extends MigrationStep
{
    public function getCreationTimestamp(): int
    {
        return 1736000003;
    }

    public function update(Connection $connection): void
    {
        $connection->executeStatement('
            CREATE TABLE IF NOT EXISTS `faq_translation` (
                `faq_id`      BINARY(16)  NOT NULL,
                `language_id` BINARY(16)  NOT NULL,
                `question`    VARCHAR(255) NOT NULL,
                `answer`      LONGTEXT    NOT NULL,
                `created_at`  DATETIME(3) NOT NULL,
                `updated_at`  DATETIME(3) NULL,
                PRIMARY KEY (`faq_id`, `language_id`),
                CONSTRAINT `fk.faq_translation.faq_id` FOREIGN KEY (`faq_id`)
                    REFERENCES `faq` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
                CONSTRAINT `fk.faq_translation.language_id` FOREIGN KEY (`language_id`)
                    REFERENCES `language` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ');
    }

    public function updateDestructive(Connection $connection): void
    {
    }
}
