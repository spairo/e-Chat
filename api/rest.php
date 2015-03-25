<?php
include 'ChromePhp.php';
ChromePhp::log("INICIA PHP");
//  Converts Soap services content to JSON

session_start();
header('Content-type: application/json');


$ws = new SoapClient('http://172.18.149.178:8050/Camu_Service.asmx?WSDL');

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

    case 'listaPerfiles':
      $a = array(
        'Perfil' => $_POST['Perfil'],
        'Activo' => $_POST['Activo']
      );
      $res = $ws->listaPerfiles($a);
      echo $res->listaPerfilesResult;
    break;

    case 'mantPerfiles':
      $a = array(
        'Id' => $_POST['Id'],
        'Perfil' => $_POST['Perfil'],
        'Descripcion' => $_POST['Descripcion'],
        'Activo' => $_POST['Activo'],
        'UserId' => $_POST['UserId']
      );
      $res = $ws->mantPerfiles($a);
      echo $res->mantPerfilesResult;
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

    case 'listaLineaNegocio':
      $a = array(
        'Linea' => $_POST['Linea'],
        'Activo' => $_POST['Activo']
      );
      $res = $ws->listaLineaNegocio($a);
      echo $res->listaLineaNegocioResult;
    break;

    case 'mantLineaNegocio':
      $a = array(
        'Id' => $_POST['Id'],
        'Linea' => $_POST['Linea'],
        'Descripcion' => $_POST['Descripcion'],
        'Activo' => $_POST['Activo'],
        'UserId' => $_POST['UserId']
      );
      $res = $ws->mantLineaNegocio($a);
      echo $res->mantLineaNegocioResult;
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

      case 'listaBases':
        $a = array(
          'Skill' => $_POST['Skill'],
          'Base' => $_POST['Base'],
          'Activo' => $_POST['Activo']
        );

        ChromePhp::log("ENTRA: {a}:");
        try {
          $res = $ws->listaBases($a);
          echo $res->listaBasesResult;
        } catch (SoapFault $exception) {
           ChromePhp::log("ERROR EN LLAMADA AL WS <<listaBases>> DESDE PHP: ".$exception->$detail );
        }
      break;

      case 'listaSkills':
        $a = array(
          'Skill' => $_POST['Skill'],
          'Servicio' => $_POST['Servicio'],
          'Canal' => $_POST['Canal'],
          'Activo' => $_POST['Activo']
        );

        ChromePhp::log("ENTRA: {a}:");
        try {
          $res = $ws->listaSkills($a);
          echo $res->listaSkillsResult;
        } catch (SoapFault $exception) {
           ChromePhp::log("ERROR EN LLAMADA AL WS <<listaSkills>> DESDE PHP: ".$exception->$detail );
        }
      break;

      case 'listaBasesCampos':
        $a = array(
          'Base' => $_POST['Base']
        );

        ChromePhp::log("ENTRA: {a}:");
        try {
          $res = $ws->listaBasesCampos($a);
          echo $res->listaBasesCamposResult;
        } catch (SoapFault $exception) {
           ChromePhp::log("ERROR EN LLAMADA AL WS <<listaBasesCampos>> DESDE PHP: ".$exception->$detail );
        }
      break;

      case 'mantBases':
        $a = array(
          'Id' => $_POST['Id'],
          'SkillId' => $_POST['SkillId'],
          'NombreBase' => $_POST['NombreBase'],
          'Descripcion' => $_POST['Descripcion'],
          'FechaIni' => $_POST['FechaIni'],
          'FechaFin' => $_POST['FechaFin'],
          'Activo' => $_POST['Activo'],
          'UserIdModif' => $_POST['UserIdModif']
        );
        try {
          $res = $ws->mantBases($a);
          echo $res->mantBasesResult;
        } catch (SoapFault $exception) {
          ChromePhp::log("ERROR EN LLAMADA AL WS <<mantBases>> DESDE PHP: ".$exception->$detail );
        }
      break;

      case 'mantBasesCampos':
        $a = array(
          'Id' => $_POST['Id'],
          'BaseId' => $_POST['BaseId'],
          'Titulo' => $_POST['Titulo'],
          'NombreCampo' => $_POST['NombreCampo'],
          'TipoDato' => $_POST['TipoDato'],
          'TipoCampo' => $_POST['TipoCampo'],
          'Longitud' => $_POST['Longitud'],
          'ValorDefault' => $_POST['ValorDefault'],
          'Requerido' => $_POST['Requerido'],
          'Orden' => $_POST['Orden'],
          'Activo' => $_POST['Activo'],
          'UserId' => $_POST['UserId']
        );
        try {
          $res = $ws->mantBasesCampos($a);
          echo $res->mantBasesCamposResult;
        } catch (SoapFault $exception) {
          ChromePhp::log("ERROR EN LLAMADA AL WS <<mantBasesCampos>> DESDE PHP: ".$exception->$detail );
        }
      break;

      case 'mantSkills':
        $a = array(
          'Id' => $_POST['Id'],
          'CanalesId' => $_POST['CanalesId'],
          'ServiciosId' => $_POST['ServiciosId'],
          'Skill' => $_POST['Skill'],
          'Activo' => $_POST['Activo'],
          'UserId' => $_POST['UserId']
        );
        try {
          $res = $ws->mantSkills($a);
          echo $res->mantSkillsResult;
        } catch (SoapFault $exception) {
          ChromePhp::log("ERROR EN LLAMADA AL WS <<mantSkills>> DESDE PHP: ".$exception->$detail );
        }
      break;

      default: echo 'Opps!';

      break;
    }

?>
