<?php

namespace App\Command\Cron;

use App\Entity\Formation\FoSession;
use App\Service\Data\DataService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class AdminFormationRefreshCommand extends Command
{
    protected static $defaultName = 'admin:formation:refresh';
    protected $em;
    private $dataService;

    public function __construct(EntityManagerInterface $entityManager, DataService $dataService)
    {
        parent::__construct();

        $this->em = $entityManager;
        $this->dataService = $dataService;
    }

    protected function configure()
    {
        $this
            ->setDescription('Refresh formations, if date is passed = close.')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $objs = $this->em->getRepository(FoSession::class)->findBy(['isPublished' => true], ['start' => 'ASC', 'end' => 'ASC']);

        $total = 0;
        $now = $this->dataService->createDate();
        foreach($objs as $obj){
            if($obj->getEnd() < $now || $obj->getStart() < $now){
                $obj->setIsPublished(false);
                $total++;
            }
        }

        $this->em->flush();

        $s = $total > 1 ? "s" : "";
        $io->text($total . " formation" . $s . " fermée" . $s);

        $io->newLine();
        $io->comment('--- [FIN DE LA COMMANDE] ---');
        return 0;
    }
}
