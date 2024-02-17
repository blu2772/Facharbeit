<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
header('Access-Control-Allow-Methods: POST');
ini_set('display_errors', 1);
error_reporting(E_ALL);

// JSON-Daten aus der POST-Anfrage abrufen
$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData, true);

// Verbindung zur Datenbank herstellen (Beispiel für MySQL)
$host = '127.0.0.1:3306';
$dbname = 'Posts';
$username = 'root';
$password = '';

try {
    $db = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    // Fehlerbehandlung bei Verbindungsfehler
    die('Verbindungsfehler zur Datenbank: ' . $e->getMessage());
}

// Daten in die Datenbank einfügen (Beispiel für eine Tabelle mit den Spalten "name" und "email")
switch($data['cmd']){
    case"read":
        try {
            $stmt = $db->prepare("SELECT * FROM `feed`");
            $stmt->execute();
        
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Convert the results to JSON
            $jsonArray = json_encode($results);

            // Return the JSON response
            echo $jsonArray;
        } catch(PDOException $e) {
            // Fehlerbehandlung bei Datenbankeinfügefehler
            $response = ['success' => false, 'message' => 'Fehler beim lessen des Kalenders','error' => $e->getMessage()];
            echo json_encode($response);
        }
    break;
    
    default:
    $response = ['success' => false, 'message' => 'no known comand given'];
    echo json_encode($response);
    break;   
}

?>