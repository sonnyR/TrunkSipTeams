import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectConfig } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { PstnNumbers } from 'src/app/Model/pstn-numbers.model';
import { WebexService } from 'src/app/services/webex.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-pstn-number',
  templateUrl: './add-pstn-number.component.html',
  styleUrls: ['./add-pstn-number.component.css']
})
export class AddPstnNumberComponent implements OnInit {

  constructor(private activeModal: NgbActiveModal, private webexServices: WebexService, private formBuilder: FormBuilder,
    private toastr: ToastrService, private config: NgSelectConfig) {
    this.config.clearAllText = 'Aucun élément trouvé';
  }
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  numerosTel: string[] = [];
  numerosTest: string[] = [];
  addnum = false;
  entID: string;
  userid: string;
  orgId : string
  Sites: any = [];
  submitted = false;
  registerPstnNumberForm: FormGroup;
  NumbersModel: any;
  loading = false;
  TextValue = "Création en cours";
  loadingSite = false;
  get f() { return this.registerPstnNumberForm.controls; }
  ngOnInit(): void {
  }
  Init(entID: string, userid: string,orgId : string) {
    this.entID = entID;
    this.userid = userid;
    this.orgId = orgId;
    if (this.entID != null) {
      this.GetSitesForEntreprise();
    }
    this.registerPstnNumberForm = this.formBuilder.group({
      tb_Site: ['', Validators.required],
      tb_pstnNumber: ['', Validators.required],
      firstNum: [''],
      lastNum: ['']

    });
  }
  validNumberFirst = true;
  validNumberLast = true;
  numberControlFirst(event: any, control: AbstractControl) {
    const pattern = /[0-9\+\ ]/;
    const input = document.getElementById('firstNumberPhone') as HTMLInputElement;
    const value = input.value;
    if(value.startsWith("+33") && value.length == 12){
      this.validNumberFirst = true;
    }
    else
    if(!value.startsWith("+33") || value.length != 12){
      this.validNumberFirst = false;
    }
    return (event.charCode === 0 || pattern.test(String.fromCharCode(event.charCode))) && (control.value.length != 12);
  }
  numberControlLast(event: any, control: AbstractControl) {
    const pattern = /[0-9\+\ ]/;
    const input = document.getElementById('lastNumberPhone') as HTMLInputElement;
    const value = input.value;
    if(value.startsWith("+33") && value.length == 12){
      this.validNumberLast = true;
    }
    else
    if(!value.startsWith("+33") || value.length != 12){
      this.validNumberLast = false;
    }
    return (event.charCode === 0 || pattern.test(String.fromCharCode(event.charCode))) && (control.value.length != 12);
  }
  validNumber = true
  numberControlSepare(event: any, control: AbstractControl) {
    const pattern = /[0-9\+\,\ ]/;
     const input = document.getElementById('numberPhone') as HTMLInputElement;
     const value = input.value;
     if (event.key == ",") {
       this.addnum = true;
       this.validNumber = false
     }
     this.numerosTel = value.split(',').filter(x=>x!= '');
     this.numerosTel.forEach(e=>{
       if(e.startsWith("+33") && e.length == 12){
         this.validNumber = true;
       }
       else if(!e.startsWith("+33") || e.length != 12){
         this.validNumber = false
       }
      })
      if(this.numerosTel.length == 0){
       this.validNumber = true;
      }
     
     return (event.charCode === 0 || pattern.test(String.fromCharCode(event.charCode)));
   }
  separe = true
  tranche = false
  AddTypeLigne(event: any) {
    if (event == "Separe") {
      this.separe = true
      this.tranche = false;
      this.registerPstnNumberForm.controls['tb_pstnNumber'].setValidators([Validators.required])
      this.registerPstnNumberForm.controls['tb_pstnNumber'].updateValueAndValidity()
      this.registerPstnNumberForm.controls["firstNum"].clearValidators();
      this.registerPstnNumberForm.controls["lastNum"].clearValidators();
      this.registerPstnNumberForm.controls['firstNum'].updateValueAndValidity()
      this.registerPstnNumberForm.controls['lastNum'].updateValueAndValidity()
    }
    else {
      this.separe = false
      this.tranche = true;
      this.registerPstnNumberForm.controls['firstNum'].setValidators([Validators.required])
      this.registerPstnNumberForm.controls['lastNum'].setValidators([Validators.required])
      this.registerPstnNumberForm.controls['firstNum'].updateValueAndValidity()
      this.registerPstnNumberForm.controls['lastNum'].updateValueAndValidity()
      this.registerPstnNumberForm.controls['tb_pstnNumber'].clearValidators()
      this.registerPstnNumberForm.controls['tb_pstnNumber'].updateValueAndValidity()
    }
  }
  close() {
    this.passEntry.emit("Closed");
    this.activeModal.dismiss();
  }
  GetSitesForEntreprise() {
    this.loadingSite = true;
    this.webexServices.GetSitesEntreprise(this.entID)
      .subscribe(data => {
        
        this.Sites = [];
        if (data["status"] == "success") {
          this.Sites = data["result"];
          this.loadingSite = false;
        }
        else {
          this.loadingSite = false;
          var str: string = data["message"];
          str = str + " " + data["erreur"]
          this.toastr.error("une erreur technique est survenue")

        }
      }, error => {
        this.loadingSite = false;
        var str: string = error["error"]["message"];
        this.toastr.error("une erreur technique est survenue")

      });
  }
  onSubmit() {
    this.submitted = true;
    if (this.registerPstnNumberForm.value["firstNum"] != null && this.registerPstnNumberForm.value["lastNum"] != null) {
      if (this.registerPstnNumberForm.value["firstNum"].toString().length == 12 && this.registerPstnNumberForm.value["lastNum"].toString().length == 12) {
        if (Number(this.registerPstnNumberForm.value["firstNum"].toString()) > Number(this.registerPstnNumberForm.value["lastNum"].toString())) {
          this.toastr.error("Le dernier numéro de téléphone doit etre supérieur à celui le premier");
          return;
        }
      }
    }
    this.numerosTel.forEach(e=>{
      if(!e.startsWith("+33") || e.length != 12){
        this.validNumber = false;
      return;
      }
     }) 
     if(!this.validNumber){
      return;
     }
     if(!this.validNumberFirst){
      return;
     }
     if(!this.validNumberLast){
      return;
     }
    if (this.registerPstnNumberForm.invalid) {
      return;
    }
    if (this.tranche) {
      if (this.registerPstnNumberForm.value.firstNum != null && this.registerPstnNumberForm.value.lastNum != null) {
        let splitPortInter: any = [];
        this.numerosTel = [];
        splitPortInter.push(this.registerPstnNumberForm.value.firstNum)
        splitPortInter.push(this.registerPstnNumberForm.value.lastNum)
        let j = 0;
        for (let i = +splitPortInter[0]; i <= +splitPortInter[1]; i++) {
          let num = '+' + String(i);
          this.numerosTel.push(num);
          j++;
        }
      }

    }
    else if (this.separe) {
      if (this.registerPstnNumberForm.value.tb_pstnNumber) {
        
      }
    }
    var numbers : PstnNumbers = new PstnNumbers()
    numbers.phoneNumbers = this.numerosTel;
    numbers.state = 'ACTIVE';
    var idLocation = this.registerPstnNumberForm.value["tb_Site"]
    numbers.userOperation = this.userid;
    this.loading = true;
    this.webexServices.CreateNumbersEntreprise(numbers, this.entID,this.orgId, idLocation)
      .subscribe(data => {
        if (data != null && data["status"] == "success") {
          this.loading = false;
          this.close();
          
        }
        else if (data != null && data["status"] == "conflict") {
          this.loading = false;
          Swal.fire(data["message"]);
        }
        else {
          this.loading = false;
          var str: string = data["message"];
          str = str + ": " + data["erreur"]
          this.toastr.error("une erreur technique est survenue")

        }
      }
        , error => {
          this.loading = false;
          var str: string = error["error"]["message"];
          str = str + " " + error["error"]["erreur"];
          this.toastr.error("une erreur technique est survenue")

        }
      );
  }
 
  elemineNumbe(num: string) {
    this.numerosTel.forEach((value, index) => {
      if (value == num) this.numerosTel.splice(index, 1);
    });
    this.registerPstnNumberForm.controls['tb_pstnNumber'].setValue(this.numerosTel.toString());
  }
}
