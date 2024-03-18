import { Address } from "./address.model"
import { CustomerInfo } from "./customer-info.model"
import { ProvisioningParameters } from "./provisioning-parameters.model"

export class EntrepriseDto {
   provisioningId :string
   externalId :string
   packages :string[]
   customerInfo : CustomerInfo
   address : Address
   ProvisioningParameters : ProvisioningParameters
   userOperation : string
}
