import { BusinessContinuity } from "./business-continuity.@model";
import { CallForwarding } from "./call-forwarding.@model";

export class CallForwardingDto {
    callForwarding : CallForwarding;
    businessContinuity : BusinessContinuity;
    userOperation : string

}
