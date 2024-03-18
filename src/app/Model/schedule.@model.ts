import { Event } from "./event.@model"

export class Schedule {
    id :string
    name :string
    locationName :string
    locationId :string
    type :string
    events :Event[]
}
