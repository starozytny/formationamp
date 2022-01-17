<?php

namespace App\Controller;

use App\Entity\Blog\BoArticle;
use App\Entity\User;
use App\Repository\Blog\BoArticleRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

class AppController extends AbstractController
{
    /**
     * @Route("/", name="app_homepage")
     */
    public function index(): Response
    {
        return $this->render('app/pages/index.html.twig');
    }

    /**
     * @Route("/legales/mentions-legales", name="app_mentions")
     */
    public function mentions(): Response
    {
        return $this->render('app/pages/legales/mentions.html.twig');
    }

    /**
     * @Route("/legales/politique-confidentialite", options={"expose"=true}, name="app_politique")
     */
    public function politique(): Response
    {
        return $this->render('app/pages/legales/politique.html.twig');
    }

    /**
     * @Route("/legales/cookies", name="app_cookies")
     */
    public function cookies(): Response
    {
        return $this->render('app/pages/legales/cookies.html.twig');
    }

    /**
     * @Route("/legales/rgpd", name="app_rgpd")
     */
    public function rgpd(): Response
    {
        return $this->render('app/pages/legales/rgpd.html.twig');
    }

    /**
     * @Route("/nous-contacter", name="app_contact")
     */
    public function contact(): Response
    {
        return $this->render('app/pages/contact/index.html.twig');
    }

    /**
     * @Route("/creation-compte", name="app_user_registration")
     */
    public function userRegistration(): Response
    {
        return $this->render('app/pages/security/registration.html.twig');
    }

    /**
     * @Route("/actualites", name="app_blog")
     */
    public function blog(BoArticleRepository $repository, SerializerInterface $serializer): Response
    {
        $objs = $repository->findBy(['isPublished' => true, "visibleBy" => BoArticle::VISIBILITY_ALL], ["createdAt" => "ASC", "updatedAt" => "ASC"]);
        $objs = $serializer->serialize($objs, 'json', ['groups' => User::VISITOR_READ]);

        return $this->render('app/pages/blog/index.html.twig',  [
            'donnees' => $objs
        ]);
    }
}
