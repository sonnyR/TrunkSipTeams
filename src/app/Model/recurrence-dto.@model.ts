import { RecurWeeklyDto } from "./recur-weekly-dto.@model"
import { RecurYearlyByDateDto } from "./recur-yearly-by-date-dto.@model"
import { RecurYearlyByDayDto } from "./recur-yearly-by-day-dto.@model"

export class RecurrenceDto {
    recurForEver:boolean
    recurEndDate:string
    recurWeekly : RecurWeeklyDto
    recurYearlyByDate:RecurYearlyByDateDto
    recurYearlyByDay:RecurYearlyByDayDto
}
