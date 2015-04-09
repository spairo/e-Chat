'use strict';
//Bases Form Controller

app.controller("BasesFormCtrl", function($scope, $state, BasesFactory){

    $scope.dataBases = BasesFactory;

    $scope.resetWizard = function ()
    {
      BasesFactory.lineaNegocioId = "";
      BasesFactory.linea = "";
      BasesFactory.clienteAtentoId = "";
      BasesFactory.cliente = "";
      BasesFactory.serviciosId = "";
      BasesFactory.servicio = "";
      BasesFactory.canalesId = "";
      BasesFactory.canal = "";
      BasesFactory.skillsId = "";
      BasesFactory.skill = "";

      $state.go('bases.lines');
    };
});

// BasesCtrl Controller
app.controller("BasesCtrl", function($scope, $state, $modal, ngToast, auth, dialogs, BasesFactory, httpp){

  //get id de autenticado
  var myid = $scope.status = auth.profileID;

  $scope.listaTiposDeDato = [{tipo:""},{tipo:"int"},{tipo:"varchar"},{tipo:"datetime"},{tipo:"binary"}];
  $scope.listaTiposDeCampo = [{campo:""},{campo:"Text"},{campo:"Check"},{campo:"Combo"},{campo:"Radio"}];

  //get values LN factory
  $scope.dataBases = BasesFactory;

  $scope.tableRowExpanded = false;
  $scope.tableRowIndexExpandedCurr = "";
  $scope.tableRowIndexExpandedPrev = "";
  $scope.nombreExpanded = "";
  $scope.getBase2 = false;

  $scope.Fecha_Ini = "";
  $scope.Fecha_Fin = "";

  $scope.baseDataCollapseFn = function () {
    $scope.baseDataCollapse = [];
      for (var i = 0; i < $scope.listaBasesResult.length; i += 1) {
        $scope.baseDataCollapse.push(false);
      }
  };

  $scope.$on('cargaListas', function(event){

    var skill = "";
    var servicio = "";
    var canal = "";
    if($state.current.name == "bases.bases")
    {
      skill = $scope.dataBases.skill;
      servicio = $scope.dataBases.servicio;
      canal = $scope.dataBases.canal;
    }

    //get lista de bases
    $scope.getListaBases = { op: "listaBases", Skill: skill, Base: "", Activo:""};

    httpp.post($scope.getListaBases)
    .then(function(data){
      $scope.listaBasesResult = data;
    })
    .catch(function(data, status){
      console.error("Error en httpp ", status, data);
      var msg = ngToast.create({
        content: "Error en httpp " + status + data,
        className:  "danger"
      });
    })
    .finally(function(){
      console.log("Finaliza llamada a httpp");
    });

    //get lista de skills
    $scope.getListaSkills = { op: "listaSkills", Skill: skill, Servicio: servicio, Canal: canal, Activo:""};

    httpp.post($scope.getListaSkills)
    .then(function(data){
      $scope.listaSkillsResult = data;
    })
    .catch(function(data, status){
      console.error("Error en httpp ", status, data);
      var msg = ngToast.create({
        content: "Error en httpp " + status + data,
        className:  "danger"
      });
    })
    .finally(function(){
      console.log("Finaliza llamada a httpp");
    });

  });

  $scope.$emit('cargaListas');

  //se muestra modal para crear base
  $scope.CreateBase = function(){

    var modalInstance = $modal.open({
      templateUrl: 'ModalCreate_Base.html',
      controller: 'ModalCreate_BaseController',
      resolve: {
        listaSkillsResult: function () {
          return $scope.listaSkillsResult;
        },
        listaTiposDeDato: function(){
          return $scope.listaTiposDeDato;
        },
        listaTiposDeCampo: function(){
          return $scope.listaTiposDeCampo;
        }
      }
    });

    modalInstance.result.then(function(){
      $scope.$emit('cargaListas');
    });
  };

  //se muestra modal para editar una base
  $scope.openEdit = function(skill, nombre, activo){
    //consultamos los datos de la base a la que se le dio click para editar
    $scope.getBaseData = { op: "listaBases", Skill: skill, Base: nombre, Activo: activo};

    httpp.post($scope.getBaseData)
    .then(function(data){
      $scope.baseResult = data;
      console.info("BasesCtrl > openEdit > getBaseData >>> OK");

      var modalInstance = $modal.open({
        templateUrl: 'ModalEdit_Base.html',
        controller: 'ModalEdit_BaseController',
        resolve: {
          base: function () {
          return $scope.baseResult;
          }
        }
      });

      modalInstance.result.then(function(){
        var start ="";
        $scope.$emit('cargaListas');
      });
    })
    .catch(function(data, status){
      console.error("Error en httpp ", status, data);
      var msg = ngToast.create({
        content: "Error en httpp " + status + data,
        className:  "danger"
      });
    })
    .finally(function(){
      console.log("Finaliza llamada a httpp");
    });
  };

  //se muestra modal para editar una compo de base selccionada.
  $scope.openCampoEdit = function(baseCampo){
    var modalInstance = $modal.open({
      templateUrl: 'ModalEdit_CampoBase.html',
      controller: 'ModalEdit_CampoBaseController',
      resolve: {
        baseCampo: function () {
        return baseCampo;
        },
        listaTiposDeDato: function(){
          return $scope.listaTiposDeDato;
        },
        listaTiposDeCampo: function(){
          return $scope.listaTiposDeCampo;
        }
      }
    });

    modalInstance.result.then(function(){
      var start ="";
      //$scope.$emit('cargaListas');
       $scope.$emit('cargaListaBasesCampos');
    });
  };


  $scope.selectTableRow = function (index, nombre) {
    $scope.listaBasesCamposResult = null;

    if (typeof $scope.baseDataCollapse === 'undefined') {
      $scope.baseDataCollapseFn();
    }

    if ($scope.tableRowExpanded === false && $scope.tableRowIndexExpandedCurr === "" && $scope.nombreExpanded === "") {
      $scope.tableRowIndexExpandedPrev = "";
      $scope.tableRowExpanded = true;
      $scope.tableRowIndexExpandedCurr = index;
      $scope.nombreExpanded = nombre;
      $scope.baseDataCollapse[index] = true;
      $scope.getBase2 = true;
    }
    else
      if ($scope.tableRowExpanded === true) {
        if ($scope.tableRowIndexExpandedCurr === index && $scope.nombreExpanded === nombre) {
          $scope.tableRowExpanded = false;
          $scope.tableRowIndexExpandedCurr = "";
          $scope.nombreExpanded = "";
          $scope.baseDataCollapse[index] = false;
          $scope.getBase2 = false;
        }
        else {
          $scope.tableRowIndexExpandedPrev = $scope.tableRowIndexExpandedCurr;
          $scope.tableRowIndexExpandedCurr = index;
          $scope.nombreExpanded = nombre;
          $scope.baseDataCollapse[$scope.tableRowIndexExpandedPrev] = false;
          $scope.baseDataCollapse[$scope.tableRowIndexExpandedCurr] = true;
          $scope.getBase2 = true;
        }
      }

    if($scope.getBase2 = true)
    {
      //get lista de bases
      $scope.getListaBasesCampos = { op: "listaBasesCampos", Base: nombre};

      $scope.$on('cargaListaBasesCampos', function(event){
        httpp.post($scope.getListaBasesCampos)
        .then(function(data){
          $scope.listaBasesCamposResult = data;
        })
        .catch(function(data, status){
          console.error("Error en httpp ", status, data);
          var msg = ngToast.create({
            content: "Error en httpp " + status + data,
            className:  "danger"
          });
        })
        .finally(function(){
          console.log("Finaliza llamada a httpp");
        });
      });

      $scope.$emit('cargaListaBasesCampos');
    }
  };

  $scope.StateReload = function(){
    $state.reload();

  };

});

