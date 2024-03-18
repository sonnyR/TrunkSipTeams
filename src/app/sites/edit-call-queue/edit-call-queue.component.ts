import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AlternateSourceMohMessageSettingCallQueue } from 'src/app/Model/alternate-source-moh-message-setting-call-queue.@model';
import { CallPolicies } from 'src/app/Model/call-policies.model';
import { CallQueue } from 'src/app/Model/call-queue.model';
import { ComfortMessageBypassSettingCallQueue } from 'src/app/Model/comfort-message-bypass-setting-call-queue.@model';
import { ComfortMessageQueueSettings } from 'src/app/Model/comfort-message-queue-settings.model';
import { FileAnnouncement } from 'src/app/Model/file-announcement.model';
import { HuntGroup } from 'src/app/Model/hunt-group.model';
import { MohMessageSettingCallQueue } from 'src/app/Model/moh-message-setting-call-queue.@model';
import { NormalSourceMohMessageSettingCallQueue } from 'src/app/Model/normal-source-moh-message-setting-call-queue.@model';
import { OverflowQueueSettings } from 'src/app/Model/overflow-queue-settings.model';
import { PostPersonPlaceCallQueueDto } from 'src/app/Model/post-person-place-call-queue-dto.@model';
import { PstnNumbers } from 'src/app/Model/pstn-numbers.model';
import { QueueSettings } from 'src/app/Model/queue-settings.model';
import { User } from 'src/app/Model/user.model';
import { WaitMessageQueueSettings } from 'src/app/Model/wait-message-queue-settings.model';
import { WelcomeMessageQueueSettings } from 'src/app/Model/welcome-message-queue-settings.model';
import { WhisperMessageSettingCallQueue } from 'src/app/Model/whisper-message-setting-call-queue.@model';
import { WebexService } from 'src/app/services/webex.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-call-queue',
  templateUrl: './edit-call-queue.component.html',
  styleUrls: ['./edit-call-queue.component.css']
})
export class EditCallQueueComponent implements OnInit {

