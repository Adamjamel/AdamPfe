sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/dnd/DragInfo",
    "sap/ui/core/dnd/DropInfo",
    "sap/f/dnd/GridDropInfo",
    "./../RevealGrid/RevealGrid",
    "sap/ui/core/library",
    


  ],
  function (Controller, JSONModel, DragInfo, DropInfo, GridDropInfo, RevealGrid, coreLibrary, Fragment, Filter, FilterOperator,MessageBox) {
    "use strict";
    var DropLayout = coreLibrary.dnd.DropLayout;

    // shortcut for sap.ui.core.dnd.DropPosition
    var DropPosition = coreLibrary.dnd.DropPosition;

    return Controller.extend("app.project1.controller.Association", {

      onInit: function () {
        this.base = this.getOwnerComponent();
       


        // Assurez-vous que this.base et this.base.getEditFlow sont définis
        if (!this.base || !this.base.getEditFlow) {
            console.error("Base or getEditFlow is undefined.");
        }
        this.initData();
        this.attachDragAndDrop();
       
      },

      initData: function () {
        var oModel = this.getOwnerComponent().getModel("mainModel");

        var oJSONModel = new sap.ui.model.json.JSONModel();
        oJSONModel.setData({
          "id": "",
          "name": ""
        });
        this.byId("grid1").setModel(oJSONModel);



        console.log(oModel)

        var sUrl1 = oModel.sServiceUrl + "/Entity";

        if (oModel) {
          console.log("Main model found");

          // Fetch entity data
          fetch(sUrl1)
            .then(response => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.json();
            })
            .then(data => {
              // Create a JSON model containing the fetched data
              var oODataJSONModel = new sap.ui.model.json.JSONModel();
              oODataJSONModel.setData(data.value);

              console.log("patron", oODataJSONModel);

              // Set the JSON model on the controls
              this.byId("list1").setModel(oODataJSONModel);
              console.log("aaaaaaaaaa", oODataJSONModel);

            })
            .catch(error => {
              // Handle errors in fetching data
              console.error('Error fetching data:', error);
            });
        }
      },



      onRevealGrid: function () {
        RevealGrid.toggle("grid1", this.getView());
      },

      onExit: function () {
        RevealGrid.destroy("grid1", this.getView());
      },

      attachDragAndDrop: function () {
        var oList = this.byId("list1");
        oList.addDragDropConfig(new DragInfo({
          sourceAggregation: "items"
        }));

        oList.addDragDropConfig(new DropInfo({
          targetAggregation: "items",
          dropPosition: DropPosition.Between,
          dropLayout: DropLayout.Vertical,
          drop: this.onDrop.bind(this)
        }));

        var oGrid = this.byId("grid1");
        oGrid.addDragDropConfig(new DragInfo({
          sourceAggregation: "items"
        }));

        oGrid.addDragDropConfig(new GridDropInfo({
          targetAggregation: "items",
          dropPosition: DropPosition.Between,
          dropLayout: DropLayout.Horizontal,
          dropIndicatorSize: this.onDropIndicatorSize.bind(this),
          drop: this.onDrop.bind(this)
        }));
      },

      onDropIndicatorSize: function (oDraggedControl) {
        var oBindingContext = oDraggedControl.getBindingContext();
        console.log("aaa", oBindingContext);
        var oData = oBindingContext.getModel().getProperty(oBindingContext.getPath());
        console.log("oData", oData);

        // Check if the dragged control is a StandardListItem
        if (oDraggedControl.isA("sap.m.StandardListItem")) {
          // Check if the oData object contains rows and columns properties
          if (oData) {
            return {
              rows: 1,
              columns: 2
            };
          } else {
            // Handle the case when rows and columns properties are not found
            console.error("Rows and/or columns properties not found in the data object.");
          }
        }
      },


      onDrop: function (oInfo) {
        var oDragged = oInfo.getParameter("draggedControl");
        var oDropped = oInfo.getParameter("droppedControl");
        var sInsertPosition = oInfo.getParameter("dropPosition");

        var oDragContainer = oDragged.getParent();
        var oDropContainer = oInfo.getSource().getParent();

        var oDragModel = oDragContainer.getModel();
        var oDropModel = oDropContainer.getModel();

        var oDragModelData = oDragModel.getData();
        var oDropModelData = oDropModel.getData();

        var iDragPosition = oDragContainer.indexOfItem(oDragged);
        var iDropPosition = oDropContainer.indexOfItem(oDropped);

        console.log("drag model", oDragModelData);
        console.log("drop model", oDropModelData);

        // remove the item
        var oItem = oDragModelData[iDragPosition];
        oDragModelData.splice(iDragPosition, 1);

        /*  if (oDragModel === oDropModel && iDragPosition < iDropPosition) {
             iDropPosition--;
         }
     
         if (sInsertPosition === "After") {
             iDropPosition++;
         } */

        // Ensure oDropModelData is an array
        if (!Array.isArray(oDropModelData)) {
          oDropModelData = [];
        }

        // insert the control in target aggregation
        oDropModelData.splice(iDropPosition, 0, oItem);

        if (oDragModel !== oDropModel) {
          oDragModel.setData(oDragModelData);
          oDropModel.setData(oDropModelData);
        } else {
          oDropModel.setData(oDropModelData);
        }

        this.byId("grid1").focusItem(iDropPosition);
        var grid = this.getView().byId("grid1");
        this.logGridContent(grid);
      },
      logGridContent: function(grid) {
        this.table=[];
        var items = grid.getItems();
        items.forEach(function(item) {
          var title = item.getHeader().getTitle();
   
          this.table.push(title);
        }.bind(this));
      },
      generateCDSModel: function() {
        var cdsModel = "service modelsService {\n";
        this.table.forEach(function(entity) {
            cdsModel += "\n\tentity " + entity + " as projection on models." + entity + ";";
        });
      
      
        cdsModel += "\n}";
      
      
        console.log("Generated CDS Model:", cdsModel);
        this.onAppendServiceToFilePress(cdsModel) ;  
      },
      onOpenAddDialog: function () {
        this.getView().byId("OpenDialog").open();
      },
      onCancelDialog: function (oEvent) {
        oEvent.getSource().getParent().close();
      },
    

     

      
     
    
   
  OnCdsgen: function () {
   
    var oModel = this.getView().getModel("mainModel");
    var sUrl1 = oModel.sServiceUrl + "/Entity";
    var sUrl2 = oModel.sServiceUrl + "/Field";
    var sUrl3 = oModel.sServiceUrl + "/Association"; // URL to fetch associations
    
    if (oModel) {
    console.log("Main model found");
    
    // Fetch entity data
    fetch(sUrl1)
    .then(response => {
    if (!response.ok) {
    throw new Error('Network response was not ok');
    }
    return response.json();
    })
    .then(entityData => {
    console.log("Entity Data:", entityData);
    
    const entities = entityData.value;
    // Fetch field data
    fetch(sUrl2)
    .then(response => {
    if (!response.ok) {
    throw new Error('Network response was not ok');
    }
    return response.json();
    })
    .then(fields => {
    console.log("Fields:", fields);
    const entityDataa = [];
    
    // Associez les champs aux entités
    entities.forEach(entity => {
    const entityFields = fields.value.filter(field => field.fld_ID === entity.ID);
    
    // Ajoutez les données de l'entité avec ses champs associés au tableau
    entityDataa.push({
    ID: entity.ID,
    name: entity.name,
    fields: entityFields
    });
    });
    
    // Fetch association data
    fetch(sUrl3)
    .then(response => {
    if (!response.ok) {
    throw new Error('Network response was not ok');
    }
    return response.json();
    
    })
    .then(associations => {
    console.log("Associations:", associations);
    
   

    const cdsEntities = this.generateCDSEntities(entityData.value, fields.value,
    
    associations.value);

    
    })
    .catch(error => {
    console.error("Error retrieving associations:", error);
    });
    
    // Process entity and field data
    // Set the entity data to the view model or do other operations
    })
    .catch(error => {
    console.error("Error retrieving fields:", error);
    });
    })
    .catch(error => {
    console.error("Error retrieving entities:", error);
    });
    } else {
    console.error("Main model not found");
    }
    
    },
    generateCDSEntities: function (entityData, fieldsData, associationsData) {
      const cdsEntities = [];
      
      for (const entity of entityData) {
      const entityName = entity.name;
      const entityFields = fieldsData.filter(field => field.fld_ID === entity.ID);
      
      let cdsEntity = `entity ${entityName} {`;
      
      // Process fields
      for (const field of entityFields) {
        if(field.annotations== null)
        {
          let fieldString = `\n\t${field.value}: ${field.type} `;
          if (field.iskey) {
          fieldString = `\n\tkey ${field.value}: ${field.type} `;
          }
          cdsEntity += fieldString + ';';
        }
        else {
          let fieldString = `\n\t${field.value}: ${field.type} ${field.annotations}`;
      if (field.iskey) {
      fieldString = `\n\tkey ${field.value}: ${field.type} ${field.annotations}`;
      }
      cdsEntity += fieldString + ';';
        }
      
      }
      
      const entityAssociations = associationsData.filter(association =>
      association.entitySource_ID === entity.ID || association.entityTarget_ID === entity.ID
      );
      var ismanytomany = false;
      
      for (const association of entityAssociations) {
      const isManyToOne = association.type === 'ManyToOne';
      const isOneToOne = association.type === 'OneToOne';
      const isManyToMany = association.type === 'ManyToMany';
      const isSourceEntity = association.entitySource_ID === entity.ID;
      const isTargetEntity = association.entityTarget_ID === entity.ID;
      
      if (isManyToOne && isSourceEntity) {
      const targetEntity = entityData.find(e => e.ID === association.entityTarget_ID);
      if (targetEntity) {
      cdsEntity += `\n\tfld : Association to ${targetEntity.name};`;
      }
      }
      
      if (isManyToOne && isTargetEntity) {
      const sourceEntity = entityData.find(e => e.ID === association.entitySource_ID);
      if (sourceEntity) {
        const lowersourceEntity=sourceEntity.name.toLowerCase();
      cdsEntity += `\n\t${lowersourceEntity} : Association to many ${sourceEntity.name}`;
      
      cdsEntity += `\ton ${lowersourceEntity}.fld = $self;`;
      }
      }
      if (isOneToOne && isSourceEntity) {
      const targetEntity = entityData.find(e => e.ID === association.entityTarget_ID);
      if (targetEntity) {
      var st= entity.name.toLowerCase();
      
      cdsEntity += `\n\t${st}${targetEntity.name} : Association to ${targetEntity.name};`;
      
      }
      }
      if (isOneToOne && isTargetEntity) {
        const sourceEntity = entityData.find(e => e.ID === association.entitySource_ID);
        if (sourceEntity) {
        var st= sourceEntity.name.toLowerCase()
        
        cdsEntity += `\n\t${st} : Association to ${sourceEntity.name};`;
        
        }
        }
      
      if (isManyToMany && isSourceEntity) {
      ismanytomany = true;
      const targetEntity = entityData.find(e => e.ID === association.entityTarget_ID);

      
      var str1 = entity.name.toLowerCase();
      var str2 = targetEntity.name.toLowerCase();
      var ch1=entity.name ; 
      var ch2=targetEntity.name ; 


      var newname =ch1 + "2" + ch2;
      cdsEntity += `\n\t${str2}s : Composition of many ${entity.name}To${targetEntity.name} on ${str2}s.${str1}=$self;`;

      
      
      }
      if (isManyToMany && isTargetEntity) {
        const sourceEntity = entityData.find(e => e.ID === association.entitySource_ID);
        var str1=sourceEntity.name.toLowerCase() ; 
        var str2=entity.name.toLowerCase();

      cdsEntity += `\n\t${str1}s : Composition of many ${sourceEntity.name}To${entity.name} on ${str1}s.${str2}=$self;`;
      }
      }
      
      if (ismanytomany === true) {
      
      cdsEntity += `\n}\n`;
      cdsEntity += `entity ${ch1}To${ch2} {
      \n\tkey ${str1} : Association to ${ch1};
      \n\tkey ${str2} : Association to ${ch2};
      \n}\n`;
      
      }
      else {
      cdsEntity += `\n}\n`;
      }
      cdsEntities.push(cdsEntity);
      }
      this.onAppendTextToFilePress(cdsEntities.join(''))

      
      return cdsEntities.join('');
      },
      onAppendTextToFilePress: function(data) {
     
       
        fetch("/odata/v4/models/appendTextToFile", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ content:  data }) // Pass the variable in the request body
        })
        .then(response => response.json())
        .then(data1 => {
            console.log("Action invoked successfully:", data1);
        })
        .catch(error => {
            console.error("Error invoking action:", error);
        });
        
    }
