import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PstnNumbers } from 'src/app/Model/pstn-numbers.model';
import { User } from 'src/app/Model/user.model';
import { WebexService } from 'src/app/services/webex.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  dropdownListServices: any = [];
  services: any = []
  selectedItemsService: any = [];
  submitted = false;
  entID: string;
  userid: string;
  userModel: any;
  registerUserForm: FormGroup
  user: User
  showChampNumbers = false;
  showChampIdLocation = false;
  numbersPhone: any = [];
  sites: any = [];
  dropdownListSites: any = [];
  orgId = "";
  PhoneNumberUser: any = {};
  idLocationUser : string = null;
  listPhoneNumberUser: any = [];
  loading = false;
  TextValue = "Modification en cours";
  obligatoireExtension = false;
  loadingPeople = false;
  constructor(private activeModal: NgbActiveModal, private webexServices: WebexService, private formBuilder: FormBuilder, private toastr: ToastrService) {}
  get f() { return this.registerUserForm.controls; }
  ngOnInit(): void {
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
  emailValidator(control: AbstractControl): { [key: string]: any } | null {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const email = control.value;
    if (email && !emailRegex.test(email)) {
      return { 'email': true };
    }
    return null;
  }
  Init(entID: string, user: any, _service: any, userid: string,orgId:string) {

    this.entID = entID;
    this.userid = userid;
    this.orgId = orgId
    this.user = user;
    if (user.package == "webex_calling" || user.package == "webex_suite" || user.package == "webex_voice") {
      this.showChampIdLocation = true;
      this.showChampNumbers = true;
      this.getSitesEntreprise()
    }
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
    if (this.user.phoneNumbers != null) {
      this.GetNumbersUsers(this.entID, this.user.orgId, this.user.id);
    }
    else {
      this.registerUserForm = this.formBuilder.group({
        tb_nom: [user["lastName"], Validators.required],
        tb_prenom: [user['firstName'], Validators.required],
        tb_email: [user['emails'][0], [Validators.required,this.emailValidator]],
        tb_numTelephone: [user['primaryPhoneNumber']],
        tb_service: [user['package'], Validators.required],
        tb_site: [this.idLocationUser],
        tb_extension: [null, [Validators.pattern("^[0-9]*$"),
        Validators.minLength(2), Validators.maxLength(6)]],
      });
    }
  }
  onSubmit() {
    
    this.submitted = true;
    if (this.registerUserForm.invalid) {
      return;
    }
    this.loading = true;
    var userUpdate = new User()
    userUpdate.id = this.user.id
    userUpdate.firstName = this.registerUserForm.value["tb_prenom"]
    userUpdate.lastName = this.registerUserForm.value["tb_nom"]
    userUpdate.emails = [this.registerUserForm.value["tb_email"]]
    userUpdate.package = this.registerUserForm.value["tb_service"]
    userUpdate.locationId = this.registerUserForm.value["tb_site"] != ""? this.registerUserForm.value["tb_site"] : null
    userUpdate.orgId = this.user.orgId;
    if (this.registerUserForm.value["tb_numTelephone"] != "" && this.registerUserForm.value["tb_numTelephone"] != null) {
      userUpdate.phoneNumbers = [];
      var phoneNumber = new PstnNumbers();
      phoneNumber.entId = this.entID
      phoneNumber.phoneNumber = this.registerUserForm.value["tb_numTelephone"]
      phoneNumber.value = this.registerUserForm.value["tb_numTelephone"]
      userUpdate.phoneNumbers.push(phoneNumber);
    }
    userUpdate.extension = this.registerUserForm.value["tb_extension"] != ""? this.registerUserForm.value["tb_extension"] : null;
   
    userUpdate.roles = this.user.roles;
    this.webexServices.UpdateUser(userUpdate, true, this.entID, userUpdate.id)
      .subscribe(data => {
        if (data != null && data["status"] == "success") {
          this.loading = false;
          this.close();
          this.toastr.success('l\'utilisateur ' + this.registerUserForm.value["tb_email"] + ' est modifié avec succès', '', {
            positionClass: 'toast-top-right',
          });
         
        }
        else {
          this.loading = false;
          var str: string = data["message"];
         // str =  data["erreur"] != null ? str + " " + data["erreur"] : str
          Swal.fire({
            icon: 'error',
            text: str 
          })
        }
      }, error => {
        this.loading = false
        var str: string = error["error"]["message"];
        str = error["error"]["erreur"] != null ? str + " " + error["error"]["erreur"] : str;
        this.toastr.error("une erreur technique est survenue")

      });
  }
  getNumberByPhoneNumber(orgId: string, phoneNumber: string) {
    this.webexServices.GetNumbersByPhoneNumber(orgId, phoneNumber, this.entID)
      .subscribe(data => {
        if (data["status"] == "success") {
          var num: any = [];
          this.PhoneNumberUser = data["result"];
          this.idLocationUser = this.PhoneNumberUser["location"]["id"];
          if (this.idLocationUser != "") {
            this.getPhoneNumbersLocation(this.idLocationUser)
          }
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
  changePackage(serv: any) {

    if (serv == "webex_meetings") {
      this.showChampNumbers = false;
      this.showChampIdLocation = false
      this.registerUserForm.controls['tb_site'].clearValidators();
      this.registerUserForm.controls['tb_site'].updateValueAndValidity();
      this.registerUserForm.controls["tb_extension"].clearValidators();
      this.registerUserForm.controls['tb_extension'].updateValueAndValidity();
      this.registerUserForm.value["tb_site"]="";
      this.registerUserForm.value["tb_numTelephone"] = "";
      this.registerUserForm.value["tb_extension"] = "";

    }
    else if (serv == "Aucun") {
      this.showChampNumbers = false;
      this.showChampIdLocation = false
      this.registerUserForm.controls['tb_site'].clearValidators();
      this.registerUserForm.controls['tb_site'].updateValueAndValidity();
      this.registerUserForm.controls["tb_extension"].clearValidators();
      this.registerUserForm.controls['tb_extension'].updateValueAndValidity();
      this.registerUserForm.value["tb_site"]="";
      this.registerUserForm.value["tb_numTelephone"] = "";
      this.registerUserForm.value["tb_extension"] = "";
    }
    else {
      this.showChampNumbers = true;
      this.showChampIdLocation = true;
      this.obligatoireExtension = true;
      this.getSitesEntreprise();
      this.registerUserForm.controls["tb_site"].setValidators([Validators.required]);
      this.registerUserForm.controls["tb_extension"].setValidators([Validators.required, Validators.pattern("^[0-9]*$"),
      Validators.minLength(2), Validators.maxLength(6)]);
    }
  }
  extensionControl(event: any, control: AbstractControl) {
    const pattern = /[0-9\ ]/;
    return (event.charCode === 0 || pattern.test(String.fromCharCode(event.charCode)));
  }
  GetNumbersUsers(entId: string, orgId: string, ownerId: string) {
    this.webexServices.GetNumbersUsers(entId, orgId, ownerId)
      .subscribe(data => {
        if (data["status"] == "success") {
          this.listPhoneNumberUser = data["result"];
          let list: any = [];
          this.idLocationUser = this.listPhoneNumberUser[0]["location"]["id"]
          this.listPhoneNumberUser.forEach((e: any) => {
            if (e["phoneNumber"] != null)
              list.push(e["phoneNumber"])
          })
          this.user.phoneNumbers = this.listPhoneNumberUser;
          this.getPhoneNumbersLocation(this.idLocationUser)
          if (list[0] == null) list[0] = "Aucun";
          this.registerUserForm = this.formBuilder.group({
            tb_nom: [this.user["lastName"], Validators.required],
            tb_prenom: [this.user['firstName'], Validators.required],
            tb_email: [this.user['emails'][0], Validators.required],
            tb_numTelephone: [list[0]],
            tb_service: [this.user['package'], Validators.required],
            tb_site: [this.idLocationUser],
            tb_extension: [this.listPhoneNumberUser[0]["extension"], [Validators.pattern("^[0-9]*$"),
            Validators.minLength(2), Validators.maxLength(6)]],

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

  onReset() {
    this.submitted = false;
    this.registerUserForm.reset();
  }
  close() {
    this.passEntry.emit("Closed");
    this.activeModal.dismiss();
  }
  getPhoneNumbersLocation(locationId: any) {

    this.webexServices.GetNumbersEntrepriseLoction(this.entID,this.orgId, locationId)
      .subscribe(data => {
        if (data["status"] == "success") {
          this.numbersPhone = data["result"]
          this.numbersPhone = this.numbersPhone.filter((e: any) => e["phoneNumber"] != null);
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
  getSitesEntreprise() {
    this.loadingPeople = true;
    this.webexServices.GetSitesEntreprise(this.entID)
      .subscribe(data => {
        this.dropdownListSites = [];
        if (data["status"] == "success") {
          this.loadingPeople = false;
          this.sites = data["result"];

        }
        else {
          this.loadingPeople = false;
          var str: string = data["message"];
         str =  data["erreur"] != null  ? str + " " + data["erreur"] : "" 
         this.toastr.error("une erreur technique est survenue")

        }
      }, error => {
        this.loadingPeople = false;
        var str: string = error["error"]["message"];
        str = error["error"]["erreur"] != null ? str + " " + error["error"]["erreur"] : str
        this.toastr.error("une erreur technique est survenue")

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
