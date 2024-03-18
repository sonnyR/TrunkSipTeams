import { ThisReceiver } from '@angular/compiler';
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BusinessContinuity } from 'src/app/Model/business-continuity.@model';
import { CallPolicies } from 'src/app/Model/call-policies.model';
import { HuntGroup } from 'src/app/Model/hunt-group.model';
import { NoAnswer } from 'src/app/Model/no-answer.@model';
import { PostPersonPlaceCallQueueDto } from 'src/app/Model/post-person-place-call-queue-dto.@model';
import { User } from 'src/app/Model/user.model';
import { WebexService } from 'src/app/services/webex.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-hunt-group',
  templateUrl: './edit-hunt-group.component.html',
  styleUrls: ['./edit-hunt-group.component.css']
})
export class EditHuntGroupComponent implements OnInit {

  orgId: string;
  userid: string;
  locationId: string;
  idCallPark: string;
  registerHuntGroupForm: FormGroup;
  submitted = false;
  huntGroup: HuntGroup
  users: User[] = [];
  entId: string
  numbersPhone: any = [];
  Destinationnumberforoverflow = false;
  numberPhoneTransfert: any = [];
  NumberAndUsers: any = []
  AnotherNumberPhone: any = []
  selectedFile: File;
  selectedFileName: string;
  userSelected: any = [];
  @ViewChild('fileInput') fileInput: ElementRef;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  constructor(private activeModal: NgbActiveModal, private webexServices: WebexService, private formBuilder: FormBuilder, private toastr: ToastrService) { }
  get f() { return this.registerHuntGroupForm.controls; }
  ngOnInit(): void {
  }
  Init(orgId: string, userid: string, locationId: string, idHuntGroupe: string,hunt:HuntGroup,agents) {
    this.orgId = orgId;
    this.userid = userid;
    this.locationId = locationId;
    this.agents = agents
    this.huntGroup = hunt;
    if (this.huntGroup.callPolicies.noAnswer.forwardEnabled) {
      this.showforwardCallAfterSetNumberOfRings = true;
    }
    if (this.huntGroup.callPolicies.noAnswer.nextAgentRings) {
      this.showhuntGroupRingAdvance = true;
    }
    if (this.huntGroup.callPolicies.businessContinuity.enabled) {
      this.showDestinationCallNoAnswered = true
    }
    if (this.huntGroup.callPolicies.policy == "WEIGHTED") {
      this.showCoefficient = true
    }
    if(this.huntGroup.agents.length!=0){
      this.tableUsersSelected = true
    }
     this.getPhoneNumbersLocation()
    this.registerHuntGroupForm = this.formBuilder.group({
      tb_Name: [this.huntGroup.name, Validators.required],
      tb_FirstName: [this.huntGroup.firstName, Validators.required],
      tb_LastName: [this.huntGroup.lastName, Validators.required],
      tb_PhoneNumber: [this.huntGroup.phoneNumber],
      tb_AnotherPhoneNumber: [this.huntGroup.phoneNumber],
      tb_extension: [this.huntGroup.extension, [Validators.pattern("^[0-9]*$"),
      Validators.minLength(2), Validators.maxLength(6)]],
      tb_policy: [this.huntGroup.callPolicies.policy],
      tb_enableHuntGroup: [this.huntGroup.enabled],
      tb_numberToForwardTo: [this.huntGroup.callPolicies.noAnswer.destination],
      tb_enableHuntGroupRingAdvance: [this.huntGroup.callPolicies.noAnswer.nextAgentEnabled],
      tb_huntGroupRingAdvance: [this.huntGroup.callPolicies.noAnswer.nextAgentRings],
      tb_numberOfRings: [this.huntGroup.callPolicies.noAnswer.numberOfRings],
      tb_advanceWhenBusy: [this.huntGroup.callPolicies.waitingEnabled],
      tb_forwardCallAfterSetNumberOfRings: [this.huntGroup.callPolicies.noAnswer.forwardEnabled],
      tb_sendToVoicemail: [this.huntGroup.callPolicies.noAnswer.destinationVoicemailEnabled],
      tb_divertCallWhenUnreachable: [this.huntGroup.callPolicies.businessContinuity.enabled],
      tb_numberToDivertTo: [this.huntGroup.callPolicies.businessContinuity.destination],
      tb_agents: [this.agents],
      formCoefAndNiv: this.formBuilder.array([])

    });
  }
  getPhoneNumbersLocation() {
    this.webexServices.GetNumbersEntrepriseLoction(this.entId, this.orgId, this.locationId)
      .subscribe(data => {
        if (data["status"] == "success") {
          this.numbersPhone = data["result"];
          this.numbersPhone = this.numbersPhone.filter((e: any) => e["owner"] == null)
          this.numberPhoneTransfert = data["result"];
          this.numberPhoneTransfert = this.numberPhoneTransfert.filter((e: any) => e["owner"] != null)
          this.NumberAndUsers = this.numberPhoneTransfert.filter((e: any) => e["owner"] != null && e.owner.type == "PEOPLE")
          this.AnotherNumberPhone = this.numbersPhone
          this.huntGroup.agents.forEach(e => {
            const coefNivForm = this.formBuilder.group({
              tb_weight: [e.weight],
            });
            this.formCoefAndNiv.push(coefNivForm);
            this.userSelected.push(this.NumberAndUsers.filter(us => us.owner.id == e.id)[0])
          })
        }
        else {
          var str: string = data["message"];
          str = data["erreur"] != null ? str + " " + data["erreur"] : ""
          this.toastr.error("une erreur technique est survenue")

        }
      }, error => {
        var str: string = error["error"]["message"];
        str = error["error"]["erreur"] != null ? str + " " + error["error"]["erreur"] : str
        this.toastr.error("une erreur technique est survenue")

      });
  }
  agents : any = []

