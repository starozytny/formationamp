<?php


namespace App\Service;


use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;

class MailerService
{
    private $mailer;
    private $settingsService;

    public function __construct(MailerInterface $mailer, SettingsService $settingsService)
    {
        $this->mailer = $mailer;
        $this->settingsService = $settingsService;
    }

    public function sendMail($to, $subject, $text, $html, $params, $from=null)
    {
        $from = ($from == null) ? $this->settingsService->getEmailExpediteurGlobal() : $from;

        $email = (new TemplatedEmail())
            ->from($from)
            ->to(new Address($to))
            ->subject($subject)
            ->text($text)
            ->htmlTemplate($html)
            ->context($params)
        ;

        try {
            $this->mailer->send($email);
            return true;
        } catch (TransportExceptionInterface $e) {
            return 'Le message n\'a pas pu être délivré. Veuillez contacter le support.';
        }
    }

    public function sendMailCCGroup($to, $subject, $text, $html, $params, $from=null)
    {
        $from = ($from == null) ? $this->settingsService->getEmailExpediteurGlobal() : $from;

        $email = (new TemplatedEmail())
            ->from($from)
            ->bcc(...$to)
            ->subject($subject)
            ->text($text)
            ->htmlTemplate($html)
            ->context($params)
        ;

        try {
            $this->mailer->send($email);
            return true;
        } catch (TransportExceptionInterface $e) {
            return 'Le message n\'a pas pu être délivré. Veuillez contacter le support.';
        }
    }
}