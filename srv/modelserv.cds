using models from '../db/src/schema.cds';
service modelsService{


  entity Entity as projection on models.Entity;

    

    entity Field as projection on models.Field;
     entity Association as projection on models.Association;

    action appendTextToFile(content: String) returns { success: Boolean };
    action ExecuteCommand (command: String,directory: String);
    action appendServiceToFile(content: String) returns { success: Boolean };










}