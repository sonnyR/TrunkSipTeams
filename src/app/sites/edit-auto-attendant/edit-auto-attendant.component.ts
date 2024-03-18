import { DatePipe, formatDate } from '@angular/common';
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { TimepickerConfig } from 'ngx-bootstrap/timepicker';
import { ToastrService } from 'ngx-toastr';
import { AfterHoursMenu } from 'src/app/Model/after-hours-menu.model';
import { AutoAttendant } from 'src/app/Model/auto-attendant.@model';
import { BusinessHoursMenu } from 'src/app/Model/business-hours-menu.model';
import { Event } from 'src/app/Model/event.@model';
import { KeyConfigurations } from 'src/app/Model/key-configurations.model';
import { RecurWeeklyDto } from 'src/app/Model/recur-weekly-dto.@model';
import { RecurYearlyByDateDto } from 'src/app/Model/recur-yearly-by-date-dto.@model';
import { RecurYearlyByDayDto } from 'src/app/Model/recur-yearly-by-day-dto.@model';
import { RecurrenceDto } from 'src/app/Model/recurrence-dto.@model';
import { ScheduleSVIDto } from 'src/app/Model/schedule-svidto.@model';
import { Schedule } from 'src/app/Model/schedule.@model';
import { WebexService } from 'src/app/services/webex.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-auto-attendant',
  templateUrl: './edit-auto-attendant.component.html',
  styleUrls: ['./edit-auto-attendant.component.css']
})
export class EditAutoAttendantComponent implements OnInit {
  orgId: string;
  userid: string;
  locationId: string;
  idCallPark: string;
  registerAutoAttendantForm: FormGroup;
  submitted = false;
  autoAttendant: AutoAttendant
  CallParkModel : any
  entId : string
  numbersPhone : any = [];
  Destinationnumberforoverflow = false;
  numberPhoneTransfert : any = [];
  NumberAndUsers : any = []
  selectedFile: File;
  selectedFileName: string;
  userSelected : any = [];

