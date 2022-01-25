<?php

namespace App\Command\Fake;

use App\Entity\Formation\FoFormation;
use App\Entity\Formation\FoSession;
use App\Service\DatabaseService;
use Doctrine\ORM\EntityManagerInterface;
use Faker\Factory;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class FakeFormationCreateCommand extends Command
{
    protected static $defaultName = 'fake:formation:create';
    protected static $defaultDescription = 'Create fake formations.';
    private $em;
    private $databaseService;

    public function __construct(EntityManagerInterface $entityManager, DatabaseService $databaseService)
    {
        parent::__construct();

        $this->em = $entityManager;
        $this->databaseService = $databaseService;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $io->title('Reset des tables');
        $this->databaseService->resetTable($io, [FoSession::class, FoFormation::class]);

        $io->title('Création de 10 formations et x sessions');
        $fake = Factory::create();
        for($i=0; $i<10 ; $i++) {
            $name = $fake->name;
            $formation = (new FoFormation())
                ->setName("Formation : " . $name)
                ->setContent($fake->text)
                ->setPrerequis($fake->text)
                ->setGoals($fake->text)
                ->setAptitudes($fake->text)
                ->setSkills($fake->text)
                ->setTarget($fake->text)
                ->setCat($fake->text)
                ->setAccessibility($fake->numberBetween(0,1))
                ->setIsPublished($fake->numberBetween(0, 1))
            ;

            $this->em->persist($formation);
            $io->text('FORMATION : ' . $name . ' créé' );

            for($j=0; $j<$fake->numberBetween(0, 5) ; $j++) {
                $session = (new FoSession())
                    ->setFormation($formation)
                    ->setAnimator($fake->lastName . " " . $fake->firstName)
                    ->setType($fake->numberBetween(0, 2))
                    ->setStart($fake->dateTimeBetween('-1 week', '+3 week'))
                    ->setEnd($fake->dateTimeBetween('+3 week', '+5 week'))
                    ->setTime("9h00 - 10h00")
                    ->setTime2(null)
                    ->setDuration("1h")
                    ->setDuration2("1h")
                    ->setDurationTotal("1h")
                    ->setDurationByDay("1h")
                    ->setPriceHT($fake->randomFloat())
                    ->setPriceTTC($fake->randomFloat())
                    ->setTva(20)
                    ->setMin($fake->numberBetween(0,5))
                    ->setMax($fake->numberBetween(6, 50))
                    ->setAddress($fake->address)
                    ->setZipcode($fake->postcode)
                    ->setCity($fake->city)
                    ->setModTrav($fake->text)
                    ->setModEval($fake->text)
                    ->setModPeda($fake->text)
                    ->setModAssi($fake->text)
                    ->setIsPublished($fake->numberBetween(0, 1))
                ;

                $this->em->persist($session);
                $io->text('SESSION : ' . $fake->lastName . " " . $fake->firstName . ' créé' );
            }
        }

        $this->em->flush();

        $io->newLine();
        $io->comment('--- [FIN DE LA COMMANDE] ---');
        return Command::SUCCESS;
    }
}
