import { Address } from "./address.model";

export class Site {
    name: string;
    address : Address
    timeZone : string
    language : string
    emergencyLocationIdentifier : string
    announcementLanguage : string
    preferredLanguage : string
    userOperation : string;
}
