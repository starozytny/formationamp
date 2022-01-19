<?php

namespace App\Command\Fake;

use App\Entity\Paiement\PaLot;
use App\Entity\Paiement\PaOrder;
use App\Entity\User;
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
    protected $em;
    private $databaseService;

    public function __construct(EntityManagerInterface $entityManager, DatabaseService $databaseService)
    {
        parent::__construct();

        $this->em = $entityManager;
        $this->databaseService = $databaseService;
    }

    protected function configure()
    {
        $this
            ->setDescription('Create fake orders.')
        ;
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
            $name = $fake->name;
            $new = (new PaOrder())
                ->setRum($i . time())
                ->setPrice($fake->numberBetween(0, 200000))
                ->setName($name)
                ->setStatus($fake->numberBetween(0, 4))
                ->setTitulaire($fake->lastName)
                ->setIban($fake->iban)
                ->setBic($fake->swiftBicNumber)
                ->setEmail($fake->email)
                ->setCode(uniqid())
                ->setParticipants($fake->numberBetween(1, 50))
                ->setIp($fake->ipv4)
                ->setAddress($fake->address)
                ->setZipcode((int) $fake->postcode)
                ->setCity($fake->city)
                ->setUser($user)
            ;

            $this->em->persist($new);
            $io->text('ORDER : ' . $name . ' créé' );
        }

        $this->em->flush();

        $io->newLine();
        $io->comment('--- [FIN DE LA COMMANDE] ---');
        return 0;
    }
}