//controlador para model de creacion de bases y campos
app.controller("ModalCreate_BaseController", function($scope, $modalInstance, ngToast, auth, dialogs, listaSkillsResult, listaTiposDeDato, listaTiposDeCampo, httpp){
  //get id de autenticado
  var myid = $scope.status = auth.profileID;

  $scope.listaSkillsResult = listaSkillsResult;
  $scope.showCampos = false;
  $scope.addBase = { op: "mantBases", Id: "0", SkillId: listaSkillsResult[0].skillsId, NombreBase: "", Descripcion: "", FechaIni: "", FechaFin: "", Activo: "",  UserIdModif: myid };

  $scope.$on('getListaBasesCampos', function(event){

    //get lista de campos de base
    $scope.getListaBasesCampos = { op: "listaBasesCampos", Base: $scope.addBase.NombreBase};

      httpp.post($scope.getListaBasesCampos)
      .then(function(data){
        $scope.listaBasesCamposResult = data;
      })
      .catch(function(data, status){
        console.error("Error en httpp ", status, data);
        var msg = ngToast.create({
          content: "Error en httpp " + status + data,
          className:  "danger"
        });
      })
      .finally(function(){
        console.log("Finaliza llamada a httpp");
      });
  });

  //funcion que agrega una base nueva a la base de datos
  $scope.AddBase = function(){
    var dd = $scope.Fecha_Ini.getDate();
    var mm = $scope.Fecha_Ini.getMonth()+1;
    var yyyy = $scope.Fecha_Ini.getFullYear();
    if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm}
    $scope.addBase.FechaIni = yyyy+"-"+mm+"-"+dd;

    dd = $scope.Fecha_Fin.getDate();
    mm = $scope.Fecha_Fin.getMonth()+1;
    yyyy = $scope.Fecha_Fin.getFullYear();
    if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm}
    $scope.addBase.FechaFin = yyyy+"-"+mm+"-"+dd;

    httpp.post($scope.addBase)
    .then(function(data){
      if(data == 'Error'){
        ngToast.create('La base no ha sido creada, revisa tus datos requeridos');
        console.warn("BasesCtrl > AddBase > mantServicio >>> ERROR WS");
      }
      else{
        var base_checked = angular.isNumber(data[0].Column1);
        if(base_checked == true){
          $scope.BaseId = data[0].Column1;
          ngToast.create('La base fue creada con exito');
          console.info("BasesCtrl > AddBase > mantServicio >>> Ok");
          $scope.$emit('cargaListas');

          var dlg = dialogs.confirm('Selecciona una respuesta','¿Deseas dar de alta los campos para esta base?');
          dlg.result.then(function(btn){

            $scope.addCampoBase = { op: "mantBasesCampos", Id: "0", BaseId: $scope.BaseId, Titulo: "",
            NombreCampo: "", TipoDato: "", TipoCampo: "", Longitud: "",
            ValorDefault: "", Requerido: "", Orden: "", Activo: "",
            UserId: myid };

            $scope.listaBasesCamposResult = {};
            $scope.showCampos = true;
          },function(btn){
            $scope.showCampos = false;
            $modalInstance.close();
          });
        }
        else{
          ngToast.create('La base no ha sido creada');
          $scope.result = data;
          console.warn("BasesCtrl > AddBase > mantServicio >>> BASE NO CREADA");
        }
      }
    })
    .catch(function(data, status){
      console.error("Error en httpp ", status, data);
      var msg = ngToast.create({
        content: "Error en httpp " + status + data,
        className:  "danger"
      });
    })
    .finally(function(){
      console.log("Finaliza llamada a httpp");
    });

  };

  $scope.AddCampoBase = function(){
   
    httpp.post($scope.addCampoBase)
    .then(function(data){
      if(data == 'Error'){
        ngToast.create('El campo base no ha sido creado, revisa tus datos requeridos');
        console.warn("BasesCtrl > AddCampoBase > mantBasesCampos >>> ERROR WS");
      }
      else{
        var campoBase_checked = angular.isNumber(data[0].Column1);
        if(campoBase_checked == true){
          $scope.addCampoBase = { op: "mantBasesCampos", Id: "0", BaseId: $scope.BaseId, Titulo: "",
            NombreCampo: "", TipoDato: "", TipoCampo: "", Longitud: "",
            ValorDefault: "", Requerido: "", Orden: "", Activo: "",
            UserId: myid };

          ngToast.create('El campo para la base fue creado con exito');
          console.info("BasesCtrl > AddCampoBase > mantBasesCampos >>> Ok");
        }
        else{
          ngToast.create('El campo no ha sido creado');
          $scope.result = data;
          console.warn("BasesCtrl > AddCampoBase > mantBasesCampos >>> CAMPO BASE NO CREADO");
        }
      }
    })
    .catch(function(data, status){
      console.error("Error en httpp ", status, data);
      var msg = ngToast.create({
        content: "Error en httpp " + status + data,
        className:  "danger"
      });
    })
    .finally(function(){
      console.log("Finaliza llamada a httpp");
      $scope.$emit('getListaBasesCampos');
    });
    
  };

  $scope.CloseLines = function()
  {
    $modalInstance.close();
  };

});

