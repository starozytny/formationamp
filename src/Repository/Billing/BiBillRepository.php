<?php

namespace App\Repository\Billing;

use App\Entity\Billing\BiBill;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method BiBill|null find($id, $lockMode = null, $lockVersion = null)
 * @method BiBill|null findOneBy(array $criteria, array $orderBy = null)
 * @method BiBill[]    findAll()
 * @method BiBill[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class BiBillRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, BiBill::class);
    }

    // /**
    //  * @return BiBill[] Returns an array of BiBill objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('b')
            ->andWhere('b.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('b.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?BiBill
    {
        return $this->createQueryBuilder('b')
            ->andWhere('b.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
