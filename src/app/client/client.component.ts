import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { WebexService } from '../services/webex.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectConfig } from '@ng-select/ng-select';
import { SharedService } from '../services/shared.service';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { EntrepriseDto } from '../Model/entreprise-dto.model';
import { ProvisioningParameters } from '../Model/provisioning-parameters.model';
import { Meetings } from '../Model/meetings.model';
import { Calling } from '../Model/calling.model';
import { Location } from '../Model/location.model';
import { Address } from '../Model/address.model';
import { CustomerInfo } from '../Model/customer-info.model';
declare var window: any;
@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
  constructor(private webexService: WebexService, private formBuilder: FormBuilder,
    private modalService: NgbModal, private config: NgSelectConfig,
    private sharedService: SharedService, private spinner: NgxSpinnerService, private toastr: ToastrService) {
    this.config.clearAllText = 'Aucun élément trouvé';
    this.config.notFoundText = 'Aucun élément trouvé'
  }
  loading = false;
  TextValue = "";
  submitted = false;
  eventSubmitted: string;
  @Output()
  SendEntID: EventEmitter<any> = new EventEmitter();
  @Output()
  SendOrgId: EventEmitter<any> = new EventEmitter();
  @Output()
  SendPackges: EventEmitter<any> = new EventEmitter();
  @Output()
  SendStatusEnt: EventEmitter<any> = new EventEmitter();
  @Output()
  approvisionnement: EventEmitter<any> = new EventEmitter();
  @Input()
  code_client: Number = 0;
  @Input()
  userid: string = "";
  entID: string = "";
  orgId: string;
  entreprise: any = [];
  isDisabled: boolean = false;
  registerForm!: FormGroup;
  showHiddenSite = false;
  showHiddenReunions = false;
  services: any = [];
  selectedItemsService: any = [];
  numeros: string[] = [];
  addnum = false;
  listPack: any = [];
  formModalDeleteEntreprise: any;
  approvisionnementEncours = false;
  isModif = false;
  entrepriseDto: EntrepriseDto = new EntrepriseDto();
  packagesExist : string[] = [];
  @ViewChild('closeModalDelete') closeModalDelete: any;
  @ViewChild('formDirective') private formDirective: NgForm;
  get f() { return this.registerForm.controls; }
  ngOnInit() {
  }
  getAllService() {
    this.webexService.GetAllServices()
      .subscribe(data => {
        this.services = data["result"];
      }, error => {
        this.toastr.error("une erreur technique est survenue, impossible de charger tout les services")
      });
  }
   emailValidator(control: AbstractControl): { [key: string]: any } | null {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const email = control.value;
    if (email && !emailRegex.test(email)) {
      return { 'email': true };
    }
    return null;
  }
  public onSelectAllPackages() {
    const selected = this.services.map((item) => item.libelleByEnglish);
    this.registerForm.get('lst_packages').patchValue(selected);
    this.showHiddenSite = true;
  }
  public onClearAllPackages() {
    this.registerForm.get('lst_packages').patchValue([]);
  }
  checkService(event : string) {
    this.selectedItemsService = this.registerForm.value["lst_packages"]
    if (this.selectedItemsService.includes('common_area_calling') || this.selectedItemsService.includes('webex_calling')
      || this.selectedItemsService.includes('webex_suite') || this.selectedItemsService.includes('webex_voice')
    ) {
      if (this.entID == "" || this.entID == null)
        this.showHiddenSite = true;
      if (this.entID != "" && this.listPack.length == 1 && this.listPack.includes("webex_meetings")) {
        this.showHiddenSite = true;
        this.registerForm.controls['tb_name_site'].setValidators([Validators.required])
        this.registerForm.controls['tb_name_site'].updateValueAndValidity()
      }
      else if (this.entID != "" && this.listPack.length != 1) {
        this.showHiddenSite = false
        this.registerForm.controls['tb_name_site'].clearValidators()
        this.registerForm.controls['tb_name_site'].updateValueAndValidity()
      }
    }
    if (!this.selectedItemsService.includes('common_area_calling') && !this.selectedItemsService.includes('webex_calling')
      && !this.selectedItemsService.includes('webex_suite') && !this.selectedItemsService.includes('webex_voice') &&
      this.selectedItemsService.includes('webex_meetings')
    ) {
      this.showHiddenSite = false;
      this.registerForm.controls["tb_name_site"]!= undefined? this.registerForm.controls["tb_name_site"].clearValidators():"";
      this.registerForm.controls["tb_name_site"]!= undefined? this.registerForm.controls['tb_name_site'].updateValueAndValidity():""
      this.registerForm.controls["tb_adresseLigne1_site"] != undefined ? this.registerForm.controls["tb_adresseLigne1_site"].clearValidators():"";
      this.registerForm.controls["tb_adresseLigne1_site"] != undefined ? this.registerForm.controls['tb_adresseLigne1_site'].updateValueAndValidity():""
      this.registerForm.controls["tb_ville_site"] != undefined? this.registerForm.controls["tb_ville_site"].clearValidators():"";
      this.registerForm.controls["tb_ville_site"] != undefined? this.registerForm.controls['tb_ville_site'].updateValueAndValidity():""
      this.registerForm.controls["tb_code_postale_site"]!= undefined? this.registerForm.controls["tb_code_postale_site"].clearValidators():"";
      this.registerForm.controls["tb_code_postale_site"]!= undefined? this.registerForm.controls['tb_code_postale_site'].updateValueAndValidity():""
    }
    if (!this.selectedItemsService.includes('common_area_calling') && !this.selectedItemsService.includes('webex_calling')
      && !this.selectedItemsService.includes('webex_suite') && !this.selectedItemsService.includes('webex_voice') &&
      !this.selectedItemsService.includes('webex_meetings')
    ) {
      this.showHiddenSite = false;
      this.registerForm.controls["tb_name_site"].clearValidators();
    }
if(this.entID != "" && this.entID != null){
  var listAdd = [];
  var listDelete = [];
 this.selectedItemsService.forEach(x=>{
  if(!this.packagesExist.includes(x)){
       listAdd.push(x);
  }
 })
 this.packagesExist.forEach(x=>{
  if(!this.selectedItemsService.includes(x)){
    listDelete.push(x);
  }
 })
 if(listAdd.length != 0){
  this.selectedItemsService.forEach(x=>{
    if(this.packagesExist.includes(x)) {
     const p2 = this.services.find((p) => p.libelleByEnglish === x); 
     p2.disabled = true;
    }
   
   })
 }
 if(listDelete.length != 0){
  this.services.forEach(x=>{
     const p2 = this.packagesExist.find((p) => p != x.libelleByEnglish); 
     if(!this.packagesExist.includes(x.libelleByEnglish)){
      x.disabled = true;
     }
   })
 }
 if(this.packagesExist.length == this.selectedItemsService.length){
  this.services.forEach(x=>{
      x.disabled = false;
   })
 }
}
  }
  ngOnChanges() {
    this.formModalDeleteEntreprise = new window.bootstrap.Modal(
      document.getElementById('myModalDeleteEntreprise')
    );
    this.getAllService();
    this.getEntreprise()
  }
  CodePostalControl(event: any, control: AbstractControl) {
   const pattern = /[0-9\ ]/;
    return (event.charCode === 0 || pattern.test(String.fromCharCode(event.charCode))) && (control?.value?.length != 5);
  }
  DeleteEntreprise() {
    this.formModalDeleteEntreprise.show();
  }
  setNameSite(name:string){
    this.registerForm.value["tb_name_site"] = name;
  }
  ConfirmedDeleteEntreprise() {
    this.TextValue = "La suppression de votre client peut prendre jusqu'à une minute"
    this.loading = true;
    this.webexService.DeleteEntreprise(this.entID,this.userid)
      .subscribe(data => {
        if (data["status"] == "success") {
          this.loading = false;
          this.submitted = true;
          this.closeModalDelete.nativeElement.click();
          this.toastr.success('le client est supprimé', '', {
            positionClass: 'toast-top-right',
            timeOut: 6000
          });
          this.isModif = false
          this.getEntreprise();

        }
        else {
          this.loading = false;
          var str: string = data["message"];
          str = data["erreur"] != null ? str + data["erreur"] : str;
          Swal.fire({
            icon: 'error',
            text: str + 'il faut supprimer tous les utilisateurs actifs'
          })
        }
      }, error => {
        this.loading = false;
        var str: string = error["error"]["message"];
        str = error["error"]["erreur"] != null ? str + " " + error["error"]["erreur"] : str
        this.toastr.error("une erreur technique est survenue, impossible de supprimer l'entreprise")
       
      });
  }
  validNumber = true
  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    this.numeros.forEach(e=>{
      if(!e.startsWith("+33") || e.length != 12){
        this.validNumber = false;
      return;
      }
     }) 
     if(!this.validNumber){
      return;
     }
    var provisioningParameters: ProvisioningParameters = new ProvisioningParameters()
    if (this.registerForm.value["tb_name_site"] == '') {
      provisioningParameters.meetings = new Meetings();
      provisioningParameters.meetings.timezone = "Europe/Paris"
    }
    if (this.registerForm.value["tb_name_site"] != '') {
      provisioningParameters.calling = new Calling()
      provisioningParameters.calling.location = new Location()
      provisioningParameters.calling.location.name = this.registerForm.value["tb_name_site"];
      provisioningParameters.calling.location.address = new Address();
      provisioningParameters.calling.location.address.addressLine1 = this.registerForm.value["tb_adresseLigne1"]
      provisioningParameters.calling.location.address.addressLine2 = this.registerForm.value["tb_adresseLigne2"]
      provisioningParameters.calling.location.address.city = this.registerForm.value["tb_ville_site"]
      provisioningParameters.calling.location.address.stateOrProvince = "FR-08"
      provisioningParameters.calling.location.address.zipOrPostalCode = this.registerForm.value["tb_code_postale_site"]
      provisioningParameters.calling.location.address.country = "FR"
      provisioningParameters.calling.location.timezone = "Europe/Paris"
      provisioningParameters.calling.location.language = "fr_FR"
      provisioningParameters.calling.location.emergencyLocationIdentifier = "14785236"
      provisioningParameters.calling.location.numbers = this.numeros
      provisioningParameters.calling.location.mainNumber = this.numeros[0]
    }
    switch (this.eventSubmitted) {
      case "Add":
        this.TextValue = "Création en cours"
        this.loading = true;
        this.entrepriseDto.provisioningId = "MTJjMzAyZmMtYjkyZi00ZjYwLWEwMTctYTk0MjkyYWVkZjJl"
        this.entrepriseDto.externalId = this.registerForm.value["tb_code_client"].toString()
        this.entrepriseDto.customerInfo = new CustomerInfo()
        this.entrepriseDto.customerInfo.name = this.registerForm.value["tb_nom_client"]
        this.entrepriseDto.customerInfo.primaryEmail = this.registerForm.value["tb_email"]
        this.entrepriseDto.packages = this.registerForm.value["lst_packages"]
        this.entrepriseDto.address = new Address()
        this.entrepriseDto.address.addressLine1 = this.registerForm.value["tb_adresseLigne1"]
        this.entrepriseDto.address.addressLine2 = this.registerForm.value["tb_adresseLigne2"]
        this.entrepriseDto.address.city = this.registerForm.value["tb_ville"]
        this.entrepriseDto.address.country = "FR"
        this.entrepriseDto.address.stateOrProvince = this.registerForm.value["tb_stateOrProvince"]
        this.entrepriseDto.address.zipOrPostalCode = this.registerForm.value["tb_code_postale"]
        this.entrepriseDto.userOperation = this.userid;
        this.entrepriseDto.ProvisioningParameters = provisioningParameters;
        this.webexService.CreateEntreprise(this.entrepriseDto)
          .subscribe(data => {
            if (data["status"] == "success") {
              this.loading = false;
              this.entreprise = data["result"];
              this.entID = this.entreprise["id"];
              this.showHiddenSite = false
              this.getEntreprise();
              this.toastr.success('le client ' + this.registerForm.value["tb_nom_client"] + 'a été ajouté avec succès.', '', {
                positionClass: 'toast-top-right',
                timeOut: 6000
              });
            }
            else if(data["status"] == "conflict"){
              this.loading = false;
              var str: string = data["message"];
              Swal.fire({
                icon: 'error',
                text: str
              })
            }
            else {
              this.loading = false;
             
              this.toastr.error("une erreur technique est survenue")
             
            }
          }, error => {
            this.loading = false;
          
            this.toastr.error("une erreur technique est survenue")
          });
        break;
      case "Edit":
        this.TextValue = "Modification en cours"
        this.loading = true;
        this.entrepriseDto.externalId = this.registerForm.value["tb_code_client"]
        this.entrepriseDto.packages = this.registerForm.value["lst_packages"]
        this.entrepriseDto.address = new Address()
        this.entrepriseDto.address.addressLine1 = this.registerForm.value["tb_adresseLigne1"]
        this.entrepriseDto.address.addressLine2 = this.registerForm.value["tb_adresseLigne2"]
        this.entrepriseDto.address.city = this.registerForm.value["tb_ville"]
        this.entrepriseDto.address.stateOrProvince = this.registerForm.value["tb_stateOrProvince"]
        this.entrepriseDto.address.zipOrPostalCode = this.registerForm.value["tb_code_postale"]
        this.entrepriseDto.address.country = "FR"
        if (this.registerForm.value["tb_name_site"] != '') {
          this.entrepriseDto.ProvisioningParameters = provisioningParameters
        }
        this.webexService.UpdateEntreprise(this.entrepriseDto, this.entID)
          .subscribe(data => {
            if (data["status"] == "success") {
              this.entreprise = data["result"];
              this.entID = this.entreprise["id"];
              this.loading = false;
              this.approvisionnement.emit(false);
              this.SendEntID.emit(this.entID);
              this.SendOrgId.emit(this.orgId);
              this.sharedService.sendClickEvent();
              this.toastr.success('le client ' + this.registerForm.value["tb_nom_client"] + ' a été modifié avec succes. Il est nécessaire de rafraîchir la page pour voir l\'état de l\'approvisionnement', '', {
                positionClass: 'toast-top-right',
                timeOut: 6000
              });
              if(this.packagesExist.length == this.entrepriseDto.packages.length){
                this.approvisionnementEncours = true
                this.approvisionnement.emit(true);
                 this.SendEntID.emit(this.entreprise['id']);
                this.SendPackges.emit(this.entreprise['packages']);
              }
              else{
                this.approvisionnementEncours = false
                this.getEntreprise();
              }
            }
            else if (data["status"] == "faild") {
              this.loading = false;
              var str: string = data["message"];
              Swal.fire({
                icon: 'error',
                text: str + '! il faut supprimez tous les utilisateurs qui possèdent des packages que vous voulez supprimer.'
              })
              this.getEntreprise()
            }
            else {
              this.loading = false;
             
              this.toastr.error("une erreur technique est survenue")
            }
          }, error => {

            this.loading = false;
       
            this.toastr.error("une erreur technique est survenue")
          });
        break;
      default:
        break;
    }
  }
  onReset() {
    this.submitted = false;
    this.registerForm.reset();
  }
  annulerSupprime() {
    this.closeModalDelete.nativeElement.click();
  }
  chevron(event: any) {
    var target = event.target || event.srcElement || event.currentTarget;
    if (target.getAttribute("class") == "fa fa-chevron-down") {
      target.setAttribute("class", "fa fa-chevron-up");
    }
    else if (target.getAttribute("class") == "fa fa-chevron-up") {
      target.setAttribute("class", "fa fa-chevron-down");
    }
  }
  SetEvent(event: string) {
    this.eventSubmitted = event;
  }
  numberControl(event: any) {
    const input = document.getElementById('message') as HTMLInputElement;
    const value = input.value;
    var numm = this.registerForm.value["tb_lst_numbers_site"]
    if (event.key == ",") {
      this.addnum = true;
    }
    this.numeros = value.split(',');
  }
  elemineNumbe(num: string) {
    this.numeros.forEach((value, index) => {
      if (value == num) this.numeros.splice(index, 1);
    });
    this.registerForm.controls['tb_lst_numbers_site'].setValue(this.numeros.toString());
    this.numeros.forEach(e=>{
      if(e.startsWith("+33") && e.length == 12){
        this.validNumber = true;
      }
      else{
        this.validNumber = false
      }
     })
    
  }
  getEntreprise() {
    this.webexService.GetEntrepriseByCodeClient_ExternalId(this.code_client.toString()).subscribe
      (data => {
        if (data["status"] == "success") {
          this.loading = false;
          this.entreprise = data["result"];
          if (this.entreprise != null) {
            if (this.entreprise.status == "provisioned") {
              this.approvisionnementEncours = true;
              this.approvisionnement.emit(true);
              this.SendEntID.emit(this.entreprise['id']);
              this.SendOrgId.emit(this.entreprise['orgId']);
              this.SendPackges.emit(this.entreprise['packages']);
              this.SendStatusEnt.emit(this.entreprise['status']);
            }
        
            else {
              if(this.entreprise.resourceDetails.packages.filter(x=>x.status != "provisioned").length != 0){
                this.approvisionnementEncours = false;
              }
              else{
                if(this.entreprise.resourceDetails.packages.length != this.packagesExist.length)
                this.approvisionnementEncours = true;
              }
              this.approvisionnement.emit(false);
              this.SendEntID.emit(this.entreprise['id']);
              this.SendPackges.emit(this.entreprise['packages']);
              this.SendOrgId.emit(this.entreprise['orgId']);
              this.SendStatusEnt.emit(this.entreprise['status']);
            }
            this.services.forEach(e=>{
             if(this.entreprise.resourceDetails.packages.filter(x=>x.name == e["libelleByEnglish"]).length != 0){
             
                if(this.entreprise.resourceDetails.packages.filter(x=>x.name == e["libelleByEnglish"])[0]?.status == "provisioning"){
           
                e["approvisionnement"] = "Approvisionnement";
               }
               else if(this.entreprise.resourceDetails.packages.filter(x=>x.name == e["libelleByEnglish"])[0]?.status == "deleting"){
               
                e["approvisionnement"] = "Supprimer";
               }
             }
            })
            this.entID = this.entreprise['id'];
            this.orgId = this.entreprise['orgId'];
            this.listPack = this.entreprise["packages"];
            this.packagesExist = this.entreprise["packages"];
            this.isModif = true
            if (this.entreprise['codeClient'] != "" && this.entreprise['codeClient'] != null) { this.isDisabled = true } else { this.isDisabled = false }
           
            if(this.entreprise['packages'].includes('webex_meetings') && !this.entreprise['packages'].includes('webex_calling')
            && !this.entreprise['packages'].includes('webex_suite') && !this.entreprise['packages'].includes('webex_voice') && !this.entreprise['packages'].includes('common_area_calling')){
              this.registerForm = this.formBuilder.group({
                tb_code_client: [this.entreprise['codeClient'], Validators.required],
                tb_code_postale: [this.entreprise['address']['zipOrPostalCode'], [Validators.required, Validators.pattern("^[0-9]*$"),
                Validators.minLength(5), Validators.maxLength(5)]],
                tb_ville: [this.entreprise['address']["city"], Validators.required],
                tb_pays: [this.entreprise['address']['country'], Validators.required],
                tb_nom_client: [this.entreprise['name'], [Validators.required]],
                tb_email: [this.entreprise['primaryEmail']],
                tb_adresseLigne1: [this.entreprise['address']["addressLine1"], [Validators.required]],
                tb_adresseLigne2: [this.entreprise['address']["addressLine2"]],
                tb_stateOrProvince: [this.entreprise['address']['stateOrProvince']],
                lst_packages: [this.entreprise['packages'], [Validators.required]],
                tb_name_site: [this.entreprise['name']],
                tb_lst_numbers_site: [''],
                tb_adresseLigne1_site:[this.entreprise['address']["addressLine1"],[Validators.required]],
                tb_adresseLigne2_site:[this.entreprise['address']["addressLine2"]],
                tb_ville_site: [this.entreprise['address']["city"],[Validators.required]],
                tb_code_postale_site: [this.entreprise['address']['zipOrPostalCode'], [Validators.required, Validators.pattern("^[0-9]*$"),
                Validators.minLength(5), Validators.maxLength(5)]],
              });
            }
            else if(this.entreprise['packages'].includes('webex_calling')
            || this.entreprise['packages'].includes('webex_suite') ||  this.entreprise['packages'].includes('webex_voice') || this.entreprise['packages'].includes('common_area_calling')){
              this.registerForm = this.formBuilder.group({
                tb_code_client: [this.entreprise['codeClient'], Validators.required],
                tb_code_postale: [this.entreprise['address']['zipOrPostalCode'], [Validators.required, Validators.pattern("^[0-9]*$"),
                Validators.minLength(5), Validators.maxLength(5)]],
                tb_ville: [this.entreprise['address']["city"], Validators.required],
                tb_pays: [this.entreprise['address']['country'], Validators.required],
                tb_nom_client: [this.entreprise['name'], [Validators.required]],
                tb_email: [this.entreprise['primaryEmail']],
                tb_adresseLigne1: [this.entreprise['address']["addressLine1"], [Validators.required]],
                tb_adresseLigne2: [this.entreprise['address']["addressLine2"]],
                tb_stateOrProvince: [this.entreprise['address']['stateOrProvince']],
                lst_packages: [this.entreprise['packages'],[Validators.required]],
                tb_name_site: [''],
              });
            }
           
          }
          else {
            this.webexService.GetClientByCode(this.code_client.toString())
              .subscribe(data => {
                if (data != null) {
                  this.entID = ''
                  this.registerForm = this.formBuilder.group({
                    tb_code_client: [data['codeClient'], Validators.required],
                    tb_code_postale: [data['codePostal'].toString(), [Validators.required, Validators.pattern("^[0-9]*$"),
                    Validators.minLength(5), Validators.maxLength(5)]],
                    tb_ville: [data['ville'], Validators.required],
                    tb_pays: ['France', Validators.required],
                    tb_nom_client: [data['societe'], [Validators.required]],
                    tb_email: [data['email'], [Validators.required, this.emailValidator]],
                    tb_adresseLigne1: [data['adresse'],[Validators.required]],
                    tb_adresseLigne2: [''],
                    tb_stateOrProvince: ['FR-93'],
                    lst_packages: ['',[Validators.required]],
                    tb_name_site: [data['societe']],
                    tb_lst_numbers_site: [''],
                    tb_adresseLigne1_site:[data['adresse'],[Validators.required]],
                    tb_adresseLigne2_site:[''],
                    tb_ville_site: [data['ville'],[Validators.required]],
                    tb_code_postale_site: [data['codePostal'].toString(), [Validators.required,Validators.pattern("^[0-9]*$"),
                    Validators.minLength(5), Validators.maxLength(5)]],
                  });
                }
                else {
                  this.entID = ''
                  this.registerForm = this.formBuilder.group({
                    tb_code_client: [this.code_client, Validators.required],
                    tb_code_postale: ['', [Validators.required, Validators.pattern("^[0-9]*$"),
                    Validators.minLength(5), Validators.maxLength(5)]],
                    tb_ville: ['', Validators.required],
                    tb_pays: ['France', Validators.required],
                    tb_nom_client: ['', [Validators.required]],
                    tb_email: ['', [Validators.required, Validators.email]],
                    tb_adresseLigne1: ['', Validators.required],
                    tb_adresseLigne2: [''],
                    tb_stateOrProvince: ['FR-93'],
                    lst_packages: ['',[Validators.required]],
                    tb_name_site: [''],
                    tb_lst_numbers_site: [''],
                    tb_adresseLigne1_site:['',[Validators.required]],
                    tb_adresseLigne2_site:[''],
                    tb_ville_site: ['',[Validators.required]],
                    tb_code_postale_site: ['', [Validators.required,Validators.pattern("^[0-9]*$"),
                    Validators.minLength(5), Validators.maxLength(5)]],
                  });
                }
              }, error => {
                this.loading = false;
                this.toastr.error("une erreur technique est survenue")
              });
          }
        }
        else {
          this.loading = false;
          
          this.toastr.error("une erreur technique est survenue")
        }
      }, error => {
        this.loading = false;
     
        this.toastr.error("une erreur technique est survenue")
      });
  }
  numberControlSepare(event: any, control: AbstractControl) {
   const pattern = /[0-9\+\,\ ]/;
    const input = document.getElementById('message') as HTMLInputElement;
    const value = input.value;
    if (event.key == ",") {
      this.addnum = true;
      this.validNumber = false
    }
    this.numeros = value.split(',').filter(x=>x!= '');
    this.numeros.forEach(e=>{
      if(e.startsWith("+33") && e.length == 12){
        this.validNumber = true;
      }
      else if(!e.startsWith("+33") || e.length != 12){
        this.validNumber = false
      }
     })
     if(this.numeros.length == 0){
      this.validNumber = true;
     }
    
    return (event.charCode === 0 || pattern.test(String.fromCharCode(event.charCode)));
  }

}
