import { ProvisioningParameters } from "./provisioning-parameters.model";
import { PstnNumbers } from "./pstn-numbers.model";

export class User {
    id:string;
    customerId:string;
    firstName : string;
    lastName : string;
    displayName : string;
    package : string;
    email : string;
    site : string;
    phoneNumbers : PstnNumbers[];
    primaryPhoneNumber : string;
    locationId : string;
    emails : string[];
    roles : string[];
    status : string;
    typeUser: string;
    extension:string;
    orgId : string;
    created: Date;
    lastStatusChange : Date;
    siteID : string;
    userOpeartion : string;
    provisioningParameters : ProvisioningParameters
   

}
