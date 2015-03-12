<?php

//  Converts Soap services content to JSON

session_start();
header('Content-type: application/json');

$ws = new SoapClient('http://172.18.130.203/wsCamu/Camu_Service.asmx?WSDL');

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

    case 'listaServicios':
      $a = array();
      try{

        $res = $ws->listaServicios($a);
        echo $res->listaServiciosResult;

      }catch(Exception $e){
        echo 'Error: ',  $e->getMessage(), "\n";
      }
    break;

    /*
    case 'listaCanales':
      $a = array(
        'Cliente' => $_POST['Cliente'],
        'Activo' => $_POST['Activo']
      );
      $res = $ws->listaCanales($a);
      echo $res->listaCanalesResult;
    break;
    */

    case 'listaCanales':
      $a = array();
      try{

        $res = $ws->listaCanales($a);
        echo $res->listaCanalesResult;

      }catch(Exception $e){
        echo 'Error: ',  $e->getMessage(), "\n";
      }
    break;

    /*
    case 'listaServicios':
    $a = array(
      'Servicio' => $_POST['Servicio'],
      'Cliente' => $_POST['Cliente'],
      'Activo' => $_POST['Activo']
    );
    $res = $ws->listaServicios($a);
    echo $res->listaServiciosResult;
    break;
    */

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
      'servicioId' => $_POST['servicioId'],
      'skillId' => $_POST['skillId'],
      'perfilId' => $_POST['perfilId']
    );
    $res = $ws->listaUsuario($a);
    echo $res->listaUsuarioResult;
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
