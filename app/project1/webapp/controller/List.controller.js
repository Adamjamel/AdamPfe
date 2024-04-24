sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/f/library",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox"


],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageToast, fioriLibrary, Filter, FilterOperator,MessageBox) {
        "use strict";

        return Controller.extend("app.project1.controller.List", {
            onInit: function () {
                this._oTable = this.byId("table0");
                /*  var oDetailModel = new sap.ui.model.json.JSONModel();
                 this.getView().setModel(oDetailModel, "detailModel");
                */
               /*   this.oCheckBox = this.byId("checkbox");

                 // Récupérer la référence des inputs que vous souhaitez contrôler
                 this.oInput1 = this.byId("namespace");
                 this.oInput2 = this.byId("EntityID");
             
                 // Attacher un gestionnaire d'événement au changement de la case à cocher
                 this.oCheckBox.attachSelect(this.onCheckBoxSelect, this);
 */

            },
           /*  onCheckBoxSelect: function(oEvent) {
                var bSelected = oEvent.getParameter("selected");
            
                // Mettre à jour la visibilité des inputs en fonction de l'état de la case à cocher
                if (bSelected) {
                    this.oInput1.setVisible(true);
                    this.oInput2.setVisible(true);
                } else {
                    this.oInput1.setVisible(false);
                    this.oInput2.setVisible(false);
                }
            }, */
            _validateInput: function (oInput) {
                var sValueState = "None";
                var bValidationError = false;
                var oBinding = oInput.getBinding("value");
    
                try {
                    oBinding.getType().validateValue(oInput.getValue());
                } catch (oException) {
                    sValueState = "Error";
                    bValidationError = true;
                }
    
                oInput.setValueState(sValueState);
    
                return bValidationError;
            },
            onCreate: function () {

                const oList = this._oTable;
                const oBinding = oList.getBinding("items");
                var oView = this.getView(),
				aInputs = [
				oView.byId("EntityID"),
				oView.byId("EntityNamee")
			],
				bValidationError = false;
			aInputs.forEach(function (oInput) {
				bValidationError = this._validateInput(oInput) || bValidationError;
			}, this);

			if (!bValidationError) {
                const oContext = oBinding.create({
                    "ID": this.byId("EntityID").getValue(),
                    "name": this.byId("EntityNamee").getValue(),


                });
				MessageToast.show("The input is validated. Your form has been submitted.");
			} else {
				MessageBox.alert("A validation error has occurred. Complete your input first.");
			}
               



            },
            onOpenAddDialog: function () {
                this.getView().byId("OpenDialog").open();
            },
            onCancelDialog: function (oEvent) {
                oEvent.getSource().getParent().close();
            },
            onEditMode: function () {
                this.byId("editModeButton").setVisible(false);
                this.byId("saveButton").setVisible(true);
                this.byId("deleteButton").setVisible(true);
                this.rebindTable(this.oEditableTemplate, "Edit");
            },
            onDelete: function () {

                var oSelected = this.byId("table0").getSelectedItem();
                if (oSelected) {
                    var oSalesOrder = oSelected.getBindingContext("mainModel").getObject().soNumber;

                    oSelected.getBindingContext("mainModel").delete("$auto").then(function () {
                        MessageToast.show(oSalesOrder + " SuccessFully Deleted");
                    }.bind(this), function (oError) {
                        MessageToast.show("Deletion Error: ", oError);
                    });
                } else {
                    MessageToast.show("Please Select a Row to Delete");
                }

            },
            onListItemPress: function (oEvent) {
                var oItem = oEvent.getSource();
                //var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                var oSelectedContext = oItem.getBindingContext("mainModel");
                var selectedObj = oSelectedContext.getObject();
                /// var oSelectedEntity = oSelectedContext.getProperty("name");
                /// var oSelectedEntityid = oSelectedContext.getProperty("ID"); 
                // Passer les données de l'entité sélectionnée à la deuxième vue et afficher cette vue
                // var oDetailView = this.getView().getParent().getParent().getMidColumnPages()[0];
                /*  oDetailView.setModel(new sap.ui.model.json.JSONModel(oSelectedEntity), "selectedEntityModel");
                 this.getView().getParent().getParent().setLayout(sap.f.LayoutType.TwoColumnsMidExpanded); */
                var oModel = this.getOwnerComponent().getModel("detailModel");
                oModel.setData(selectedObj);
                /// oModel.setProperty("/name", oSelectedEntity);
                /// oModel.setProperty("/id", oSelectedEntityid);





                this.getOwnerComponent().getRouter().navTo("Details", {
                    index: selectedObj.ID
                });
                var Model = this.getOwnerComponent().getModel("localModel");
                Model.setProperty("/layout", "TwoColumnsMidExpanded");






            },

            filterEntityById: function (id) {
                let oModel = this.getView().getModel();
                let aFilter = new sap.ui.model.Filter("ID", sap.ui.model.FilterOperator.EQ, id);

                oModel.bindList("{mainModel>/Entity}", undefined, undefined, [aFilter]).requestContexts().then(function (aContexts) {
                    aContexts.forEach(oContext => {
                        console.log(oContext.getObject());
                    });
                });
            },
            onSearch: function (oEvent) {
                // add filter for search
                var aFilters = [];
                var sQuery = oEvent.getSource().getValue();
                if (sQuery && sQuery.length > 0) {
                    var filter = new Filter("name", FilterOperator.Contains, sQuery);
                    aFilters.push(filter);
                }

                // update list binding
                var oUploadSet = this.byId("table0");
                var oBinding = oUploadSet.getBinding("items");
                oBinding.filter(aFilters, "Application");
            },
            onUpdate: function () {
                var oSelected = this.getView().byId("table0").getSelectedItem();
                if (oSelected) {
                    var oContext = oSelected.getBindingContext("mainModel");
                    if (oContext) {
                        var sNewName = this.getView().byId("EntityName").getValue();
                        oContext.setProperty("name", sNewName); // Assuming "name" is the property you want to update
                        var oModel = this.getView().getModel("mainModel");
                        oModel.submitBatch("yourGroupId").then(function () {
                            // Success callback
                            MessageToast.show("Update successful");
                        }).catch(function (oError) {
                            // Error callback
                            MessageToast.show("Update failed: " + oError.message);
                        });
                    } else {
                        MessageToast.show("Invalid Entity Name");
                    }
                } else {
                    MessageToast.show("Please select a row to update");
                }
            }


            ,



        });
    });