//controlador para model de edicion de bases
app.controller("ModalEdit_BaseController", function($scope, $modalInstance, ngToast, auth, base, httpp){
  //get id de autenticado
  var myid = $scope.status = auth.profileID;

  $scope.editBase = { op: "mantBases", Id: base[0].skillsBasesId, SkillId: base[0].skillsId, NombreBase: base[0].nombre, Descripcion: base[0].descripcion, FechaIni: base[0].fechaInicio, FechaFin: base[0].fechaFin, Activo: base[0].activo,  UserIdModif: myid };

  var yi = $scope.editBase.FechaIni.slice(0,4);
  var mi = parseInt($scope.editBase.FechaIni.slice(5,7))-1;
  var di = $scope.editBase.FechaIni.slice(8,10);
  var yf = $scope.editBase.FechaFin.slice(0,4);
  var mf = parseInt($scope.editBase.FechaFin.slice(5,7))-1;
  var df = $scope.editBase.FechaFin.slice(8,10);
  $scope.fechas = {FechaIni: new Date(yi, mi, di), FechaFin: new Date(yf, mf, df)};

  $scope.base = base;

  $scope.EditBase = function () {
    var dd = $scope.fechas.FechaIni.getDate();
    var mm = $scope.fechas.FechaIni.getMonth()+1;
    var yyyy = $scope.fechas.FechaIni.getFullYear();
    if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm}
    $scope.editBase.FechaIni = yyyy+"-"+mm+"-"+dd;

    dd = $scope.fechas.FechaFin.getDate();
    mm = $scope.fechas.FechaFin.getMonth()+1;
    yyyy = $scope.fechas.FechaFin.getFullYear();
    if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm}
    $scope.editBase.FechaFin = yyyy+"-"+mm+"-"+dd;

    httpp.post($scope.editBase)
    .then(function(data){
      if(data == 'Error'){
        ngToast.create('La base no ha sido editada, revisa tus datos requeridos');
        console.warn("ModalEdit_BaseController > EditBase > mantBases >>> ERROR WS");
      }
      else{
        var checked = angular.isNumber(data[0].Column1);
        if(checked == true){
          ngToast.create('La base fue editada con exito');
          console.info("ModalEdit_BaseController > EditBase > mantBases >>> Ok");
          //scopee.$emit('cargaListas');
          $modalInstance.close();
        }
        else{
          ngToast.create('La base no ha sido editada');
          $scope.result = data;
          console.warn("ModalEdit_BaseController > EditBase > mantBases >>> BASE NO EDITADA");
        }
      }
    })
    .catch(function(data, status){
      console.error("Error en httpp ", status, data);
      var msg = ngToast.create({
        content: "Error en httpp " + status + data,
        className:  "danger"
      });
    })
    .finally(function(){
      console.log("Finaliza llamada a httpp");
      $scope.$emit('getListaBasesCampos');
      $modalInstance.close();
    });

  };

  $scope.CloseLines = function()
  {
    $modalInstance.close();
  };

});

