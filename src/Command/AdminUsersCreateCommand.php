<?php

namespace App\Command;

use App\Entity\Notification;
use App\Entity\Society;
use App\Entity\Fnaim\FnAgency;
use App\Entity\User;
use App\Service\Data\Society\DataSociety;
use App\Service\DatabaseService;
use Doctrine\ORM\EntityManagerInterface;
use Faker\Factory;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class AdminUsersCreateCommand extends Command
{
    protected static $defaultName = 'admin:users:create';
    private $em;
    private $databaseService;
    private $dataSociety;

    public function __construct(EntityManagerInterface $entityManager, DatabaseService $databaseService,
                                DataSociety $dataSociety)
    {
        parent::__construct();

        $this->em = $entityManager;
        $this->databaseService = $databaseService;
        $this->dataSociety = $dataSociety;
    }

    protected function configure()
    {
        $this
            ->setDescription('Create an user and an admin.')
            ->addOption('fake', "f", InputOption::VALUE_NONE, 'Option shit values')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $io->title('Reset des tables');
        $this->databaseService->resetTable($io, [Notification::class, User::class, Society::class]);

        $users = array(
            [
                'username' => 'shanbo',
                'firstname' => 'Dev',
                'lastname' => 'Shanbora',
                'email' => 'chanbora.chhun@outlook.fr',
                'roles' => ['ROLE_USER','ROLE_ADMIN', 'ROLE_DEVELOPER']
            ],
            [
                'username' => 'staro',
                'firstname' => 'Admin',
                'lastname' => 'Starozytny',
                'email' => 'starozytny@hotmail.fr',
                'roles' => ['ROLE_USER','ROLE_ADMIN']
            ],
            [
                'username' => 'shanks',
                'firstname' => 'User',
                'lastname' => 'Shanks',
                'email' => 'shanks@hotmail.fr',
                'roles' => ['ROLE_USER']
            ],
            [
                'username' => 'manager',
                'firstname' => 'Manager',
                'lastname' => 'Shan',
                'email' => 'chanbora.manager@outlook.fr',
                'roles' => ['ROLE_USER', 'ROLE_MANAGER']
            ],
        );

        $password = password_hash("azerty", PASSWORD_ARGON2I);

        $io->title('Création de la société Logilink');
        $data = [
            "name" => "Logilink",
            "siren" => "",
            "siret" => "",
            "rcs" => "",
            "numeroTva" => "",
            "forme" => 1,
            "address" => "17 rue de la république",
            "zipcode" => "13002",
            "city" => "MARSEILLE 02",
            "complement" => "",
            "country" => "France",
            "email" => "chanbora@logilink.fr",
            "phone1" => "0652XXXXXX",
        ];
        $data = json_decode(json_encode($data));

        $society = $this->dataSociety->setData(new Society(), $data, 0);

        $this->em->persist($society);
        $io->text('SOCIETE : Logilink créé' );

        $io->title('Création des utilisateurs');
        foreach ($users as $user) {
            $new = (new User())
                ->setUsername($user['username'])
                ->setEmail($user['email'])
                ->setRoles($user['roles'])
                ->setFirstname(ucfirst($user['firstname']))
                ->setLastname(mb_strtoupper($user['lastname']))
                ->setPassword($password)
                ->setSociety($society)
            ;

            $agency = (new FnAgency())
                ->setName("Logilink")
                ->setphone("065204XXXX")
                ->setNumCompta("LOGILINK")
                ->setLastname(mb_strtoupper($user['lastname']))
                ->setFirstname(ucfirst($user['firstname']))
                ->setAddress("17 rue de la République")
                ->setZipcode("13002")
                ->setCity("MARSEILLE 02")
            ;

            $this->em->persist($agency);

            $new->setAgency($agency);

            $this->em->persist($new);
            $io->text('USER : ' . $user['username'] . ' créé' );
        }

        if ($input->getOption('fake')) {
            $io->title('Création de 10 société fake');
            $societies = [];
            $fake = Factory::create();
            for($i=0; $i<10 ; $i++) {
                $data = [
                    "name" => $fake->name,
                    "siren" => "",
                    "siret" => "",
                    "rcs" => "",
                    "numeroTva" => "",
                    "forme" => $fake->numberBetween(0, 4),
                    "address" => $fake->streetName,
                    "zipcode" => $fake->postcode,
                    "city" => $fake->city,
                    "complement" => $fake->lastName
                ];

                $data = json_decode(json_encode($data));

                $new = $this->dataSociety->setData(new Society(), $data, $i+1);

                $this->em->persist($new);
                $societies[] = $new;
            }
            $io->text('SOCIETE : Sociétés fake créées' );

            $io->title('Création de 110 utilisateurs fake');
            $fake = Factory::create();
            for($i=0; $i<110 ; $i++) {
                $new = (new User())
                    ->setUsername($fake->userName)
                    ->setEmail($fake->freeEmail)
                    ->setRoles(['ROLE_USER'])
                    ->setFirstname(ucfirst($fake->firstName))
                    ->setLastname(mb_strtoupper($fake->lastName))
                    ->setPassword($password)
                    ->setSociety($societies[$fake->numberBetween(0,9)])
                ;

                $this->em->persist($new);
            }
            $io->text('USER : Utilisateurs fake créés' );
        }

        $this->em->flush();

        $io->newLine();
        $io->comment('--- [FIN DE LA COMMANDE] ---');
        return 0;
    }
}
