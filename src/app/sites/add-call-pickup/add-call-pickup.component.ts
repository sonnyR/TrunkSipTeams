import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { WebexService } from 'src/app/services/webex.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-call-pickup',
  templateUrl: './add-call-pickup.component.html',
  styleUrls: ['./add-call-pickup.component.css']
})
export class AddCallPickupComponent implements OnInit {

  orgId: string;
  userid: string;
  locationId : string;
  registerCallPickupForm: FormGroup;
  submitted = false;
  CallPickupModel : any
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  constructor(private activeModal: NgbActiveModal,private webexServices: WebexService,private formBuilder: FormBuilder) { }
  get f() { return this.registerCallPickupForm.controls; }
  ngOnInit(): void {
  }
  Init(orgId: string, userid: string, locationId: string) {
    this.orgId = orgId;
    this.userid = userid;
    this.locationId = locationId;
    this.registerCallPickupForm = this.formBuilder.group({
      tb_NameCallPickup: ['', Validators.required],
      tb_user: ['']
    });
  }
  close() {
    this.passEntry.emit("Closed");
    this.activeModal.dismiss();
  }
  onSubmit() {
    this.submitted = true;
    if (this.registerCallPickupForm.invalid) {
      return;
    }
    var objSite = {}
      objSite = {
        "name": this.registerCallPickupForm.value["tb_NameCallPickup"],
      }
      this.webexServices.CreateCallPickup(objSite, this.orgId,this.locationId)
        .subscribe(data => {
          if (data != null && data["status"] == "success") {
            this.CallPickupModel = data["result"];
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
           str= str + ": " + data["erreur"] 
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
