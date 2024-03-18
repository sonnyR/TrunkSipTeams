import { AlternateNumbers } from "./alternate-numbers.@model"
import { CallPolicies } from "./call-policies.model"
import { PostPersonPlaceCallQueueDto } from "./post-person-place-call-queue-dto.@model"

export class HuntGroup {
    name: string
    phoneNumber: string
    extension: string
    firstName: string
    lastName: string
    languageCode:string
    timeZone:string
    callPolicies: CallPolicies   
    // queueSettings: QueueSettings 
    agents: PostPersonPlaceCallQueueDto[]
    enabled: boolean
    phoneNumberForOutgoingCallsEnabled: boolean
    allowAgentJoinEnabled: boolean
    locationId : string
    id:string;
    alternateNumbers : AlternateNumbers[]
}
