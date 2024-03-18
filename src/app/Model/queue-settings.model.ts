import { ComfortMessageBypassSettingCallQueue } from "./comfort-message-bypass-setting-call-queue.@model";
import { ComfortMessageQueueSettings } from "./comfort-message-queue-settings.model";
import { MohMessageSettingCallQueue } from "./moh-message-setting-call-queue.@model";
import { OverflowQueueSettings } from "./overflow-queue-settings.model"
import { WaitMessageQueueSettings } from "./wait-message-queue-settings.model";
import { WelcomeMessageQueueSettings } from "./welcome-message-queue-settings.model";
import { WhisperMessageSettingCallQueue } from "./whisper-message-setting-call-queue.@model";

export class QueueSettings {
    queueSize : number
    callOfferToneEnabled: boolean
    resetCallStatisticsEnabled:boolean
    overflow : OverflowQueueSettings;
    welcomeMessage : WelcomeMessageQueueSettings
    waitMessage : WaitMessageQueueSettings;
    comfortMessage : ComfortMessageQueueSettings;
    comfortMessageBypass:ComfortMessageBypassSettingCallQueue
    mohMessage : MohMessageSettingCallQueue;
    whisperMessage : WhisperMessageSettingCallQueue;

}
