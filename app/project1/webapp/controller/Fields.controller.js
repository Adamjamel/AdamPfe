sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/f/library",
        "sap/m/MessageToast",
        "sap/ui/core/Fragment",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/m/MessageBox"



    ],
    function (BaseController, fioriLibrary,MessageToast,Fragment,Filter,FilterOperator,MessageBox) {
        "use strict";

        return BaseController.extend("app.project1.controller.Fields", {
            onInit: function () {
                var actions = {
                    "Actions": [
                        { key: 0, type: "String" },
                        { key: 1, type: "int" },
                        { key: 2, type: "boolean" },
                        { key: 3, type: "float" }
                    ]
                };
                var annotations = {
                    "Annotations": [
                        { key: 0, name: "@readonly" },
                        { key: 1, name: "@mandatory" },
                        { key: 2, name: "@assert.unique" },
                        { key: 3, name: "@assert.integrity" },
                        { key: 3, name: "@assert.integrity" },
                        { key: 3, name: "@assert.notNull" }


                    ]
                };
                var oViewModel = new sap.ui.model.json.JSONModel({
                    showTable: false // Initially set to false to hide the table
                });

                var AssociationType = {
                    "Type": [
                      { key: 0, type: "ManyToMany" },
                      { key: 1, type: "ManyToOne" },
                      { key: 2, type: "OneToOne" },
                    ]
                  };
                  var oModel = new sap.ui.model.json.JSONModel(AssociationType);
                  this.getView().setModel(oModel, "AssociationType");
                this.getView().setModel(oViewModel, "viewModel");
              
                var oModel = new sap.ui.model.json.JSONModel(actions);
                this.getView().setModel(oModel, "actions");
                var oModel = new sap.ui.model.json.JSONModel(annotations);
                this.getView().setModel(oModel, "annotations");

                var oModel = this.getView().getModel("selectedEntityModel");
                this.getView().setModel(oModel, "selectedEntityModel");

                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.getRoute("Details").attachPatternMatched(this._onFieldsMatched, this);


            },
            _onFieldsMatched: function (oEvent) {
                this.index = oEvent.getParameter("arguments").index || "0";
                this.getView().bindElement({
                    path: "/Entity/" + this.index,
                    model: "mainModel"
                });
            },

            onEditToggleButtonPress: function () {

                var oObjectPage = this.getView().byId("ObjectPagea"),
                    bCurrentShowFooterState = oObjectPage.getShowFooter();

                oObjectPage.setShowFooter(!bCurrentShowFooterState);
            },
            onSupplierPress: function () {
                var Model = this.getOwnerComponent().getModel("localModel");
                this.getOwnerComponent().getRouter().navTo("Assosciation"
                );
                Model.setProperty("/layout", "ThreeColumnsEndExpanded");


            },
            onCloneInputField: function (event) {
                var button = event.getSource();
                var parentContainer = button.getParent();
                console.log(parentContainer.getMetadata())

                var originalInputField = this.getView().byId("fields"); // Assuming the input field has an ID "field"
                var clonedInputField = originalInputField.clone();
                var parentVBox = this.getView().byId("parentvbox")



                parentVBox.addItem(clonedInputField);



            },
            onCancelDialog: function (oEvent) {
                oEvent.getSource().getParent().close();
            },



            onCreate2: function () {
                var sID = this.byId("fldd").getText();


                var oModel = this.getView().getModel("mainModel");
                var sUrl = oModel.sServiceUrl + "/Entity";
                /*  var oViewModel = this.getView().getModel("viewModel");
               
                 // Toggle the showTable property
                 var bShowTable = oViewModel.getProperty("/showTable");
                 oViewModel.setProperty("/showTable", !bShowTable);
                */
                 console.log("bbbbbbbbbbbbbbbbbbbbbbbbbbb",this.getView().byId("annotations").mProperties.
                 selectedKeys)
                 var array= this.getView().byId("annotations").mProperties.selectedKeys ; 
                 var annotations = array.join(" ");
                 console.log("a7la annotation",annotations)
                 var key = this.byId("key").getValue();
                 var skey;
                 
                 // Convert string to boolean
                 if (key.toLowerCase() === "true") {
                     skey = true;
                 } else if (key.toLowerCase() === "false") {
                     skey = false;
                 } else {
                     // Handle invalid input if necessary
                     console.error("Invalid input. Cannot convert to boolean.");
                 }




                if (oModel) {
                    console.log("Main model found");
                    fetch(sUrl)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.json();
                        })
                        .then(data => {
                            console.log("Data:", data);
                            if (data && data.value && Array.isArray(data.value)) {

                                const entities = data.value;


                                const entityWithID = entities.find(entity => entity.ID === sID);
                                if (entityWithID) {
                                    console.log("Entity with ID :", entityWithID);

                                    const oEntity = entityWithID;
                                    console.log("aaaaa", oEntity)
                                    const oList2 = this.getView().byId("table1");
                                    const oBinding2 = oList2.getBinding("items");


                                    const oContext = oBinding2.create({
                                        "ID": this.byId("fieldid").getValue(),
                                        "value": this.byId("field").getValue(),
                                        "type": this.byId("idComboBoxSuccess").getValue(),
                                        "fld": oEntity,
                                        "annotations":annotations,
                                        "iskey":skey


                                    });


                                    /* 
                                            var oFilter = new sap.ui.model.Filter({
                                                path: "fld_ID", // Le chemin du champ à filtrer
                                                operator: sap.ui.model.FilterOperator.EQ, // Opérateur de comparaison
                                                value1: sID // La valeur de filtrage
                                            });
                                    
                                            oBinding2.filter(oFilter); */


                                } else {
                                    console.log("Entity with ID " + sID + " not found");
                                }
                            } else {
                                console.error("Invalid data format:", data);
                            }
                        })
                        .catch(error => {
                            console.error("Error:", error);
                        });
                } else {


                    console.error("Main model not found");
                }


            },
            onShowTablePress: function () {
                // Get the view model
                var oViewModel = this.getView().getModel("viewModel");

                // Toggle the showTable property
                var bShowTable = oViewModel.getProperty("/showTable");
                oViewModel.setProperty("/showTable", !bShowTable);

                var oModel = this.getView().getModel("mainModel");
                var sUrl1 = oModel.sServiceUrl + "/Entity";
                var sUrl2 = oModel.sServiceUrl + "/Field";

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
                                    const oView0 = this.getView();
                                    const oModel0 = new sap.ui.model.json.JSONModel();
                                    oModel0.setData({ entityData: entityDataa });
                                    oView0.setModel(oModel0);

                                    // Fetch association data
                                    /*  fetch(sUrl3)
                                         .then(response => {
                                             if (!response.ok) {
                                                 throw new Error('Network response was not ok');
                                             }
                                             return response.json();
                                         })
                                         .then(associations => {
                                             console.log("Associations:", associations);
               
               
                                             // Set the generated CDS entities to the view model or do other operations
                                             const oView0 = this.getView();
                                             const oModel0 = new sap.ui.model.json.JSONModel();
                                             oModel0.setData({ entityData: entityDataa });
                                             oView0.setModel(oModel0);
                                             const fileName = 'entityData.json';
                                             const filePath = './controller/' + fileName;
                                             // Call generateCDSEntities here
                                             const cdsEntities = this.generateCDSEntities(entityData.value, fields.value, associations.value);
                                             console.log(cdsEntities);
                                         })
                                         .catch(error => {
                                             console.error("Error retrieving associations:", error);
                                         });  */

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
            onUpdate: function () {
                var oSelected = this.getView().byId("table1").getSelectedItem();
                if (oSelected) {
                    var oContext = oSelected.getBindingContext("mainModel");
                    if (oContext) {
                        var skey = this.getView().byId("iskey").getValue();
                        var svalue = this.getView().byId("value").getValue();
                        var stype = this.getView().byId("idComboBoxupdate").getValue();
                        var sannotations=this.getView().byId("idComboBoxupdate").mProperties.selectedKeys;
                        var bIsKey;
                        
                        // Convert string to boolean
                        if (skey.toLowerCase() === "true") {
                            bIsKey = true;
                        } else if (skey.toLowerCase() === "false") {
                            bIsKey = false;
                        } else {
                            // Handle invalid input if necessary
                            console.error("Invalid input. Cannot convert to boolean.");
                        }




                        oContext.setProperty("iskey", bIsKey);
                        oContext.setProperty("value", svalue);
                        oContext.setProperty("type", stype);
                        //oContext.setProperty("annotations", sannotations);




                        var oModel = this.getView().getModel("mainModel");
                        oModel.submitBatch("yourGroupId").then(function () {
                            // Success callback
                            MessageToast.show("Update successful");
                        }).catch(function (oError) {
                            // Error callback
                            MessageToast.show("Update failed: " + oError.message);
                        });
                    } else {
                        MessageToast.show("Invalid Field");
                    }
                } else {
                    MessageToast.show("Please select a row to update");
                }
            },
            onDelete: function () {

                var oSelected = this.byId("table1").getSelectedItem();
                if (oSelected) {
                    var oSalesOrder = oSelected.getBindingContext("mainModel").getObject();

                    oSelected.getBindingContext("mainModel").delete("$auto").then(function () {
                        MessageToast.show(oSalesOrder + " SuccessFully Deleted");
                    }.bind(this), function (oError) {
                        MessageToast.show("Deletion Error: ", oError);
                    });
                } else {
                    MessageToast.show("Please Select a Row to Delete");
                }

            },
           

            onOpenAddDialog2: function () {
                this.getView().byId("OpenDialog2").open();

            },
            formatFieldsValue: function (fields) {
                if (Array.isArray(fields)) {
                    return fields.map(field => field.value).join(', '); // Concatenate values with comma separator
                } else {
                    return '';
                }
            },

            handleClose: function () {
                var Model = this.getOwnerComponent().getModel("localModel");
                Model.setProperty("/layout", "OneColumn");
                this.getOwnerComponent().getRouter().navTo("Listview");
            },
            onCreate: function() {
                var oModel = this.getView().getModel("mainModel");
                var input1 = this.getView().byId("sourceInput").getValue();
                var input2 = this.getView().byId("targetInput").getValue();
                var type = this.getView().byId("associationtype").getValue();
                var sUrl1 = oModel.sServiceUrl + "/Entity";
                var entity1 = {};
                var entity2 = {};
                if (oModel) {
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
                            entities.forEach(element => {
                                console.log("aaaaaaaaaaaaaaaaaaaaaaa", element.name)
                                if (element.name == input1) {
                                    entity1 = element;
                                }
                                if (element.name == input2) {
                                    entity2 = element;
                                }
                                
                            } );
                            // Vérifier si les entités source et cible sont identiques
                            if (entity1 === entity2) {
                                this.showSameEntityConfirmationPopup();
                            } else {
                                var oBindList = oModel.bindList("/Association");
                                oBindList.create({
                                    entitySource:entity1,
                                    entityTarget:entity2,
                                    type:type
                                });
                            }
                        })
                        .catch(error => {
                            console.error("Error retrieving entities:", error);
                        });
                } else {
                    console.error("Model 'mainModel' is not defined or accessible in the view.");
                }
            },
            onSuggestionItemSelected: function (oEvent) {
                var oItem = oEvent.getParameter("selectedItem");
                var oText = oItem ? oItem.getKey() : "";
        
        
                this.byId("selectedKeyIndicator").setText(oText);
              },
              onSuggestionItemSelected1: function (oEvent) {
                var oItem = oEvent.getParameter("selectedItem");
                var oText = oItem ? oItem.getKey() : "";
        
        
                this.byId("selectedKeyIndicator").setText(oText);
              },
              onValueHelpRequest: function (oEvent) {
                var sInput = oEvent.getSource();
                var sInputValue = oEvent.getSource().getValue(),
                  oView = this.getView();
        
                if (!this._pValueHelpDialog) {
                  this._pValueHelpDialog = Fragment.load({
                    id: oView.getId(),
                    name: "app.project1.view.ValueHelpDialog",
                    controller: this
                  }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                  });
                }
                this._pValueHelpDialog.then(function (oDialog) {
                  // Create a filter for the binding
                  oDialog.getBinding("items").filter([new Filter("name", FilterOperator.Contains, sInputValue)]);
                  // Open ValueHelpDialog filtered by the input's value
                  oDialog.open(sInputValue);
                });
              },
              onValueHelpDialogSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter("name", FilterOperator.Contains, sValue);
        
                oEvent.getSource().getBinding("items").filter([oFilter]);
              },
        
              onValueHelpDialogClose: function (oEvent) {
                var sDescription,
                  oSelectedItem = oEvent.getParameter("selectedItem");
                oEvent.getSource().getBinding("items").filter([]);
        
                if (!oSelectedItem) {
                  return;
                }
        
        
                sDescription = oSelectedItem.getDescription();
                this.byId("sourceInput").setValue(sDescription);
        
        
        
        
        
        
        
              },
        
              
              onValueHelpRequest1: function (oEvent) {
                var sInputValue = oEvent.getSource().getValue(),
                  oView = this.getView();
        
                if (!this._pValueHelpDialog1) {
                  this._pValueHelpDialog1 = Fragment.load({
                    id: oView.getId(),
                    name: "app.project1.view.ValueHelp",
                    controller: this
                  }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                  });
                }
                this._pValueHelpDialog1.then(function (oDialog) {
                  // Create a filter for the binding
                  oDialog.getBinding("items").filter([new Filter("name", FilterOperator.Contains, sInputValue)]);
                  // Open ValueHelpDialog filtered by the input's value
                  oDialog.open(sInputValue);
                });
              },
        
              onValueHelpDialogSearch1: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter("name", FilterOperator.Contains, sValue);
        
                oEvent.getSource().getBinding("items").filter([oFilter]);
              },
        
              onValueHelpDialogClose1: function (oEvent) {
                var sDescription,
                  oSelectedItem = oEvent.getParameter("selectedItem");
                oEvent.getSource().getBinding("items").filter([]);
        
                if (!oSelectedItem) {
                  return;
                }
        
        
                sDescription = oSelectedItem.getDescription();
                this.byId("targetInput").setValue(sDescription);
        
              },
              showSameEntityConfirmationPopup: function() {
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


          
        });
    },
    
    





);