  logObservable(agents : any) {
    this.huntGroup.agents.forEach(e => {
      const coefNivForm = this.formBuilder.group({
        tb_weight: [e.weight],
      });
      this.formCoefAndNiv.push(coefNivForm);
      agents.push(e.id);
      this.userSelected.push(this.NumberAndUsers.filter(us => us.owner.id == e.id)[0])
    })
    return agents;
  }
  obligatoireExtension = true;
  extensionControl(event: any) {
    const pattern = /[0-9\ ]/;
    return (event.charCode === 0 || pattern.test(String.fromCharCode(event.charCode)));
  }
  setExtensionOblige(number: any) {
    if (number == "" || number == null || undefined) {
      this.obligatoireExtension = true;
      this.registerHuntGroupForm.controls["tb_extension"].setValidators([Validators.required, Validators.pattern("^[0-9]*$"),
      Validators.minLength(2), Validators.maxLength(6)]);
      this.registerHuntGroupForm.controls['tb_extension'].updateValueAndValidity();
      this.AnotherNumberPhone = this.numbersPhone
    }
    else {
      this.obligatoireExtension = false;
      this.registerHuntGroupForm.controls["tb_extension"].clearValidators();
      this.registerHuntGroupForm.controls['tb_extension'].updateValueAndValidity();
      this.AnotherNumberPhone = this.AnotherNumberPhone.filter(e=>e.phoneNumber != number)
    }
  }
  selectAnotherPhoneNumber(number: any) {
    if (number == "" || number == null || undefined) {
     
    
      this.numbersPhone = this.AnotherNumberPhone 
    }
    else {
      
      this.numbersPhone = this.numbersPhone.filter(e=>e.phoneNumber != number)
    }
  }
  startsWithSearchFn(item: any, term: any) {
    return item.startsWith(term);
  }
  close() {
    this.passEntry.emit("Closed");
    this.activeModal.dismiss();
  }
  showhuntGroupRingAdvance = false
  affichehuntGroupRingAdvance(event: any) {
    this.showhuntGroupRingAdvance = !this.showhuntGroupRingAdvance;
    if (event.target.checked) {
      this.registerHuntGroupForm.controls['tb_huntGroupRingAdvance'].setValidators([Validators.required, Validators.min(1), Validators.max(20)])
      this.registerHuntGroupForm.controls['tb_huntGroupRingAdvance'].updateValueAndValidity()
    }
    else {
      this.registerHuntGroupForm.controls['tb_huntGroupRingAdvance'].clearValidators()
      this.registerHuntGroupForm.controls['tb_huntGroupRingAdvance'].updateValueAndValidity()
    }
  }
  showforwardCallAfterSetNumberOfRings = false
  afficheforwardCallAfterSetNumberOfRings(event: any) {
    this.showforwardCallAfterSetNumberOfRings = !this.showforwardCallAfterSetNumberOfRings;
    if (event.target.checked) {
      this.registerHuntGroupForm.controls['tb_numberOfRings'].setValidators([Validators.required, Validators.min(1), Validators.max(99)])
      this.registerHuntGroupForm.controls['tb_numberOfRings'].updateValueAndValidity()
      this.registerHuntGroupForm.controls['tb_numberToForwardTo'].setValidators([Validators.required])
      this.registerHuntGroupForm.controls['tb_numberToForwardTo'].updateValueAndValidity()
    }
    else {
      this.registerHuntGroupForm.controls['tb_numberOfRings'].clearValidators()
      this.registerHuntGroupForm.controls['tb_numberOfRings'].updateValueAndValidity()
      this.registerHuntGroupForm.controls['tb_numberToForwardTo'].clearValidators()
      this.registerHuntGroupForm.controls['tb_numberToForwardTo'].updateValueAndValidity()

    }
  }
  showDestinationCallNoAnswered = false
  afficheDestinationCallNoAnswered(event: any) {
    this.showDestinationCallNoAnswered = !this.showDestinationCallNoAnswered;
    if (event.target.checked) {
      this.registerHuntGroupForm.controls['tb_numberToDivertTo'].setValidators([Validators.required])
      this.registerHuntGroupForm.controls['tb_numberToDivertTo'].updateValueAndValidity()

    }
    else {

      this.registerHuntGroupForm.controls['tb_numberToDivertTo'].clearValidators()
      this.registerHuntGroupForm.controls['tb_numberToDivertTo'].updateValueAndValidity()
    }
  }
  get formCoefAndNiv() {
    return this.registerHuntGroupForm.controls["formCoefAndNiv"] as FormArray;
  }
  tableUsersSelected = false
  selectedUser(users: any) {
   
    const coefNivForm = this.formBuilder.group({
      tb_weight: [''],
      tb_skillLevel: ['']
    });
    this.formCoefAndNiv.push(coefNivForm);
    this.formCoefAndNiv.reset()
    if (users.length != 0) {
      this.userSelected = []

      users.forEach(user => {
        var numUser = this.NumberAndUsers.filter(e => e.owner.id == user)
        this.userSelected.push(numUser[0])
        if (this.registerHuntGroupForm.value["tb_policy"] == 'WEIGHTED') {
          var coff = (100 / (this.userSelected.length)).toString()
          this.formCoefAndNiv.controls.forEach(x => {
            (x as FormGroup).controls['tb_weight'].setValue(coff);
          })
        }

      })
      this.tableUsersSelected = true
    }
    else {
      while (this.formCoefAndNiv.length !== 0) {
        this.formCoefAndNiv.removeAt(0)
      }
      this.userSelected = []
      
      this.tableUsersSelected = false
    }
  }
  showCoefficient = false;
  pendrePolicy(event: any) {
    if (event.target.value == 'WEIGHTED') {
      this.showCoefficient = true

    }
    else {
      this.showCoefficient = false
    }
  }
  DeleteUser(numUser: any, index: number) {

    this.userSelected = this.userSelected.filter(e => e.owner.id != numUser.owner.id)
    this.formCoefAndNiv.removeAt(index)

    var uuu = []
    this.formCoefAndNiv.reset()
    this.userSelected.forEach(e => {

      uuu.push(e.owner.id)
      if (this.registerHuntGroupForm.value["tb_policy"] == 'WEIGHTED') {
        var coff = (100 / (this.userSelected.length)).toString()
        this.formCoefAndNiv.controls.forEach(x => {
          (x as FormGroup).controls['tb_weight'].setValue(coff);
        })
      }


    })
    this.registerHuntGroupForm.controls['tb_agents'].setValue(uuu)
    if (this.userSelected.length == 0) {
      this.tableUsersSelected = false
    }
  }
  onUpdateHuntGroup() {
    this.submitted = true;
    if (this.registerHuntGroupForm.invalid) {
      return;
    }
    this.huntGroup.name = this.registerHuntGroupForm.value["tb_Name"];
    this.huntGroup.enabled = this.registerHuntGroupForm.value["tb_enableHuntGroup"];
    this.huntGroup.firstName = this.registerHuntGroupForm.value["tb_FirstName"];
    this.huntGroup.lastName = this.registerHuntGroupForm.value["tb_LastName"];
    this.huntGroup.phoneNumber = this.registerHuntGroupForm.value["tb_PhoneNumber"] != "" ? this.registerHuntGroupForm.value["tb_PhoneNumber"] : null
    this.huntGroup.extension = this.registerHuntGroupForm.value["tb_extension"] != "" ? this.registerHuntGroupForm.value["tb_extension"] : null
    this.huntGroup.phoneNumberForOutgoingCallsEnabled = this.registerHuntGroupForm.value["tb_phoneNumberForOutgoingCallsEnabled"];
    this.huntGroup.languageCode = "fr_fr"
    this.huntGroup.timeZone = "Europe/Paris"
    this.huntGroup.callPolicies = new CallPolicies();
    this.huntGroup.callPolicies.policy = this.registerHuntGroupForm.value["tb_policy"];
    this.huntGroup.callPolicies.waitingEnabled = this.registerHuntGroupForm.value["tb_advanceWhenBusy"];
    this.huntGroup.callPolicies.noAnswer = new NoAnswer()
    this.huntGroup.callPolicies.noAnswer.nextAgentEnabled = this.registerHuntGroupForm.value["tb_enableHuntGroupRingAdvance"];
    this.huntGroup.callPolicies.noAnswer.nextAgentRings = this.registerHuntGroupForm.value["tb_huntGroupRingAdvance"] != "" ? this.registerHuntGroupForm.value["tb_huntGroupRingAdvance"] : null;
    this.huntGroup.callPolicies.noAnswer.forwardEnabled = this.registerHuntGroupForm.value["tb_forwardCallAfterSetNumberOfRings"];
    if (this.huntGroup.callPolicies.noAnswer.forwardEnabled) {
      this.huntGroup.callPolicies.noAnswer.numberOfRings = this.registerHuntGroupForm.value["tb_numberOfRings"];
      this.huntGroup.callPolicies.noAnswer.destination = this.registerHuntGroupForm.value["tb_numberToForwardTo"];
      this.huntGroup.callPolicies.noAnswer.destinationVoicemailEnabled = this.registerHuntGroupForm.value["tb_sendToVoicemail"];
    }
    else{
      this.huntGroup.callPolicies.noAnswer.destination = null
      this.huntGroup.callPolicies.noAnswer.destinationVoicemailEnabled = null
    }
    this.huntGroup.callPolicies.businessContinuity = new BusinessContinuity();
    this.huntGroup.callPolicies.businessContinuity.enabled = this.registerHuntGroupForm.value["tb_divertCallWhenUnreachable"];
    if (this.huntGroup.callPolicies.businessContinuity.enabled) {
      this.huntGroup.callPolicies.businessContinuity.destination = this.registerHuntGroupForm.value["tb_numberToDivertTo"];
    }
    this.huntGroup.agents = [];
    var postPers: PostPersonPlaceCallQueueDto = new PostPersonPlaceCallQueueDto();
    if (this.registerHuntGroupForm.value["tb_agents"] != "") {
      this.registerHuntGroupForm.value["tb_agents"].forEach((e: string, index) => {
        postPers = new PostPersonPlaceCallQueueDto()
        postPers.id = e;
        postPers.weight = this.formCoefAndNiv?.at(index)?.value["tb_weight"]
        this.huntGroup.agents.push(postPers);
      })
    }
    else this.huntGroup.agents = null
    this.webexServices.UpdateHuntGroup(this.huntGroup, this.orgId, this.locationId)
      .subscribe(data => {
        if (data != null && data["status"] == "success") {

          this.close();
          this.toastr.success('le hunt group ' + this.huntGroup.name + ' est modifié avec succée', '', {
            positionClass: 'toast-top-right'
          });
        }
        else {
          var str: string = data["message"];
          if (data["status"] == "conflict") {
            str = str
          }
          else {
            str = str + ": " + data["erreur"]
          }

          Swal.fire({
            icon: 'error',
            text: str
          })
        }
      }, error => {
        var str: string = error["error"]["message"];
        str = str + ":  " + error["error"]["erreur"];
        this.toastr.error("une erreur technique est survenue")

      }
      );
  }

}
