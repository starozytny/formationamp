<?php

namespace App\Controller;

use App\Entity\Formation\FoRegistration;
use App\Entity\Formation\FoSession;
use App\Entity\Formation\FoWorker;
use App\Entity\Paiement\PaBank;
use App\Entity\User;
use App\Repository\Formation\FoSessionRepository;
use Doctrine\Common\Persistence\ManagerRegistry;
use App\Repository\Blog\BoArticleRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

/**
 * @Route("/espace-membre", name="user_")
 */
class UserController extends AbstractController
{
    private $doctrine;

    public function __construct(ManagerRegistry $doctrine)
    {
        $this->doctrine = $doctrine;
    }

    private function getAllData($classe, SerializerInterface $serializer, $groups = User::USER_READ): string
    {
        $em = $this->doctrine->getManager();
        $objs = $em->getRepository($classe)->findAll();

        return $serializer->serialize($objs, 'json', ['groups' => $groups]);
    }

    /**
     * @Route("/", options={"expose"=true}, name="homepage")
     */
    public function index(FoSessionRepository $sessionRepository, BoArticleRepository $articleRepository): Response
    {
        $sessions = $sessionRepository->findBy(['isPublished' => true], ['start' => "ASC"], 10);
        $articles = $articleRepository->findBy(['isPublished' => true], ['createdAt' => "DESC", "updatedAt" => "DESC"], 5);

        return $this->render('user/pages/index.html.twig', [
            'sessions' => $sessions,
            'articles' => $articles,
        ]);
    }

    /**
     * @Route("/profil", options={"expose"=true}, name="profil")
     */
    public function profil(Request $request, SerializerInterface $serializer): Response
    {
        $em = $this->doctrine->getManager();
        /** @var User $obj */
        $obj = $this->getUser();
        $teams = $em->getRepository(FoWorker::class)->findBy(['user' => $obj, 'isArchived' => false]);
        $teamsArchived = $em->getRepository(FoWorker::class)->findBy(['user' => $obj, 'isArchived' => true]);

        $teams = $serializer->serialize($teams, 'json', ['groups' => User::USER_READ]);
        $teamsArchived = $serializer->serialize($teamsArchived, 'json', ['groups' => User::USER_READ]);

        $banks = $obj->getPaBanks();
        $orders = $obj->getPaOrders();

        $banks = $serializer->serialize($banks, 'json', ['groups' => User::USER_READ]);
        $orders = $serializer->serialize($orders, 'json', ['groups' => User::ADMIN_READ]);

        return $this->render('user/pages/profil/index.html.twig',  [
            'obj' => $obj,
            'banks' => $banks,
            'orders' => $orders,
            'teams' => $teams,
            'teamsArchived' => $teamsArchived,
            '_error' => $request->query->get('_error')
        ]);
    }

    /**
     * @Route("/modifier-profil", name="profil_update")
     */
    public function profilUpdate(SerializerInterface $serializer): Response
    {
        /** @var User $data */
        $data = $this->getUser();
        $data = $serializer->serialize($data, 'json', ['groups' => User::ADMIN_READ]);
        return $this->render('user/pages/profil/update.html.twig',  ['donnees' => $data]);
    }

    /**
     * @Route("/equipe/ajouter", options={"expose"=true}, name="team_create")
     */
    public function teamCreate(): Response
    {
        return $this->render('user/pages/profil/team/create.html.twig');
    }

    /**
     * @Route("/equipe/modifier/{id}", options={"expose"=true}, name="team_update")
     */
    public function teamUpdate(FoWorker $obj, SerializerInterface $serializer): Response
    {
        if(count($obj->getRegistrations()) != 0){
            return $this->redirectToRoute("user_profil", ['_error' => 1]);
        }

        $data = $serializer->serialize($obj, 'json', ['groups' => User::USER_READ]);
        return $this->render('user/pages/profil/team/update.html.twig', ['elem' => $obj, 'donnees' => $data]);
    }

    /**
     * @Route("/ajouter-banque", options={"expose"=true}, name="bank_create")
     */
    public function bankCreate(): Response
    {
        return $this->render('user/pages/profil/bank/create.html.twig');
    }

    /**
     * @Route("/modifier-banque/{id}", options={"expose"=true}, name="bank_update")
     */
    public function bankUpdate(PaBank $obj, SerializerInterface $serializer): Response
    {
        $obj = $serializer->serialize($obj, 'json', ['groups' => User::USER_READ]);
        return $this->render('user/pages/profil/bank/update.html.twig', ['donnees' => $obj]);
    }

    /**
     * @Route("/formations/sessions", name="sessions")
     */
    public function sessions(SerializerInterface $serializer): Response
    {
        $em = $this->doctrine->getManager();
        $objs = $em->getRepository(FoSession::class)->findBy(['isPublished' => true], ['start' => 'ASC']);

        $objs = $serializer->serialize($objs, 'json', ['groups' => User::ADMIN_READ]);

        return $this->render('user/pages/sessions/index.html.twig', [
            'donnees' => $objs
        ]);
    }

    /**
     * @Route("/formation/sessions/{slug}", options={"expose"=true}, name="registration")
     */
    public function registration(FoSession $obj, SerializerInterface $serializer): Response
    {
        $em = $this->doctrine->getManager();

        $workers = $em->getRepository(FoWorker::class)->findBy(['user' => $this->getUser(), 'isArchived' => false]);

        $session = $serializer->serialize($obj, 'json', ['groups' => User::ADMIN_READ]);
        $workers = $serializer->serialize($workers, 'json', ['groups' => User::USER_READ]);

        return $this->render('user/pages/sessions/registration/index.html.twig', [
            'elem' => $obj,
            'session' => $session,
            'workers' => $workers
        ]);
    }

    /**
     * @Route("/mes-formations", options={"expose"=true}, name="my_formations")
     */
    public function myFormations(SerializerInterface $serializer): Response
    {
        $em = $this->doctrine->getManager();
        $objs = $em->getRepository(FoRegistration::class)->findBy(['user' => $this->getUser()]);

        $sessions = []; $noDuplication = [];
        foreach($objs as $obj){
            $sessionId = $obj->getSession()->getId();
            if(!in_array($sessionId, $noDuplication)){
                $noDuplication[] = $sessionId;
                $sessions[] = $obj->getSession();
            }
        }

        $sessions = $serializer->serialize($sessions, 'json', ['groups' => User::ADMIN_READ]);

        return $this->render('user/pages/sessions/own.html.twig',  [
            'donnees' => $sessions,
        ]);
    }

    /**
     * @Route("/actualites", name="blog")
     */
    public function blog(BoArticleRepository $repository, SerializerInterface $serializer): Response
    {
        $objs = $repository->findBy(['isPublished' => true], ["createdAt" => "ASC", "updatedAt" => "ASC"]);
        $objs = $serializer->serialize($objs, 'json', ['groups' => User::VISITOR_READ]);

        return $this->render('user/pages/blog/index.html.twig',  [
            'donnees' => $objs
        ]);
    }
}
