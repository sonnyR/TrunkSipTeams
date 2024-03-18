import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectConfig } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { ProvisioningParameters } from 'src/app/Model/provisioning-parameters.model';
import { Role } from 'src/app/Model/role.model';
import { User } from 'src/app/Model/user.model';
import { WebexService } from 'src/app/services/webex.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  dropdownListServices: any = [];
  services: any = []
  selectedItemsService: any = [];
  submitted = false;
  entID: string;
  userid: string;
  userModel: any;
  registerUserForm: FormGroup
  dropdownListSites: any = [];
  sites: any = [];
  showChampNumbers = false;
  showChampIdLocation = false;
  numbersPhone: any = [];
  obligatoireExtension = false;
  loading = false;
  TextValue = "Création en cours";
  roles : Role[] = [];
  orgId: any;
  loadingPeople = false;
  constructor(private activeModal: NgbActiveModal, private webexServices: WebexService, private formBuilder: FormBuilder,
    private config: NgSelectConfig, private toastr: ToastrService) {
    this.config.clearAllText = 'Aucun élément trouvé';
  }
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  get f() { return this.registerUserForm.controls; }
  ngOnInit() {
  }
  getValuePackge(serv: any) {
    let pac = ""
    switch (serv) {
      case "webex_meetings":
        pac = "Webex meetings"
        break;
      case "common_area_calling":
        pac = "Common area calling"

        break;
      case "webex_calling":
        pac = "Webex calling"
        break;
      case "webex_suite":
        pac = "Webex suite"
        break;
      case "webex_voice":
        pac = "Webex voice"
        break;
      default: ""
    }
    return pac;
  }
  Init(entID: string, orgId: any, _service: any, userid: string) {
    this.entID = entID;
    this.userid = userid;
    this.orgId = orgId;
    _service.forEach((eee: any) => {
      if (eee.name != "common_area_calling") {
        this.dropdownListServices.push(
          {
            name: this.getValuePackge(eee.name),
            value: eee.name
          }
        );
      }
    })
    _service.length == 1 && _service[0]["name"].includes("Webex meeting") ? "" : this.getSitesEntreprise()
    this.registerUserForm = this.formBuilder.group({
      tb_nom: ['', Validators.required],
      tb_prenom: ['', Validators.required],
      tb_email: ['', [Validators.required, this.emailValidator]],
      tb_numTelephone: [''],
      tb_service: ['', Validators.required],
      tb_extension: ['', [Validators.pattern("^[0-9]*$"),
      Validators.minLength(2), Validators.maxLength(6)]],
      tb_site: ['', Validators.required],
      tb_role:['']
    });
    //this.getRole();
  }
  changePackage(serv: any) {
    if (serv == "webex_meetings") {
      this.showChampNumbers = false;
      this.showChampIdLocation = false
      this.registerUserForm.controls['tb_site'].clearValidators();
      this.registerUserForm.controls['tb_site'].updateValueAndValidity();
      this.registerUserForm.controls["tb_extension"].clearValidators();
      this.registerUserForm.controls['tb_extension'].updateValueAndValidity();
    }
    else if (serv == "Aucun") {
      this.showChampNumbers = false;
      this.showChampIdLocation = false
      this.registerUserForm.controls['tb_site'].clearValidators();
      this.registerUserForm.controls["tb_extension"].clearValidators();
      this.registerUserForm.controls['tb_site'].updateValueAndValidity();
      this.registerUserForm.controls['tb_extension'].updateValueAndValidity();
    }
    else {
      this.showChampNumbers = true;
      this.showChampIdLocation = true;
      this.obligatoireExtension = true;
      this.registerUserForm.controls["tb_site"].setValidators([Validators.required]);
      this.registerUserForm.controls["tb_extension"].setValidators([Validators.required, Validators.pattern("^[0-9]*$"),
      Validators.minLength(2), Validators.maxLength(6)]);
    }
  }
  emailValidator(control: AbstractControl): { [key: string]: any } | null {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const email = control.value;
    if (email && !emailRegex.test(email)) {
      return { 'email': true };
    }
    return null;
  }
  onSubmit() {
    this.submitted = true;
    if (this.registerUserForm.invalid) {
      return;
    }
    var user = new User()
    if (this.registerUserForm.value["tb_service"] == "webex_meetings") {
      user.customerId = this.entID
      user.email = this.registerUserForm.value["tb_email"]
      user.package = this.registerUserForm.value["tb_service"]
      user.userOpeartion = this.userid;
      user.provisioningParameters = new ProvisioningParameters()
      user.provisioningParameters.firstName = this.registerUserForm.value["tb_prenom"]
      user.provisioningParameters.lastName = this.registerUserForm.value["tb_nom"]
      user.orgId = this.orgId
      //user.roles = [this.registerUserForm.value["tb_role"]];
    }
    else if (this.registerUserForm.value["tb_service"] == "Aucun") {
      user.orgId = this.orgId
      user.userOpeartion = this.userid;
      user.emails = [this.registerUserForm.value["tb_email"]]
      user.firstName = this.registerUserForm.value["tb_prenom"]
      user.lastName = this.registerUserForm.value["tb_nom"]
      user.package = this.registerUserForm.value["tb_service"]
      //user.roles = [this.registerUserForm.value["tb_role"]]
    }
    else {
      user.customerId = this.entID
      user.orgId = this.orgId
      user.email = this.registerUserForm.value["tb_email"]
      user.package = this.registerUserForm.value["tb_service"]
      user.userOpeartion = this.userid;
      user.provisioningParameters = new ProvisioningParameters()
      user.provisioningParameters.firstName = this.registerUserForm.value["tb_prenom"]
      user.provisioningParameters.lastName = this.registerUserForm.value["tb_nom"]
      user.provisioningParameters.primaryPhoneNumber = this.registerUserForm.value["tb_numTelephone"] != " " ? this.registerUserForm.value["tb_numTelephone"] : null
      user.provisioningParameters.extension = this.registerUserForm.value["tb_extension"] != "" ? this.registerUserForm.value["tb_extension"] : null
      user.provisioningParameters.locationId = this.registerUserForm.value["tb_site"] != " " ? this.registerUserForm.value["tb_site"] : null
    }
    this.loading = true;
    if (this.registerUserForm.value["tb_service"] == "Aucun") {
      this.webexServices.CreateUser_People(user,true, this.entID)
        .subscribe(data => {
          if (data != null && data["status"] == "success") {
            this.loading = false
            this.close();
            this.toastr.success('l\'utilisateur ' + this.registerUserForm.value["tb_email"] + ' est ajouté avec succès', '', {
              positionClass: 'toast-top-right',
            });
          }
          else {
            this.loading = false
            var str: string = data["message"];
            //str = data["erreur"] != null ? str + " " + data["erreur"] : str
            Swal.fire({
              icon: 'error',
              text: str
            })
          }
        }, error => {
          this.loading = false
          var str: string = error["error"]["message"];
          str = error["error"]["erreur"] != null ? str + " " + error["error"]["erreur"] : str
          this.toastr.error("une erreur technique est survenue")
        });
    }
    else {
      this.webexServices.CreateUserWholeSale(user)
        .subscribe(data => {
          if (data != null && data["status"] == "success") {
            this.loading = false;
            this.close();
            this.toastr.success('l\'utilisateur ' + this.registerUserForm.value["tb_email"] + ' est ajouté avec succès', '', {
              positionClass: 'toast-top-right',
            });
          }
          else {
            this.loading = false;
            var str: string = data["message"];
            //str = data["erreur"] != null ?data["erreur"] + " : " + str : str
            Swal.fire({
              icon: 'error',
              text: str
            })
          }
        }
          , error => {
            this.loading = false;
            var str: string = error["error"]["message"];
            str = error["error"]["erreur"] != null ? error["error"]["erreur"] + " : " + str : str
            this.toastr.error("une erreur technique est survenue")

          }
        );
    }
  }
  extensionControl(event: any, control: AbstractControl) {
    const pattern = /[0-9\ ]/;
    return (event.charCode === 0 || pattern.test(String.fromCharCode(event.charCode)));
  }
  onReset() {
    this.submitted = false;
    this.registerUserForm.reset();
  }
  close() {
    this.passEntry.emit("Closed");
    this.activeModal.dismiss();
  }
  getAllService() {
    this.webexServices.GetAllServices()
      .subscribe(data => {
        this.dropdownListServices = []
        this.services = data["result"];
        this.services.forEach((element: { [x: string]: any; }) => {
          this.dropdownListServices.push(element)
        });
      }
      );
  }
  getSitesEntreprise() {
    this.loadingPeople = true;
    this.webexServices.GetSitesEntreprise(this.entID)
      .subscribe(data => {
        this.dropdownListSites = [];
        if (data["status"] == "success") {
          this.sites = data["result"];
          this.loadingPeople = false
        }
        else {
          this.loadingPeople = false
          var str: string = data["message"];
         str =  data["erreur"] != null  ? str + " " + data["erreur"] : "" 
         this.toastr.error("une erreur technique est survenue")

        }
      }, error => {
        this.loadingPeople = false
        var str: string = error["error"]["message"];
        str = error["error"]["erreur"] != null ? str + " " + error["error"]["erreur"] : str
        this.toastr.error("une erreur technique est survenue")

      });
  }
  getPhoneNumbersLocation(locationId: any) {
    this.webexServices.GetNumbersEntrepriseLoction(this.entID, this.orgId, locationId)
      .subscribe(data => {
        if (data["status"] == "success") {
          this.obligatoireExtension = true;
          this.registerUserForm.controls["tb_extension"].setValidators([Validators.required, Validators.pattern("^[0-9]*$"),
          Validators.minLength(2), Validators.maxLength(6)]);
          this.numbersPhone = data["result"];
          this.numbersPhone = this.numbersPhone.filter((e: any) => e["owner"] == null)
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
  getRole() {
    this.webexServices.GetRoles()
      .subscribe(data => {
        if (data["status"] == "success") {
          this.roles = data["result"] as Role[];
        }
        else {
          var str: string = data["message"];
         str =  data["erreur"] != null  ? str + " " + data["erreur"] : "" 
         Swal.fire({
          icon: 'error',
          text: str
        })
        }
      }, error => {
        var str: string = error["error"]["message"];
        str = error["error"]["erreur"] != null ? str + " " + error["error"]["erreur"] : str
        Swal.fire({
          icon: 'error',
          text: str
        })
      });
  }
  setExtensionOblige(number: any) {
    if (number == "" || number == null) {
      this.obligatoireExtension = true;
      this.registerUserForm.controls["tb_extension"].setValidators([Validators.required, Validators.pattern("^[0-9]*$"),
      Validators.minLength(2), Validators.maxLength(6)]);
      this.registerUserForm.controls['tb_extension'].updateValueAndValidity();
    }
    else {
      this.obligatoireExtension = false;
      this.registerUserForm.controls["tb_extension"].clearValidators();
      this.registerUserForm.controls['tb_extension'].updateValueAndValidity();
    }
  }
}
