<?php
header('Content-Type: application/json');

// Allow CORS if needed
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, PUT');
header('Access-Control-Allow-Headers: Content-Type');

// Path to data file
$dataFile = '../data/items.json';

// Ensure the data directory exists and is writable
if (!file_exists('../data')) {
    mkdir('../data', 0777, true);
}

// Create data file if it doesn't exist
if (!file_exists($dataFile)) {
    file_put_contents($dataFile, json_encode(['items' => []]));
}

// Read data
function readData() {
    global $dataFile;
    $jsonString = file_get_contents($dataFile);
    return json_decode($jsonString, true);
}

// Write data
function writeData($data) {
    global $dataFile;
    file_put_contents($dataFile, json_encode($data, JSON_PRETTY_PRINT));
}

// Get request method
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Read all items
        $data = readData();
        echo json_encode($data);
        break;

    case 'POST':
        // Update all items
        $input = json_decode(file_get_contents('php://input'), true);
        writeData($input);
        echo json_encode(['success' => true]);
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}