  listSchedulesBusinessHours : Schedule[] = [];
  listSchedulesHolidays : Schedule[] = [];
  schedule : Schedule = new Schedule();
  minTime: Date = new Date();
  maxTime: Date = new Date();
  listAction : any = []
  eventsHolidays : Event[] = [];
  listDays : any=[];
  listMonth : any=[];
  @ViewChild('fileInput') fileInput: ElementRef;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  constructor(private activeModal: NgbActiveModal,private webexServices: WebexService,private formBuilder: FormBuilder,private toastr: ToastrService) { 
  }
  get f() { return this.registerAutoAttendantForm.controls; }
  ngOnInit(): void {
  }
  Init(orgId: string, userid: string, locationId: string, idAutoAttendant: string) {
    this.orgId = orgId;
    this.userid = userid;
    this.locationId = locationId;
    this.GetDetailsAutoAttendant(idAutoAttendant);
    this.minTime.setHours(9, 0, 0);
    this.maxTime.setHours(17, 0, 0);
    this.getPhoneNumbersLocation();
    this.getListSchedules()
  this.listAction = [
    {name : 'Non utilisé',value : ''},
    {name : 'Transférer l’appel sans invite',value : 'TRANSFER_WITHOUT_PROMPT'},
    {name : 'Transférer l’appel avec invite',value : 'TRANSFER_WITH_PROMPT'},
    {name : 'Transférer l’appel à l’opérateur',value : 'TRANSFER_TO_OPERATOR'},
    {name : 'Appeler par le nom',value : 'NAME_DIALING'},
    {name : 'Appeler par le numéro de poste',value : 'EXTENSION_DIALING'},
    {name : 'Répéter le menu',value : 'REPEAT_MENU'},
    {name : 'Quitter le menu',value : 'EXIT'},
    {name : 'Transférer l’appel vers la messagerie vocale',value : 'TRANSFER_TO_MAILBOX'}
  ]
  this.listDays = [
    {name : 'Lundi',value : 'MONDAY'},
    {name : 'Mardi',value : 'TUESDAY'},
    {name : 'Mercredi',value : 'WEDNESDAY'},
    {name : 'Jeudi',value : 'THURSDAY'},
    {name : 'Vendredi',value : 'FRIDAY'},
    {name : 'Samedi',value : 'SATURDAY'},
    {name : 'Dimanche',value : 'SUNDAY'}
  ]
  this.listMonth = [
    {name : 'Janvier',value : 'JANUARY'},
    {name : 'Février',value : 'FEBRUARY'},
    {name : 'Mars',value : 'MARCH'},
    {name : 'Avril',value : 'APRIL'},
    {name : 'Mai',value : 'MAY'},
    {name : 'Juin',value : 'JUNE'},
    {name : 'Juillet',value : 'JULY'},
    {name : 'Août',value : 'AUGUST'},
    {name : 'Septembre',value : 'SEPTEMBER'},
    {name : 'Octobre',value : 'OCTOBER'},
    {name : 'Novembre',value : 'NOVEMBER'},
    {name : 'Décembre',value : 'DECEMBER'},
  ]

  }
  GetDetailsAutoAttendant(id){
    this.webexServices.GetDetailsAutoAttendant(this.orgId,this.locationId, id)
    .subscribe(data => {
      if (data["status"] == "success") {
        this.autoAttendant = data["result"] as AutoAttendant;
        this.registerAutoAttendantForm = this.formBuilder.group({
          tb_Name: [this.autoAttendant.name, Validators.required],
          tb_FirstName: [this.autoAttendant.firstName, Validators.required],
          tb_LastName: [this.autoAttendant.lastName, Validators.required],
          tb_PhoneNumber: [this.autoAttendant.phoneNumber],
          tb_extension:[this.autoAttendant.extension,[Validators.pattern("^[0-9]*$"),
          Validators.minLength(2), Validators.maxLength(6)]],
          tb_isCreateBHSchedule:["false"],
          tb_isCreateSchedule:['false'],
          tb_NameSchedule:[''],
          tb_NameScheduleHoliday:[''],
          tb_businessSchedule:[this.autoAttendant.businessSchedule,Validators.required],
          tb_businessScheduleHoliday:[this.autoAttendant.holidaySchedule],
          tb_NameEventScheduleHoliday:[''],
          tb_sunday:[false],
          tb_monday:[true],
          tb_tuesday:[true],
          tb_wednesday:[true],
          tb_thursday:[true],
          tb_friday:[true],
          tb_saturday:[false],
          tb_pauseDejeuner:[true],
          tb_startTimeDimanche:['09:00 AM'],
          tb_endTimeDimanche:['05:00 PM'],
          tb_startTimeLundi:['09:00 AM'],
          tb_endTimeLundi:['05:00 PM'],
          tb_startTimeMardi:['09:00 AM'],
          tb_endTimeMardi:['05:00 PM'],
          tb_startTimeMercredi:['09:00 AM'],
          tb_endTimeMercredi:['05:00 PM'],
          tb_startTimeJeudi:['09:00 AM'],
          tb_endTimeJeudi:['05:00 PM'],
          tb_startTimeVendredi:['09:00 AM'],
          tb_endTimeVendredi:['05:00 PM'],
          tb_startTimeSamedi:['09:00 AM'],
          tb_endTimeSamedi:['05:00 PM'],
          tb_startTimePauseDejeuner:['12:00 AM'],
          tb_endTimePauseDejeuner:['13:00 AM'],
          tb_businessExtensionEnabled:[this.autoAttendant.businessHoursMenu.extensionEnabled],
          tb_Recurence:["Aucun"],
          tb_action_HO_0:[this.autoAttendant.businessHoursMenu.keyConfigurations[0]!= undefined ?this.autoAttendant.businessHoursMenu.keyConfigurations[0].action:''],
          tb_action_HO_1:[this.autoAttendant.businessHoursMenu.keyConfigurations[1]!= undefined ?this.autoAttendant.businessHoursMenu.keyConfigurations[1].action:''],
          tb_action_HO_2:[this.autoAttendant.businessHoursMenu.keyConfigurations[2]!= undefined ?this.autoAttendant.businessHoursMenu.keyConfigurations[2].action:''],
          tb_action_HO_3:[this.autoAttendant.businessHoursMenu.keyConfigurations[3]!= undefined ?this.autoAttendant.businessHoursMenu.keyConfigurations[3].action:''],
          tb_action_HO_4:[this.autoAttendant.businessHoursMenu.keyConfigurations[4]!= undefined ?this.autoAttendant.businessHoursMenu.keyConfigurations[4].action:''],
          tb_action_HO_5:[this.autoAttendant.businessHoursMenu.keyConfigurations[5]!= undefined ?this.autoAttendant.businessHoursMenu.keyConfigurations[5].action:''],
          tb_action_HO_6:[this.autoAttendant.businessHoursMenu.keyConfigurations[6]!= undefined ?this.autoAttendant.businessHoursMenu.keyConfigurations[6].action:''],
          tb_action_HO_7:[this.autoAttendant.businessHoursMenu.keyConfigurations[7]!= undefined ?this.autoAttendant.businessHoursMenu.keyConfigurations[7].action:''],
          tb_action_HO_8:[this.autoAttendant.businessHoursMenu.keyConfigurations[8]!= undefined ?this.autoAttendant.businessHoursMenu.keyConfigurations[8].action:''],
          tb_action_HO_9:[this.autoAttendant.businessHoursMenu.keyConfigurations[9]!= undefined ?this.autoAttendant.businessHoursMenu.keyConfigurations[9].action:''],
          tb_action_HO_etoile:[this.autoAttendant.businessHoursMenu.keyConfigurations[10]!= undefined ?this.autoAttendant.businessHoursMenu.keyConfigurations[10].action:''],
          tb_action_HO_diese:[this.autoAttendant.businessHoursMenu.keyConfigurations[11]!= undefined ?this.autoAttendant.businessHoursMenu.keyConfigurations[11].action:''],
          tb_afterExtensionEnabled:[this.autoAttendant.afterHoursMenu.extensionEnabled],
          tb_transferNumber_0:[this.autoAttendant.businessHoursMenu.keyConfigurations[0]!= undefined ?this.autoAttendant.businessHoursMenu.keyConfigurations[0].value:''],
          tb_transferNumber_1:[this.autoAttendant.businessHoursMenu.keyConfigurations[1]!= undefined ?this.autoAttendant.businessHoursMenu.keyConfigurations[1].value:''],
          tb_transferNumber_2:[this.autoAttendant.businessHoursMenu.keyConfigurations[2]!= undefined ?this.autoAttendant.businessHoursMenu.keyConfigurations[2].value:''],
          tb_transferNumber_3:[this.autoAttendant.businessHoursMenu.keyConfigurations[3]!= undefined ?this.autoAttendant.businessHoursMenu.keyConfigurations[3].value:''],
          tb_transferNumber_4:[this.autoAttendant.businessHoursMenu.keyConfigurations[4]!= undefined ?this.autoAttendant.businessHoursMenu.keyConfigurations[4].value:''],
          tb_transferNumber_5:[this.autoAttendant.businessHoursMenu.keyConfigurations[5]!= undefined ?this.autoAttendant.businessHoursMenu.keyConfigurations[5].value:''],
          tb_transferNumber_6:[this.autoAttendant.businessHoursMenu.keyConfigurations[6]!= undefined ?this.autoAttendant.businessHoursMenu.keyConfigurations[6].value:''],
          tb_transferNumber_7:[this.autoAttendant.businessHoursMenu.keyConfigurations[7]!= undefined ?this.autoAttendant.businessHoursMenu.keyConfigurations[7].value:''],
          tb_transferNumber_8:[this.autoAttendant.businessHoursMenu.keyConfigurations[8]!= undefined ?this.autoAttendant.businessHoursMenu.keyConfigurations[8].value:''],
          tb_transferNumber_9:[this.autoAttendant.businessHoursMenu.keyConfigurations[9]!= undefined ?this.autoAttendant.businessHoursMenu.keyConfigurations[9].value:''],
          tb_transferNumber_etoile:[this.autoAttendant.businessHoursMenu.keyConfigurations[10]!= undefined ?this.autoAttendant.businessHoursMenu.keyConfigurations[10].value:''],
          tb_transferNumber_diese:[this.autoAttendant.businessHoursMenu.keyConfigurations[11]!= undefined ?this.autoAttendant.businessHoursMenu.keyConfigurations[11].value:''],
          tb_action_AHO_0:[this.autoAttendant.afterHoursMenu.keyConfigurations[0]!= undefined ?this.autoAttendant.afterHoursMenu.keyConfigurations[0].action:''],
          tb_action_AHO_1:[this.autoAttendant.afterHoursMenu.keyConfigurations[1]!= undefined ?this.autoAttendant.afterHoursMenu.keyConfigurations[1].action:''],
          tb_action_AHO_2:[this.autoAttendant.afterHoursMenu.keyConfigurations[2]!= undefined ?this.autoAttendant.afterHoursMenu.keyConfigurations[2].action:''],
          tb_action_AHO_3:[this.autoAttendant.afterHoursMenu.keyConfigurations[3]!= undefined ?this.autoAttendant.afterHoursMenu.keyConfigurations[3].action:''],
          tb_action_AHO_4:[this.autoAttendant.afterHoursMenu.keyConfigurations[4]!= undefined ?this.autoAttendant.afterHoursMenu.keyConfigurations[4].action:''],
          tb_action_AHO_5:[this.autoAttendant.afterHoursMenu.keyConfigurations[5]!= undefined ?this.autoAttendant.afterHoursMenu.keyConfigurations[5].action:''],
          tb_action_AHO_6:[this.autoAttendant.afterHoursMenu.keyConfigurations[6]!= undefined ?this.autoAttendant.afterHoursMenu.keyConfigurations[6].action:''],
          tb_action_AHO_7:[this.autoAttendant.afterHoursMenu.keyConfigurations[7]!= undefined ?this.autoAttendant.afterHoursMenu.keyConfigurations[7].action:''],
          tb_action_AHO_8:[this.autoAttendant.afterHoursMenu.keyConfigurations[8]!= undefined ?this.autoAttendant.afterHoursMenu.keyConfigurations[8].action:''],
          tb_action_AHO_9:[this.autoAttendant.afterHoursMenu.keyConfigurations[9]!= undefined ?this.autoAttendant.afterHoursMenu.keyConfigurations[9].action:''],
          tb_action_AHO_etoile:[this.autoAttendant.afterHoursMenu.keyConfigurations[10]!= undefined ?this.autoAttendant.afterHoursMenu.keyConfigurations[10].action:''],
          tb_action_AHO_diese:[this.autoAttendant.afterHoursMenu.keyConfigurations[11]!= undefined ?this.autoAttendant.afterHoursMenu.keyConfigurations[11].action:''],
          tb_transferNumber_AHO_0:[this.autoAttendant.afterHoursMenu.keyConfigurations[0]!= undefined ?this.autoAttendant.afterHoursMenu.keyConfigurations[0].value:''],
          tb_transferNumber_AHO_1:[this.autoAttendant.afterHoursMenu.keyConfigurations[1]!= undefined ?this.autoAttendant.afterHoursMenu.keyConfigurations[1].value:''],
          tb_transferNumber_AHO_2:[this.autoAttendant.afterHoursMenu.keyConfigurations[2]!= undefined ?this.autoAttendant.afterHoursMenu.keyConfigurations[2].value:''],
          tb_transferNumber_AHO_3:[this.autoAttendant.afterHoursMenu.keyConfigurations[3]!= undefined ?this.autoAttendant.afterHoursMenu.keyConfigurations[3].value:''],
          tb_transferNumber_AHO_4:[this.autoAttendant.afterHoursMenu.keyConfigurations[4]!= undefined ?this.autoAttendant.afterHoursMenu.keyConfigurations[4].value:''],
          tb_transferNumber_AHO_5:[this.autoAttendant.afterHoursMenu.keyConfigurations[5]!= undefined ?this.autoAttendant.afterHoursMenu.keyConfigurations[5].value:''],
          tb_transferNumber_AHO_6:[this.autoAttendant.afterHoursMenu.keyConfigurations[6]!= undefined ?this.autoAttendant.afterHoursMenu.keyConfigurations[6].value:''],
          tb_transferNumber_AHO_7:[this.autoAttendant.afterHoursMenu.keyConfigurations[7]!= undefined ?this.autoAttendant.afterHoursMenu.keyConfigurations[7].value:''],
          tb_transferNumber_AHO_8:[this.autoAttendant.afterHoursMenu.keyConfigurations[8]!= undefined ?this.autoAttendant.afterHoursMenu.keyConfigurations[8].value:''],
          tb_transferNumber_AHO_9:[this.autoAttendant.afterHoursMenu.keyConfigurations[9]!= undefined ?this.autoAttendant.afterHoursMenu.keyConfigurations[9].value:''],
          tb_transferNumber_AHO_etoile:[this.autoAttendant.afterHoursMenu.keyConfigurations[10]!= undefined ?this.autoAttendant.afterHoursMenu.keyConfigurations[10].value:''],
          tb_transferNumber_AHO_diese:[this.autoAttendant.afterHoursMenu.keyConfigurations[11]!= undefined ?this.autoAttendant.afterHoursMenu.keyConfigurations[11].value:''],
          tb_businessGreetingType:[this.autoAttendant.businessHoursMenu.greeting],
          tb_afterGreetingType:[this.autoAttendant.afterHoursMenu.greeting],
          tb_dateDebutConge:[new Date()],
          tb_dateFinConge:[new Date()],
          tb_timeDebutConge:[new Date().getHours() + ":" + new Date().getMinutes() + " AM"],
          tb_timeFinConge:[+new Date().getHours() + ":" + new Date().getMinutes() + " AM"],
          tb_dayConge:["MONDAY"],
          tb_toutJourne:[false],
          tb_TypeConge:["Date"],
          tb_timeWeekConge:["Premier"],
          tb_day_mounthConge:["MONDAY"],
          tb_Month:["JANUARY"],
          tb_dateInput:[1]
        });
        if(this.autoAttendant.businessHoursMenu.keyConfigurations!= null){
          this.autoAttendant.businessHoursMenu.keyConfigurations.forEach(e=>
            {
              this.showTransferNumber(e.action,e.key)
            })
        }
        if(this.autoAttendant.afterHoursMenu.keyConfigurations!= null){
          this.autoAttendant.afterHoursMenu.keyConfigurations.forEach(e=>
            {
              this.showTransferNumberHoliday(e.action,e.key)
            })
        }
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
  startsWithSearchFn(item:any, term:any) {
    return item.startsWith(term);
}

  close() {
    this.passEntry.emit("Closed");
    this.activeModal.dismiss();
  }
  obligatoireExtension = true;
  extensionControl(event: any) {
    const pattern = /[0-9\ ]/;
    return (event.charCode === 0 || pattern.test(String.fromCharCode(event.charCode)));
  }
  setExtensionOblige(number: any) {
    if (number == "" || number == null) {
      this.obligatoireExtension = true;
      this.registerAutoAttendantForm.controls["tb_extension"].setValidators([Validators.required, Validators.pattern("^[0-9]*$"),
      Validators.minLength(2), Validators.maxLength(6)]);
      this.registerAutoAttendantForm.controls['tb_extension'].updateValueAndValidity();
    }
    else {
      this.obligatoireExtension = false;
      this.registerAutoAttendantForm.controls["tb_extension"].clearValidators();
      this.registerAutoAttendantForm.controls['tb_extension'].updateValueAndValidity();
    }
  }
  getPhoneNumbersLocation() {
    this.webexServices.GetNumbersEntrepriseLoction(this.entId, this.orgId, this.locationId)
      .subscribe(data => {
        if (data["status"] == "success") {
          this.numbersPhone = data["result"];
           this.numbersPhone = this.numbersPhone.filter((e: any) => e["owner"] == null)
          this.numberPhoneTransfert = data["result"];
         this.numberPhoneTransfert = this.numberPhoneTransfert.filter((e: any) => e["owner"] != null)
         
    
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
  getListSchedules() {
    this.webexServices.GetSchedules(this.orgId, this.locationId)
      .subscribe(data => {
        if (data["status"] == "success") {
          var listSchedules = data["result"] as Schedule[];
          this.listSchedulesBusinessHours = listSchedules.filter(sch=>sch.type == "businessHours");
          this.listSchedulesHolidays = listSchedules.filter(sch=>sch.type == "holidays");
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
  showDetailsSchedule = false
  getDetailsSchedule(event:any) {
   var  type:string
    var idSchedule:string
    this.showDetailsSchedule = true
    this.webexServices.GetDetailsSchedule(this.locationId,this.orgId,type,idSchedule)
      .subscribe(data => {
        if (data["status"] == "success") {
          this.schedule = data["result"] as Schedule;
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
  checkedDimanche = false;
  eventDimanche(){
    this.checkedDimanche = !this.checkedDimanche
  }
  checkedSamedi = false;
  eventSamedi(){
    this.checkedSamedi = !this.checkedSamedi
  }
  checkedPauseDejeuner = true;
  eventPauseDejeuner(){
    this.checkedPauseDejeuner = !this.checkedPauseDejeuner
  }
  checkedLundi = true;
  eventLundi(){
    this.checkedLundi = !this.checkedLundi
  }
  checkedMardi = true;
  eventMardi(){
    this.checkedMardi = !this.checkedMardi
  }
  checkedMercredi = true;
  eventMercredi(){
    this.checkedMercredi = !this.checkedMercredi
  }
  checkedJeudi = true;
  eventJeudi(){
    this.checkedJeudi = !this.checkedJeudi
  }
  checkedVendredi = true;
  eventVendredi(){
    this.checkedVendredi = !this.checkedVendredi
  }
  showNewSchedule= false;
  CreateNewSchedule(){
this.showNewSchedule = !this.showNewSchedule
  }
  showeventExist = true
  eventExist(event:any){
if(event.target.value == "false"){
  this.registerAutoAttendantForm.controls['tb_businessSchedule'].setValidators([Validators.required])
  this.registerAutoAttendantForm.controls['tb_businessSchedule'].updateValueAndValidity()
  this.registerAutoAttendantForm.controls['tb_NameSchedule'].clearValidators()
  this.registerAutoAttendantForm.controls['tb_NameSchedule'].updateValueAndValidity()
  this.showeventExist = true

  this.showNewSchedule= false;
}
else{
  this.registerAutoAttendantForm.controls['tb_businessSchedule'].clearValidators()
  this.registerAutoAttendantForm.controls['tb_businessSchedule'].updateValueAndValidity()
  this.registerAutoAttendantForm.controls['tb_NameSchedule'].setValidators([Validators.required])
  this.registerAutoAttendantForm.controls['tb_NameSchedule'].updateValueAndValidity()
  this.showNewSchedule= true;
  this.showeventExist = false
}
      //this.showeventExist = !this.showeventExist
  }
  showeventExistHoliday = true
  showNewScheduleHoliday = false
  eventExistHolidays(event:any){
    if(event.target.value == "false"){
      this.registerAutoAttendantForm.controls['tb_NameScheduleHoliday'].clearValidators()
      this.registerAutoAttendantForm.controls['tb_NameScheduleHoliday'].updateValueAndValidity()
      this.showeventExistHoliday = true
      this.showNewScheduleHoliday= false;
    }
    else{
      this.registerAutoAttendantForm.controls['tb_NameScheduleHoliday'].setValidators([Validators.required])
      this.registerAutoAttendantForm.controls['tb_NameScheduleHoliday'].updateValueAndValidity()
      this.showNewScheduleHoliday= true;
      this.showeventExistHoliday = false
    }
  }
  transferNumber_0 = false
  transferNumber_1= false
  transferNumber_2 = false
  transferNumber_3 = false
  transferNumber_4 = false
  transferNumber_5 = false
  transferNumber_6 = false
  transferNumber_7 = false
  transferNumber_8 = false
  transferNumber_9 = false
  transferNumber_etoile = false
  transferNumber_diese = false
  showTransferNumber(event:any,key:string){
    if(event == "TRANSFER_WITHOUT_PROMPT" || event == "TRANSFER_WITH_PROMPT"
    || event == "TRANSFER_TO_OPERATOR"|| event == "TRANSFER_TO_MAILBOX"){
      switch(key){
        case "0" : 
        this.transferNumber_0 = true;
        break
        case "1" : 
        this.transferNumber_1 = true;
        break
        case "2" : 
        this.transferNumber_2 = true;
        break;
        case "3" : 
        this.transferNumber_3 = true;
        break;
        case "4" : 
        this.transferNumber_4 = true;
        break;
        case "5" : 
        this.transferNumber_5 = true;
        break;
        case "6" : 
        this.transferNumber_6 = true;
        break;
        case "7" : 
        this.transferNumber_7 = true;
        break;
        case "8" : 
        this.transferNumber_8 = true;
        break;
        case "9" : 
        this.transferNumber_9 = true;
        break;
        case "*" : 
        this.transferNumber_etoile = true;
        break;
        case "#" : 
        this.transferNumber_diese = true;
        break;
      }
    }
    else{
      switch(key){
        case "0" : 
        this.transferNumber_0 = false;
        break
        case "1" : 
        this.transferNumber_1 = false;
        break
        case "2" : 
        this.transferNumber_2 = false;
        break;
        case "3" : 
        this.transferNumber_3 = false;
        break;
        case "4" : 
        this.transferNumber_4 = false;
        break;
        case "5" : 
        this.transferNumber_5 = false;
        break;
        case "6" : 
        this.transferNumber_6 = false;
        break;
        case "7" : 
        this.transferNumber_7 = false;
        break;
        case "8" : 
        this.transferNumber_8 = false;
        break;
        case "9" : 
        this.transferNumber_9 = false;
        break;
        case "*" : 
        this.transferNumber_etoile = false;
        break;
        case "#" : 
        this.transferNumber_diese = false;
        break;
      }
    }
  }
  transferNumber_H_0 = false
  transferNumber_H_1= false
  transferNumber_H_2 = false
  transferNumber_H_3 = false
  transferNumber_H_4 = false
  transferNumber_H_5 = false
  transferNumber_H_6 = false
  transferNumber_H_7 = false
  transferNumber_H_8 = false
  transferNumber_H_9 = false
  transferNumber_H_etoile = false
  transferNumber_H_diese = false
  showTransferNumberHoliday(event:any,key:string){
    if(event == "TRANSFER_WITHOUT_PROMPT" || event == "TRANSFER_WITH_PROMPT"
    || event == "TRANSFER_TO_OPERATOR"|| event == "TRANSFER_TO_MAILBOX"){
      switch(key){
        case "0" : 
        this.transferNumber_H_0 = true;
        break
        case "1" : 
        this.transferNumber_H_1 = true;
        break
        case "2" : 
        this.transferNumber_H_2 = true;
        break;
        case "3" : 
        this.transferNumber_H_3 = true;
        break;
        case "4" : 
        this.transferNumber_H_4 = true;
        break;
        case "5" : 
        this.transferNumber_H_5 = true;
        break;
        case "6" : 
        this.transferNumber_H_6 = true;
        break;
        case "7" : 
        this.transferNumber_H_7 = true;
        break;
        case "8" : 
        this.transferNumber_H_8 = true;
        break;
        case "9" : 
        this.transferNumber_H_9 = true;
        break;
        case "*" : 
        this.transferNumber_H_etoile = true;
        break;
        case "#" : 
        this.transferNumber_H_diese = true;
        break;
      }
    }
    else{
      switch(key){
        case "0" : 
        this.transferNumber_H_0 = false;
        break
        case "1" : 
        this.transferNumber_H_1 = false;
        break
        case "2" : 
        this.transferNumber_H_2 = false;
        break;
        case "3" : 
        this.transferNumber_H_3 = false;
        break;
        case "4" : 
        this.transferNumber_H_4 = false;
        break;
        case "5" : 
        this.transferNumber_H_5 = false;
        break;
        case "6" : 
        this.transferNumber_H_6 = false;
        break;
        case "7" : 
        this.transferNumber_H_7 = false;
        break;
        case "8" : 
        this.transferNumber_H_8 = false;
        break;
        case "9" : 
        this.transferNumber_H_9 = false;
        break;
        case "*" : 
        this.transferNumber_H_etoile = false;
        break;
        case "#" : 
        this.transferNumber_H_diese = false;
        break;
      }
    }
  }
onSubmit(){
  this.submitted = true;
  if (this.registerAutoAttendantForm.invalid) {
    return;
  }
  var scheduleSvi : ScheduleSVIDto = new ScheduleSVIDto();
  scheduleSvi.autoAttendant = new AutoAttendant();
  scheduleSvi.autoAttendant.id = this.autoAttendant.id;
  scheduleSvi.schedules = []
  scheduleSvi.autoAttendant.name = this.registerAutoAttendantForm.value["tb_Name"];
  scheduleSvi.autoAttendant.firstName = this.registerAutoAttendantForm.value["tb_FirstName"];
  scheduleSvi.autoAttendant.lastName = this.registerAutoAttendantForm.value["tb_LastName"];
  scheduleSvi.autoAttendant.timeZone = "Europe/Paris";
  scheduleSvi.autoAttendant.languageCode = "fr_fr";
  scheduleSvi.autoAttendant.extensionDialing = "ENTERPRISE";
  scheduleSvi.autoAttendant.nameDialing = "ENTERPRISE";
  scheduleSvi.autoAttendant.extension = this.registerAutoAttendantForm.value["tb_extension"]!=""?this.registerAutoAttendantForm.value["tb_extension"]:null;
  scheduleSvi.autoAttendant.phoneNumber = this.registerAutoAttendantForm.value["tb_PhoneNumber"]!=""?this.registerAutoAttendantForm.value["tb_PhoneNumber"]:null;
  if(this.registerAutoAttendantForm.value["tb_isCreateBHSchedule"] == "false"){
   
    scheduleSvi.autoAttendant.businessSchedule = this.registerAutoAttendantForm.value["tb_businessSchedule"]   
    
  }
  else{
var sched = new Schedule();
sched.name = this.registerAutoAttendantForm.value["tb_NameSchedule"]
sched.type = "businessHours";
var eventLundi = this.addEvent(this.registerAutoAttendantForm.value["tb_monday"],"Lundi");
var eventMardi = this.addEvent(this.registerAutoAttendantForm.value["tb_tuesday"],"Mardi");
var eventMercredi = this.addEvent(this.registerAutoAttendantForm.value["tb_wednesday"],"Mercredi");
var eventJeudi = this.addEvent(this.registerAutoAttendantForm.value["tb_thursday"],"Jeudi");
var eventVendredi = this.addEvent(this.registerAutoAttendantForm.value["tb_friday"],"Vendredi");
var eventSamedi = this.addEvent(this.registerAutoAttendantForm.value["tb_saturday"],"Samedi");
var eventDimanche = this.addEvent(this.registerAutoAttendantForm.value["tb_sunday"],"Dimanche");
sched.events = [];
sched.events.push(...eventLundi);
sched.events.push(...eventMardi);
sched.events.push(...eventMercredi);
sched.events.push(...eventJeudi);
sched.events.push(...eventVendredi);
sched.events.push(...eventSamedi);
sched.events.push(...eventDimanche);

scheduleSvi.schedules.push(sched);
  }
  if(this.registerAutoAttendantForm.value["tb_isCreateSchedule"] == "false"){
    scheduleSvi.autoAttendant.holidaySchedule = this.registerAutoAttendantForm.value["tb_businessScheduleHoliday"] != ""?this.registerAutoAttendantForm.value["tb_businessScheduleHoliday"] : null
    }
  else{
var sched = new Schedule();
sched.name = this.registerAutoAttendantForm.value["tb_NameScheduleHoliday"]
sched.type = "holidays";
sched.events = [];
      sched.events.push(...this.eventsHolidays)
      scheduleSvi.schedules.push(sched);
  }
  scheduleSvi.autoAttendant.businessHoursMenu = new BusinessHoursMenu();
  scheduleSvi.autoAttendant.businessHoursMenu.greeting = this.registerAutoAttendantForm.value["tb_businessGreetingType"];
  scheduleSvi.autoAttendant.businessHoursMenu.extensionEnabled = this.registerAutoAttendantForm.value["tb_businessExtensionEnabled"];
  scheduleSvi.autoAttendant.businessHoursMenu.keyConfigurations = [];
 var key_0 =  this.getMenu(this.registerAutoAttendantForm.value["tb_action_HO_0"],"0");
 
 if(key_0!= null)scheduleSvi.autoAttendant.businessHoursMenu.keyConfigurations.push(key_0)
 var key_1 =  this.getMenu(this.registerAutoAttendantForm.value["tb_action_HO_1"],"1");
 if(key_1!= null)scheduleSvi.autoAttendant.businessHoursMenu.keyConfigurations.push(key_1)
 var key_2 =  this.getMenu(this.registerAutoAttendantForm.value["tb_action_HO_2"],"2");
 if(key_2!= null)scheduleSvi.autoAttendant.businessHoursMenu.keyConfigurations.push(key_2)
 var key_3 =  this.getMenu(this.registerAutoAttendantForm.value["tb_action_HO_3"],"3");
 if(key_3!= null)scheduleSvi.autoAttendant.businessHoursMenu.keyConfigurations.push(key_3)
 var key_4 =  this.getMenu(this.registerAutoAttendantForm.value["tb_action_HO_4"],"4");
 if(key_4!= null)scheduleSvi.autoAttendant.businessHoursMenu.keyConfigurations.push(key_4)
 var key_5 =  this.getMenu(this.registerAutoAttendantForm.value["tb_action_HO_5"],"5");
 if(key_5!= null)scheduleSvi.autoAttendant.businessHoursMenu.keyConfigurations.push(key_5)
 var key_6 =  this.getMenu(this.registerAutoAttendantForm.value["tb_action_HO_6"],"6");
 if(key_6!= null)scheduleSvi.autoAttendant.businessHoursMenu.keyConfigurations.push(key_6)
 var key_7 =  this.getMenu(this.registerAutoAttendantForm.value["tb_action_HO_7"],"7");
 if(key_7!= null)scheduleSvi.autoAttendant.businessHoursMenu.keyConfigurations.push(key_7)
 var key_8 =  this.getMenu(this.registerAutoAttendantForm.value["tb_action_HO_8"],"8");
 if(key_8!= null)scheduleSvi.autoAttendant.businessHoursMenu.keyConfigurations.push(key_8)
 var key_9 =  this.getMenu(this.registerAutoAttendantForm.value["tb_action_HO_9"],"9");
 if(key_9!= null)scheduleSvi.autoAttendant.businessHoursMenu.keyConfigurations.push(key_9)
 var key_etoile =  this.getMenu(this.registerAutoAttendantForm.value["tb_action_HO_etoile"],"*");
 if(key_etoile!= null)scheduleSvi.autoAttendant.businessHoursMenu.keyConfigurations.push(key_etoile)
 var key_diese =  this.getMenu(this.registerAutoAttendantForm.value["tb_action_HO_diese"],"#");
 if(key_diese!= null)scheduleSvi.autoAttendant.businessHoursMenu.keyConfigurations.push(key_diese)
 scheduleSvi.autoAttendant.afterHoursMenu = new AfterHoursMenu()
  scheduleSvi.autoAttendant.afterHoursMenu.greeting = this.registerAutoAttendantForm.value["tb_afterGreetingType"];
  scheduleSvi.autoAttendant.afterHoursMenu.extensionEnabled = this.registerAutoAttendantForm.value["tb_afterExtensionEnabled"];
  scheduleSvi.autoAttendant.afterHoursMenu.keyConfigurations = [];
 var key_0 =  this.getMenu(this.registerAutoAttendantForm.value["tb_action_AHO_0"],"0");
 if(key_0!= null)scheduleSvi.autoAttendant.afterHoursMenu.keyConfigurations.push(key_0)
 var key_1 =  this.getMenu(this.registerAutoAttendantForm.value["tb_action_AHO_1"],"1");
 if(key_1!= null)scheduleSvi.autoAttendant.afterHoursMenu.keyConfigurations.push(key_1)
 var key_2 =  this.getMenu(this.registerAutoAttendantForm.value["tb_action_AHO_2"],"2");
 if(key_2!= null)scheduleSvi.autoAttendant.afterHoursMenu.keyConfigurations.push(key_2)
 var key_3 =  this.getMenu(this.registerAutoAttendantForm.value["tb_action_AHO_3"],"3");
 if(key_3!= null)scheduleSvi.autoAttendant.afterHoursMenu.keyConfigurations.push(key_3)
 var key_4 =  this.getMenu(this.registerAutoAttendantForm.value["tb_action_AHO_4"],"4");
 if(key_4!= null)scheduleSvi.autoAttendant.afterHoursMenu.keyConfigurations.push(key_4)
 var key_5 =  this.getMenu(this.registerAutoAttendantForm.value["tb_action_AHO_5"],"5");
 if(key_5!= null)scheduleSvi.autoAttendant.afterHoursMenu.keyConfigurations.push(key_5)
 var key_6 =  this.getMenu(this.registerAutoAttendantForm.value["tb_action_AHO_6"],"6");
 if(key_6!= null)scheduleSvi.autoAttendant.afterHoursMenu.keyConfigurations.push(key_6)
 var key_7 =  this.getMenu(this.registerAutoAttendantForm.value["tb_action_AHO_7"],"7");
 if(key_7!= null)scheduleSvi.autoAttendant.afterHoursMenu.keyConfigurations.push(key_7)
 var key_8 =  this.getMenu(this.registerAutoAttendantForm.value["tb_action_AHO_8"],"8");
 if(key_8!= null)scheduleSvi.autoAttendant.afterHoursMenu.keyConfigurations.push(key_8)
 var key_9 =  this.getMenu(this.registerAutoAttendantForm.value["tb_action_AHO_9"],"9");
 if(key_9!= null)scheduleSvi.autoAttendant.afterHoursMenu.keyConfigurations.push(key_9)
 var key_etoile =  this.getMenu(this.registerAutoAttendantForm.value["tb_action_AHO_etoile"],"*");
 if(key_etoile!= null)scheduleSvi.autoAttendant.afterHoursMenu.keyConfigurations.push(key_etoile)
 var key_diese =  this.getMenu(this.registerAutoAttendantForm.value["tb_action_AHO_diese"],"#");
 if(key_diese!= null)scheduleSvi.autoAttendant.afterHoursMenu.keyConfigurations.push(key_diese)
 this.webexServices.UpdateAutoattendantAndShcedule(scheduleSvi, this.orgId,this.locationId).subscribe(data => {
  if (data != null && data["status"] == "success") {
   
    this.close();
  }
  else {
    var str: string = data["message"];
    if(data["status"] == "conflict"){
      str= str 
    }
    else{
      this.toastr.error("une erreur technique est survenue") 
    }
    Swal.fire({
      icon: 'error',
      text: str 
    })
  }
}, error => {
    this.toastr.error("une erreur technique est survenue")

  }
);
}
getMenu(menu : string,key : string){
  if(menu != ""){
    var keyConfig = new KeyConfigurations()
    keyConfig.key = key;
    keyConfig.action = menu
    if(menu == "TRANSFER_WITHOUT_PROMPT" || menu == "TRANSFER_WITH_PROMPT"
    || menu == "TRANSFER_TO_OPERATOR"|| menu == "TRANSFER_TO_MAILBOX"){
      if(key == "*"){
        keyConfig.value = this.registerAutoAttendantForm.value["tb_transferNumber_etoile"]
      }
      if(key == "#"){
        keyConfig.value = this.registerAutoAttendantForm.value["tb_transferNumber_diese"]
      }
      else{
        keyConfig.value = this.registerAutoAttendantForm.value["tb_transferNumber_"+key]

      }
    }
    return keyConfig
  }
  return null;
}
pipe = new DatePipe('en-US');
addEvent(ev:boolean,day:string){
 
  var events : Event[] = []
  if(ev){
  
    var event1 = new Event();
    event1.name =  day + " 1";
    event1.startDate = formatDate(new Date(),'yyyy-MM-dd', 'en');
    event1.endDate = formatDate(new Date(),'yyyy-MM-dd', 'en');
    event1.startTime = this.registerAutoAttendantForm.value["tb_startTime"+day]
    event1.endTime = this.registerAutoAttendantForm.value["tb_startTimePauseDejeuner"]
    event1.startTime = this.convertTo24Hour(event1.startTime)
    event1.endTime = this.convertTo24Hour(event1.endTime)

    event1.recurrence = new RecurrenceDto();
    event1.recurrence.recurWeekly = new RecurWeeklyDto();
    event1.recurrence.recurWeekly.sunday = false
    event1.recurrence.recurWeekly.monday = true
    event1.recurrence.recurWeekly.tuesday = false
    event1.recurrence.recurWeekly.wednesday = false
    event1.recurrence.recurWeekly.friday = false
    event1.recurrence.recurWeekly.saturday = false
    event1.recurrence.recurWeekly.thursday = false
    var event2 = new Event();
    event2.name = day + " 2";
    event2.startDate = formatDate(new Date(),'yyyy-MM-dd', 'en');
    event2.endDate = formatDate(new Date(),'yyyy-MM-dd', 'en');
    event2.startTime = this.registerAutoAttendantForm.value["tb_endTimePauseDejeuner"]
    event2.endTime = this.registerAutoAttendantForm.value["tb_endTime" + day]
    
    event2.startTime=this.convertTo24Hour(event2.startTime)
    event2.endTime=this.convertTo24Hour(event2.endTime)
    event2.recurrence = new RecurrenceDto();
    event2.recurrence.recurWeekly = new RecurWeeklyDto();
    switch(day){
      case "Lundi" : 
      event2.recurrence.recurWeekly.sunday = false
      event2.recurrence.recurWeekly.monday = true
      event2.recurrence.recurWeekly.tuesday = false
      event2.recurrence.recurWeekly.wednesday = false
      event2.recurrence.recurWeekly.friday = false
      event2.recurrence.recurWeekly.saturday = false
      event2.recurrence.recurWeekly.thursday = false
      break;
      case "Mardi" : 
      event2.recurrence.recurWeekly.sunday = false
      event2.recurrence.recurWeekly.monday = false
      event2.recurrence.recurWeekly.tuesday = true
      event2.recurrence.recurWeekly.wednesday = false
      event2.recurrence.recurWeekly.friday = false
      event2.recurrence.recurWeekly.saturday = false
      event2.recurrence.recurWeekly.thursday = false
      break;
      case "Mercredi" : 
      event2.recurrence.recurWeekly.sunday = false
      event2.recurrence.recurWeekly.monday = false
      event2.recurrence.recurWeekly.tuesday = false
      event2.recurrence.recurWeekly.wednesday = true
      event2.recurrence.recurWeekly.friday = false
      event2.recurrence.recurWeekly.saturday = false
      event2.recurrence.recurWeekly.thursday = false
      break;
      case "Jeudi" : 
      event2.recurrence.recurWeekly.sunday = false
      event2.recurrence.recurWeekly.monday = false
      event2.recurrence.recurWeekly.tuesday = false
      event2.recurrence.recurWeekly.wednesday = false
      event2.recurrence.recurWeekly.thursday = true
      event2.recurrence.recurWeekly.friday = false
      event2.recurrence.recurWeekly.saturday = false
  
      break;
      case "Vendredi" : 
      event2.recurrence.recurWeekly.sunday = false
      event2.recurrence.recurWeekly.monday = false
      event2.recurrence.recurWeekly.tuesday = false
      event2.recurrence.recurWeekly.wednesday = false
      event2.recurrence.recurWeekly.thursday = false
      event2.recurrence.recurWeekly.friday = true
      event2.recurrence.recurWeekly.saturday = false
  
      break;
      case "Samedi" : 
      event2.recurrence.recurWeekly.sunday = false
      event2.recurrence.recurWeekly.monday = false
      event2.recurrence.recurWeekly.tuesday = false
      event2.recurrence.recurWeekly.wednesday = false
      event2.recurrence.recurWeekly.thursday = false
      event2.recurrence.recurWeekly.friday = false
      event2.recurrence.recurWeekly.saturday = true
  
      break;
    }
    
    events.push(event1)
    events.push(event2)


  }
  return events;
}
convertTo24Hour(inputTime: string): string {
  
  if(inputTime.includes('AM') || inputTime.includes('am')){
    let input = inputTime.includes('AM') ?inputTime.replace(" AM", ""): inputTime.replace(" am", "")
    return input;
  }
  else
    {
    let outputTime = inputTime.replace(" PM", "");
    if(inputTime.includes('pm')){
      outputTime = inputTime.replace(" pm", "");
    }
    
    const minutes = outputTime.split(":")[1]; 
    const hours = outputTime.split(":")[0]; 
    let num = Number(hours);
    let val  = num + 12
    let outtt  = val+ ":" + minutes
    return outtt;
  }
}
saveEventsHolidays(){
 var eventHoliday = new Event()
 if(this.isModifEvent){
  if(this.registerAutoAttendantForm.value["tb_Recurence"] =="Aucun"){
    this.modificationEventHoliday.name = this.registerAutoAttendantForm.value["tb_NameEventScheduleHoliday"]
    this.modificationEventHoliday.startDate = this.registerAutoAttendantForm.value["tb_dateDebutConge"]
    this.modificationEventHoliday.endDate = this.registerAutoAttendantForm.value["tb_dateFinConge"]
    this.modificationEventHoliday.startTime = !this.registerAutoAttendantForm.value["tb_toutJourne"]? this.convertTo24Hour(this.registerAutoAttendantForm.value["tb_timeDebutConge"]):null
    this.modificationEventHoliday.endTime = !this.registerAutoAttendantForm.value["tb_toutJourne"] ?this.convertTo24Hour(this.registerAutoAttendantForm.value["tb_timeFinConge"]):null
    this.modificationEventHoliday.allDayEnabled = false;
    this.modificationEventHoliday.recurenceData = "Aucun"
    this.eventsHolidays.forEach(e=>{
      
      if(e.name == this.modificationEventHoliday.name){
     
        e=this.modificationEventHoliday;
      }
      else{
        this.eventsHolidays.push(this.modificationEventHoliday)
      }
    })
    //this.eventsHolidays.push(eventHoliday);
   }
   else if(this.registerAutoAttendantForm.value["tb_Recurence"] =="Hebdomadaire"){
    eventHoliday = new Event()
    this.modificationEventHoliday.name = this.registerAutoAttendantForm.value["tb_NameEventScheduleHoliday"]
    this.modificationEventHoliday.startDate = this.registerAutoAttendantForm.value["tb_dateDebutConge"]
    this.modificationEventHoliday.endDate = this.registerAutoAttendantForm.value["tb_dateFinConge"]
    this.modificationEventHoliday.startTime = !this.registerAutoAttendantForm.value["tb_toutJourne"]? this.registerAutoAttendantForm.value["tb_timeDebutConge"]:null
    this.modificationEventHoliday.endTime = !this.registerAutoAttendantForm.value["tb_toutJourne"] ?this.registerAutoAttendantForm.value["tb_timeFinConge"]:null
    this.modificationEventHoliday.recurrence = new RecurrenceDto();
    this.modificationEventHoliday.recurrence.recurWeekly = new RecurWeeklyDto()
    this.modificationEventHoliday.recurrence.recurWeekly = this.getWeekDay(this.registerAutoAttendantForm.value["tb_dayConge"],eventHoliday.recurrence.recurWeekly)
    this.modificationEventHoliday.recurenceData = "Hebdomadaire"
    this.eventsHolidays.push(eventHoliday);
   }
   else{
    eventHoliday = new Event()
    this.modificationEventHoliday.name = this.registerAutoAttendantForm.value["tb_NameEventScheduleHoliday"]
    this.modificationEventHoliday.startDate = this.registerAutoAttendantForm.value["tb_dateDebutConge"]
    this.modificationEventHoliday.endDate = this.registerAutoAttendantForm.value["tb_dateFinConge"]
    this.modificationEventHoliday.startTime = !this.registerAutoAttendantForm.value["tb_toutJourne"]? this.registerAutoAttendantForm.value["tb_timeDebutConge"]:null
    this.modificationEventHoliday.endTime = !this.registerAutoAttendantForm.value["tb_toutJourne"] ?this.registerAutoAttendantForm.value["tb_timeFinConge"]:null
    this.modificationEventHoliday.recurenceData = "Annuel"
   }
   
 }
 else{
  if(this.registerAutoAttendantForm.value["tb_Recurence"] =="Aucun"){
    eventHoliday.name = this.registerAutoAttendantForm.value["tb_NameEventScheduleHoliday"]
    eventHoliday.startDate = formatDate(this.registerAutoAttendantForm.value["tb_dateDebutConge"],'yyyy-MM-dd', 'en')
    eventHoliday.endDate = formatDate(this.registerAutoAttendantForm.value["tb_dateFinConge"],'yyyy-MM-dd', 'en')
    eventHoliday.startTime = !this.registerAutoAttendantForm.value["tb_toutJourne"]? this.convertTo24Hour(this.registerAutoAttendantForm.value["tb_timeDebutConge"]):null
    eventHoliday.endTime = !this.registerAutoAttendantForm.value["tb_toutJourne"] ?this.convertTo24Hour(this.registerAutoAttendantForm.value["tb_timeFinConge"]):null
    eventHoliday.allDayEnabled = false;
    eventHoliday.recurenceData = "Aucun"
    this.eventsHolidays.push(eventHoliday);
   }
   else if(this.registerAutoAttendantForm.value["tb_Recurence"] =="Hebdomadaire"){
    eventHoliday = new Event()
    eventHoliday.name = this.registerAutoAttendantForm.value["tb_NameEventScheduleHoliday"]
    eventHoliday.startDate = formatDate(this.registerAutoAttendantForm.value["tb_dateDebutConge"],'yyyy-MM-dd', 'en')
    eventHoliday.endDate = formatDate(this.registerAutoAttendantForm.value["tb_dateFinConge"],'yyyy-MM-dd', 'en')
    eventHoliday.startTime = !this.registerAutoAttendantForm.value["tb_toutJourne"]? this.convertTo24Hour(this.registerAutoAttendantForm.value["tb_timeDebutConge"]):null
    eventHoliday.endTime = !this.registerAutoAttendantForm.value["tb_toutJourne"] ?this.convertTo24Hour(this.registerAutoAttendantForm.value["tb_timeFinConge"]):null
    eventHoliday.recurrence = new RecurrenceDto();
    eventHoliday.recurrence.recurWeekly = new RecurWeeklyDto()
    eventHoliday.recurrence.recurWeekly = this.getWeekDay(this.registerAutoAttendantForm.value["tb_dayConge"],eventHoliday.recurrence.recurWeekly)
    eventHoliday.recurenceData = "Hebdomadaire"
    this.eventsHolidays.push(eventHoliday);
   }
   else{
    eventHoliday = new Event()
    eventHoliday.name = this.registerAutoAttendantForm.value["tb_NameEventScheduleHoliday"]
    eventHoliday.startDate = formatDate(this.registerAutoAttendantForm.value["tb_dateDebutConge"],'yyyy-MM-dd', 'en')
    eventHoliday.endDate = formatDate(this.registerAutoAttendantForm.value["tb_dateFinConge"],'yyyy-MM-dd', 'en')
    eventHoliday.startTime = !this.registerAutoAttendantForm.value["tb_toutJourne"]? this.convertTo24Hour(this.registerAutoAttendantForm.value["tb_timeDebutConge"]):null
    eventHoliday.endTime = !this.registerAutoAttendantForm.value["tb_toutJourne"] ?this.convertTo24Hour(this.registerAutoAttendantForm.value["tb_timeFinConge"]):null
    eventHoliday.recurenceData = "Annuel"
    if(this.registerAutoAttendantForm.value["tb_TypeConge"] == "Date"){
      
      eventHoliday.recurrence = new RecurrenceDto()
      eventHoliday.recurrence.recurYearlyByDate = new RecurYearlyByDateDto();
      eventHoliday.recurrence.recurYearlyByDate.dayOfMonth = this.registerAutoAttendantForm.value["tb_dateInput"]
      eventHoliday.recurrence.recurYearlyByDate.month = this.registerAutoAttendantForm.value["tb_Month"]
      eventHoliday.recurenceData = "Annuel"
      this.eventsHolidays.push(eventHoliday);
    }
    else{
      eventHoliday.recurrence = new RecurrenceDto()
      eventHoliday.recurrence.recurYearlyByDay = new RecurYearlyByDayDto();
      eventHoliday.recurrence.recurYearlyByDay.day = this.registerAutoAttendantForm.value["tb_day_mounthConge"]
      eventHoliday.recurrence.recurYearlyByDay.week = this.registerAutoAttendantForm.value["tb_timeWeekConge"]
      eventHoliday.recurrence.recurYearlyByDay.month = this.registerAutoAttendantForm.value["tb_Month"]
      eventHoliday.recurenceData = "Annuel"
      this.eventsHolidays.push(eventHoliday);
    }
   
   }
 
 }
 this.isModifEvent = false
 this.showAddEventHoliday = false;
 this.registerAutoAttendantForm.get('tb_NameEventScheduleHoliday').setValue('')
 this.registerAutoAttendantForm.get('tb_Recurence').setValue('Aucun')
 this.registerAutoAttendantForm.get('tb_dateDebutConge').setValue(new Date())
 this.registerAutoAttendantForm.get('tb_dateFinConge').setValue(new Date())
 this.registerAutoAttendantForm.get('tb_timeDebutConge').setValue(new Date().getHours() + ":" + new Date().getMinutes() + " AM")
 this.registerAutoAttendantForm.get('tb_timeFinConge').setValue(new Date().getHours() + ":" + new Date().getMinutes() + " AM")
}
modifEventHoliday(){

}
getWeekDay(day:string, rec:RecurWeeklyDto) : RecurWeeklyDto{
  rec = new RecurWeeklyDto()
  switch(day){
    case "MONDAY":
      rec.monday=true
      rec.tuesday = false
      rec.wednesday = false
      rec.thursday = false
      rec.friday = false
      rec.saturday = false
      rec.sunday = false
      break; 
      case "TUESDAY":
        rec.monday=false
        rec.tuesday = true
        rec.wednesday = false
        rec.thursday = false
        rec.friday = false
        rec.saturday = false
        rec.sunday = false
      break;
      case "WEDNESDAY":
        rec.monday=false
        rec.tuesday = false
        rec.wednesday = true
        rec.thursday = false
        rec.friday = false
        rec.saturday = false
        rec.sunday = false
      break; 
      case "THURSDAY":
        rec.monday=false
        rec.tuesday = false
        rec.wednesday = false
        rec.thursday = true
        rec.friday = false
        rec.saturday = false
        rec.sunday = false
      break; 
      case "FRIDAY":
        rec.monday=false
        rec.tuesday = false
        rec.wednesday = false
        rec.thursday = false
        rec.friday = true
        rec.saturday = false
        rec.sunday = false
      break;  
      case "SATURDAY":
        rec.monday=false
        rec.tuesday = false
        rec.wednesday = false
        rec.thursday = false
        rec.friday = false
        rec.saturday = true
        rec.sunday = false
      break;  
      case "SUNDAY":
        rec.monday=false
        rec.tuesday = false
        rec.wednesday = false
        rec.thursday = false
        rec.friday = false
        rec.saturday = false
        rec.sunday = true
      break;  
  }
  return rec
}
recurenceWeekly = false;
recurenceMonth = false
getDataRecurence(event){
  if(event == "Annuel"){
    this.recurenceMonth = true
    this.recurenceWeekly = false;
  }
 else if(event == "Hebdomadaire"){
    this.recurenceWeekly = true;
    this.recurenceMonth = false
  }
  else{
    this.recurenceWeekly = false;
    this.recurenceMonth = false
  }
}
showAddEventHoliday = false
addEventHoliday(){
this.showAddEventHoliday = true;
}
annuleAddEvent(){
  this.showAddEventHoliday = false;
  this.listDays = [];
}
getFormatDate(date : Date){
  let bbb = formatDate(date,"dd MM , yyyy","en")
  return  bbb;
}
showTime = true
toutJourne(){
  this.showTime = !this.showTime 
}
isModifEvent = false;
modificationEventHoliday : Event
modfierEvent(ev:Event){
  this.isModifEvent = true;
  this.modificationEventHoliday = ev
  this.showAddEventHoliday = true;
  this.registerAutoAttendantForm.get('tb_NameEventScheduleHoliday').setValue(ev.name)
  this.registerAutoAttendantForm.get('tb_Recurence').setValue(ev.recurenceData)
  this.registerAutoAttendantForm.get('tb_dateDebutConge').setValue(ev.startDate)
  this.registerAutoAttendantForm.get('tb_dateFinConge').setValue(ev.endDate)
  this.registerAutoAttendantForm.get('tb_timeDebutConge').setValue(ev.startTime)
  this.registerAutoAttendantForm.get('tb_timeFinConge').setValue(ev.endTime)
}
deleteEvent(ev:Event){
  this.eventsHolidays = this.eventsHolidays.filter(e=>e.name != ev.name)
}
notAddEvent = true;
correctDate = false
comparedate(){
  
  let dateDebut = formatDate(this.registerAutoAttendantForm.value["tb_dateDebutConge"],'yyyy-MM-dd', 'en')
  let dateFin = formatDate(this.registerAutoAttendantForm.value["tb_dateFinConge"],'yyyy-MM-dd', 'en')
  let timeDebut = this.registerAutoAttendantForm.value["tb_timeDebutConge"]
  let timeFin = this.registerAutoAttendantForm.value["tb_timeFinConge"]
  let name = this.registerAutoAttendantForm.value["tb_NameEventScheduleHoliday"]
if(dateDebut>dateFin){
  this.notAddEvent = true
}
else if(dateDebut < dateFin){
  this.correctDate = true
  if(name!=""){
    this.notAddEvent = false
  }
  else{
    this.notAddEvent = true
  }
}
else {
  const time1 = moment(timeDebut, 'hh:mm A');
  const time2 = moment(timeFin, 'hh:mm A');
  if (time1.isBefore(time2)) {
    this.correctDate = true
    if(name!=""){
      this.notAddEvent = false
    }
    else{
      this.notAddEvent = true
    }
   
  } else if (time1.isAfter(time2)) {
    this.notAddEvent = true
  } else {
    this.notAddEvent = true
  }
}
}
compareTime(ev,type : string){
  let dateDebut = formatDate(this.registerAutoAttendantForm.value["tb_dateDebutConge"],'yyyy-MM-dd', 'en')
  let dateFin = formatDate(this.registerAutoAttendantForm.value["tb_dateFinConge"],'yyyy-MM-dd', 'en')
  let timeDebut = this.registerAutoAttendantForm.value["tb_timeDebutConge"]
  let timeFin = this.registerAutoAttendantForm.value["tb_timeFinConge"]
  let name = this.registerAutoAttendantForm.value["tb_NameEventScheduleHoliday"]
  if(type == "Debut"){
    timeDebut = ev
  }
  else{
    timeFin = ev
  }
if(dateDebut>dateFin){
  this.notAddEvent = true
}
else if(dateDebut < dateFin){
  
  this.correctDate = true
  if(name!=""){
    this.notAddEvent = false
  }
  else{
    this.notAddEvent = true
  }
}
else {
  const time1 = moment(timeDebut, 'hh:mm A');
  const time2 = moment(timeFin, 'hh:mm A');
  if (time1.isBefore(time2)) {
    this.correctDate = true
    if(name!=""){
      this.notAddEvent = false
    }
    else{
      this.notAddEvent = true
    }
  } else if (time1.isAfter(time2)) {
    this.notAddEvent = true
  } else {
    this.notAddEvent = true
  }
}
}
remplirNameEventConge(){
  let name = this.registerAutoAttendantForm.value["tb_NameEventScheduleHoliday"]
  if(name != ""){
    let dateDebut = formatDate(this.registerAutoAttendantForm.value["tb_dateDebutConge"],'yyyy-MM-dd', 'en')
    let dateFin = formatDate(this.registerAutoAttendantForm.value["tb_dateFinConge"],'yyyy-MM-dd', 'en')
    let timeDebut = this.registerAutoAttendantForm.value["tb_timeDebutConge"]
    let timeFin = this.registerAutoAttendantForm.value["tb_timeFinConge"]
  if(dateDebut>dateFin){
    this.notAddEvent = true
  }
  else if(dateDebut < dateFin){
    this.notAddEvent = false
  }
  else {
    const time1 = moment(timeDebut, 'hh:mm A');
    const time2 = moment(timeFin, 'hh:mm A');
    if (time1.isBefore(time2)) {
      this.notAddEvent = false
    } else if (time1.isAfter(time2)) {
      this.notAddEvent = true
    } else {
      this.notAddEvent = true
    }
  }
  }
  else{
    this.notAddEvent = true
  }
}
parDay = false;
parDate = true
choiseDateorDay(ev){
if(ev=="Jour"){
  this.parDay = true
  this.parDate = false
}
else{
  this.parDay = false
  this.parDate = true
}
}

}
