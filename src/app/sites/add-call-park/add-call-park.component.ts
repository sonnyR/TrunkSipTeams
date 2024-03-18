import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/Model/user.model';
import { WebexService } from 'src/app/services/webex.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-add-call-park',
  templateUrl: './add-call-park.component.html',
  styleUrls: ['./add-call-park.component.css']
})
export class AddCallParkComponent implements OnInit {
  orgId: string;
  userid: string;
  locationId : string;
  registerCallParkForm: FormGroup;
  submitted = false;
  CallParkModel : any
  users : User[]=[];
  entId : string
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  constructor(private activeModal: NgbActiveModal,private webexServices: WebexService,private formBuilder: FormBuilder) { }
  get f() { return this.registerCallParkForm.controls; }
  ngOnInit(): void {
  }
  Init(entId : string,orgId: string, userid: string, locationId: string) {
    this.orgId = orgId;
    this.userid = userid;
    this.locationId = locationId;
    this.entId = entId;
    this.registerCallParkForm = this.formBuilder.group({
      tb_NameCallPark: ['', Validators.required],
      tb_option: ['', Validators.required],
      tb_user: ['']
    });
    this.GetUsersEntreprise();
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
    var objCallPark = {}
    objCallPark = {
        "name": this.registerCallParkForm.value["tb_NameCallPark"],
        "recall": {
          "option": this.registerCallParkForm.value["tb_option"]
        },
        "agents" : this.registerCallParkForm.value["tb_user"]
      }
      this.webexServices.CreateCallPark(objCallPark, this.orgId,this.locationId)
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
  GetUsersEntreprise() {
    this.webexServices.GetUsersEntreprise_withApiPeople(this.entId,this.orgId,null,"100")
      .subscribe(data => {
        this.users = [];
        if (data["status"] == "success") {
          this.users = data["result"] as User[];
          this.users = this.users.filter((e: any) => e.package != "Aucun" && e.package != "webex_meetings")
         
        }
        else {
          var str: string = data["message"];
          if (data["erreur"] != null) { str + " " + data["erreur"] }
          alert(str);
        }
      }, error => {
        alert(JSON.stringify(error))
      });
  }

}
