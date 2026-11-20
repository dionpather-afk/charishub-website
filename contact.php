<?php
/**
 * RCA Charisma contact form mailer (replaces the Wix form + Wix automation).
 *
 * The Contact page sends the form here as JSON. We check it and email it to
 * the address below, with Reply-To set to the visitor so a reply goes
 * straight back to them. Nothing is stored on the server.
 */

// ---- Settings ---------------------------------------------------------------
// Same inbox the Wix automation used.
const TO_ADDRESS   = 'developer5@talentlearnconsult.com';
// Must be a real mailbox / allowed sender on this hosting (set up on Xneelo).
const FROM_ADDRESS = 'website@rcacharisma.com';
const FROM_NAME    = 'RCA Charisma Website';
// Max messages per visitor (IP address) per hour, to stop spam floods.
const MAX_PER_HOUR = 5;
// -----------------------------------------------------------------------------

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

function reply(int $code, array $body): void {
    http_response_code($code);
    echo json_encode($body);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    reply(405, ['ok' => false, 'error' => 'Method not allowed']);
}

// Only accept posts from our own pages.
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$host   = $_SERVER['HTTP_HOST'] ?? '';
if ($origin !== '' && parse_url($origin, PHP_URL_HOST) !== $host) {
    reply(403, ['ok' => false, 'error' => 'Not allowed']);
}

$raw = file_get_contents('php://input', false, null, 0, 20000);
$data = json_decode($raw ?: '', true);
if (!is_array($data)) {
    reply(400, ['ok' => false, 'error' => 'Invalid request']);
}

$clean = fn($v, $max) => trim(mb_substr(str_replace(["\r", "\0"], '', (string)($v ?? '')), 0, $max));
$name    = $clean($data['senderName'] ?? '', 120);
$email   = $clean($data['senderEmail'] ?? '', 200);
$subject = $clean($data['subject'] ?? '', 60);
$message = trim(mb_substr((string)($data['messageContent'] ?? ''), 0, 5000));

$allowedSubjects = ['General Inquiry', 'Prayer Request', 'Suggestion / Feedback', 'Praise Report'];
if ($name === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    reply(422, ['ok' => false, 'error' => 'Please fill in your name, a valid email and a message']);
}
if (!in_array($subject, $allowedSubjects, true)) {
    $subject = 'General Inquiry';
}
// Header-injection guard (no line breaks allowed in header values).
if (preg_match('/[\r\n]/', $name . $email)) {
    reply(422, ['ok' => false, 'error' => 'Invalid characters']);
}

// Simple per-IP rate limit, kept in the server's temp folder.
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$bucket = sys_get_temp_dir() . '/rca_contact_' . md5($ip);
$now = time();
$hits = array_filter(array_map('intval', @file($bucket) ?: []), fn($t) => $t > $now - 3600);
if (count($hits) >= MAX_PER_HOUR) {
    reply(429, ['ok' => false, 'error' => 'Too many messages, please try again later']);
}
$hits[] = $now;
@file_put_contents($bucket, implode("\n", $hits));

$when = (new DateTime('now', new DateTimeZone('Africa/Johannesburg')))->format('j M Y, H:i');
$body = "New message from the RCA Charisma website contact form\n\n"
      . "Purpose: {$subject}\n"
      . "Name:    {$name}\n"
      . "Email:   {$email}\n"
      . "Sent:    {$when}\n\n"
      . "Message:\n{$message}\n";

$encodedSubject = '=?UTF-8?B?' . base64_encode("RCA Charisma website: {$subject} from {$name}") . '?=';
$headers = [
    'From: ' . FROM_NAME . ' <' . FROM_ADDRESS . '>',
    'Reply-To: ' . $name . ' <' . $email . '>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
];

$sent = mail(TO_ADDRESS, $encodedSubject, $body, implode("\r\n", $headers), '-f' . FROM_ADDRESS);
if (!$sent) {
    reply(500, ['ok' => false, 'error' => 'The message could not be sent']);
}
reply(200, ['ok' => true]);
