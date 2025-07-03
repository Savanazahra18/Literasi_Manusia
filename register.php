<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

$conn = new mysqli("localhost", "root", "", "db_website");
if ($conn->connect_error) {
    die("Koneksi gagal: " . $conn->connect_error);
}

// Mendukung JSON dan form-data
if (isset($_SERVER['CONTENT_TYPE']) && strpos($_SERVER['CONTENT_TYPE'], 'application/json') === 0) {
    $input = json_decode(file_get_contents('php://input'), true);
    $username = $input['regUsername'] ?? '';
    $email = $input['regEmail'] ?? '';
    $password = $input['regPassword'] ?? '';
    $confirmPassword = $input['regConfirmPassword'] ?? '';
} else {
    $username = $_POST['regUsername'] ?? '';
    $email = $_POST['regEmail'] ?? '';
    $password = $_POST['regPassword'] ?? '';
    $confirmPassword = $_POST['regConfirmPassword'] ?? '';
}

// Debug: cek data POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo "Request harus POST";
    exit;
}

if (empty($username) || empty($email) || empty($password) || empty($confirmPassword)) {
    echo "Semua field harus diisi. Data: ";
    var_dump($username, $email, $password, $confirmPassword);
    exit;
}

if ($password !== $confirmPassword) {
    echo "Password tidak cocok.";
    exit;
}

// Cek email sudah terdaftar
$cek = $conn->prepare("SELECT id FROM users WHERE email = ?");
$cek->bind_param("s", $email);
$cek->execute();
$cek->store_result();
if ($cek->num_rows > 0) {
    echo "Email sudah terdaftar.";
    exit;
}
$cek->close();

$hashed = password_hash($password, PASSWORD_DEFAULT);

$sql = $conn->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
if (!$sql) {
    echo "Gagal prepare: " . $conn->error;
    exit;
}
$sql->bind_param("sss", $username, $email, $hashed);

if ($sql->execute()) {
    echo "Registrasi berhasil!";
} else {
    echo "Gagal: " . $sql->error;
}
$sql->close();
$conn->close();
?>
