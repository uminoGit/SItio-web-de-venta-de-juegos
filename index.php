<?php
$servidor = "localhost";
$usuario = "root";
$clave = "";
$baseDeDatos = "electronics";

$enlace = mysqli_connect($servidor, $usuario, $clave, $baseDeDatos);

if (!$enlace) {
    die("Error en la conexión: " . mysqli_connect_error());
}
?>

<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Formulario</title>
<style>
    html, body {
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
        color: white;
        position: relative;
        min-height: 100vh;
        overflow: hidden;
    }
    body::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80'); /* Imagen HD */
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        z-index: -1;
    }
    body::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(to left, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
        z-index: -1;
    }
    .form-container {
        background-color: rgba(0, 0, 0, 0.6);
        padding: 30px 40px;
        border-radius: 12px;
        max-width: 400px;
        margin: 80px auto 0 auto;
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .form-container input[type="text"],
    .form-container input[type="email"] {
        width: 100%;
        padding: 10px;
        margin: 10px 0;
        border: none;
        border-radius: 5px;
        font-size: 1rem;
        color: #222;
    }
    .form-container input[type="submit"],
    .form-container input[type="reset"] {
        background-color: #007BFF;
        color: #fff;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        font-size: 1rem;
        margin: 10px 5px 0 5px;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    .form-container input[type="submit"]:hover,
    .form-container input[type="reset"]:hover {
        background-color: #0056b3;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }
    .mensaje {
        text-align: center;
        margin-top: 20px;
        font-size: 1.1rem;
        color: #FFD700;
        background: rgba(0,0,0,0.5);
        padding: 10px;
        border-radius: 8px;
        max-width: 400px;
        margin-left: auto;
        margin-right: auto;
    }
</style>
</head>
<body>

<div class="form-container">
<form action="#" name="electronics" method="post">
    <input type="text" name="nombre" placeholder="Nombre" required>
    <input type="email" name="correo" placeholder="Correo" required>
    <input type="text" name="telefono" placeholder="Teléfono" required>
    <input type="submit" name="registro" value="Registrar">
    <input type="reset" value="Limpiar">
</form>
</div>

<?php
if(isset($_POST['registro'])){
    $nombre = $_POST['nombre'];
    $correo = $_POST['correo'];
    $telefono = $_POST['telefono'];

    $insertarDatos = "INSERT INTO datos VALUES('$nombre','$correo','$telefono','')";
    $ejecutarInsertar = mysqli_query($enlace, $insertarDatos);
    
    if($ejecutarInsertar) {
        echo '<div class="mensaje">Datos insertados correctamente</div>';
    } else {
        echo '<div class="mensaje">Error al insertar datos: ' . mysqli_error($enlace) . '</div>';
    }
}
?>

</body>
</html>