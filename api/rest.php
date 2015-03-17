<?php

//  Converts Soap services content to JSON

session_start();
header('Content-type: application/json');

$ws = new SoapClient('http://172.18.149.189:8050/?WSDL');

$opcion = (isset($_POST['op'])) ? $_POST['op'] : $_GET['op'];

  switch($opcion){

    case 'seguridadLogin':
      $a = array(
        'User' => $_POST['User'],
        'Password' => $_POST['Password']
      );
      $res = $ws->seguridadLogin($a);
      echo $res->seguridadLoginResult;
    break;

    case 'listaCanales':
      $a = array(
        'Canal' => $_POST['Canal'],
        'Activo' => $_POST['Activo']
      );
      $res = $ws->listaCanales($a);
      echo $res->listaCanalesResult;
    break;

    case 'mantCanales':
      $a = array(
        'Id' => $_POST['Id'],
        'Canal' => $_POST['Canal'],
        'Activo' => $_POST['Activo'],
        'UserId' => $_POST['UserId']
      );
      $res = $ws->mantCanales($a);
      echo $res->mantCanalesResult;
    break;

    case 'ListaSkills':
      $a = array(
        'Skill' => $_POST['Skill'],
        'Servicio' => $_POST['Servicio'],
        'Canal' => $_POST['Canal'],
        'Activo' => $_POST['Activo']
      );
      $res = $ws->ListaSkills($a);
      echo $res->ListaSkillsResult;
    break;

    case 'listaUsuario':
    $a = array(
      'Usuario' => $_POST['Usuario'],
      'Servicio' => $_POST['Servicio'],
      'Skill' => $_POST['Skill'],
      'Perfil' => $_POST['Perfil'],
      'activo' => $_POST['activo']
    );
    $res = $ws->listaUsuario($a);
    echo $res->listaUsuarioResult;
    break;

    case 'mantUsuarios':
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
    $res = $ws->mantUsuarios($a);
    echo $res->mantUsuariosResult;
    break;

    case 'listaCentros':
    $a = array(
      'Centro' => $_POST['Centro'],
      'Activo' => $_POST['Activo']
    );
    $res = $ws->listaCentros($a);
    echo $res->listaCentrosResult;
    break;

    case 'mantCentros':
    $a = array(
      'Id' => $_POST['Id'],
      'Centro' => $_POST['Centro'],
      'Activo' => $_POST['Activo'],
      'UserId' => $_POST['UserId']
    );
    $res = $ws->mantCentros($a);
    echo $res->mantCentrosResult;
    break;

    default: echo 'Opps!';

    break;

  }

?>
