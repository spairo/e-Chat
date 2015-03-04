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
    /*$a = array(
      'serviceId' => $_POST['serviceId']
    );*/
    $res = $ws->ListaUsuario($a);
    echo $res->ListaUsuarioResult;
    break;

    default: echo 'Opps!';

    break;

  }

?>
