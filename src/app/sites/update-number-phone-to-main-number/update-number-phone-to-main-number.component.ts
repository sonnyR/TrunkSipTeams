import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectConfig } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { CommandesComponent } from 'src/app/commandes/commandes.component';
import { CallingLineId } from 'src/app/Model/calling-line-id.@model';
import { Site } from 'src/app/Model/site.model';
import { UpdateMainNumber } from 'src/app/Model/update-main-number.@model';
import { WebexService } from 'src/app/services/webex.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-number-phone-to-main-number',
  templateUrl: './update-number-phone-to-main-number.component.html',
  styleUrls: ['./update-number-phone-to-main-number.component.css']
})
export class UpdateNumberPhoneToMainNumberComponent implements OnInit {
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  entID : string
  userid : string
  orgId : string
  site : any
  numbersPhone : any;
  updatemainPhoneForm: FormGroup;
  submitted= false;
  constructor(private webexService : WebexService,private activeModal: NgbActiveModal,private formBuilder: FormBuilder,private config: NgSelectConfig,private toastr: ToastrService) {
    this.config.clearAllText = 'Aucun élément trouvé';
   }
  get f() { return this.updatemainPhoneForm.controls; }
  ngOnInit(): void {
  }
  Init(entID: string, userid: string,orgId : string, site) {
    this.entID = entID;
    this.userid = userid;
    this.orgId = orgId;
    this.site = site
    this.getPhoneNumbersLocation();
  }

 selectedNumberMain : string = ""
 getPhoneNumbersLocation() {
  this.webexService.GetNumbersEntrepriseLoction(this.entID, this.orgId, this.site.id)
    .subscribe(data => {
      if (data["status"] == "success") {
       
        this.numbersPhone = data["result"];
        this.numbersPhone = this.numbersPhone.filter((e: any) => e["phoneNumber"] != null)
        var mainNumber = this.numbersPhone.find(e=>e.mainNumber == true);
        this.selectedNumberMain = mainNumber?.phoneNumber;
        this.updatemainPhoneForm = this.formBuilder.group({
          selectedNumberMain: [this.selectedNumberMain, Validators.required],
        });
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
close() {
  this.passEntry.emit("Closed");
  this.activeModal.dismiss();
}
UpdateNumberPhoneToMainNumber(){
  this.submitted = true;
  if (this.updatemainPhoneForm.invalid) {
    return;
  }
  var updateMainNumber : UpdateMainNumber = new UpdateMainNumber();
  updateMainNumber.callingLineId =  new CallingLineId();
  updateMainNumber.callingLineId.UserOperation = this.userid;
  updateMainNumber.callingLineId.entId = this.entID;
  updateMainNumber.callingLineId.phoneNumber = this.updatemainPhoneForm.value["selectedNumberMain"];
  this.webexService.UpdateNumberPhoneToMainNumber(updateMainNumber,this.orgId,this.site.id)
  .subscribe(data => {
    if (data) {
      this.close();
   
      this.toastr.success('le numéro de téléphone  ' + updateMainNumber.callingLineId.phoneNumber + ' devient un numéro principal pour le site ' + this.site.name , '', {
        positionClass: 'toast-top-right',
        timeOut: 6000
      });
    }
    else {
      //this.loading = false;
      var str: string = data["message"];
      str = data["erreur"] != null ? str + " " + data["erreur"] : str
      this.toastr.error("une erreur technique est survenue")

    }
  }, error => {
    //this.loading = false;
    var str: string = error["error"]["message"];
    str = error["error"]["erreur"] != null ? str + " " + error["error"]["erreur"] : str
    this.toastr.error("une erreur technique est survenue")

  });

}

}
