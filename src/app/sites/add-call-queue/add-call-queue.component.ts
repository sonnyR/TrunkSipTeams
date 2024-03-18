import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbButtonLabel } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AlternateSourceMohMessageSettingCallQueue } from 'src/app/Model/alternate-source-moh-message-setting-call-queue.@model';
import { CallPolicies } from 'src/app/Model/call-policies.model';
import { CallQueue } from 'src/app/Model/call-queue.model';
import { ComfortMessageBypassSettingCallQueue } from 'src/app/Model/comfort-message-bypass-setting-call-queue.@model';
import { ComfortMessageQueueSettings } from 'src/app/Model/comfort-message-queue-settings.model';
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
  selector: 'app-add-call-queue',
  templateUrl: './add-call-queue.component.html',
  styleUrls: ['./add-call-queue.component.css']
})
export class AddCallQueueComponent implements OnInit {
  selected = false
  orgId: string;
  userid: string;
  locationId: string;
  registerCallQueueForm: FormGroup;
  submitted = false;
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
  @ViewChild('fileInput') fileInput: ElementRef;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  constructor(private activeModal: NgbActiveModal, private webexServices: WebexService,
    private toastr: ToastrService, private formBuilder: FormBuilder) { }
  get f() { return this.registerCallQueueForm.controls; }
  ngOnInit(): void {
  }
  Init(entId: string, orgId: string, userid: string, locationId: string) {
    this.orgId = orgId;
    this.userid = userid;
    this.locationId = locationId;
    this.entId = entId;
    this.getPhoneNumbersLocation();
    this.getNivAp()
    this.registerCallQueueForm = this.formBuilder.group({
      tb_NameCallQueue: ['', Validators.required],
      tb_FirstName: ['', Validators.required],
      tb_LastName: ['', Validators.required],
      tb_PhoneNumber: [''],
      tb_extension: [''],
      tb_callingLineIdPolicy: [''],
      tb_callingLineIdPhoneNumber: [''],
      tb_phoneNumberForOutgoingCallsEnabled: [false],
      tb_queueSize: [10, Validators.required],
      tb_routingType: ['PRIORITY_BASED'],
      tb_policy: ['CIRCULAR'],
      tb_action: ['PERFORM_BUSY_TREATMENT', Validators.required],
      tb_transferNumber: [''],
      tb_sendToVoicemail: [false],
      tb_overflowAfterWaitEnabled: [false],
      tb_overflowAfterWaitTime: [30, Validators.required],
      tb_playOverflowGreetingEnabled: [false],
      tb_greeting: ['DEFAULT'],
      tb_enabled_waitingMessage: [true],
      tb_enabled_welcomeAnnouncement: [true],
      tb_welcomeAnnouncementsAlways: [false],
      tb_greeting_welcomeMessage: ['DEFAULT'],
      tb_waitMessageAnnouncement: [false],
      tb_defaultHandlingTime: [1],
      tb_playUpdatedEstimatedWaitMessage: [false],
      tb_estimatedWaitingTime: [10, Validators.required],
      tb_waitMode: ['POSITION'],
      tb_queuePosition: [10, Validators.required],
      tb_handlingTime: [10, Validators.required],
      tb_highVolumeMessageEnabled: [false],
      tb_enabled_comfortMessage: [false],
      tb_timeBetweenMessages: [10, Validators.required],
      tb_comfortGreeting: ["DEFAULT"],
      tb_comfortBypassEnabled: [false],
      tb_callWaitingAgeThreshold: [30, Validators.required],
      tb_greetingType_comfortBypass: ['DEFAULT'],
      tb_mohMessageAnnouncement: [false],
      tb_mohMessageGreeting: ['DEFAULT'],
      tb_mohAlternateMessageSource: [false],
      tb_mohAlternateMessageGreeting: ['DEFAULT'],
      tb_whisperAnnouncement: [false],
      tb_greetingType_whisper: ['DEFAULT'],
      tb_agents: [''],
      tb_allowCallWaitingForAgentsEnabled: [false],
      tb_allowAgentJoinEnabled: [false],
      tb_welcomeGreetingFileName: [''],
      tb_audio: [''],
      formCoefAndNiv: this.formBuilder.array([])

    });
  }
  get formCoefAndNiv() {
    return this.registerCallQueueForm.controls["formCoefAndNiv"] as FormArray;
  }



