import { AutoAttendant } from "./auto-attendant.@model";
import { Schedule } from "./schedule.@model";

export class ScheduleSVIDto {
    // id :string
    // name :string
    // locationName :string
    // locationId :string
    // type :string
      autoAttendant :AutoAttendant
     schedules : Schedule[]
}
