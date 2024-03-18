import { PassCode } from "./pass-code.model"

export class VoicePortal {
   id : string
   name : string
   language : string
   languageCode : string
   extension : string
   phoneNumber : string
   firstName : string
   lastName : string
   userOperation : string
   passcode : PassCode
}
