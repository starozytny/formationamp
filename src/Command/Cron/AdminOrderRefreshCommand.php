<?php

namespace App\Command\Cron;

use App\Entity\Formation\FoRegistration;
use App\Entity\Paiement\PaOrder;
use App\Service\Data\DataService;
use App\Service\Expiration;
use App\Service\Registration\RegistrationService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class AdminOrderRefreshCommand extends Command
{
    protected static $defaultName = 'admin:order:refresh';
    private $em;
    private $dataService;
    private $expiration;
    private $registrationService;

    public function __construct(EntityManagerInterface $entityManager, DataService $dataService, Expiration $expiration,
                                RegistrationService $registrationService)
    {
        parent::__construct();

        $this->em = $entityManager;
        $this->dataService = $dataService;
        $this->expiration = $expiration;
        $this->registrationService = $registrationService;
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

        $objs = $this->em->getRepository(PaOrder::class)->findBy(['status' => PaOrder::STATUS_ATTENTE], ['codeAt' => 'ASC']);
        $registrations = $this->em->getRepository(FoRegistration::class)->findBy(['paOrder' => $objs]);

        $total = 0;
        $now = $this->dataService->createDate();
        foreach($objs as $obj){
            if($this->expiration->isExpiredByHours($obj->getCodeAt(), $now, 2)){
               $obj->setStatus(PaOrder::STATUS_EXPIRER);
               $obj->setUpdatedAt($this->dataService->createDate());
               $total++;

               $this->registrationService->cancelRegistrationsFromOrder($registrations, $obj);
            }
        }

        $this->em->flush();

        $s = $total > 1 ? "s" : "";
        $io->text($total . " ordre" . $s . " expiré" . $s);

        $io->newLine();
        $io->comment('--- [FIN DE LA COMMANDE] ---');
        return 0;
    }
}
