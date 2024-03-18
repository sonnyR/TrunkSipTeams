import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CallForwardingDto } from 'src/app/Model/call-forwarding-dto.@model';
import { User } from 'src/app/Model/user.model';
import { WebexService } from 'src/app/services/webex.service';

@Component({
  selector: 'app-configure-call-forwarding-for-people',
  templateUrl: './configure-call-forwarding-for-people.component.html',
  styleUrls: ['./configure-call-forwarding-for-people.component.css']
})
export class ConfigureCallForwardingForPeopleComponent implements OnInit {

  constructor(private activeModal: NgbActiveModal,private webexServices: WebexService, private formBuilder: FormBuilder, private toastr: ToastrService) { }
entID:string;
userid:string
orgId : string
personId : string
always = false;
busy = false;
noAnswer = false;
notReatchable = false;
configureCallForwardingForm: FormGroup
callForwarding : CallForwardingDto
numberOfRing : any = [];
submitted = false;
@Output() passEntry: EventEmitter<any> = new EventEmitter();
get f() { return this.configureCallForwardingForm.controls; }
  ngOnInit(): void {
  }
  Init(entID: string, orgId: any, user: User, userid: string) {
    this.entID = entID;
    this.userid = userid;
    this.orgId = orgId;
    this.personId = user.id;
    this.GetCallForwarding()
    this.GetNumbersUsers(entID,orgId,user.id)
  }
  close() {
    this.passEntry.emit("Closed");
    this.activeModal.dismiss();
  }
  checkAlways(event:any){
    if(event.target.checked){
    this.always = true
    this.noAnswer = false
    this.busy = false;
    this.configureCallForwardingForm.controls['tb_setPhoneAlways'].setValidators([Validators.required])
    this.configureCallForwardingForm.controls['tb_setPhoneAlways'].updateValueAndValidity()
    this.configureCallForwardingForm.controls["tb_setPhoneBusy"].clearValidators();
    this.configureCallForwardingForm.get('tb_setPhoneBusy').setValue('')
    this.configureCallForwardingForm.controls['tb_setPhoneBusy'].updateValueAndValidity()
    this.configureCallForwardingForm.get('tb_setPhoneBusy').setValue('')
    this.configureCallForwardingForm.get('tb_sendVioceMailBusy').setValue(false)
    this.configureCallForwardingForm.get('tb_setEnabledBusy').setValue(false)
    this.configureCallForwardingForm.controls['tb_setPhoneNoAnswer'].clearValidators()
    this.configureCallForwardingForm.controls['tb_setPhoneNoAnswer'].updateValueAndValidity()
    this.configureCallForwardingForm.get('tb_setPhoneNoAnswer').setValue('')
    this.configureCallForwardingForm.get('tb_sendVioceMailNoAnswer').setValue(false)
    this.configureCallForwardingForm.get('tb_setEnabledNoAnswer').setValue(false)
    //this.configureCallForwardingForm.value["tb_sendVioceMailNoAnswer"] = false;
    //this.configureCallForwardingForm.value["tb_sendVioceMailBusy"] = false;
    }
    else{
      this.always = false
      this.configureCallForwardingForm.controls['tb_setPhoneAlways'].clearValidators()
      this.configureCallForwardingForm.controls['tb_setPhoneAlways'].updateValueAndValidity()
     
    this.configureCallForwardingForm.get('tb_setPhoneAlways').setValue('')
    this.configureCallForwardingForm.get('tb_sendVioceMailAlways').setValue(false)
    this.configureCallForwardingForm.get('tb_setEnabledAlways').setValue(false)

    }
  }
  checkBusy(event:any){
    if(event.target.checked){
    this.busy = true
    this.configureCallForwardingForm.controls['tb_setPhoneBusy'].setValidators([Validators.required])
    this.configureCallForwardingForm.controls['tb_setPhoneBusy'].updateValueAndValidity()
    this.configureCallForwardingForm.controls['tb_setPhoneAlways'].clearValidators()
    this.configureCallForwardingForm.controls['tb_setPhoneAlways'].updateValueAndValidity()
    this.configureCallForwardingForm.get('tb_setPhoneAlways').setValue('')
    this.configureCallForwardingForm.get('tb_sendVioceMailAlways').setValue(false)
    this.configureCallForwardingForm.get('tb_setEnabledAlways').setValue(false)

    }
    else{
      this.busy = false
      this.configureCallForwardingForm.controls["tb_setPhoneBusy"].clearValidators();
      this.configureCallForwardingForm.controls['tb_setPhoneBusy'].updateValueAndValidity()
      this.configureCallForwardingForm.get('tb_setPhoneBusy').setValue('')
      this.configureCallForwardingForm.get('tb_sendVioceMailBusy').setValue(false)
      this.configureCallForwardingForm.get('tb_setEnabledBusy').setValue(false)
    }
  }
  checkNoAnswer(event:any){
    if(event.target.checked){
this.noAnswer = true
this.configureCallForwardingForm.controls['tb_setPhoneNoAnswer'].setValidators([Validators.required])
this.configureCallForwardingForm.controls['tb_setPhoneNoAnswer'].updateValueAndValidity()
this.configureCallForwardingForm.controls['tb_setPhoneAlways'].clearValidators()
this.configureCallForwardingForm.controls['tb_setPhoneAlways'].updateValueAndValidity()
this.configureCallForwardingForm.get('tb_setPhoneAlways').setValue('')
this.configureCallForwardingForm.get('tb_sendVioceMailAlways').setValue(false)
this.configureCallForwardingForm.get('tb_setEnabledAlways').setValue(false)
    }
    else{
      this.noAnswer = false
      this.configureCallForwardingForm.controls['tb_setPhoneNoAnswer'].clearValidators()
this.configureCallForwardingForm.controls['tb_setPhoneNoAnswer'].updateValueAndValidity()
this.configureCallForwardingForm.get('tb_setPhoneNoAnswer').setValue('')
this.configureCallForwardingForm.get('tb_sendVioceMailNoAnswer').setValue(false)
this.configureCallForwardingForm.get('tb_setEnabledNoAnswer').setValue(false)

    }
  }
  checkNotReatchable(event:any){
    if(event.target.checked){
this.notReatchable = true
this.configureCallForwardingForm.controls['tb_setPhoneNotReachable'].setValidators([Validators.required])
this.configureCallForwardingForm.controls['tb_setPhoneNotReachable'].updateValueAndValidity()
    }
    else{
      this.notReatchable = false
      this.configureCallForwardingForm.controls['tb_setPhoneNotReachable'].clearValidators()
      this.configureCallForwardingForm.controls['tb_setPhoneNotReachable'].updateValueAndValidity()
      this.configureCallForwardingForm.value["tb_sendVioceMailNotReachable"] = false;
    }
  }
  GetCallForwarding() {
    this.webexServices.GetCallForwarding(this.personId, this.orgId)
      .subscribe(data => {
        if (data["status"] == "success") {
          this.callForwarding = data["result"] as CallForwardingDto;
          if(this.callForwarding.callForwarding.always.enabled) this.always = true
          if(this.callForwarding.callForwarding.busy.enabled) this.busy = true
          if(this.callForwarding.callForwarding.noAnswer.enabled) this.noAnswer = true
          if(this.callForwarding.businessContinuity.enabled) this.notReatchable = true
          for(var ring =0; ring<= this.callForwarding.callForwarding.noAnswer.systemMaxNumberOfRings;ring++){

          ring == 1 ? '' : this.numberOfRing.push(ring);

          }
          this.configureCallForwardingForm = this.formBuilder.group({
            tb_setPhoneAlways: [this.callForwarding.callForwarding.always.destination,[this.callForwarding.callForwarding.always.enabled?Validators.required : Validators.nullValidator]],
            tb_setEnabledAlways: [this.callForwarding.callForwarding.always.enabled],
            tb_setPhoneBusy: [this.callForwarding.callForwarding.busy.destination,[this.callForwarding.callForwarding.busy.enabled?Validators.required :Validators.nullValidator]],
            tb_setEnabledBusy: [this.callForwarding.callForwarding.busy.enabled],
            tb_setPhoneNoAnswer: [this.callForwarding.callForwarding.noAnswer.destination,[this.callForwarding.callForwarding.noAnswer.enabled?Validators.required :Validators.nullValidator]],
            tb_setEnabledNoAnswer: [this.callForwarding.callForwarding.noAnswer.enabled],
            tb_setPhoneNotReachable: [this.callForwarding.businessContinuity.destination,[this.callForwarding.businessContinuity.enabled?Validators.required :Validators.nullValidator]],
            tb_setEnabledNotReachable: [this.callForwarding.businessContinuity.enabled],
            tb_sendVioceMailAlways: [this.callForwarding.callForwarding.always.destinationVoicemailEnabled],
            tb_sendVioceMailBusy: [this.callForwarding.callForwarding.busy.destinationVoicemailEnabled],
            tb_sendVioceMailNoAnswer: [this.callForwarding.callForwarding.noAnswer.destinationVoicemailEnabled],
            tb_numberOfRingsNoAnswer: [this.callForwarding.callForwarding.noAnswer.numberOfRings],
            tb_sendVioceMailNotReachable:[this.callForwarding.businessContinuity.destinationVoicemailEnabled]
          });
          
        }
        else {
             this.configureCallForwardingForm = this.formBuilder.group({
      tb_setPhoneAlways: [''],
      tb_setEnabledBusy:[false],
      tb_setEnabledAlways:[false],
      tb_setEnabledNoAnswer:[false],
      tb_setEnabledNotReachable:[false],
      tb_setPhoneBusy: [''],
      tb_setPhoneNoAnswer: [''],
      tb_setPhoneNotReachable: [''],
      tb_sendVioceMailAlways: [false],
      tb_sendVioceMailBusy: [false],
      tb_sendVioceMailNoAnswer: [false],
      tb_numberOfRingsNoAnswer: [''],
      tb_sendVioceMailNotReachable:[false]
    });
          var str: string = data["message"];
          if (data["erreur"] != null) { str + " " + data["erreur"] }
          alert(str);
        }
      }, error => {
           this.configureCallForwardingForm = this.formBuilder.group({
      tb_setPhoneAlways: [''],
      tb_setEnabledBusy:[false],
      tb_setEnabledAlways:[false],
      tb_setEnabledNoAnswer:[false],
      tb_setEnabledNotReachable:[false],
      tb_setPhoneBusy: [''],
      tb_setPhoneNoAnswer: [''],
      tb_setPhoneNotReachable: [''],
      tb_sendVioceMailAlways: [false],
      tb_sendVioceMailBusy: [false],
      tb_sendVioceMailNoAnswer: [false],
      tb_numberOfRingsNoAnswer: [''],
      tb_sendVioceMailNotReachable:[false]
    });
        var str: string = error["error"]["message"];
        str = str + ":  " + error["error"]["erreur"]
      });
  }
  configureCallForwarding() {
    this.submitted = true;
    if (this.configureCallForwardingForm.invalid) {
      return;
    }
    this.callForwarding.userOperation  = this.userid;
  this.callForwarding.callForwarding.always.enabled = this.configureCallForwardingForm.value["tb_setEnabledAlways"] 
  this.callForwarding.callForwarding.always.destination = this.configureCallForwardingForm.value["tb_setPhoneAlways"] 
  this.callForwarding.callForwarding.always.destinationVoicemailEnabled = this.configureCallForwardingForm.value["tb_sendVioceMailAlways"] 
  this.callForwarding.callForwarding.busy.enabled = this.configureCallForwardingForm.value["tb_setEnabledBusy"]
  this.callForwarding.callForwarding.busy.destination = this.configureCallForwardingForm.value["tb_setPhoneBusy"]
  this.callForwarding.callForwarding.busy.destinationVoicemailEnabled = this.configureCallForwardingForm.value["tb_sendVioceMailBusy"]
  this.callForwarding.callForwarding.noAnswer.enabled = this.configureCallForwardingForm.value["tb_setEnabledNoAnswer"]
  this.callForwarding.callForwarding.noAnswer.destination = this.configureCallForwardingForm.value["tb_setPhoneNoAnswer"]
  this.callForwarding.callForwarding.noAnswer.destinationVoicemailEnabled = this.configureCallForwardingForm.value["tb_sendVioceMailNoAnswer"]
  this.callForwarding.callForwarding.noAnswer.numberOfRings = this.configureCallForwardingForm.value["tb_numberOfRingsNoAnswer"]
  this.callForwarding.businessContinuity.destination = this.configureCallForwardingForm.value["tb_setPhoneNotReachable"]
  this.callForwarding.businessContinuity.enabled = this.configureCallForwardingForm.value["tb_setEnabledNotReachable"]
  this.callForwarding.businessContinuity.destinationVoicemailEnabled = this.configureCallForwardingForm.value["tb_sendVioceMailNotReachable"]
  console.log("aaaaaaaaaaa",this.callForwarding)
  this.webexServices.ConfigureCallForwarding(this.callForwarding, this.orgId,this.personId)
        .subscribe(data => {
          if (data != null && data["status"] == "success") {
            this.toastr.success('Les modifications apportées aux paramètres d’appel ont été enregistrées.');
            this.close();
          }
          else {
            var str: string = data["message"];
           str= str + ": " + data["erreur"] 
           this.toastr.error("une erreur technique est survenue")

          }
        }, error => {
            var str: string = error["error"]["message"];
            str = str + ":  " + error["error"]["erreur"];
            this.toastr.error("une erreur technique est survenue")

          }
        );
  }
  numberPhoneControl(event: any, control: AbstractControl) {
    const pattern = /[0-9\ ]/;
    return (event.charCode === 0 || pattern.test(String.fromCharCode(event.charCode)))&& (control?.value?.length != 15);
  }
  listPhoneNumberUser: any = [];
  idLocationUser:string
GetNumbersUsers(entId: string, orgId: string, ownerId: string) {
  this.webexServices.GetNumbersUsers(entId, orgId, ownerId)
    .subscribe(data => {
      if (data["status"] == "success") {
        this.listPhoneNumberUser = data["result"];
        let list: any = [];
        this.idLocationUser = this.listPhoneNumberUser[0]["location"]["id"]
     
        this.getPhoneNumbersLocation(this.idLocationUser)
        if (list[0] == null) list[0] = "Aucun";
       
      }
      else {
       this.toastr.error("une erreur technique est survenue")
      }
    }, error => {
      this.toastr.error("une erreur technique est survenue")
    });
}
numbersPhone : any = [];
getPhoneNumbersLocation(locationId: any) {

  this.webexServices.GetNumbersEntrepriseLoction(this.entID,this.orgId, locationId)
    .subscribe(data => {
      if (data["status"] == "success") {
        this.numbersPhone = data["result"]
        this.numbersPhone = this.numbersPhone.filter((e: any) => e["owner"] != null)
      }
      else {
        var str: string = data["message"];
       str =  data["erreur"] != null  ? str + " " + data["erreur"] : "" 
       this.toastr.error("une erreur technique est survenue")
      }
    }, error => {
      var str: string = error["error"]["message"];
      str = error["error"]["erreur"] != null ? str + " " + error["error"]["erreur"] : str
      this.toastr.error("une erreur technique est survenue")
    });
}
startsWithSearchFn(item:any, term:any) {
  return item.startsWith(term);
}

}
