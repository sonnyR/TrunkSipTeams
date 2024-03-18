import { CallPolicies } from "./call-policies.model"
import { PostPersonPlaceCallQueueDto } from "./post-person-place-call-queue-dto.@model"
import { QueueSettings } from "./queue-settings.model"

export class CallQueue {
    name: string
    phoneNumber: string
    extension: string
    firstName: string
    lastName: string
    languageCode:string
    timeZone:string
    callPolicies: CallPolicies   
    queueSettings: QueueSettings 
    agents: PostPersonPlaceCallQueueDto[]
    enabled: boolean
    phoneNumberForOutgoingCallsEnabled: boolean
    allowAgentJoinEnabled: boolean
    locationId : string
    id:string;
    callingLineIdPolicy:string;
    callingLineIdPhoneNumber:string;
}
