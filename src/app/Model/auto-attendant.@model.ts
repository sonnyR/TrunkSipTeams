import { AfterHoursMenu } from "./after-hours-menu.model"
import { BusinessHoursMenu } from "./business-hours-menu.model"

export class AutoAttendant {
    name: string
    id: string
    phoneNumber: string
    extension: string
    firstName: string
    lastName: string
    languageCode:string
    timeZone:string
    locationId:string
    businessSchedule:any
    holidaySchedule:string
    businessHoursMenu:BusinessHoursMenu;
    afterHoursMenu:AfterHoursMenu;
    extensionDialing:string;
    nameDialing:string;
}
