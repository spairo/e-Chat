<?php

//  Converts Soap services content to JSON

session_start();
header('Content-type: application/json');

$ws = new SoapClient('http://172.18.130.203/wsCamu/Camu_Service.asmx?WSDL');

$opcion = (isset($_POST['op'])) ? $_POST['op'] : $_GET['op'];

  switch($opcion){

    case 'SeguridadLogin':
    $a = array(
      'User' => $_POST['User'],
      'Password' => $_POST['Password']
    );
    $res = $ws->SeguridadLogin($a);
    echo $res->SeguridadLoginResult;
    break;

    case 'getServicesDef':
    $a = array(
      'serviceId' => $_POST['serviceId']
    );
    $res = $ws->getServicesDef($a);
    echo $res->getServicesDefResult;
    break;

    case 'ListaUsuario':
    $a = array(
      'servicioId' => $_POST['servicioId'],
      'skillId' => $_POST['skillId'],
      'perfilId' => $_POST['perfilId']
    );
    $res = $ws->ListaUsuario($a);
    echo $res->ListaUsuarioResult;
    break;

    case 'Mantenimiento_Usuarios':
    $a = array(
      'Id' => $_POST['Id'],
      'PerfilId' => $_POST['PerfilId'],
      'Nombre' => $_POST['Nombre'],
      'Apellidos' => $_POST['Apellidos'],
      'Sexo' => $_POST['Sexo'],
      'Usuario' => $_POST['Usuario'],
      'Password' => $_POST['Password'],
      'Activo' => $_POST['Activo'],
      'UserIdModif' => $_POST['UserIdModif']
    );
    $res = $ws->Mantenimiento_Usuarios($a);
    echo $res->Mantenimiento_UsuariosResult;
    break;

    default: echo 'Opps!';

    break;

  }

?>