  close() {
    this.passEntry.emit("Closed");
    this.activeModal.dismiss();
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
          if (this.ligneAttributeEmplacementViaCallQueu.length != 0) {
            this.showLigneAttributeEmplacementViaCallQueu = true;

          }
          else {
            this.showLigneAttributeEmplacementViaCallQueu = false;
          }
          if (this.numbersPhone.length != 0) {

            this.mainPhoneNumber = this.numbersPhone.filter(num => num.mainNumber)[0]

            if (this.mainPhoneNumber != null || this.mainPhoneNumber != undefined) {
              // this.ligneDirect =true;
              //this.showLigneAttributeEmplacementViaCallQueu = false;
              this.numeroEmplacement = true
            }
            // this.numbersPhone.forEach(elem=>{
            //   if(elem.mainNumber){
            //     this
            //   }
            // })
          }
          this.numbersPhone = this.numbersPhone.filter((e: any) => e["owner"] == null)
          this.numberPhoneTransfert = data["result"];
          this.numberPhoneTransfert = this.numberPhoneTransfert.filter((e: any) => e["owner"] != null)
          this.NumberAndUsers = this.numberPhoneTransfert.filter((e: any) => e["owner"] != null && e.owner.type == "PEOPLE")
          // this.numberPhoneTransfert.forEach(e=>{
          //   if(e.owner.type=="PEOPLE")
          //   this.NumberAndUsers.push(e.owner)
          // })


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
      this.showCoefficient = false
      this.showniveauAptitude = true
      //this.showCoefficient = true
    }
  }
  checkAction(event: any) {
    if (event == 'TRANSFER_TO_PHONE_NUMBER') {
      this.Destinationnumberforoverflow = true;
    }
    else {
      this.Destinationnumberforoverflow = false
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
  enabledComfortMessage() {
    this.showAnnouncementComfortMessage = !this.showAnnouncementComfortMessage
  }
  showEstimaionTypeMessage = false
  estimaionTypeMessage() {

    this.showEstimaionTypeMessage = !this.showEstimaionTypeMessage

  }
  showNombreRepeatMessage = false
  nombreRepeatMessage() {

    this.showNombreRepeatMessage = !this.showNombreRepeatMessage

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
  comfortBypassEnabled() {
    this.showcomfortBypassEnabled = !this.showcomfortBypassEnabled;
  }
  showmohMessageAnnouncement = false
  mohMessageAnnouncement() {
    this.showmohMessageAnnouncement = !this.showmohMessageAnnouncement
  }
  showwhisperAnnouncement = false;
  whisperAnnouncement() {
    this.showwhisperAnnouncement = !this.showwhisperAnnouncement
  }
  afficheBlocFichier = false
  getFichire(event: any) {
    this.afficheBlocFichier = !this.afficheBlocFichier

  }
  annoncePersonalise = true
  onFileSelected(event): void {
    this.selectedFile = event.target.files[0];
    this.selectedFileName = this.selectedFile ? this.selectedFile.name : '';
    this.registerCallQueueForm.controls["tb_welcomeGreetingFileName"].setValue(this.selectedFileName)
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
          console.log("this.mediaRecorder.state", this.mediaRecorder.state)
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
            console.log("audio.src;", audio.src)
          }

          // Do something with the recorded audio data
          console.log('Recorded audio data:', blob);
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
          console.log("audio", audio)
          //   audio.currentTime = 0;
          //  this.currentTime = 0
          audio.pause();
          console.log("audio2222", audio)
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
  onCreateCallQueue() {
    this.submitted = true;
    if (this.registerCallQueueForm.invalid) {
      return;
    }
    var callQueue = new CallQueue()
    callQueue.name = this.registerCallQueueForm.value["tb_NameCallQueue"];
    callQueue.firstName = this.registerCallQueueForm.value["tb_FirstName"];
    callQueue.lastName = this.registerCallQueueForm.value["tb_LastName"];
    callQueue.phoneNumber = this.registerCallQueueForm.value["tb_PhoneNumber"] != "" ? this.registerCallQueueForm.value["tb_PhoneNumber"] : null
    callQueue.extension = this.registerCallQueueForm.value["tb_extension"] != "" ? this.registerCallQueueForm.value["tb_extension"] : null
    callQueue.phoneNumberForOutgoingCallsEnabled = this.registerCallQueueForm.value["tb_phoneNumberForOutgoingCallsEnabled"];
    callQueue.callingLineIdPolicy = this.registerCallQueueForm.value["tb_callingLineIdPolicy"]
    if (callQueue.callingLineIdPolicy == "DIRECT_LINE") {
      callQueue.callingLineIdPhoneNumber = this.numberChoice
    }
    else if (callQueue.callingLineIdPolicy == "LOCATION_NUMBER") {
      callQueue.callingLineIdPhoneNumber = this.mainPhoneNumber.phoneNumber
    }
    else if (callQueue.callingLineIdPolicy == "CUSTOM") {

      callQueue.callingLineIdPhoneNumber = this.registerCallQueueForm.value["tb_callingLineIdPhoneNumber"]
    }
    else {
      callQueue.callingLineIdPolicy = null;
      callQueue.callingLineIdPhoneNumber = null
    }
    callQueue.languageCode = "fr_fr"
    callQueue.timeZone = "Europe/Paris"
    callQueue.callPolicies = new CallPolicies();
    callQueue.callPolicies.routingType = this.registerCallQueueForm.value["tb_routingType"];
    callQueue.callPolicies.policy = this.registerCallQueueForm.value["tb_policy"];
    callQueue.queueSettings = new QueueSettings();
    callQueue.queueSettings.queueSize = this.registerCallQueueForm.value["tb_queueSize"] != 0 ? this.registerCallQueueForm.value["tb_queueSize"] : null;
    callQueue.queueSettings.overflow = new OverflowQueueSettings()
    callQueue.queueSettings.overflow.action = this.registerCallQueueForm.value["tb_action"];
    if (callQueue.queueSettings.overflow.action == 'TRANSFER_TO_PHONE_NUMBER') {
      callQueue.queueSettings.overflow.transferNumber = this.registerCallQueueForm.value["tb_transferNumber"];
      callQueue.queueSettings.overflow.sendToVoicemail = this.registerCallQueueForm.value["tb_sendToVoicemail"];


    }
    callQueue.queueSettings.overflow.overflowAfterWaitEnabled = this.registerCallQueueForm.value["tb_overflowAfterWaitEnabled"];
    callQueue.queueSettings.overflow.playOverflowGreetingEnabled = this.registerCallQueueForm.value["tb_playOverflowGreetingEnabled"];
    callQueue.queueSettings.overflow.overflowAfterWaitTime = this.registerCallQueueForm.value["tb_overflowAfterWaitTime"]
    callQueue.queueSettings.overflow.greeting = this.registerCallQueueForm.value["tb_greeting"];

    if (callQueue.queueSettings.overflow.greeting == 'CUSTOM') {
      callQueue.queueSettings.overflow.audioFiles = []
      callQueue.queueSettings.overflow.audioFiles = [this.registerCallQueueForm.value["tb_welcomeGreetingFileName"]]
      //callQueue.queueSettings.overflow.audioFiles.push(this.audioUrl) 
    }
    callQueue.queueSettings.welcomeMessage = new WelcomeMessageQueueSettings();
    callQueue.queueSettings.welcomeMessage.enabled = this.registerCallQueueForm.value["tb_enabled_welcomeAnnouncement"];
    callQueue.queueSettings.welcomeMessage.alwaysEnabled = this.registerCallQueueForm.value["tb_welcomeAnnouncementsAlways"];
    callQueue.queueSettings.welcomeMessage.greeting = this.registerCallQueueForm.value["tb_greeting_welcomeMessage"];
    callQueue.queueSettings.waitMessage = new WaitMessageQueueSettings()
    callQueue.queueSettings.waitMessage.enabled = this.registerCallQueueForm.value["tb_waitMessageAnnouncement"];

    callQueue.queueSettings.waitMessage.defaultHandlingTime = this.registerCallQueueForm.value["defaultHandlingTime"] != 0 ? this.registerCallQueueForm.value["defaultHandlingTime"] : null;
    callQueue.queueSettings.waitMessage.playUpdatedEstimatedWaitMessage = this.registerCallQueueForm.value["tb_playUpdatedEstimatedWaitMessage"]
    callQueue.queueSettings.waitMessage.waitMode = this.registerCallQueueForm.value["tb_waitMode"]
    if (callQueue.queueSettings.waitMessage.waitMode == 'POSITION') {
      callQueue.queueSettings.waitMessage.queuePosition = this.registerCallQueueForm.value["tb_queuePosition"] != 0 ? this.registerCallQueueForm.value["tb_queuePosition"] : null;
    }
    else {
      callQueue.queueSettings.waitMessage.highVolumeMessageEnabled = this.registerCallQueueForm.value["tb_highVolumeMessageEnabled"]
    }

    callQueue.queueSettings.comfortMessage = new ComfortMessageQueueSettings()
    callQueue.queueSettings.comfortMessage.enabled = this.registerCallQueueForm.value["tb_enabled_comfortMessage"]
    if (callQueue.queueSettings.comfortMessage.enabled) {
      callQueue.queueSettings.comfortMessage.timeBetweenMessages = this.registerCallQueueForm.value["tb_timeBetweenMessages"] != 0 ? this.registerCallQueueForm.value["tb_timeBetweenMessages"] : null;
      callQueue.queueSettings.comfortMessage.greeting = this.registerCallQueueForm.value["tb_comfortGreeting"]
      if (callQueue.queueSettings.comfortMessage.greeting == 'CUSTOM') {
        //add audio File
      }

    }
    else {
      callQueue.queueSettings.comfortMessage.greeting == 'DEFAULT'
    }
    callQueue.queueSettings.comfortMessageBypass = new ComfortMessageBypassSettingCallQueue()
    callQueue.queueSettings.comfortMessageBypass.enabled = this.registerCallQueueForm.value["tb_comfortBypassEnabled"]
    if (callQueue.queueSettings.comfortMessageBypass.enabled) {
      callQueue.queueSettings.comfortMessageBypass.callWaitingAgeThreshold = this.registerCallQueueForm.value["tb_callWaitingAgeThreshold"] != 0 ? this.registerCallQueueForm.value["tb_callWaitingAgeThreshold"] : null;
      callQueue.queueSettings.comfortMessageBypass.greeting = this.registerCallQueueForm.value["tb_greetingType_comfortBypass"]
      if (callQueue.queueSettings.comfortMessageBypass.greeting == 'CUSTOM') {
        //add audio File
      }


    }
    else {
      callQueue.queueSettings.comfortMessageBypass.greeting == 'DEFAULT'
    }
    callQueue.queueSettings.mohMessage = new MohMessageSettingCallQueue()
    callQueue.queueSettings.mohMessage.normalSource = new NormalSourceMohMessageSettingCallQueue()
    callQueue.queueSettings.mohMessage.normalSource.enabled = this.registerCallQueueForm.value["tb_mohMessageAnnouncement"]
    if (callQueue.queueSettings.mohMessage.normalSource.enabled) {
      callQueue.queueSettings.mohMessage.normalSource.greeting = this.registerCallQueueForm.value["tb_mohMessageGreeting"]
      if (callQueue.queueSettings.mohMessage.normalSource.greeting == 'CUSTOM') {
        //add audio File
      }
    }
    else {
      callQueue.queueSettings.mohMessage.normalSource.greeting = "DEFAULT"
    }
    callQueue.queueSettings.mohMessage.alternateSource = new AlternateSourceMohMessageSettingCallQueue()
    callQueue.queueSettings.mohMessage.alternateSource.enabled = this.registerCallQueueForm.value["tb_mohAlternateMessageSource"]
    if (callQueue.queueSettings.mohMessage.alternateSource.enabled) {
      callQueue.queueSettings.mohMessage.alternateSource.greeting = this.registerCallQueueForm.value["tb_mohAlternateMessageGreeting"]
      if (callQueue.queueSettings.mohMessage.alternateSource.greeting == 'CUSTOM') {
        //add audio File
      }
    }
    else {
      callQueue.queueSettings.mohMessage.alternateSource.greeting = "DEFAULT"
    }
    callQueue.queueSettings.whisperMessage = new WhisperMessageSettingCallQueue()
    callQueue.queueSettings.whisperMessage.enabled = this.registerCallQueueForm.value["tb_whisperAnnouncement"]
    if (callQueue.queueSettings.whisperMessage.enabled) {
      callQueue.queueSettings.whisperMessage.greeting = this.registerCallQueueForm.value["tb_greetingType_whisper"]
      if (callQueue.queueSettings.mohMessage.alternateSource.greeting == 'CUSTOM') {
        //add audio File
      }
    }
    else {
      callQueue.queueSettings.mohMessage.alternateSource.greeting == 'DEFAULT'
    }
    callQueue.agents = [];
    var postPers: PostPersonPlaceCallQueueDto = new PostPersonPlaceCallQueueDto();
    if (this.registerCallQueueForm.value["tb_agents"] != "") {
      this.registerCallQueueForm.value["tb_agents"].forEach((e: string, index) => {
        postPers = new PostPersonPlaceCallQueueDto()
        postPers.id = e;
        postPers.weight = this.formCoefAndNiv.at(index).value["tb_weight"]
        postPers.skillLevel = this.formCoefAndNiv.at(index).value["tb_skillLevel"]
        console.log("postPers", postPers)
        callQueue.agents.push(postPers);
      })
    }
    else callQueue.agents = null

    callQueue.allowAgentJoinEnabled = this.registerCallQueueForm.value["tb_allowAgentJoinEnabled"];

    this.webexServices.CreateCallQueue(callQueue, this.orgId, this.locationId)
      .subscribe(data => {
        if (data != null && data["status"] == "success") {

          this.toastr.success("le call queue " + callQueue.name + " est ajouté avec succés")

          this.close();
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
        if (this.registerCallQueueForm.value["tb_policy"] == 'WEIGHTED') {
          var coff = (100 / (this.userSelected.length)).toString()
          var x = Number(coff);
          const b = Math.floor(x);
          var y= 100-(b*(users.length-1))
          this.formCoefAndNiv.controls.forEach((x,index) => {
           if(index == users.length-1){
            (x as FormGroup).controls['tb_weight'].setValue(y.toString());
           }
           if(index != users.length-1){
            (x as FormGroup).controls['tb_weight'].setValue(b.toString());
           }
          
           
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
  showCoefficient = false;
  pendrePolicy(event: any) {
    console.log(event)
    if (event.target.value == 'WEIGHTED') {
      this.showCoefficient = true
      this.showniveauAptitude = false
    }
    else {
      this.showCoefficient = false
    }
  }
  showniveauAptitude = false
  niveauAptitude(event: any) {
    if (event.target.value == 'WEIGHTED') {
      this.showniveauAptitude = true
    }
    else {
      this.showniveauAptitude = false
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
      this.tableUsersSelected = false
    }
  }
  nivAptitude = []
  getNivAp() {
    for (var ring = 1; ring <= 20; ring++) {

      this.nivAptitude.push(ring);
    }
  }

}

