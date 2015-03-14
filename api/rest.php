<?php
include 'ChromePhp.php';
ChromePhp::log("INICIA PHP");
//  Converts Soap services content to JSON

session_start();
header('Content-type: application/json');

//$ws = new SoapClient('http://172.18.130.203/wsCamu/Camu_Service.asmx?WSDL');
$ws = new SoapClient('http://172.18.149.189:8050/Camu_Service.asmx?WSDL');

$opcion = (isset($_POST['op'])) ? $_POST['op'] : $_GET['op'];

  ChromePhp::log("opcion: ".$opcion);

 // 
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

