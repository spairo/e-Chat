<?php

//  Converts Soap services content to JSON

session_start();
header('Content-type: application/json');

$ws = new SoapClient('http://172.18.130.203/wsCamu/Service1.asmx?WSDL');

$opcion = (isset($_POST['op'])) ? $_POST['op'] : $_GET['op'];

  switch($opcion){

    case 'Login':
    $a = array(
      'User' => $_POST['User'],
      'Password' => $_POST['Password']
    );
    $res = $ws->Login($a);
    echo $res->LoginResult;
    break;

    case 'getServicesDef':
    $res = $ws->getServicesDef($a);
    echo $res->getServicesDefResult;
    break;

    case 'HelloWorld':
    $res = $ws->HelloWorld($a);
    echo $res->HelloWorldResult;
    break;

    case 'Mani':
    $a = array(
      'User' => $_POST['User'],
      'Password' => $_POST['Password']
    );
    $res = $ws->Mani($a);
    echo $res->ManiResult;
    break;


    default: echo 'Opps!';

    break;

  }

?>