//controlador para model de edicion de campos de bases
app.controller("ModalEdit_CampoBaseController", function($scope, $modalInstance, ngToast, auth, baseCampo, listaTiposDeDato, listaTiposDeCampo, httpp){

  //get id de autenticado
  var myid = $scope.status = auth.profileID;

  $scope.baseCampo = baseCampo;
  $scope.listaTiposDeDato = listaTiposDeDato;
  $scope.listaTiposDeCampo = listaTiposDeCampo;

  $scope.editCampoBase = { op: "mantBasesCampos", Id: baseCampo.skillsBasesCamposId, BaseId: baseCampo.skillsBasesId, Titulo: baseCampo.titulo,
            NombreCampo: baseCampo.nombre1, TipoDato: baseCampo.tipoDato, TipoCampo: baseCampo.tipoCampo, Longitud: baseCampo.longitud,
            ValorDefault: baseCampo.valorDefault, Requerido: baseCampo.requerido, Orden: baseCampo.orden, Activo: baseCampo.activo,
            UserId: myid };

  angular.forEach($scope.listaTiposDeDato, function(item) {
      if(baseCampo.tipoDato == item.tipo)
        $scope.selectedTipoDato = item;
    });

   angular.forEach($scope.listaTiposDeCampo, function(item) {
      if(baseCampo.tipoCampo == item.campo)
        $scope.selectedTipoCampo = item;
    });
  
  $scope.changedValueTipoDato=function(item){
    $scope.editCampoBase.TipoDato = item.tipo;
  }; 

  $scope.changedValueTipoCampo=function(item){
    $scope.editCampoBase.TipoCampo = item.campo;
  };

  $scope.EditBaseCampo = function () {

    httpp.post($scope.editCampoBase)
    .then(function(data){
      if(data == 'Error'){
        ngToast.create('El campo de la base no ha sido editado, revisa tus datos requeridos');
        console.warn("ModalEdit_CampoBaseController > EditBaseCampo > mantBases >>> ERROR WS");
      }
      else{
        var checked = angular.isNumber(data[0].Column1);
        if(checked == true){
          ngToast.create('La base fue editada con exito');
          console.info("ModalEdit_CampoBaseController > EditBaseCampo > mantBases >>> Ok");
          //scopee.$emit('cargaListas');
          $modalInstance.close();
        }
        else{
          ngToast.create('El campo de la base no ha sido editado');
          $scope.result = data;
          console.warn("ModalEdit_CampoBaseController > EditBaseCampo > mantBases >>> BASE NO EDITADA");
        }
      }
    })
    .catch(function(data, status){
      console.error("Error en httpp ", status, data);
      var msg = ngToast.create({
        content: "Error en httpp " + status + data,
        className:  "danger"
      });
    })
    .finally(function(){
      console.log("Finaliza llamada a httpp");
      $scope.$emit('cargaListas');
      $modalInstance.close();
    });

  };

  $scope.CloseLines = function()
  {
    $modalInstance.close();
  };

});
