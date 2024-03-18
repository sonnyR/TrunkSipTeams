import { Calling } from "./calling.model";
import { Meetings } from "./meetings.model";

export class ProvisioningParameters {
     calling : Calling
     meetings : Meetings
     firstName :string
     lastName :string
     primaryPhoneNumber :string
     extension :string
     locationId :string
}
