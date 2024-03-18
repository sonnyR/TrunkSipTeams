import { Address } from "./address.model";

export class Location {
    name: string;
    address : Address
    timezone : string
    language : string
    emergencyLocationIdentifier : string
    numbers :  string[]
    mainNumber : string
    announcementLanguage : string
    preferredLanguage : string
}
