<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
header('Access-Control-Allow-Methods: POST');


if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['image'])) {
    $image = $_FILES['image'];


    $uploadDir = 'uploads/';
    $uploadFile = $uploadDir . basename($image['name']);


    if (move_uploaded_file($image['tmp_name'], $uploadFile)) {

        echo json_encode(['success' => true, 'message' => 'Bild erfolgreich hochgeladen.', 'path' => $uploadFile]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Ein Fehler ist beim Hochladen aufgetreten.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Kein Bild zum Hochladen.']);
}

?>