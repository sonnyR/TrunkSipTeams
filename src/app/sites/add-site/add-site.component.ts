import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Address } from 'src/app/Model/address.model';
import { Site } from 'src/app/Model/site.model';
import { WebexService } from 'src/app/services/webex.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-add-site',
  templateUrl: './add-site.component.html',
  styleUrls: ['./add-site.component.css']
})
export class AddSiteComponent implements OnInit {
  registerSiteForm: FormGroup
  constructor(private formBuilder: FormBuilder, private webexServices: WebexService, private toastr: ToastrService) { }
  @Input()
  entID: string;
  @Input()
  userid: string;
  @Input()
  orgId: string;
  @Input()
  siteModif: any;
  @Output()
  refreshListSite: EventEmitter<any> = new EventEmitter();
  @Output()
  loading: EventEmitter<any> = new EventEmitter();
  @Output()
  typeAction: EventEmitter<any> = new EventEmitter();
  submitted = false;
  SiteModel: any;
  isModif = false;
  get f() { return this.registerSiteForm.controls; }
  ngOnInit(): void {
    this.registerSiteForm = this.formBuilder.group({
      tb_name: [this.SiteModel != undefined ? this.SiteModel["name"] : '', Validators.required],
      tb_address1: ['', Validators.required],
      tb_address2: [''],
      tb_city: ['', Validators.required],
      tb_state: [''],
      tb_codePostal: ['', [Validators.required, Validators.pattern("^[0-9]*$"),
      Validators.minLength(5), Validators.maxLength(5)]],
    });
  }
  fillingForm(SiteMod: any) {
    this.siteModif = SiteMod
    this.isModif = true;
    if(this.siteModif != null){
      this.isModif = true;
      this.registerSiteForm = this.formBuilder.group({
        tb_name: [SiteMod["name"], Validators.required],
        tb_address1: [SiteMod["address"]["address1"], Validators.required],
        tb_address2: [SiteMod["address"]["address2"]],
        tb_city: [SiteMod["address"]["city"], Validators.required],
        tb_state: [SiteMod["address"]["stateOrProvince"]],
        tb_codePostal: [SiteMod["address"]["postalCode"], Validators.required],
      });
    }
    else{
      this.isModif = false;
      this.registerSiteForm = this.formBuilder.group({
        tb_name: [this.SiteModel != undefined ? this.SiteModel["name"] : '', Validators.required],
        tb_address1: ['', Validators.required],
        tb_address2: [''],
        tb_city: ['', Validators.required],
        tb_state: [''],
        tb_codePostal: ['', [Validators.required, Validators.pattern("^[0-9]*$"),
        Validators.minLength(5), Validators.maxLength(5)]],
      });
    }
   
  }
  onSubmit(formData: any, formDirective: FormGroupDirective) {
    this.submitted = true;
    if (this.registerSiteForm.invalid) {
      return;
    }
    var site = new Site()
    site.name = this.registerSiteForm.value["tb_name"]
    site.timeZone = "Europe/Paris"
    site.announcementLanguage = "fr_fr"
    site.preferredLanguage = "fr_fr"
    site.address = new Address()
    site.address.address1 = this.registerSiteForm.value["tb_address1"]
    site.address.address2 = this.registerSiteForm.value["tb_address2"] != "" ? this.registerSiteForm.value["tb_address2"] : null
    site.address.city = this.registerSiteForm.value["tb_city"]
    site.address.postalCode = this.registerSiteForm.value["tb_codePostal"]
    site.address.state =  "FR-08"
    site.address.country =  "FR"
    site.userOperation = this.userid;
    if (!this.isModif) {
      this.loading.emit(true);
      this.webexServices.CreateSite(site, this.orgId,this.entID)
        .subscribe(data => {
          this.loading.emit(false);
          if (data != null && data["status"] == "success") {
            this.refreshListSite.emit();
            this.toastr.success('le site ' + this.registerSiteForm.value["tb_name"] + ' est ajouté avec succes');
            this.submitted = false;
            formDirective.resetForm();
            this.registerSiteForm.reset();
          }
          else if(data["status"] == "conflict"){
            var str: string = data["message"];
            Swal.fire({
              icon: 'error',
              text: str
            })
          }
          else {
            this.loading.emit(false);
            var str: string = data["message"];
           str= data["erreur"] != null ? str + ": " + data["erreur"] : str
           this.toastr.error("une erreur technique est survenue")

          }
        }, error => {
          this.loading.emit(false);
            var str: string = error["error"]["message"];
            str = error["error"]["erreur"] != null ? str + ":  " + error["error"]["erreur"] : str;
            this.toastr.error("une erreur technique est survenue")

          }
        );
    }
    else {
      this.loading.emit(true);
      this.webexServices.UpdateSite(site, this.orgId, this.siteModif["id"])
        .subscribe(data => {
          if (data != null && data["status"] == "success") {
            this.refreshListSite.emit();
            this.loading.emit(false);
            this.toastr.success('le site ' + this.registerSiteForm.value["tb_name"] + ' est modifié avec succes');
            this.isModif = false;
            this.submitted = false;
            formDirective.resetForm();
            this.registerSiteForm.reset();
            this.fillingForm(null);
          }
          else {
            this.loading.emit(false);
            var str: string = data["message"];
            str = data["erreur"] != null ? str + ": " + data["erreur"] : str
            Swal.fire({
              icon: 'error',
              text: str 
            })
          }
        }
          , error => {
            this.loading.emit(false);
            var str: string = error["error"]["message"];
            str = error["error"]["erreur"] != null ? str + ":  " + error["error"]["erreur"] : str
            this.toastr.error("une erreur technique est survenue")

          }
        );
    }
  }
  CodePostalControl(event: any, control: AbstractControl) {
    const pattern = /[0-9\ ]/;
    return (event.charCode === 0 || pattern.test(String.fromCharCode(event.charCode))) && (control?.value?.length != 5);
  }
  onReset() {
    this.fillingForm(null);
    this.submitted = false;
    this.isModif = false;
    this.registerSiteForm.setErrors(null);
    this.registerSiteForm.updateValueAndValidity();
    
  }
 
}
