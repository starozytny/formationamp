<?php

namespace App\Repository\Fnaim;

use App\Entity\Fnaim\FnAgency;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method FnAgency|null find($id, $lockMode = null, $lockVersion = null)
 * @method FnAgency|null findOneBy(array $criteria, array $orderBy = null)
 * @method FnAgency[]    findAll()
 * @method FnAgency[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class FnAgencyRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, FnAgency::class);
    }

    // /**
    //  * @return FnAgency[] Returns an array of FnAgency objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('f')
            ->andWhere('f.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('f.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?FnAgency
    {
        return $this->createQueryBuilder('f')
            ->andWhere('f.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
