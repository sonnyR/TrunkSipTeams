
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
  selector: 'app-add-hunt-group',
  templateUrl: './add-hunt-group.component.html',
  styleUrls: ['./add-hunt-group.component.css']
})
export class AddHuntGroupComponent implements OnInit {

  selected=false
  orgId: string;
  userid: string;
  locationId : string;
  registerHuntGroupForm: FormGroup;
  submitted = false;
  CallParkModel : any
  users : User[]=[];
  entId : string
  numbersPhone : any = [];
  Destinationnumberforoverflow = false;
  numberPhoneTransfert : any = [];
  NumberAndUsers : any = []
  selectedFile: File;
  selectedFileName: string;
  userSelected : any = [];
  @ViewChild('fileInput') fileInput: ElementRef;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  constructor(private activeModal: NgbActiveModal,private webexServices: WebexService,private formBuilder: FormBuilder,private toastr: ToastrService) { }
  get f() { return this.registerHuntGroupForm.controls; }
  ngOnInit(): void {
  }
  Init(entId : string,orgId: string, userid: string, locationId: string) {
    this.orgId = orgId;
    this.userid = userid;
    this.locationId = locationId;
    this.entId = entId;
    this.getPhoneNumbersLocation();
   // this.getNivAp()
    this.registerHuntGroupForm = this.formBuilder.group({
      tb_Name: ['', Validators.required],
      tb_FirstName: ['', Validators.required],
      tb_LastName: ['', Validators.required],
      tb_PhoneNumber: [''],
      tb_extension:['',[Validators.pattern("^[0-9]*$"),
      Validators.minLength(2), Validators.maxLength(6)]],
      tb_policy:['CIRCULAR'],
      tb_action : ['PERFORM_BUSY_TREATMENT',Validators.required],
      tb_numberToForwardTo:[''],
      tb_enableHuntGroupRingAdvance:[false],
      tb_huntGroupRingAdvance:[''],
      tb_numberOfRings:[15],
      tb_advanceWhenBusy:[true],
      tb_forwardCallAfterSetNumberOfRings:[false],
      tb_sendToVoicemail:[false],
      tb_divertCallWhenUnreachable:[false],
      tb_numberToDivertTo:[''],
      tb_agents:[''],
      formCoefAndNiv: this.formBuilder.array([])

    });
  }
  get formCoefAndNiv() {
    return this.registerHuntGroupForm.controls["formCoefAndNiv"] as FormArray;
  }
  getPhoneNumbersLocation() {
    this.webexServices.GetNumbersEntrepriseLoction(this.entId, this.orgId, this.locationId)
      .subscribe(data => {
        if (data["status"] == "success") {
          this.numbersPhone = data["result"];
          this.numbersPhone = this.numbersPhone.filter((e: any) => e["owner"] == null)
          this.numberPhoneTransfert = data["result"];
          this.numberPhoneTransfert = this.numberPhoneTransfert.filter((e: any) => e["owner"] != null)
          this.NumberAndUsers =this.numberPhoneTransfert.filter((e: any) => e["owner"] != null && e.owner.type=="PEOPLE")
         
       
    
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
  obligatoireExtension = true;
  extensionControl(event: any) {
    const pattern = /[0-9\ ]/;
    return (event.charCode === 0 || pattern.test(String.fromCharCode(event.charCode)));
  }
  setExtensionOblige(number: any) {
    if (number == "" || number == null) {
      this.obligatoireExtension = true;
      this.registerHuntGroupForm.controls["tb_extension"].setValidators([Validators.required, Validators.pattern("^[0-9]*$"),
      Validators.minLength(2), Validators.maxLength(6)]);
      this.registerHuntGroupForm.controls['tb_extension'].updateValueAndValidity();
    }
    else {
      this.obligatoireExtension = false;
      this.registerHuntGroupForm.controls["tb_extension"].clearValidators();
      this.registerHuntGroupForm.controls['tb_extension'].updateValueAndValidity();
    }
  }
  startsWithSearchFn(item:any, term:any) {
    return item.startsWith(term);
}
close() {
  this.passEntry.emit("Closed");
  this.activeModal.dismiss();
}
 showhuntGroupRingAdvance = false
affichehuntGroupRingAdvance(event:any){
this.showhuntGroupRingAdvance = !this.showhuntGroupRingAdvance;
if(event.target.checked){
  this.registerHuntGroupForm.controls['tb_huntGroupRingAdvance'].setValidators([Validators.required,Validators.min(1),Validators.max(20)])
  this.registerHuntGroupForm.controls['tb_huntGroupRingAdvance'].updateValueAndValidity()
}
else
{
  this.registerHuntGroupForm.controls['tb_huntGroupRingAdvance'].clearValidators()
  this.registerHuntGroupForm.controls['tb_huntGroupRingAdvance'].updateValueAndValidity()
}
}
showforwardCallAfterSetNumberOfRings = false
afficheforwardCallAfterSetNumberOfRings(event:any){
this.showforwardCallAfterSetNumberOfRings = !this.showforwardCallAfterSetNumberOfRings;
if(event.target.checked){
  this.registerHuntGroupForm.controls['tb_numberOfRings'].setValidators([Validators.required,Validators.min(1),Validators.max(99)])
  this.registerHuntGroupForm.controls['tb_numberOfRings'].updateValueAndValidity()
  this.registerHuntGroupForm.controls['tb_numberToForwardTo'].setValidators([Validators.required])
  this.registerHuntGroupForm.controls['tb_numberToForwardTo'].updateValueAndValidity()
}
else
{
  this.registerHuntGroupForm.controls['tb_numberOfRings'].clearValidators()
  this.registerHuntGroupForm.controls['tb_numberOfRings'].updateValueAndValidity()
  this.registerHuntGroupForm.controls['tb_numberToForwardTo'].clearValidators()
  this.registerHuntGroupForm.controls['tb_numberToForwardTo'].updateValueAndValidity()
}
}
showDestinationCallNoAnswered = false
afficheDestinationCallNoAnswered(event:any){
  this.showDestinationCallNoAnswered = !this.showDestinationCallNoAnswered;
  if(event.target.checked){
    this.registerHuntGroupForm.controls['tb_numberToDivertTo'].setValidators([Validators.required])
    this.registerHuntGroupForm.controls['tb_numberToDivertTo'].updateValueAndValidity()
   
  }
  else
  {
    
    this.registerHuntGroupForm.controls['tb_numberToDivertTo'].clearValidators()
    this.registerHuntGroupForm.controls['tb_numberToDivertTo'].updateValueAndValidity()
  }
  }
  tableUsersSelected = false
selectedUser(users:any){
  const coefNivForm = this.formBuilder.group({
    tb_weight: [''],
    tb_skillLevel: ['']
  });
  this.formCoefAndNiv.push(coefNivForm);

  this.formCoefAndNiv.reset()
  if(users.length!=0){
    this.userSelected = []
  
    users.forEach(user=>{
      var numUser = this.NumberAndUsers.filter(e=>e.owner.id == user)
      this.userSelected.push(numUser[0])
       if(this.registerHuntGroupForm.value["tb_policy"] == 'WEIGHTED'){
        var coff= (100/(this.userSelected.length)).toString()
        this.formCoefAndNiv.controls.forEach(x =>{
          (x as FormGroup).controls['tb_weight'].setValue(coff);
         })
      }
    
    })
    this.tableUsersSelected = true
  }
  else{
    while (this.formCoefAndNiv.length !== 0) {
      this.formCoefAndNiv.removeAt(0)
    }
    this.userSelected = []
    this.tableUsersSelected = false
  }
}
showCoefficient = false;
pendrePolicy(event:any){
  if(event.target.value == 'WEIGHTED'){
    this.showCoefficient = true
  }
  else{
    this.showCoefficient = false
  }
}
DeleteUser(numUser:any,index:number){
  
  this.userSelected = this.userSelected.filter(e=>e.owner.id != numUser.owner.id)
  this.formCoefAndNiv.removeAt(index)
  
  var uuu = []
  this.formCoefAndNiv.reset()
  this.userSelected.forEach(e=>{
   
    uuu.push(e.owner.id)
    if(this.registerHuntGroupForm.value["tb_policy"] == 'WEIGHTED'){
      var coff= (100/(this.userSelected.length)).toString()
      this.formCoefAndNiv.controls.forEach(x =>{
        (x as FormGroup).controls['tb_weight'].setValue(coff);
       })
    }
   
    
  })
  this.registerHuntGroupForm.controls['tb_agents'].setValue(uuu)
  if(this.userSelected.length ==0){
    this.tableUsersSelected = false
  }
}
onCreateHuntGroup(){
  this.submitted = true;
  if (this.registerHuntGroupForm.invalid) {
    return;
  }
  var huntGroup  = new HuntGroup()
  huntGroup.name = this.registerHuntGroupForm.value["tb_Name"];
  huntGroup.firstName = this.registerHuntGroupForm.value["tb_FirstName"];
  huntGroup.lastName = this.registerHuntGroupForm.value["tb_LastName"];
  huntGroup.phoneNumber = this.registerHuntGroupForm.value["tb_PhoneNumber"]!= ""?this.registerHuntGroupForm.value["tb_PhoneNumber"]:null
  huntGroup.extension = this.registerHuntGroupForm.value["tb_extension"]!= ""?this.registerHuntGroupForm.value["tb_extension"]:null
  huntGroup.phoneNumberForOutgoingCallsEnabled = this.registerHuntGroupForm.value["tb_phoneNumberForOutgoingCallsEnabled"];

  huntGroup.languageCode = "fr_fr"
  huntGroup.timeZone = "Europe/Paris"
  huntGroup.callPolicies = new CallPolicies();
  huntGroup.callPolicies.policy = this.registerHuntGroupForm.value["tb_policy"];
 huntGroup.callPolicies.waitingEnabled = this.registerHuntGroupForm.value["tb_advanceWhenBusy"];
 huntGroup.callPolicies.noAnswer = new NoAnswer()
 huntGroup.callPolicies.noAnswer.nextAgentEnabled = this.registerHuntGroupForm.value["tb_enableHuntGroupRingAdvance"];
 huntGroup.callPolicies.noAnswer.nextAgentRings = this.registerHuntGroupForm.value["tb_huntGroupRingAdvance"] != ""?this.registerHuntGroupForm.value["tb_huntGroupRingAdvance"]:null;
 huntGroup.callPolicies.noAnswer.forwardEnabled = this.registerHuntGroupForm.value["tb_forwardCallAfterSetNumberOfRings"];
 
  huntGroup.callPolicies.noAnswer.numberOfRings = this.registerHuntGroupForm.value["tb_numberOfRings"];
  huntGroup.callPolicies.noAnswer.destination = this.registerHuntGroupForm.value["tb_numberToForwardTo"];
  huntGroup.callPolicies.noAnswer.destinationVoicemailEnabled = this.registerHuntGroupForm.value["tb_sendToVoicemail"];

 huntGroup.callPolicies.businessContinuity = new BusinessContinuity();
 huntGroup.callPolicies.businessContinuity.enabled = this.registerHuntGroupForm.value["tb_divertCallWhenUnreachable"]
  huntGroup.callPolicies.businessContinuity.destination = this.registerHuntGroupForm.value["tb_numberToDivertTo"];
 huntGroup.agents = [];
var postPers : PostPersonPlaceCallQueueDto = new PostPersonPlaceCallQueueDto();
if(this.registerHuntGroupForm.value["tb_agents"]!= ""){
  this.registerHuntGroupForm.value["tb_agents"].forEach((e:string,index)=>{
    postPers = new PostPersonPlaceCallQueueDto()
    postPers.id = e;
    postPers.weight = this.formCoefAndNiv?.at(index)?.value["tb_weight"]
    huntGroup.agents.push(postPers);
  })
}
else huntGroup.agents=null
this.webexServices.CreateHuntGroup(huntGroup, this.orgId,this.locationId)
.subscribe(data => {
  if (data != null && data["status"] == "success") {
   
    this.close();
    this.toastr.success('le hunt group ' + huntGroup.name + ' est ajouté avec succée', '', {
      positionClass: 'toast-top-right'
    });
  }
  else {
    var str: string = data["message"];
    if(data["status"] == "conflict"){
      str= str 
    }
    else{
      str= str + ": " + data["erreur"] 
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
