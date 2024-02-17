<?php
// JSON-Daten aus der POST-Anfrage abrufen
$eingehendeDaten = file_get_contents('php://input');
$daten = json_decode($eingehendeDaten, true);

// Verbindung zur Datenbank herstellen
$host = '127.0.0.1:3306';
$dbname = 'Posts';
$username = 'root';
$password = '';

// Einfache Verbindung ohne Fehlerbehandlung
$db = new mysqli($host, $username, $password, $dbname);

// Überprüfen, ob die Verbindung erfolgreich war
if ($db->connect_error) {
    die("Verbindung fehlgeschlagen: " . $db->connect_error);
}

// Befehl aus den Daten bestimmen und entsprechend handeln
switch ($daten['cmd']) {
    case 'read':
        // Daten aus der Datenbank abfragen
        $abfrage = "SELECT * FROM `feed`";
        $ergebnis = $db->query($abfrage);

        if ($ergebnis) {
            // Alle Zeilen in ein Array umwandeln
            $zeilen = $ergebnis->fetch_all(MYSQLI_ASSOC);
            // Das Array als JSON zurückgeben
            echo json_encode($zeilen);
        } else {
            // Fehler beim Abrufen der Daten
            echo json_encode(['erfolg' => false, 'nachricht' => 'Fehler beim Abrufen der Daten']);
        }
        break;

    case 'delet':
         // Daten aus der Datenbank abfragen
         $abfrage = "DELETE FROM `feed` WHERE id = ".$daten['id'];
         $ergebnis = $db->query($abfrage);
 
         if ($ergebnis) {
             // Alle Zeilen in ein Array umwandeln
             $zeilen = $ergebnis->fetch_all(MYSQLI_ASSOC);
             // Das Array als JSON zurückgeben
             echo json_encode($zeilen);
         } else {
             // Fehler beim Abrufen der Daten
             echo json_encode(['erfolg' => false, 'nachricht' => 'Fehler beim Abrufen der Daten']);
         }
        break;

    default:
        // Unbekannter Befehl
        echo json_encode(['erfolg' => false, 'nachricht' => 'Unbekannter Befehl']);
        break;
}
?>
