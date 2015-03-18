<?php
include 'ChromePhp.php';
ChromePhp::log("INICIA PHP");
//  Converts Soap services content to JSON

session_start();
header('Content-type: application/json');

$ws = new SoapClient('http://172.18.149.189:8050/Camu_Service.asmx?WSDL');


$opcion = (isset($_POST['op'])) ? $_POST['op'] : $_GET['op'];

  ChromePhp::log("opcion: ".$opcion);


    switch($opcion){

      case 'SeguridadLogin':
        $a = array(
          'User' => $_POST['User'],
          'Password' => $_POST['Password']
        );
          $res = $ws->SeguridadLogin($a);
          ChromePhp::log($res);
          echo $res->seguridadLoginResult;
      break;

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

      case 'getServicesDef':
        $a = array(
          'serviceId' => $_POST['serviceId']
        );
          $res = $ws->getServicesDef($a);
          echo $res->getServicesDefResult;
      break;

      case 'ListaUsuario':
        $a = array(
          'Servicio' => $_POST['Servicio'],
          'Cliente' => $_POST['Cliente'],
          'Activo' => $_POST['Activo']
        );
          $res = $ws->ListaUsuario($a);
          echo $res->ListaUsuarioResult;
      break;

      case 'listaClienteAtento':
        $a = array(
          'Linea' => $_POST['Linea'],
          'Cliente' => $_POST['Cliente'],
          'Activo' => $_POST['Activo']
        );
        ChromePhp::log("ENTRA: {a}: ".$a[0][0]);
        try {
          $res = $ws->listaClienteAtento($a);
          echo $res->listaClienteAtentoResult;
        } catch (SoapFault $exception) {
          ChromePhp::log("ERROR EN LLAMADA AL WS <<listaClienteAtento>> DESDE PHP: ".$exception->$detail );
        }
      break;


      case 'listaLineaNegocio':
        $a = array(
          'Linea' => $_POST['Linea'],
          'Activo' => $_POST['Activo']
        );
        ChromePhp::log("ENTRA: {a}: ".$a[0][0]);
        try {
          $res = $ws->listaLineaNegocio($a);
          echo $res->listaLineaNegocioResult;
        } catch (SoapFault $exception) {
          ChromePhp::log("ERROR EN LLAMADA AL WS <<listaLineaNegocio>> DESDE PHP: ".$exception->$detail );
        }
      break;

      case 'mantClienteAtento':
        $a = array(
          'Id' => $_POST['Id'],
          'LineaId' => $_POST['LineaId'],
          'Cliente' => $_POST['Cliente'],
          'Activo' => $_POST['Activo'],
          'UserId' => $_POST['UserId']
        );
        try {
          $res = $ws->mantClienteAtento($a);
          echo $res->mantClienteAtentoResult;
        } catch (SoapFault $exception) {
          ChromePhp::log("ERROR EN LLAMADA AL WS <<mantClienteAtento>> DESDE PHP: ".$exception->$detail );
        }
      break;

      case 'listaServicios':
        $a = array(
          'Servicio' => $_POST['Servicio'],
          'ClienteAtento' => $_POST['ClienteAtento'],
          'Activo' => $_POST['Activo']
        );

        ChromePhp::log("ENTRA: {a}:");
        try {
          $res = $ws->listaServicios($a);
          echo $res->listaServiciosResult;
        } catch (SoapFault $exception) {
           ChromePhp::log("ERROR EN LLAMADA AL WS <<listaServicios>> DESDE PHP: ".$exception->$detail );
        }
      break;

      case 'mantServicio':
        $a = array(
          'id' => $_POST['id'],
          'cliAteId' => $_POST['cliAteId'],
          'Servicio' => $_POST['Servicio'],
          'Activo' => $_POST['Activo'],
          'UserId' => $_POST['UserId']
        );
        try {
          $res = $ws->mantServicio($a);
          echo $res->mantServicioResult;
        } catch (SoapFault $exception) {
          ChromePhp::log("ERROR EN LLAMADA AL WS <<mantServicio>> DESDE PHP: ".$exception->$detail );
        }
      break;

      default: echo 'Opps!';

      break;
    }

?>
