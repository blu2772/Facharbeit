<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
header('Access-Control-Allow-Methods: POST');

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
    case 'searchid':
        $abfrage = "SELECT * FROM `feed` WHERE id = ".$daten['id'];
        $ergebnis = $db->query($abfrage);

        if ($ergebnis) {
            $zeilen = $ergebnis->fetch_all(MYSQLI_ASSOC);
            echo json_encode($zeilen);
        } else {
            echo json_encode(['erfolg' => false, 'nachricht' => 'Fehler beim Abrufen der Daten']);
        }
        break;
    case 'edit':
        $abfrage = "UPDATE `feed` SET `title` = '".$daten['title']."', `content` = '".$daten['content']."', `img` = '".$daten['img']."' WHERE id = ".$daten['id'];
        $ergebnis = $db->query($abfrage);

        if ($ergebnis) {
            echo json_encode(['erfolg' => true, 'nachricht' => 'Daten erfolgreich bearbeitet']);
        } else {
            echo json_encode(['erfolg' => false, 'nachricht' => 'Fehler beim Bearbeiten der Daten']);
        }
        break;
    case 'create':
        $abfrage = "INSERT INTO `feed` (`title`, `content`, `img`) VALUES ('".$daten['title']."', '".$daten['content']."', '".$daten['img']."')";
        $ergebnis = $db->query($abfrage);

        if ($ergebnis) {
            echo json_encode(['erfolg' => true, 'nachricht' => 'Daten erfolgreich erstellt']);
        } else {
            echo json_encode(['erfolg' => false, 'nachricht' => 'Fehler beim Erstellen der Daten']);
        }
        break;
       
    default:
    
        echo json_encode(['erfolg' => false, 'nachricht' => 'Unbekannter Befehl']);
    
        break;
}
?>
