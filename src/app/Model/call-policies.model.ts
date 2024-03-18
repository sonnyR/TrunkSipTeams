import { BusinessContinuity } from "./business-continuity.@model";
import { NoAnswer } from "./no-answer.@model";

export class CallPolicies {
    policy : string;
    routingType : string;
    waitingEnabled:boolean;
    noAnswer : NoAnswer;
    businessContinuity : BusinessContinuity;


}
