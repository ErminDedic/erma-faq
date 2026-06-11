<?php

declare(strict_types=1);

namespace Erma\Faq\Infrastructure\CompilerPass;

use Shopware\Core\Framework\Migration\MigrationSource;
use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;

class FaqMigrationCompilerPass implements CompilerPassInterface
{
    public function process(ContainerBuilder $container): void
    {
        $migrationPath = \dirname(__DIR__) . '/Migration';

        $migrationSource = $container->getDefinition(MigrationSource::class . '.core');
        $migrationSource->addMethodCall('addDirectory', [$migrationPath, 'Erma\Faq\Infrastructure\Migration']);
    }
}
