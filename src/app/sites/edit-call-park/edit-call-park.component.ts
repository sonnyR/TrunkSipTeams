import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CallPark } from 'src/app/Model/call-park.model';
import { WebexService } from 'src/app/services/webex.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-call-park',
  templateUrl: './edit-call-park.component.html',
  styleUrls: ['./edit-call-park.component.css']
})
export class EditCallParkComponent implements OnInit {
  orgId: string;
  userid: string;
  locationId: string;
  idCallPark: string;
  registerCallParkForm: FormGroup;
  submitted = false;
  CallParkModel: CallPark
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  callPark: CallPark = new CallPark();
  constructor(private activeModal: NgbActiveModal, private webexServices: WebexService, private formBuilder: FormBuilder) { }
  ngOnInit(): void {
  }
  get f() { return this.registerCallParkForm.controls; }
  Init(orgId: string, userid: string, locationId: string, callPark: CallPark) {
    this.orgId = orgId;
    this.userid = userid;
    this.locationId = locationId;
    this.CallParkModel = callPark;
    this.registerCallParkForm = this.formBuilder.group({
      tb_NameCallQueue: ['', Validators.required],
      tb_FirstName: ['', Validators.required],
      tb_LastName: ['', Validators.required],
      tb_PhoneNumber: [''],
      tb_extension:[''],
      tb_phoneNumberForOutgoingCallsEnabled:[false],
      tb_queueSize:[10, Validators.required],
      tb_routingType:['PRIORITY_BASED'],
      tb_policy:['CIRCULAR'],
      tb_action : ['PERFORM_BUSY_TREATMENT',Validators.required],
      tb_transferNumber:[''],
      tb_sendToVoicemail:[false],
      tb_overflowAfterWaitEnabled:[false],
      tb_overflowAfterWaitTime:[30,Validators.required],
      tb_playOverflowGreetingEnabled:[false],
      tb_greeting:['DEFAULT'],
      tb_enabled_waitingMessage:[true],
      tb_enabled_welcomeAnnouncement:[true],
      tb_welcomeAnnouncementsAlways:[false],
      tb_greeting_welcomeMessage:['DEFAULT'],
      tb_waitMessageAnnouncement:[false],
      tb_defaultHandlingTime:[1],
      tb_playUpdatedEstimatedWaitMessage:[false],
      tb_estimatedWaitingTime:[10,Validators.required],
      tb_waitMode:['POSITION'],
      tb_queuePosition:[10,Validators.required],
      tb_handlingTime:[10,Validators.required],
      tb_highVolumeMessageEnabled:[false],
      tb_enabled_comfortMessage:[false],
      tb_timeBetweenMessages:[10,Validators.required],
      tb_comfortGreeting:["DEFAULT"],
      tb_comfortBypassEnabled:[false],
      tb_callWaitingAgeThreshold:[30,Validators.required],
      tb_greetingType_comfortBypass:['DEFAULT'],
      tb_mohMessageAnnouncement:[false],
      tb_mohMessageGreeting:['DEFAULT'],
      tb_mohAlternateMessageSource:[false],
      tb_mohAlternateMessageGreeting:['DEFAULT'],
      tb_whisperAnnouncement:[false],
      tb_greetingType_whisper:['DEFAULT'],
      tb_agents:[''],
      tb_allowCallWaitingForAgentsEnabled:[false],
      tb_allowAgentJoinEnabled:[false],
      tb_welcomeGreetingFileName:[''],
      tb_audio:[''],
      formCoefAndNiv: this.formBuilder.array([])

    });
    this.GetDetailsCallPark();

  }
  GetDetailsCallPark() {
    this.webexServices.GetDetailsCallPark(this.locationId, this.CallParkModel.id, this.orgId)
      .subscribe(data => {
        if (data["status"] == "success") {
          this.callPark = data["result"] as CallPark;
          this.registerCallParkForm = this.formBuilder.group({
            tb_NameCallPark: [this.callPark.name, Validators.required],
            tb_option: [this.callPark.option, Validators.required],
            tb_user: ['']
          });
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
  close() {
    this.passEntry.emit("Closed");
    this.activeModal.dismiss();
  }
  onSubmit() {
    this.submitted = true;
    if (this.registerCallParkForm.invalid) {
      return;
    }
    var objCall = new CallPark
    objCall.name = this.registerCallParkForm.value["tb_NameCallPark"];
    objCall.option = this.registerCallParkForm.value["tb_option"];
    objCall.id = this.callPark.id;
    objCall.locationId = this.locationId;
    objCall.locationName = this.CallParkModel.locationName;
    this.webexServices.UpdateCallPark(objCall, this.orgId, this.locationId)
      .subscribe(data => {
        if (data != null && data["status"] == "success") {
          this.CallParkModel = data["result"];
          this.close();
          // var history = new HistoriquesCommande();
          // history.description = "Modification";
          // history.userOperation = this.userid;
          // history.entID = this.entID;
          // var siteLog = new SiteLogs();
          // siteLog.commentaire = "Création du site " + this.registerSiteForm.value["tb_name"];
          // siteLog.entID = this.entID;
          // siteLog.nameSite = this.registerSiteForm.value["tb_name"];
          // siteLog.idSite = this.SiteModel["id"]
          // history.siteLogs = [];
          // history.siteLogs.push(siteLog);
          // this.SaveHistoriquesCommande(history);
          // this.toastr.success('le site ' + this.registerSiteForm.value["tb_name"] + ' est ajouté avec succes');
          // this.submitted = false;
          // formDirective.resetForm();
          // this.registerSiteForm.reset();
        }
        else {
          var str: string = data["message"];
          str = str + ": " + data["erreur"]
          Swal.fire({
            icon: 'error',
            text: str
          })
        }
      }, error => {
        var str: string = error["error"]["message"];
        str = str + ":  " + error["error"]["erreur"];
        Swal.fire({
          icon: 'error',
          text: str
        })
      }
      );
  }

}
