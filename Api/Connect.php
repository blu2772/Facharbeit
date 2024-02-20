<?php

$eingehendeDaten = file_get_contents('php://input');
$daten = json_decode($eingehendeDaten, true);


$host = '127.0.0.1:3306';
$dbname = 'Posts';
$username = 'root';
$password = '';


$db = new mysqli($host, $username, $password, $dbname);


if ($db->connect_error) {
    die("Verbindung fehlgeschlagen: " . $db->connect_error);
}


switch ($daten['cmd']) {
    case 'read':

        $abfrage = "SELECT * FROM `feed`";
        $ergebnis = $db->query($abfrage);

        if ($ergebnis) {
     
            $zeilen = $ergebnis->fetch_all(MYSQLI_ASSOC);
            
            echo json_encode($zeilen);
        } else {
          
            echo json_encode(['erfolg' => false, 'nachricht' => 'Fehler beim Abrufen der Daten']);
        }
        break;

    case 'delet':

         $abfrage = "DELETE FROM `feed` WHERE id = ".$daten['id'];
         $ergebnis = $db->query($abfrage);
 
         if ($ergebnis) {
             $zeilen = $ergebnis->fetch_all(MYSQLI_ASSOC);
            
             echo json_encode($zeilen);
         } else {
             
             echo json_encode(['erfolg' => false, 'nachricht' => 'Fehler beim Abrufen der Daten']);
         }
        break;

    default:
      
        echo json_encode(['erfolg' => false, 'nachricht' => 'Unbekannter Befehl']);
        break;
}
?>
