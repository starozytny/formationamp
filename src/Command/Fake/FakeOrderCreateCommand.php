<?php

namespace App\Command\Fake;

use App\Entity\Paiement\PaLot;
use App\Entity\Paiement\PaOrder;
use App\Entity\User;
use App\Service\Data\Paiement\DataPaiement;
use App\Service\DatabaseService;
use Doctrine\ORM\EntityManagerInterface;
use Faker\Factory;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class FakeOrderCreateCommand extends Command
{
    protected static $defaultName = 'fake:order:create';
    protected static $defaultDescription = 'Create fake orders.';
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
        $this->databaseService->resetTable($io, [PaOrder::class, PaLot::class]);

        $user = $this->em->getRepository(User::class)->findOneBy(['username' => "shanbo"]);

        $io->title('Création de 20 ordres');
        $fake = Factory::create();
        for($i=0; $i<20 ; $i++) {

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

            $order = $this->dataPaiement->setDataOrder(new PaOrder(), $dataOrder, $user, $i . time(), uniqid(), $fake->ipv4);
            $order->setStatus($fake->numberBetween(0, 4));

            $this->em->persist($order);
        }
        $io->text('ORDER : Orders fake créés' );

        $this->em->flush();

        $io->newLine();
        $io->comment('--- [FIN DE LA COMMANDE] ---');
        return self::SUCCESS;
    }
}
