<?php

namespace App\Controller;

use App\Entity\Contact;
use App\Entity\Formation\FoFormation;
use App\Entity\Formation\FoRegistration;
use App\Entity\Formation\FoSession;
use App\Entity\Notification;
use App\Entity\Paiement\PaLot;
use App\Entity\Paiement\PaOrder;
use App\Entity\Settings;
use App\Entity\User;
use Doctrine\Common\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

/**
 * @Route("/admin", name="admin_")
 */
class AdminController extends AbstractController
{
    private $doctrine;

    public function __construct(ManagerRegistry $doctrine)
    {
        $this->doctrine = $doctrine;
    }
    
    private function getAllData($classe, SerializerInterface $serializer, $groups = User::ADMIN_READ): string
    {
        $em = $this->doctrine->getManager();
        $objs = $em->getRepository($classe)->findAll();

        return $serializer->serialize($objs, 'json', ['groups' => $groups]);
    }

    private function getRenderView(Request $request, SerializerInterface $serializer, $class, $route): Response
    {
        $objs = $this->getAllData($class, $serializer);
        $search = $request->query->get('search');
        if($search){
            return $this->render($route, [
                'donnees' => $objs,
                'search' => $search
            ]);
        }

        return $this->render($route, [
            'donnees' => $objs
        ]);
    }

    /**
     * @Route("/", options={"expose"=true}, name="homepage")
     */
    public function index(): Response
    {
        $em = $this->doctrine->getManager();
        $users = $em->getRepository(User::class)->findAll();
        $settings = $em->getRepository(Settings::class)->findAll();

        $totalUsers = count($users); $nbConnected = 0;
        foreach($users as $user){
            if($user->getLastLogin()){
                $nbConnected++;
            }
        }
        return $this->render('admin/pages/index.html.twig', [
            'settings' => $settings ? $settings[0] : null,
            'totalUsers' => $totalUsers,
            'nbConnected' => $nbConnected,
        ]);
    }

    /**
     * @Route("/styleguide/html", name="styleguide_html")
     */
    public function styleguideHtml(): Response
    {
        return $this->render('admin/pages/styleguide/index.html.twig');
    }

    /**
     * @Route("/styleguide/react", options={"expose"=true}, name="styleguide_react")
     */
    public function styleguideReact(Request  $request): Response
    {
        if($request->isMethod("POST")){
            return new JsonResponse(['code' => true]);
        }
        return $this->render('admin/pages/styleguide/react.html.twig');
    }

    /**
     * @Route("/utilisateurs", name="users_index")
     */
    public function users(Request $request, SerializerInterface $serializer): Response
    {
        return $this->getRenderView($request, $serializer, User::class, 'admin/pages/user/index.html.twig');
    }

    /**
     * @Route("/parametres", name="settings_index")
     */
    public function settings(): Response
    {
        return $this->render('admin/pages/settings/index.html.twig');
    }

    /**
     * @Route("/contact", name="contact_index")
     */
    public function contact(Request $request, SerializerInterface $serializer): Response
    {
        return $this->getRenderView($request, $serializer, Contact::class, 'admin/pages/contact/index.html.twig');
    }

    /**
     * @Route("/notifications", options={"expose"=true}, name="notifications_index")
     */
    public function notifications(SerializerInterface $serializer): Response
    {
        $objs = $this->getAllData(Notification::class, $serializer);

        return $this->render('admin/pages/notifications/index.html.twig', [
            'donnees' => $objs
        ]);
    }

    /**
     * @Route("/paiements", name="paiements_index")
     */
    public function paiements(SerializerInterface $serializer): Response
    {
        $objs = $this->getAllData(PaOrder::class, $serializer);

        return $this->render('admin/pages/paiement/order/index.html.twig', [
            'donnees' => $objs
        ]);
    }

    /**
     * @Route("/paiements/historiques", name="lots_index")
     */
    public function lots(SerializerInterface $serializer): Response
    {
        $objs = $this->getAllData(PaLot::class, $serializer);

        return $this->render('admin/pages/paiement/lot/index.html.twig', [
            'donnees' => $objs
        ]);
    }

    /**
     * @Route("/paiements/historiques/{id}", options={"expose"=true}, name="lots_read")
     */
    public function lot(PaLot $obj, SerializerInterface $serializer): Response
    {
        $em = $this->doctrine->getManager();
        $objs = $em->getRepository(PaOrder::class)->findby(['lot' => $obj]);

        $objs = $serializer->serialize($objs, 'json', ['groups' => User::ADMIN_READ]);

        return $this->render('admin/pages/paiement/lot/read.html.twig', [
            'elem' => $obj,
            'donnees' => $objs
        ]);
    }

    /**
     * @Route("/formations", name="formations_index")
     */
    public function formations(SerializerInterface $serializer): Response
    {
        $objs = $this->getAllData(FoFormation::class, $serializer);

        return $this->render('admin/pages/formations/index.html.twig', [
            'donnees' => $objs
        ]);
    }

    /**
     * @Route("/formations/{slug}/sessions", options={"expose"=true}, name="sessions_index")
     */
    public function sessions(FoFormation $formation, SerializerInterface $serializer): Response
    {
        $em = $this->doctrine->getManager();
        $objs = $em->getRepository(FoSession::class)->findBy(['formation' => $formation]);

        $objs = $serializer->serialize($objs, 'json', ['groups' => User::ADMIN_READ]);

        return $this->render('admin/pages/formations/sessions.html.twig', [
            'donnees' => $objs,
            'formation' => $formation
        ]);
    }

    /**
     * @Route("/session/{slug}", options={"expose"=true}, name="sessions_read")
     */
    public function session(FoSession $session, SerializerInterface $serializer): Response
    {
        $em = $this->doctrine->getManager();
        $obj = $em->getRepository(FoRegistration::class)->findBy(['session' => $session]);
        $obj = $serializer->serialize($obj, 'json', ['groups' => User::ADMIN_READ]);

        return $this->render('admin/pages/formations/participants.html.twig', [
            'donnees' => $obj,
            'session' => $session
        ]);
    }
}
