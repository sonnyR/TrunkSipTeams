import { RecurrenceDto } from "./recurrence-dto.@model"

export class Event {
    name: string
    startDate: string
    endDate: string
    startTime: string
    endTime: string
    allDayEnabled: boolean
    recurrence : RecurrenceDto
    
    recurenceData : string
}

