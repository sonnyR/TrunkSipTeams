import { AlternateSourceMohMessageSettingCallQueue } from "./alternate-source-moh-message-setting-call-queue.@model";
import { NormalSourceMohMessageSettingCallQueue } from "./normal-source-moh-message-setting-call-queue.@model";

export class MohMessageSettingCallQueue {
    normalSource:NormalSourceMohMessageSettingCallQueue
    alternateSource:AlternateSourceMohMessageSettingCallQueue
}
