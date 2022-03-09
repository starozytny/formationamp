<?php

namespace App\Command\Fake;

use App\Entity\Bill\BiInvoice;
use App\Entity\Society;
use App\Service\Data\Bill\DataInvoice;
use App\Service\DatabaseService;
use Doctrine\ORM\EntityManagerInterface;
use Faker\Factory;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class FakeInvoiceCreateCommand extends Command
{
    protected static $defaultName = 'fake:invoices:create';
    protected static $defaultDescription = 'Create fake invoices';
    private $em;
    private $databaseService;
    private $dataEntity;

    public function __construct(EntityManagerInterface $entityManager, DatabaseService $databaseService, DataInvoice $dataEntity)
    {
        parent::__construct();

        $this->em = $entityManager;
        $this->databaseService = $databaseService;
        $this->dataEntity = $dataEntity;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $io->title('Reset des tables');
        $this->databaseService->resetTable($io, [BiInvoice::class]);
        $society = $this->em->getRepository(Society::class)->findOneBy(['name' => 'Logilink']);
        $society->setCounterBill(0);
        $this->em->flush();

        $society = $this->em->getRepository(Society::class)->findOneBy(['name' => 'Logilink']);

        $io->title('Création de 60 facturations fake');
        $fake = Factory::create();
        for($i=0; $i<60 ; $i++) {

            $toName = $fake->name;

            $totalHt = $fake->randomFloat(2);
            $totalTva = $totalHt * (20/100);
            $totalTtc = $totalHt + $totalTva;

            $data = [
                'fromName' => $society->getName(),
                'fromAddress' => $society->getAddress(),
                'fromComplement' => $society->getComplement(),
                'fromZipcode' => $society->getZipcode(),
                'fromCity' => $society->getCity(),
                'fromEmail' => $society->getEmail(),
                'fromPhone1' => $society->getPhone1(),
                'toName' => $toName,
                'toAddress' => $fake->streetName,
                'toComplement' => $fake->streetName,
                'toZipcode' => $fake->postcode,
                'toCity' => $fake->city,
                'toEmail' => $fake->email,
                'toPhone1' => $fake->e164PhoneNumber,
                'fromBankName' => $society->getName(),
                'fromBankIban' => $fake->iban("FR"),
                'fromBankBic' => $fake->swiftBicNumber,
                'toBankName' => $toName,
                'toBankIban' => $fake->iban("FR"),
                'toBankBic' => $fake->swiftBicNumber,
                'note' => $fake->sentence,
                'totalHt' => $totalHt,
                'totalTva' => $totalTva,
                'totalTtc' => $totalTtc,
                'total' => $totalTtc,
            ];

            $data = json_decode(json_encode($data));

            $new = $this->dataEntity->setDataInvoice(new BiInvoice(), $data);

            $new = ($new)
                ->setStatus($fake->numberBetween(0, 6))
                ->setDateAt(new \DateTime())
                ->setDueAt(new \DateTime())
                ->setSociety($society)
                ->setNumero($this->dataEntity->createNewNumeroBill($i + 1))
            ;

            $this->em->persist($new);
        }

        $society->setCounterBill(60);

        $io->text('INVOICES : Invoices fake créés' );

        $this->em->flush();

        $io->newLine();
        $io->comment('--- [FIN DE LA COMMANDE] ---');
        return Command::SUCCESS;
    }
}