  orgId: string;
  userid: string;
  locationId: string;
  idCallPark: string;
  registerCallQueueForm: FormGroup;
  submitted = false;
  callQueue: CallQueue
  CallParkModel: any
  users: User[] = [];
  entId: string
  numbersPhone: any = [];
  Destinationnumberforoverflow = false;
  numberPhoneTransfert: any = [];
  NumberAndUsers: any = []
  selectedFile: File;
  selectedFileName: string;
  userSelected: any = [];
  listFilesAnnouncement: FileAnnouncement[] = [];
  @ViewChild('fileInput') fileInput: ElementRef;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  constructor(private activeModal: NgbActiveModal, private toastr: ToastrService, private webexServices: WebexService, private formBuilder: FormBuilder) { }
  get f() { return this.registerCallQueueForm.controls; }
  ngOnInit(): void {
  }
  Init(orgId: string, userid: string, locationId: string, idCallQueue: string) {
    this.orgId = orgId;
    this.userid = userid;
    this.locationId = locationId;

    this.getPhoneNumbersLocation()
    this.getDetailsCallQueue(idCallQueue)
    this.getNivAp()

  }
  ligneDirect = false
  numeroEmplacement = false;
  showLigneAttributeEmplacementViaCallQueu = true;
  ligneAttributeEmplacementViaCallQueu: PstnNumbers[] = [];
  mainPhoneNumber: PstnNumbers
  getPhoneNumbersLocation() {
    this.webexServices.GetNumbersEntrepriseLoction(this.entId, this.orgId, this.locationId)
      .subscribe(data => {
        if (data["status"] == "success") {
          this.numbersPhone = data["result"] as PstnNumbers[];

          this.ligneAttributeEmplacementViaCallQueu = this.numbersPhone.filter((e: any) => e["phoneNumber"] != null && e["owner"] != null && e.owner.type == "CALL_QUEUE")

          if (this.numbersPhone.length != 0) {

            this.mainPhoneNumber = this.numbersPhone.filter(num => num.mainNumber)[0]
            if (this.mainPhoneNumber != null || this.mainPhoneNumber != undefined) {
              this.numeroEmplacement = true
            }
          }
          this.numbersPhone = this.numbersPhone.filter((e: any) => e["owner"] == null)
          this.numberPhoneTransfert = data["result"];
          this.numberPhoneTransfert = this.numberPhoneTransfert.filter((e: any) => e["owner"] != null)
          this.NumberAndUsers = this.numberPhoneTransfert.filter((e: any) => e["owner"] != null && e.owner.type == "PEOPLE")
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
  getDetailsCallQueue(id: string) {
    this.webexServices.GetDetailsCallQueue(this.locationId, id, this.orgId)
      .subscribe(data => {
        if (data["status"] == "success") {
          this.callQueue = data["result"] as CallQueue;
          var agents = []
          if (this.callQueue.queueSettings.overflow.action == "TRANSFER_TO_PHONE_NUMBER") {
            this.Destinationnumberforoverflow = true
          }
          if (this.callQueue.queueSettings.overflow.playOverflowGreetingEnabled) {
            this.showLireAnnonce = true
          }
          if (this.callQueue.queueSettings.overflow.overflowAfterWaitEnabled) {
            this.showactiveNumberQueu = true
          }
          if (this.callQueue.queueSettings.welcomeMessage.enabled) {
            this.showEstimationMessage = true
          }
          if (this.callQueue.queueSettings.comfortMessage.enabled) {
            this.showAnnouncementComfortMessage = true
          }
          if (this.callQueue.queueSettings.comfortMessageBypass.enabled) {
            this.showcomfortBypassEnabled = true
          }
          if (this.callQueue.queueSettings.mohMessage.normalSource.enabled) {
            this.showmohMessageAnnouncement = true
          }
          if (this.callQueue.queueSettings.whisperMessage.enabled) {
            this.showwhisperAnnouncement = true
          }
          if (this.callQueue.callPolicies.routingType == "SKILL_BASED") {
            this.showniveauAptitude = true
            this.affichetype = false
          }
          if (this.callQueue.callPolicies.policy == "WEIGHTED") {

            this.showCoefficient = true
          }
          if (this.callQueue.queueSettings.overflow.audioFiles != null && this.callQueue.queueSettings.overflow.audioFiles.length != 0) {
            this.showPersonnelAnnoucemnt = true;
          }
          if (this.callQueue.queueSettings.welcomeMessage.audioFiles != null && this.callQueue.queueSettings.welcomeMessage.audioFiles.length != 0) {
            this.showPersonnelAnnounceWelcomeMessage = true;
          }
          if (this.callQueue.queueSettings.comfortMessage.audioFiles != null && this.callQueue.queueSettings.comfortMessage.audioFiles.length != 0) {
            this.showPersonnelAnnounceComfortMessage = true;
          }
          if (this.callQueue.queueSettings.comfortMessageBypass.audioFiles != null && this.callQueue.queueSettings.comfortMessageBypass.audioFiles.length != 0) {
            this.showPersonnelAnnounceComfortMessageBypass = true;
          }
          if (this.callQueue.queueSettings.mohMessage.alternateSource.audioFiles != null && this.callQueue.queueSettings.mohMessage.alternateSource.audioFiles.length != 0) {
            this.showPersonnelAnnounceAlternateSource = true;
          }
          if (this.callQueue.queueSettings.mohMessage.normalSource.audioFiles != null && this.callQueue.queueSettings.mohMessage.normalSource.audioFiles.length != 0) {
            this.showPersonnelAnnounceNormalSource = true;
          }
          if (this.callQueue.queueSettings.whisperMessage.audioFiles != null && this.callQueue.queueSettings.whisperMessage.audioFiles.length != 0) {
            this.showPersonnelAnnounceWhisperMessage = true;
          }

          this.registerCallQueueForm = this.formBuilder.group({
            tb_NameCallQueue: [this.callQueue.name, Validators.required],
            tb_FirstName: [this.callQueue.firstName, Validators.required],
            tb_LastName: [this.callQueue.lastName, Validators.required],
            tb_PhoneNumber: [this.callQueue.phoneNumber],
            tb_extension: [this.callQueue.extension],
            tb_phoneNumberForOutgoingCallsEnabled: [this.callQueue.phoneNumberForOutgoingCallsEnabled],
            tb_callingLineIdPolicy: [this.callQueue.callingLineIdPolicy],
            tb_callingLineIdPhoneNumber: [this.callQueue.callingLineIdPhoneNumber],
            tb_queueSize: [this.callQueue.queueSettings.queueSize, Validators.required],
            tb_routingType: [this.callQueue.callPolicies.routingType],
            tb_policy: [this.callQueue.callPolicies.policy],
            tb_action: [this.callQueue.queueSettings.overflow.action],
            tb_transferNumber: [this.callQueue.queueSettings.overflow.transferNumber, this.callQueue.queueSettings.overflow.action == "TRANSFER_TO_PHONE_NUMBER" ? Validators.required : Validators.nullValidator],
            tb_sendToVoicemail: [this.callQueue.queueSettings.overflow.sendToVoicemail],
            tb_overflowAfterWaitEnabled: [this.callQueue.queueSettings.overflow.overflowAfterWaitEnabled],
            tb_overflowAfterWaitTime: [this.callQueue.queueSettings.overflow.overflowAfterWaitTime, Validators.required],
            tb_playOverflowGreetingEnabled: [this.callQueue.queueSettings.overflow.playOverflowGreetingEnabled],
            tb_greeting: [this.callQueue.queueSettings.overflow.greeting],
            tb_enabled_waitingMessage: [this.callQueue.queueSettings.waitMessage.enabled],
            tb_enabled_welcomeAnnouncement: [this.callQueue.queueSettings.welcomeMessage.enabled],
            tb_welcomeAnnouncementsAlways: [this.callQueue.queueSettings.welcomeMessage.alwaysEnabled],
            tb_greeting_welcomeMessage: [this.callQueue.queueSettings.welcomeMessage.greeting],
            tb_WelcomeMsgFileName: [this.callQueue.queueSettings.welcomeMessage.audioFiles],
            tb_waitMessageAnnouncement: [this.callQueue.queueSettings.waitMessage.enabled],
            tb_defaultHandlingTime: [this.callQueue.queueSettings.waitMessage.defaultHandlingTime],
            tb_playUpdatedEstimatedWaitMessage: [this.callQueue.queueSettings.waitMessage.playUpdatedEstimatedWaitMessage],
            tb_estimatedWaitingTime: [this.callQueue.queueSettings.waitMessage.estimatedWaitingTime, this.callQueue.queueSettings.waitMessage.playUpdatedEstimatedWaitMessage ? Validators.required : Validators.nullValidator],
            tb_waitMode: [this.callQueue.queueSettings.waitMessage.waitMode],
            tb_queuePosition: [this.callQueue.queueSettings.waitMessage.queuePosition],
            tb_handlingTime: [this.callQueue.queueSettings.waitMessage.handlingTime],
            tb_highVolumeMessageEnabled: [this.callQueue.queueSettings.waitMessage.highVolumeMessageEnabled],
            tb_enabled_comfortMessage: [this.callQueue.queueSettings.comfortMessage.enabled],
            tb_timeBetweenMessages: [this.callQueue.queueSettings.comfortMessage.timeBetweenMessages, this.callQueue.queueSettings.comfortMessage.enabled ? Validators.required : Validators.nullValidator],
            tb_comfortGreeting: [this.callQueue.queueSettings.comfortMessage.greeting],
            tb_ComfortMsgFileName: [this.callQueue.queueSettings.comfortMessage.audioFiles],
            tb_comfortBypassEnabled: [this.callQueue.queueSettings.comfortMessageBypass.enabled],
            tb_ComfortMsgByPassFileName: [this.callQueue.queueSettings.comfortMessageBypass.audioFiles],
            tb_callWaitingAgeThreshold: [this.callQueue.queueSettings.comfortMessageBypass.callWaitingAgeThreshold, this.callQueue.queueSettings.comfortMessage.greeting ? Validators.required : Validators.nullValidator],
            tb_greetingType_comfortBypass: [this.callQueue.queueSettings.comfortMessageBypass.greeting],
            tb_mohMessageAnnouncement: [this.callQueue.queueSettings.mohMessage.normalSource.enabled],
            tb_mohMessageGreeting: [this.callQueue.queueSettings.mohMessage.normalSource.greeting],
            tb_AlternateSourceFileName: [this.callQueue.queueSettings.mohMessage.alternateSource.audioFiles],
            tb_NormalSourceFileName: [this.callQueue.queueSettings.mohMessage.normalSource.audioFiles],
            tb_mohAlternateMessageSource: [this.callQueue.queueSettings.mohMessage.alternateSource.enabled],
            tb_mohAlternateMessageGreeting: [this.callQueue.queueSettings.mohMessage.normalSource.greeting],
            tb_whisperAnnouncement: [this.callQueue.queueSettings.whisperMessage.enabled],
            tb_whisperMsgFileName: [this.callQueue.queueSettings.whisperMessage.audioFiles],
            tb_greetingType_whisper: [this.callQueue.queueSettings.whisperMessage.greeting],
            tb_agents: [agents],
            tb_allowCallWaitingForAgentsEnabled: [this.callQueue.allowAgentJoinEnabled],
            tb_allowAgentJoinEnabled: [this.callQueue.allowAgentJoinEnabled],
            tb_welcomeGreetingFileName: [''],
            tb_PlayedOverFlowFileName: [this.callQueue.queueSettings.overflow.audioFiles],
            formCoefAndNiv: this.formBuilder.array([])
          });

          if (this.callQueue.callingLineIdPolicy == "DIRECT_LINE") {

            this.ligneDirect = true
            this.numberChoice = this.callQueue.phoneNumber;

          }
          if (this.callQueue.callingLineIdPolicy == "LOCATION_NUMBER") {
            this.numeroEmplacement = true

          }
          if (this.callQueue.callingLineIdPolicy == "CUSTOM") {
            this.showCallingIdPhoneNumberByCallQueue = true

          }
          if (this.callQueue.agents.length != 0) {
            this.tableUsersSelected = true


            this.callQueue.agents.forEach(e => {
              const coefNivForm = this.formBuilder.group({
                tb_weight: [e.weight],
                tb_skillLevel: [e.skillLevel],
                tb_joinEnabled: [e.joinEnabled]
              });
              this.formCoefAndNiv.push(coefNivForm);
              agents.push(e.id);
              this.userSelected.push(this.NumberAndUsers.filter(us => us.owner.id == e.id)[0])
            })
          }
          else {
            this.tableUsersSelected = false;
          }


        }
        else {
          this.toastr.error("une erreur technique est survenue")

        }
      }, error => {
        this.toastr.error("une erreur technique est survenue")

      });
  }
  get formCoefAndNiv() {
    return this.registerCallQueueForm.controls["formCoefAndNiv"] as FormArray;
  }
  showniveauAptitude = false
  tableUsersSelected = false;
  niveauAptitude(event: any) {
    if (event.target.value == 'WEIGHTED') {
      this.showniveauAptitude = true
    }
    else {
      this.showniveauAptitude = false
    }
  }

  selectedUser(users: any) {
    const coefNivForm = this.formBuilder.group({
      tb_weight: [''],
      tb_skillLevel: [''],
      tb_joinEnabled: [true]
    });
    this.formCoefAndNiv.push(coefNivForm);

    this.formCoefAndNiv.reset()
    if (users.length != 0) {
      this.userSelected = []

      users.forEach(user => {
        var numUser = this.NumberAndUsers.filter(e => e.owner.id == user)
        this.userSelected.push(numUser[0])
        if (this.registerCallQueueForm.value["tb_policy"] == 'WEIGHTED') {
          var coff = (100 / (this.userSelected.length)).toString()
          this.formCoefAndNiv.controls.forEach(x => {
            (x as FormGroup).controls['tb_weight'].setValue(coff);
          })
        }
        if (this.registerCallQueueForm.value["tb_routingType"] == 'SKILL_BASED') {
          this.formCoefAndNiv.controls.forEach(x => {
            (x as FormGroup).controls['tb_skillLevel'].setValue(1);
          })
        }
      })
      this.tableUsersSelected = true
    }
    else {
      this.formCoefAndNiv.reset()
      this.userSelected = []
      this.tableUsersSelected = false
    }
  }
  DeleteUser(numUser: any, index: number) {

    this.userSelected = this.userSelected.filter(e => e.owner.id != numUser.owner.id)
    this.formCoefAndNiv.removeAt(index)

    var uuu = []
    this.formCoefAndNiv.reset()
    this.userSelected.forEach(e => {

      uuu.push(e.owner.id)
      if (this.registerCallQueueForm.value["tb_policy"] == 'WEIGHTED') {
        var coff = (100 / (this.userSelected.length)).toString()
        this.formCoefAndNiv.controls.forEach(x => {
          (x as FormGroup).controls['tb_weight'].setValue(coff);
        })
      }
      if (this.registerCallQueueForm.value["tb_routingType"] == 'SKILL_BASED') {
        this.formCoefAndNiv.controls.forEach(x => {
          (x as FormGroup).controls['tb_skillLevel'].setValue(1);
        })
      }

    })
    this.registerCallQueueForm.controls['tb_agents'].setValue(uuu)
    if (this.userSelected.length == 0) {
      this.formCoefAndNiv.reset()
      this.tableUsersSelected = false
    }
  }
  close() {
    this.passEntry.emit("Closed");
    this.activeModal.dismiss();
  }
  obligatoireExtension = true;
  numberChoice = ""
  setExtensionOblige(number: any) {
    if (number == "" || number == null) {
      this.obligatoireExtension = true;
      this.registerCallQueueForm.controls["tb_extension"].setValidators([Validators.required, Validators.pattern("^[0-9]*$"),
      Validators.minLength(2), Validators.maxLength(6)]);
      this.registerCallQueueForm.controls['tb_extension'].updateValueAndValidity();
      this.ligneDirect = false;
      this.showLigneAttributeEmplacementViaCallQueu = true;
    }
    else {
      this.numberChoice = number
      this.obligatoireExtension = false;
      this.registerCallQueueForm.controls["tb_extension"].clearValidators();
      this.registerCallQueueForm.controls['tb_extension'].updateValueAndValidity();
      this.ligneDirect = true;
      this.showLigneAttributeEmplacementViaCallQueu = false;
    }
  }
  showCallingIdPhoneNumberByCallQueue = false

  getCallingLineIdPolicy(ev) {
    const callingLineIdPolicy1 = document.getElementById('callingLineIdPolicy1',) as HTMLInputElement | null;
    const callingLineIdPolicy2 = document.getElementById('callingLineIdPolicy2',) as HTMLInputElement | null;
    const callingLineIdPolicy3 = document.getElementById('callingLineIdPolicy3',) as HTMLInputElement | null;


    if (ev.target.value == "DIRECT_LINE") {
      this.showCallingIdPhoneNumberByCallQueue = false
      this.registerCallQueueForm.get('tb_callingLineIdPolicy').setValue('DIRECT_LINE')
      if (callingLineIdPolicy2 != null) {
        callingLineIdPolicy2.checked = false;
      }
      if (callingLineIdPolicy3 != null) {
        callingLineIdPolicy3.checked = false;

      }
    }
    else if (ev.target.value == "LOCATION_NUMBER") {
      this.showCallingIdPhoneNumberByCallQueue = false
      this.registerCallQueueForm.get('tb_callingLineIdPolicy').setValue('LOCATION_NUMBER')
      if (callingLineIdPolicy1 != null) {
        callingLineIdPolicy1.checked = false;
      }
      if (callingLineIdPolicy3 != null) {
        callingLineIdPolicy3.checked = false;

      }
    }
    else {
      this.showCallingIdPhoneNumberByCallQueue = true
      this.registerCallQueueForm.get('tb_callingLineIdPolicy').setValue(ev.target.value)
      if (callingLineIdPolicy1 != null) {
        callingLineIdPolicy1.checked = false;
      }
      if (callingLineIdPolicy2 != null) {
        callingLineIdPolicy2.checked = false;

      }
    }
  }
  startsWithSearchFn(item: any, term: any) {
    return item.startsWith(term);
  }
  extensionControl(event: any) {
    const pattern = /[0-9\ ]/;
    return (event.charCode === 0 || pattern.test(String.fromCharCode(event.charCode)));
  }
  affichetype = true
  getRoutingType(event: any) {
    if (event.target.value == "PRIORITY_BASED") {
      this.affichetype = true
      this.showCoefficient = false
      this.showniveauAptitude = false
    }
    else {
      if (this.registerCallQueueForm.value["tb_policy"] == 'WEIGHTED' || this.registerCallQueueForm.value["tb_policy"] == 'SIMULTANEOUS') {
        this.registerCallQueueForm.value["tb_policy"] = 'CIRCULAR'
      }
      this.affichetype = false

      this.showniveauAptitude = true
      //this.showCoefficient = true
    }
  }
  showCoefficient = false;
  pendrePolicy(event: any) {
    if (event.target.value == 'WEIGHTED') {
      this.showCoefficient = true
      this.showniveauAptitude = false
    }
    else {
      this.showCoefficient = false
    }
  }

  checkAction(event: any) {
    if (event == 'TRANSFER_TO_PHONE_NUMBER') {
      this.Destinationnumberforoverflow = true;
      this.registerCallQueueForm.controls['tb_transferNumber'].setValidators([Validators.required])
      this.registerCallQueueForm.controls['tb_transferNumber'].updateValueAndValidity()
    }
    else {
      this.Destinationnumberforoverflow = false
      this.registerCallQueueForm.controls['tb_transferNumber'].clearValidators()
      this.registerCallQueueForm.controls['tb_transferNumber'].updateValueAndValidity()
    }
  }
  showactiveNumberQueu = false
  activeNumberQueu() {
    this.showactiveNumberQueu = !this.showactiveNumberQueu
  }
  showLireAnnonce = false
  lireAnnonce() {
    this.showLireAnnonce = !this.showLireAnnonce
  }
  showEstimationMessage = true
  enabledWaitingMessage() {

    this.showEstimationMessage = !this.showEstimationMessage

  }
  showAnnouncementComfortMessage = false
  enabledComfortMessage(event: any) {
    this.showAnnouncementComfortMessage = !this.showAnnouncementComfortMessage
    if (event.target.checked) {
      this.registerCallQueueForm.controls['tb_timeBetweenMessages'].setValidators([Validators.required])
      this.registerCallQueueForm.controls['tb_timeBetweenMessages'].updateValueAndValidity()
    }
    else {
      this.registerCallQueueForm.controls['tb_timeBetweenMessages'].clearValidators()
      this.registerCallQueueForm.controls['tb_timeBetweenMessages'].updateValueAndValidity()
    }

  }
  showEstimaionTypeMessage = false
  estimaionTypeMessage() {

    this.showEstimaionTypeMessage = !this.showEstimaionTypeMessage

  }
  showNombreRepeatMessage = false
  nombreRepeatMessage(event: any) {

    this.showNombreRepeatMessage = !this.showNombreRepeatMessage

    if (event.target.checked) {
      this.registerCallQueueForm.controls['tb_estimatedWaitingTime'].setValidators([Validators.required])
      this.registerCallQueueForm.controls['tb_estimatedWaitingTime'].updateValueAndValidity()
    }
    else {
      this.registerCallQueueForm.controls['tb_estimatedWaitingTime'].clearValidators()
      this.registerCallQueueForm.controls['tb_estimatedWaitingTime'].updateValueAndValidity()
    }



  }
  showpositionWaitMode = true
  positionWaitMode() {

    this.showpositionWaitMode = !this.showpositionWaitMode
    this.showtimeWaitMode = !this.showtimeWaitMode
  }
  showtimeWaitMode = false
  timeWaitMode() {

    this.showpositionWaitMode = !this.showpositionWaitMode
    this.showtimeWaitMode = !this.showtimeWaitMode

  }
  showcomfortBypassEnabled = false
  comfortBypassEnabled(event: any) {
    this.showcomfortBypassEnabled = !this.showcomfortBypassEnabled;
    if (event.target.checked) {
      this.registerCallQueueForm.controls['tb_callWaitingAgeThreshold'].setValidators([Validators.required])
      this.registerCallQueueForm.controls['tb_callWaitingAgeThreshold'].updateValueAndValidity()
    }
    else {
      this.registerCallQueueForm.controls['tb_callWaitingAgeThreshold'].clearValidators()
      this.registerCallQueueForm.controls['tb_callWaitingAgeThreshold'].updateValueAndValidity()
    }
  }
  showmohMessageAnnouncement = false
  mohMessageAnnouncement() {
    this.showmohMessageAnnouncement = !this.showmohMessageAnnouncement
  }
  showwhisperAnnouncement = false;
  whisperAnnouncement() {
    this.showwhisperAnnouncement = !this.showwhisperAnnouncement
  }
  annoncePersonalise = true
  onFileSelected(event): void {
    this.selectedFile = event.target.files[0];
    this.selectedFileName = this.selectedFile ? this.selectedFile.name : '';
  }
  onBrowseClick(): void {
    this.fileInput.nativeElement.click();
  }


  mediaRecorder: MediaRecorder;
  chunks: Blob[] = [];
  isRecording: boolean = false;
  duration: number = 0;
  currentTime: number = 0;
  startTime: number = 0;
  showRecording = false
  audioUrl: string;
  disabledJoinFile = false
  saveRecording() {
    this.showRecording = !this.showRecording;
    this.disabledJoinFile = !this.disabledJoinFile
  }

  onRecordButtonClick() {

    if (this.isRecording) {
      // Stop recording
      this.mediaRecorder.stop();
      this.isRecording = false;
      return;
    }

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        // Create MediaRecorder instance
        this.mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

        // Set up event listeners
        this.mediaRecorder.addEventListener('dataavailable', (event) => {
          this.chunks.push(event.data);
          this.currentTime += this.mediaRecorder.state === 'recording' ? event.timeStamp - this.startTime : 0;

          // Update the value of the audioData form control
          const blob = new Blob(this.chunks, { type: 'audio/webm' });
          this.registerCallQueueForm.get('tb_audio').setValue(blob);
        });

        // Handle errors
        this.mediaRecorder.addEventListener('error', (event: any) => {
          console.error('MediaRecorder error:', event.error);
        });

        // Handle stop event
        this.mediaRecorder.addEventListener('stop', () => {
          // Create a new blob with the recorded audio data
          const blob = new Blob(this.chunks, { type: 'audio/webm' });

          // Reset the chunks array
          this.chunks = [];

          // Get the duration of the recorded audio data
          const audio = new Audio();
          audio.src = URL.createObjectURL(blob);
          audio.onloadedmetadata = () => {
            this.duration = audio.duration;
            // this.currentTime = 0;
            this.audioUrl = audio.src;
          }
        });

        // Start recording
        this.startTime = performance.now();
        this.mediaRecorder.start();
        this.isRecording = true;
      })
      .catch((error) => {
        console.error('getUserMedia error:', error);
      });
  }

  onTimeChange(event) {
    // Update the current time of the audio data form control
    this.currentTime = event.target.value;
    this.registerCallQueueForm.get('audioData').setValue(this.chunks[0].slice(0, this.chunks[0].size * this.currentTime / this.duration));
  }
  isPlaying = false;
  onPlayButtonClick() {
    if (this.audioUrl) {
      try {
        const audio = new Audio(this.audioUrl);
        if (this.isPlaying) {
          //   audio.currentTime = 0;
          //  this.currentTime = 0
          audio.pause();
          this.isPlaying = false;
        }
        else {
          audio.currentTime = 0;
          audio.play();
          this.isPlaying = true;
          audio.addEventListener('timeupdate', () => {
            this.currentTime = audio.currentTime;
          });
        }
      } catch (e) {
        console.error('Failed to play audio:', e);
      }
    } else {
      console.error('Audio URL is undefined');
    }
  }
  showmohAlternateMessage = false
  mohAlternateMessage() {
    this.showmohAlternateMessage = !this.showmohAlternateMessage
  }
  onUpdateCallQueue() {

    this.submitted = true;
    if (this.registerCallQueueForm.invalid) {
      return;
    }
    this.callQueue.name = this.registerCallQueueForm.value["tb_NameCallQueue"];
    this.callQueue.firstName = this.registerCallQueueForm.value["tb_FirstName"];
    this.callQueue.lastName = this.registerCallQueueForm.value["tb_LastName"];
    this.callQueue.phoneNumber = this.registerCallQueueForm.value["tb_PhoneNumber"] != "" ? this.registerCallQueueForm.value["tb_PhoneNumber"] : null
    this.callQueue.extension = this.registerCallQueueForm.value["tb_extension"] != "" ? this.registerCallQueueForm.value["tb_extension"] : null
    this.callQueue.phoneNumberForOutgoingCallsEnabled = this.registerCallQueueForm.value["tb_phoneNumberForOutgoingCallsEnabled"];
    this.callQueue.callingLineIdPolicy = this.registerCallQueueForm.value["tb_callingLineIdPolicy"]
    if (this.callQueue.callingLineIdPolicy == "DIRECT_LINE") {
      this.callQueue.callingLineIdPhoneNumber = this.numberChoice
    }
    else if (this.callQueue.callingLineIdPolicy == "LOCATION_NUMBER") {
      this.callQueue.callingLineIdPhoneNumber = this.mainPhoneNumber.phoneNumber
    }
    else if (this.callQueue.callingLineIdPolicy == "CUSTOM") {

      this.callQueue.callingLineIdPhoneNumber = this.registerCallQueueForm.value["tb_callingLineIdPhoneNumber"]
    }
    else {
      this.callQueue.callingLineIdPolicy = null;
      this.callQueue.callingLineIdPhoneNumber = null
    }
    this.callQueue.languageCode = "fr_fr"
    this.callQueue.timeZone = "Europe/Paris"
    this.callQueue.callPolicies = new CallPolicies();
    this.callQueue.callPolicies.routingType = this.registerCallQueueForm.value["tb_routingType"];
    this.callQueue.callPolicies.policy = this.registerCallQueueForm.value["tb_policy"];
    this.callQueue.queueSettings = new QueueSettings();
    this.callQueue.queueSettings.queueSize = this.registerCallQueueForm.value["tb_queueSize"] != 0 ? this.registerCallQueueForm.value["tb_queueSize"] : null;
    this.callQueue.queueSettings.overflow = new OverflowQueueSettings()
    this.callQueue.queueSettings.overflow.action = this.registerCallQueueForm.value["tb_action"];
    if (this.callQueue.queueSettings.overflow.action == 'TRANSFER_TO_PHONE_NUMBER') {
      this.callQueue.queueSettings.overflow.transferNumber = this.registerCallQueueForm.value["tb_transferNumber"];
      this.callQueue.queueSettings.overflow.sendToVoicemail = this.registerCallQueueForm.value["tb_sendToVoicemail"];


    }
    this.callQueue.queueSettings.overflow.overflowAfterWaitEnabled = this.registerCallQueueForm.value["tb_overflowAfterWaitEnabled"];
    this.callQueue.queueSettings.overflow.playOverflowGreetingEnabled = this.registerCallQueueForm.value["tb_playOverflowGreetingEnabled"];
    this.callQueue.queueSettings.overflow.overflowAfterWaitTime = this.registerCallQueueForm.value["tb_overflowAfterWaitTime"]
    this.callQueue.queueSettings.overflow.greeting = this.registerCallQueueForm.value["tb_greeting"];

    if (this.callQueue.queueSettings.overflow.greeting == 'CUSTOM') {
      this.callQueue.queueSettings.overflow.audioFiles = []
      this.callQueue.queueSettings.overflow.audioFiles = this.registerCallQueueForm.value["tb_PlayedOverFlowFileName"]
      //callQueue.queueSettings.overflow.audioFiles.push(this.audioUrl) 
    }
    this.callQueue.queueSettings.welcomeMessage = new WelcomeMessageQueueSettings();
    this.callQueue.queueSettings.welcomeMessage.enabled = this.registerCallQueueForm.value["tb_enabled_welcomeAnnouncement"];
    this.callQueue.queueSettings.welcomeMessage.alwaysEnabled = this.registerCallQueueForm.value["tb_welcomeAnnouncementsAlways"];
    this.callQueue.queueSettings.welcomeMessage.greeting = this.registerCallQueueForm.value["tb_greeting_welcomeMessage"];
    if (this.callQueue.queueSettings.welcomeMessage.greeting == 'CUSTOM') {
      this.callQueue.queueSettings.welcomeMessage.audioFiles = []
      this.callQueue.queueSettings.welcomeMessage.audioFiles = this.registerCallQueueForm.value["tb_WelcomeMsgFileName"]
    }
    this.callQueue.queueSettings.waitMessage = new WaitMessageQueueSettings()
    this.callQueue.queueSettings.waitMessage.enabled = this.registerCallQueueForm.value["tb_waitMessageAnnouncement"];


    this.callQueue.queueSettings.waitMessage.defaultHandlingTime = this.registerCallQueueForm.value["defaultHandlingTime"] != 0 ? this.registerCallQueueForm.value["defaultHandlingTime"] : null;
    this.callQueue.queueSettings.waitMessage.playUpdatedEstimatedWaitMessage = this.registerCallQueueForm.value["tb_playUpdatedEstimatedWaitMessage"]

    this.callQueue.queueSettings.waitMessage.estimatedWaitingTime = this.registerCallQueueForm.value["tb_estimatedWaitingTime"]

    this.callQueue.queueSettings.waitMessage.waitMode = this.registerCallQueueForm.value["tb_waitMode"]
    if (this.callQueue.queueSettings.waitMessage.waitMode == 'POSITION') {
      this.callQueue.queueSettings.waitMessage.queuePosition = this.registerCallQueueForm.value["tb_queuePosition"] != 0 ? this.registerCallQueueForm.value["tb_queuePosition"] : null;
    }
    else {
      this.callQueue.queueSettings.waitMessage.highVolumeMessageEnabled = this.registerCallQueueForm.value["tb_highVolumeMessageEnabled"]
    }

    this.callQueue.queueSettings.comfortMessage = new ComfortMessageQueueSettings()
    this.callQueue.queueSettings.comfortMessage.enabled = this.registerCallQueueForm.value["tb_enabled_comfortMessage"]
    if (this.callQueue.queueSettings.comfortMessage.enabled) {
      this.callQueue.queueSettings.comfortMessage.timeBetweenMessages = this.registerCallQueueForm.value["tb_timeBetweenMessages"] != 0 ? this.registerCallQueueForm.value["tb_timeBetweenMessages"] : null;
      this.callQueue.queueSettings.comfortMessage.greeting = this.registerCallQueueForm.value["tb_comfortGreeting"]
      if (this.callQueue.queueSettings.comfortMessage.greeting == 'CUSTOM') {
        //add audio File

        this.callQueue.queueSettings.comfortMessage.audioFiles = []
        this.callQueue.queueSettings.comfortMessage.audioFiles = this.registerCallQueueForm.value["tb_ComfortMsgFileName"]

      }

    }
    else {
      this.callQueue.queueSettings.comfortMessage.greeting == 'DEFAULT'
    }
    this.callQueue.queueSettings.comfortMessageBypass = new ComfortMessageBypassSettingCallQueue()
    this.callQueue.queueSettings.comfortMessageBypass.enabled = this.registerCallQueueForm.value["tb_comfortBypassEnabled"]
    if (this.callQueue.queueSettings.comfortMessageBypass.enabled) {
      this.callQueue.queueSettings.comfortMessageBypass.callWaitingAgeThreshold = this.registerCallQueueForm.value["tb_callWaitingAgeThreshold"] != 0 ? this.registerCallQueueForm.value["tb_callWaitingAgeThreshold"] : null;
      this.callQueue.queueSettings.comfortMessageBypass.greeting = this.registerCallQueueForm.value["tb_greetingType_comfortBypass"]
      if (this.callQueue.queueSettings.comfortMessageBypass.greeting == 'CUSTOM') {

        this.callQueue.queueSettings.comfortMessageBypass.audioFiles = []
        this.callQueue.queueSettings.comfortMessageBypass.audioFiles = this.registerCallQueueForm.value["tb_ComfortMsgByPassFileName"]

      }


    }
    else {
      this.callQueue.queueSettings.comfortMessageBypass.greeting == 'DEFAULT'
    }
    this.callQueue.queueSettings.mohMessage = new MohMessageSettingCallQueue()
    this.callQueue.queueSettings.mohMessage.normalSource = new NormalSourceMohMessageSettingCallQueue()
    this.callQueue.queueSettings.mohMessage.normalSource.enabled = this.registerCallQueueForm.value["tb_mohMessageAnnouncement"]
    if (this.callQueue.queueSettings.mohMessage.normalSource.enabled) {
      this.callQueue.queueSettings.mohMessage.normalSource.greeting = this.registerCallQueueForm.value["tb_mohMessageGreeting"]
      if (this.callQueue.queueSettings.mohMessage.normalSource.greeting == 'CUSTOM') {

        this.callQueue.queueSettings.mohMessage.normalSource.audioFiles = []
        this.callQueue.queueSettings.mohMessage.normalSource.audioFiles = this.registerCallQueueForm.value["tb_NormalSourceFileName"]

      }
    }
    else {
      this.callQueue.queueSettings.mohMessage.normalSource.greeting = "DEFAULT"
    }
    this.callQueue.queueSettings.mohMessage.alternateSource = new AlternateSourceMohMessageSettingCallQueue()
    this.callQueue.queueSettings.mohMessage.alternateSource.enabled = this.registerCallQueueForm.value["tb_mohAlternateMessageSource"]
    if (this.callQueue.queueSettings.mohMessage.alternateSource.enabled) {
      this.callQueue.queueSettings.mohMessage.alternateSource.greeting = this.registerCallQueueForm.value["tb_mohAlternateMessageGreeting"]
      if (this.callQueue.queueSettings.mohMessage.alternateSource.greeting == 'CUSTOM') {
        this.callQueue.queueSettings.mohMessage.alternateSource.audioFiles = []
        this.callQueue.queueSettings.mohMessage.alternateSource.audioFiles = this.registerCallQueueForm.value["tb_AlternateSourceFileName"]
      }
    }
    else {
      this.callQueue.queueSettings.mohMessage.alternateSource.greeting = "DEFAULT"
    }
    this.callQueue.queueSettings.whisperMessage = new WhisperMessageSettingCallQueue()
    this.callQueue.queueSettings.whisperMessage.enabled = this.registerCallQueueForm.value["tb_whisperAnnouncement"]

    this.callQueue.queueSettings.whisperMessage.greeting = this.registerCallQueueForm.value["tb_greetingType_whisper"]
    if (this.callQueue.queueSettings.whisperMessage.greeting == 'CUSTOM') {

      this.callQueue.queueSettings.whisperMessage.audioFiles = []
      this.callQueue.queueSettings.whisperMessage.audioFiles = this.registerCallQueueForm.value["tb_whisperMsgFileName"]

    }

    else {
      this.callQueue.queueSettings.mohMessage.alternateSource.greeting == 'DEFAULT'
    }
    this.callQueue.agents = [];
    var postPers: PostPersonPlaceCallQueueDto = new PostPersonPlaceCallQueueDto();
    if (this.registerCallQueueForm.value["tb_agents"] != "") {
      this.registerCallQueueForm.value["tb_agents"].forEach((e: string, index) => {
        debugger
        postPers = new PostPersonPlaceCallQueueDto()
        postPers.id = e;
        postPers.weight = this.formCoefAndNiv.at(index).value["tb_weight"]
        postPers.skillLevel = this.formCoefAndNiv.at(index).value["tb_skillLevel"]
        postPers.joinEnabled = this.formCoefAndNiv.at(index).value["tb_joinEnabled"]

        this.callQueue.agents.push(postPers);
      })

    }
    else this.callQueue.agents = null

    this.callQueue.allowAgentJoinEnabled = this.registerCallQueueForm.value["tb_allowAgentJoinEnabled"];
    console.log("this.callQueue", this.callQueue)
    this.webexServices.UpdateCallQueue(this.callQueue, this.orgId, this.locationId)
      .subscribe(data => {
        if (data != null && data["status"] == "success") {
          this.toastr.success("le call queue " + this.callQueue.name + " est modifié avec succés")
          this.close();
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
        this.toastr.error("une erreur technique est survenue")

      }
      );
  }
  nivAptitude = []
  getNivAp() {
    for (var ring = 1; ring <= 20; ring++) {

      this.nivAptitude.push(ring);
    }
  }
  showPersonnelAnnoucemnt = false
  lireAnnouncement(event) {
    this.readPersonnelAnnouncement()
    if (event.target.value == "DEFAULT") {
      this.showPersonnelAnnoucemnt = false;
    }
    else {
      this.readPersonnelAnnouncement();
      this.showPersonnelAnnoucemnt = true;
    }
  }
  showPersonnelAnnounceWelcomeMessage = false
  readAnnouncementWelcomeMessage(event) {
    if (event.target.value == "DEFAULT") {
      this.showPersonnelAnnounceWelcomeMessage = false;
    }
    else {
      this.readPersonnelAnnouncement();
      this.showPersonnelAnnounceWelcomeMessage = true;
    }
  }
  showPersonnelAnnounceComfortMessage = false
  readAnnouncementComfortMessage(event) {
    if (event.target.value == "DEFAULT") {
      this.showPersonnelAnnounceComfortMessage = false;
    }
    else {
      this.readPersonnelAnnouncement();
      this.showPersonnelAnnounceComfortMessage = true;
    }
  }
  showPersonnelAnnounceComfortMessageBypass = false
  readAnnouncementComfortMessageBypass(event) {
    if (event.target.value == "DEFAULT") {
      this.showPersonnelAnnounceComfortMessageBypass = false;
    }
    else {
      this.readPersonnelAnnouncement();
      this.showPersonnelAnnounceComfortMessageBypass = true;
    }
  }
  showPersonnelAnnounceAlternateSource = false
  readAnnouncementAlternateSource(event) {
    if (event.target.value == "DEFAULT") {
      this.showPersonnelAnnounceAlternateSource = false;
    }
    else {
      this.readPersonnelAnnouncement();
      this.showPersonnelAnnounceAlternateSource = true;
    }
  }
  showPersonnelAnnounceNormalSource = false
  readAnnouncementNormalSource(event) {
    if (event.target.value == "DEFAULT") {
      this.showPersonnelAnnounceNormalSource = false;
    }
    else {
      this.readPersonnelAnnouncement();
      this.showPersonnelAnnounceNormalSource = true;
    }
  }
  showPersonnelAnnounceWhisperMessage = false
  readAnnouncementNormalWhisperMessage(event) {
    if (event.target.value == "DEFAULT") {
      this.showPersonnelAnnounceWhisperMessage = false;
    }
    else {
      this.readPersonnelAnnouncement();
      this.showPersonnelAnnounceWhisperMessage = true;
    }
  }
  readPersonnelAnnouncement() {
    this.webexServices.GetListOfCallQueueAnnouncementFiles(this.orgId, this.locationId, this.callQueue.id)
      .subscribe(data => {
        if (data["status"] == "success") {
          this.listFilesAnnouncement = data["result"] as FileAnnouncement[];
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

}