,
onExecuteCommandPress: function(data) {
     
       
  fetch("/odata/v4/models/ExecuteCommand", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({ command:  "/home/user/projects/Pfe/ClientProject/yo.sh" }) // Pass the variable in the request body
  })
  .then(response => response.json())
  .then(data1 => {
      console.log("Action invoked successfully:", data1);
  })
  .catch(error => {
      console.error("Error invoking action:", error);
  });
  
},
onAppendTextToFilePress: function(data) {
     
       
  fetch("/odata/v4/models/appendTextToFile", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({ content:  data }) // Pass the variable in the request body
  })
  .then(response => response.json())
  .then(data1 => {
      console.log("Action invoked successfully:", data1);
  })
  .catch(error => {
      console.error("Error invoking action:", error);
  });
  
},

showServicePopup: function() {
  var that = this;
  var dialog = sap.m.MessageBox.show(
      "You have selected the same entity for both the source and target entities. Please select different entities",
      {
          icon: sap.m.MessageBox.Icon.WARNING,
          title: "Confirmation",
          actions: [sap.m.MessageBox.Action.OK],
          onClose: function(oAction) {
              if (oAction === sap.m.MessageBox.Action.OK) {
                  // L'utilisateur a choisi de continuer, rien à faire ici
              }
          }
      }
  );

  // Désactiver le bouton "OK" après l'affichage de la boîte de dialogue
  dialog.getBeginButton().setEnabled(false);
},
showCDSPopup: function() {
  var that = this;
  var dialog = sap.m.MessageBox.show(
      "You have selected the same entity for both the source and target entities. Please select different entities",
      {
          icon: sap.m.MessageBox.Icon.WARNING,
          title: "Confirmation",
          actions: [sap.m.MessageBox.Action.OK],
          onClose: function(oAction) {
              if (oAction === sap.m.MessageBox.Action.OK) {
                  // L'utilisateur a choisi de continuer, rien à faire ici
              }
          }
      }
  );

  // Désactiver le bouton "OK" après l'affichage de la boîte de dialogue
  dialog.getBeginButton().setEnabled(false);
},

handleAboutPress: function () {
  var Model = this.getOwnerComponent().getModel("localModel");
  Model.setProperty("/layout", "EndColumnExpanded");
  this.getOwnerComponent().getRouter().navTo("page2");
},
onOpenAddDialog: function () {
  this.getView().byId("mainDialog").open();
},
onCancelDialog: function (oEvent) {
  this.getView().byId("mainDialog").close();
},
onOpenAddDialog1: function () {
  this.getView().byId("mainDialog1").open();
},
onCancelDialog1: function (oEvent) {
  this.getView().byId("mainDialog1").close();
},
onOpenAddDialog3: function () {
  this.getView().byId("mainDialog3").open();
},
onCancelDialog3: function (oEvent) {
  this.getView().byId("mainDialog3").close();
},



  });
  }
  
  

);
