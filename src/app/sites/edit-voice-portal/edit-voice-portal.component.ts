import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PassCode } from 'src/app/Model/pass-code.model';
import { VoicePortal } from 'src/app/Model/voice-portal.model';
import { WebexService } from 'src/app/services/webex.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-voice-portal',
  templateUrl: './edit-voice-portal.component.html',
  styleUrls: ['./edit-voice-portal.component.css']
})
export class EditVoicePortalComponent implements OnInit {
  locationId: string;
  submitted = false;
  @Input()
  entID: string;
  @Input()
  userid: string;
  @Input()
  orgId: string;
  voicePortal : VoicePortal;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  registerVoicePortalForm: FormGroup;
  numbersPhone: any = [];
  constructor(private webexServices : WebexService,private formBuilder: FormBuilder, private toastr: ToastrService) { }
  get f() { return this.registerVoicePortalForm.controls; }
  ngOnInit(): void {
     this.registerVoicePortalForm = this.formBuilder.group({
            tb_Name: [null],
            tb_extension: [null],
            tb_PhoneNumber: [null],
            tb_FirstName: [null],
            tb_LastName: [null],
            tb_newPasscode: [null],
            tb_confirmPasscode: [null]
          });
  }
  GetVoicePortal() {
    this.webexServices.GetVoicePortal(this.locationId, this.orgId)
      .subscribe(data => {
        if (data["status"] == "success") {
          this.voicePortal = data["result"] as VoicePortal;
          this.registerVoicePortalForm = this.formBuilder.group({
            tb_Name: [this.voicePortal.name,Validators.required],
            tb_extension: [this.voicePortal.extension,[Validators.required,Validators.pattern("^[0-9]*$"),
            Validators.minLength(2), Validators.maxLength(6)]],
            tb_PhoneNumber: [this.voicePortal.phoneNumber],
            tb_FirstName: [this.voicePortal.firstName,Validators.required],
            tb_LastName: [this.voicePortal.lastName,Validators.required],
            tb_newPasscode: [''],
            tb_confirmPasscode: ['']
          ,},
          
    {
      validator: this.ConfirmedValidator('tb_newPasscode', 'tb_confirmPasscode'),
    }
          
          );
        }
        else {
          var str: string = data["message"];
          if (data["erreur"] != null) { str + " " + data["erreur"] }
          alert(str);
        }
      }, error => {
        var str: string = error["error"]["message"];
        str = str + ":  " + error["error"]["erreur"]
      });
  }
  obligatoireExtension = true;
  setExtensionOblige(number: any) {
    if (number == "" || number == null) {
      this.obligatoireExtension = true;
      this.registerVoicePortalForm.controls["tb_extension"].setValidators([Validators.required, Validators.pattern("^[0-9]*$"),
      Validators.minLength(2), Validators.maxLength(6)]);
      this.registerVoicePortalForm.controls['tb_extension'].updateValueAndValidity();
    }
    else {
      this.obligatoireExtension = false;
      this.registerVoicePortalForm.controls["tb_extension"].clearValidators();
      this.registerVoicePortalForm.controls['tb_extension'].updateValueAndValidity();
    }
  }
  ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (
        matchingControl.errors &&
        !matchingControl.errors['confirmedValidator']
      ) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
  fillingFormVoicePortal(locationId: string,orgId:string) {
    this.locationId = locationId;
    this.orgId = orgId;
    this.GetVoicePortal();
    this.getPhoneNumbersLocation(locationId);
  }
  passcodeControl(event: any) {
    const pattern = /[0-9\ ]/;
    return (event.charCode === 0 || pattern.test(String.fromCharCode(event.charCode)));
  }
  onSubmit() {
    this.submitted = true;
    if (this.registerVoicePortalForm.invalid) {
      return;
    }
  this.voicePortal.name = this.registerVoicePortalForm.value["tb_Name"] != "" ? this.registerVoicePortalForm.value["tb_Name"]: null
  this.voicePortal.firstName = this.registerVoicePortalForm.value["tb_FirstName"] != "" ?this.registerVoicePortalForm.value["tb_FirstName"] : null
  this.voicePortal.lastName = this.registerVoicePortalForm.value["tb_LastName"] != "" ?this.registerVoicePortalForm.value["tb_LastName"]: null
  this.voicePortal.extension = this.registerVoicePortalForm.value["tb_extension"] != "" ?  this.registerVoicePortalForm.value["tb_extension"] : null
  this.voicePortal.phoneNumber = this.registerVoicePortalForm.value["tb_PhoneNumber"] != ""? this.registerVoicePortalForm.value["tb_PhoneNumber"]: null
  if(this.registerVoicePortalForm.value["tb_newPasscode"] != "" || this.registerVoicePortalForm.value["tb_newPasscode"] != "")
  {
    this.voicePortal.passcode = new PassCode();
    this.voicePortal.passcode.newPasscode = this.registerVoicePortalForm.value["tb_newPasscode"]
    this.voicePortal.passcode.confirmPasscode = this.registerVoicePortalForm.value["tb_confirmPasscode"]
  }

  this.voicePortal.languageCode = "fr_fr"
  this.voicePortal.language = 'French'
  this.voicePortal.userOperation = this.userid;
      this.webexServices.UpdateVoicePortal(this.voicePortal, this.orgId,this.locationId)
        .subscribe(data => {
          if (data != null && data["status"] == "success") {
            this.toastr.success('le portail vocal ' + this.voicePortal.name + ' est modifié avec succes');
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

  getPhoneNumbersLocation(locationId: any) {
    this.webexServices.GetNumbersEntrepriseLoction(this.entID, this.orgId, locationId)
      .subscribe(data => {
        if (data["status"] == "success") {
          this.numbersPhone = data["result"];
          this.numbersPhone = this.numbersPhone.filter((e: any) => e["phoneNumber"] != null && e["owner"] == null)
        }
        else {
          var str: string = data["message"];
          if (data["erreur"] != null) { str + " " + data["erreur"] }
          this.toastr.error("une erreur technique est survenue")

        }
      }, error => {
        this.toastr.error("une erreur technique est survenue")

      });
  }
  startsWithSearchFn(item:any, term:any) {
    return item.startsWith(term);
}
}
