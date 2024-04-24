namespace models;


using { cuid, managed} from '@sap/cds/common';



type FieldType : String enum {
  boolean;
  int;
  float; 
  string
}


entity Field : cuid, managed {
    key ID       : String;
    value       : String;
    type        : String;
    fld         : Association to Entity; // Many-to-one association
    annotations : String ;
    iskey       : Boolean;


}


entity Entity : cuid, managed {
    key ID       : String;
    name        : String;
    fields      : Association to many Field on fields.fld = $self;


}
entity Association :cuid, managed{
  entitySource : Association to Entity;
  entityTarget  : Association to Entity;
  type : String;


}


