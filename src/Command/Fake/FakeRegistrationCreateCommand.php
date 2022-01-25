<?php

namespace App\Command\Fake;

use App\Entity\Formation\FoRegistration;
use App\Entity\Formation\FoSession;
use App\Entity\Formation\FoWorker;
use App\Entity\Paiement\PaOrder;
use App\Service\Data\Paiement\DataPaiement;
use App\Service\DatabaseService;
use Doctrine\ORM\EntityManagerInterface;
use Faker\Factory;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class FakeRegistrationCreateCommand extends Command
{
    protected static $defaultName = 'fake:registration:create';
    protected static $defaultDescription = 'Create fake registrations';
    private $em;
    private $databaseService;
    private $dataPaiement;

    public function __construct(EntityManagerInterface $entityManager, DatabaseService $databaseService,
                                DataPaiement $dataPaiement)
    {
        parent::__construct();

        $this->em = $entityManager;
        $this->databaseService = $databaseService;
        $this->dataPaiement = $dataPaiement;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $io->title('Reset des tables');
        $this->databaseService->resetTable($io, [FoRegistration::class]);

        $sessions = $this->em->getRepository(FoSession::class)->findAll();
        $workers = $this->em->getRepository(FoWorker::class)->findAll();
        $nbSessions = count($sessions);
        $nbWorkers = count($workers);

        if($nbSessions == 0 || $nbWorkers == 0){
            $io->text("Veuillez créer un ou des sessions/workers avant de lancer cette commande.");
            return self::FAILURE;
        }

        $io->title('Création de 30 registrations fake');
        $fake = Factory::create();
        for($i=0; $i<110 ; $i++) {

            $session = $sessions[$fake->numberBetween(0,$nbSessions - 1)];
            $worker  = $workers[$fake->numberBetween(0,$nbWorkers - 1)];

            $user = $worker->getUser();

            $dataOrder = [
                "price" => $fake->randomFloat(2),
                "name" => $user->getFullname(),
                "titulaire" => $user->getFullname(),
                "iban" => $fake->iban,
                "bic" => $fake->swiftBicNumber,
                "email" => $user->getEmail(),
                "participants" => 1,
                "address" => $fake->address,
                "zipcode" => $fake->postcode,
                "city" => $fake->city
            ];
            $dataOrder = json_decode(json_encode($dataOrder));

            $order = $this->dataPaiement->setDataOrder(new PaOrder(), $dataOrder, $worker->getUser(), $session, $i . time(), uniqid(), $fake->ipv4);
            $this->em->persist($order);

            $new = (new FoRegistration())
                ->setUser($user)
                ->setSession($session)
                ->setFormation($session->getFormation())
                ->setWorker($worker)
                ->setPaOrder($order)
            ;

            $this->em->persist($new);
        }
        $io->text('INSCRIPTIONS : Registrations fake créés' );

        $this->em->flush();

        $io->newLine();
        $io->comment('--- [FIN DE LA COMMANDE] ---');
        return Command::SUCCESS;
    }
}
