import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddPstnNumberComponent } from '../sites/add-pstn-number/add-pstn-number.component';
import { AddUserComponent } from './add-user/add-user.component';
import { WebexService } from '../services/webex.service';
import { EditUserComponent } from './edit-user/edit-user.component';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { PstnNumbers } from '../Model/pstn-numbers.model';
import { User } from '../Model/user.model';
import { Subscription } from 'rxjs';
import { SharedService } from '../services/shared.service';
import { ConfigureCallForwardingForPeopleComponent } from './configure-call-forwarding-for-people/configure-call-forwarding-for-people.component';
declare var window: any;
@Component({
  selector: 'app-commandes',
  templateUrl: './commandes.component.html',
  styleUrls: ['./commandes.component.css']
})
export class CommandesComponent implements OnInit {

  constructor(private modalService: NgbModal, private webexServices: WebexService,
     private toastr: ToastrService, private sharedService:SharedService) {
      this.clickEventsubscription=    this.sharedService.getClickEvent().subscribe(()=>{
        this.GetNumbersEntreprise(this.currentPageNumber,this.pageSizeNumber);
        })

      }
  @Input()
  entID: string;
  @Input()
  userid: any;
  @Input()
  orgId: string;
  @Input()
  packages: any
  @Input()
  approvisionnement: boolean;
  @Input()
  statusEnt: string;
  Services: any = [];
  users: any = [];
  PhoneNumbers: any = [];
  formModal: any;
  formModalDeleteUser: any;
  formModalDeleteListNumbers : any;
  formModalDeleteListUsers : any;
  callAddUserWholeSale = true;
  showOngletNumeros = true;
  licensesEntreprise: any = [];
  showButtonDeleteListPhones = false;
  @ViewChild('closebutton') closebutton: any;
  @ViewChild('closeModalDelete') closeModalDelete: any;
  @ViewChild('closeModalDeleteListNumbers') closeModalDeleteListNumbers: any;
  @ViewChild('closeModalDeletListUser') closeModalDeletListUser: any;
  loading = false;
  TextValue = "Création en cours";
  searchTextUser=""
  selectedAllUser = false
  clickEventsubscription:Subscription;
  ngOnInit() {
  }
  tableContainer = document.querySelector('.table-container') as HTMLElement;
 
  ngOnChanges() {
    this.nextUrl = null;
    this.formModal = new window.bootstrap.Modal(
      document.getElementById('myModal')
    );
    this.formModalDeleteUser = new window.bootstrap.Modal(
      document.getElementById('myModalDeleteUser')
    );
    this.formModalDeleteListNumbers = new window.bootstrap.Modal(
      document.getElementById('myModalDeleteListNumbers')
    )
    this.formModalDeleteListUsers = new window.bootstrap.Modal(
      document.getElementById('myModalDeleteListUser')
    )
    if (this.entID != "" || this.entID != null) {
      if (this.statusEnt == "provisioned" || this.statusEnt == "updating") {
        this.GetServicesForEntreprise();
        this.GetUsersEntreprise_withApiPeaple(this.currentPage,this.pageSize1);
        if (this.packages.length == 1 && this.packages.includes("webex_meetings")) {
          this.showOngletNumeros = false
        }
        else {
          this.showOngletNumeros = true
          this.GetNumbersEntreprise(this.currentPageNumber,this.pageSizeNumber);
        }
      }
    }
   
  }
  GetServicesForEntreprise() {
    this.webexServices.GetServicesEntreprise(this.entID)
      .subscribe(data => {
        this.Services = [];
        if (data["status"] == "success") {
          this.Services = data["result"];
          if (this.Services.length == 1 && this.Services[0]['name'] == 'Common area calling') {
            this.callAddUserWholeSale = false
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
  GetUsersEntreprise() {
    this.webexServices.GetUsersEntreprise(this.entID)
      .subscribe(data => {
        this.users = [];
        if (data["status"] == "success") {
          this.users = data["result"];
        

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
  loadingSpinner = false;
  haveDataUses = true;
nextUrl = null;
  GetUsersEntreprise_withApiPeaple(pageNumber, pageSize) {
    this.loadingSpinner = true;
    console.log("nextUrlavant",this.nextUrl)
    this.webexServices.GetUsersEntreprise_withApiPeople(this.entID,this.orgId,encodeURIComponent(this.nextUrl),pageSize)
      .subscribe(data => {
        if (data["status"] == "success") {
          //this.users=data["result"];
        this.nextUrl = data["linkHeader"];
        const newData = data["result"];
        this.users = this.users.concat(newData);
          if(this.users.length == 0){
            this.haveDataUses = false;
          }
          this.loadingSpinner = false;
        }
        else {
          this.loadingSpinner = false;
          var str: string = data["message"];
         str =  data["erreur"] != null  ? str + " " + data["erreur"] : "" 
         this.toastr.error("une erreur technique est survenue")
        }
      }, error => {
        this.loadingSpinner = false;
        var str: string = error["error"]["message"];
        str = error["error"]["erreur"] != null ? str + " " + error["error"]["erreur"] : str
        this.toastr.error("une erreur technique est survenue")
      });
  }
  onScrollUsers() {
    
    const tableContainer = document.querySelector('.table-container');
    const threshold = 1
    if (tableContainer.scrollTop + tableContainer.clientHeight + threshold>= tableContainer.scrollHeight) {
      this.currentPage++;
      if(this.nextUrl != "noUrl")
      {
        this.GetUsersEntreprise_withApiPeaple(this.currentPage,this.pageSize1);

      }
    }
  }
 currentPage = 1;
 pageSize1 = 50; // Set the desired page size
 currentPageNumber = 0;
 pageSizeNumber = 50;
 onScrollNumber() {
  const tableContainer = document.querySelector('.table-containerNumber');
  console.log("tableContainer.scrollTop + tableContainer.clientHeight,", Number(tableContainer.scrollTop) + Number(tableContainer.clientHeight))
  const threshold = 1
  if(( Number(tableContainer.scrollTop) +  Number(tableContainer.clientHeight) + threshold)>= Number(tableContainer.scrollHeight)) {
    this.currentPageNumber = this.currentPageNumber + this.pageSizeNumber;
    //this.pageSizeNumber = this.pageSizeNumber + 50;
    this.GetNumbersEntreprise(this.currentPageNumber,this.pageSizeNumber);
  }
}
  page = 1;
  pageSize = 5;
  collectionSize = 0;
  paginateData: any[] = [];
  GetNumbersEntreprise(currentPageNumber,pageSizeNumber) {
    
    this.webexServices.GetNumbersEntreprise(this.entID,this.orgId,currentPageNumber,pageSizeNumber)
      .subscribe(data => {
        //this.PhoneNumbers = [];
        if (data["status"] == "success") {
          const newData = data["result"];
      this.PhoneNumbers = this.PhoneNumbers.concat(newData);
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
  getPremiumData(){
    
    this.paginateData =  this.PhoneNumbers
     .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
     
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
  activateNumber(num: any) {
    var objNumber = {
      "phoneNumbers": [
        num["phoneNumber"]
      ]
    }
    this.webexServices.ActivatePstnNumbers(objNumber, this.entID, num['idSite'])
      .subscribe(data => {

        if (data != null && data["status"] == "success") {
        
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
  AddNumero() {
    const modalRef = this.modalService.open(AddPstnNumberComponent, { size: 'lg', windowClass: "mainModal", centered: true, backdrop: "static" });
    modalRef.componentInstance.Init(this.entID, this.userid,this.orgId);
    modalRef.componentInstance.passEntry.subscribe((receivedEntry: any) => {
      if (receivedEntry == "Closed") {
        this.GetNumbersEntreprise(this.currentPageNumber,this.pageSizeNumber);
      }
    })
  }
  AddUser() {
    const modalRef = this.modalService.open(AddUserComponent, { size: 'lg', windowClass: "mainModal", centered: true, backdrop: "static" });
    modalRef.componentInstance.Init(this.entID, this.orgId, this.Services, this.userid);
    modalRef.componentInstance.passEntry.subscribe((receivedEntry: any) => {
      if (receivedEntry == "Closed") {
        if (this.showOngletNumeros) {
          this.GetNumbersEntreprise(this.currentPageNumber,this.pageSizeNumber)
        }
        this.GetUsersEntreprise_withApiPeaple(this.currentPage,this.pageSize1)
      }
    })
  }
  EditUser(user: any) {
    const modalRef = this.modalService.open(EditUserComponent, { size: 'lg', windowClass: "mainModal", centered: true, backdrop: "static" });
    modalRef.componentInstance.Init(this.entID, user, this.Services, this.userid, this.orgId);
    modalRef.componentInstance.passEntry.subscribe((receivedEntry: any) => {
      if (receivedEntry == "Closed") {
        if (this.showOngletNumeros) {
          this.GetNumbersEntreprise(this.currentPageNumber,this.pageSizeNumber)
        }
        this.GetUsersEntreprise_withApiPeaple(this.currentPage,this.pageSize1);
      }
    })
  }
  packageEnFrancais(serv: string) {
    let pac = "Aucun";
    switch (serv) {
      case "webex_meetings":
        pac = "Webex meeting"
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
    return pac
  }
  phoneNumberDelete: PstnNumbers = new PstnNumbers();
  DeletePhoneNumber(phone: any) {
    this.phoneNumberDelete = phone
    this.phoneNumberDelete.orgId = this.orgId;
    this.phoneNumberDelete.entId = this.entID;
    this.phoneNumberDelete.userOperation = this.userid
    this.formModal.show();
  }
  ConfirmedDeletePhoneNumber() {
    this.TextValue = "Suppression de ligne en cours"
    this.loading = true;
    this.webexServices.DeleteNumbersEntreprise(this.phoneNumberDelete)
      .subscribe(data => {
        if (data) {
          this.loading = false;
          this.GetNumbersEntreprise(this.currentPageNumber,this.pageSizeNumber)
          this.closeModalDelete.nativeElement.click();
          this.toastr.success('le numéro de téléphone  ' + this.phoneNumberDelete["phoneNumber"] + ' est supprimé', '', {
            positionClass: 'toast-top-right',
            timeOut: 6000
          });

        }
        else {
          this.loading = false;
          var str: string = data["message"];
          str = data["erreur"]  != null ? str + " " + data["erreur"] : str
          this.toastr.error("une erreur technique est survenue")

        }
      }, error => {
        this.loading = false;
        var str: string = error["error"]["message"];
       str = error["error"]["erreur"]  != null ? str + " " + error["error"]["erreur"] : str
       this.toastr.error("une erreur technique est survenue")
      });
  }
  DeleteListPhoneNumbers(){
    this.formModalDeleteListNumbers.show()
  }
  ConfirmedDeleteListPhonesNumber() {
    this.TextValue = "Suppression des lignes en cours"
    this.loading = true;
    this.webexServices.DeleteListNumbersEntreprise(this.ListphoneNumberDelete)
      .subscribe(data => {
        if (data) {
          this.loading = false;
          this.GetNumbersEntreprise(this.currentPageNumber,this.pageSizeNumber)
          this.closeModalDeleteListNumbers.nativeElement.click();
        
          this.toastr.success('les numéros de téléphone ' + this.ListphoneNumberDelete + ' sont supprimé', '', {
            positionClass: 'toast-top-right',
            timeOut: 6000
          });
          this.ListphoneNumberDelete = [];

        }
        else {
          this.loading = false;
          var str: string = data["message"];
          str = data["erreur"]  != null ? str + " " + data["erreur"] : str
          this.toastr.error("une erreur technique est survenue")

        }
      }, error => {
        this.loading = false;
        var str: string = error["error"]["message"];
       str = error["error"]["erreur"]  != null ? str + " " + error["error"]["erreur"] : str
       this.toastr.error("une erreur technique est survenue")

      });
  }
  DeleteListPhoneUsers(){
    this.formModalDeleteListUsers.show()
  }
  ConfirmedDeleteListUsers() {
    this.loading = true;
    this.TextValue = "Suppression des utilisateurs en cours"
    this.webexServices.DeleteListUser(this.ListIdPerson,this.userid)
      .subscribe(data => {
        if (data) {
          this.loading = false;
          this.closeModalDeletListUser.nativeElement.click();
          if (this.showOngletNumeros)
            this.GetNumbersEntreprise(this.currentPageNumber,this.pageSizeNumber)
          this.GetUsersEntreprise_withApiPeaple(this.currentPage,this.pageSize1);
          this.toastr.success('les utilisateurs selectionné sont supprimé', '', {
            positionClass: 'toast-top-right'
          });
        }
        else {
          this.loading = false;
          var str: string = data["message"];
          str = data["erreur"] != null ? str + " " + data["erreur"] : str
          this.toastr.error("une erreur technique est survenue")

        }
      }, error => {
        this.loading = false;
        var str: string = error["error"]["message"];
        str = error["error"]["erreur"] != null ? str + " " + error["error"]["erreur"] : str
        this.toastr.error("une erreur technique est survenue")

      });
  }
  UserDelete: any
  UserEmail = ""
  DeleteUser(user: any) {
    this.UserDelete = user
    this.UserEmail = user['emails'];
    this.formModalDeleteUser.show();
  }
  ConfirmedDeleteUser() {
    this.loading = true;
    this.TextValue = "Suppression d'utilisateur en cours"
    this.webexServices.DeleteUser(this.UserDelete["id"],this.userid)
      .subscribe(data => {
        if (data) {
          this.loading = false;
          this.closebutton.nativeElement.click();
          if (this.showOngletNumeros)
            this.GetNumbersEntreprise(this.currentPageNumber,this.pageSizeNumber)
          this.GetUsersEntreprise_withApiPeaple(this.currentPage,this.pageSize1);
          this.toastr.success('l\'utilisateur ' + this.UserDelete["firstName"] + " " + this.UserDelete["lastName"] + ' est supprimé', '', {
            positionClass: 'toast-top-right'
          });
        }
        else {
          this.loading = false;
          var str: string = data["message"];
          str = data["erreur"] != null ? str + " " + data["erreur"] : str
          this.toastr.error("une erreur technique est survenue")

        }
      }, error => {
        this.loading = false;
        var str: string = error["error"]["message"];
        str = error["error"]["erreur"] != null ? str + " " + error["error"]["erreur"] : str
        this.toastr.error("une erreur technique est survenue")

      });
  }
  ResetVoicemailPIN(personId : string){
    this.webexServices.ResetVoicemailPIN(personId,this.orgId)
    .subscribe(data => {
      if (data["status"] == "success") {
        this.toastr.success('PIN de la boîte vocale est Réinitialisé avec succée', '', {
          positionClass: 'toast-top-right',
          timeOut: 6000
        });
      }
      else {
        var str: string = data["message"];
        str =  str + " " + data["erreur"] 
        Swal.fire({
          icon: 'error',
          text: str
        })
      }
    }, error => {
      var str: string = error["error"]["message"];
        str = str + " " + error["error"]["erreur"]
        Swal.fire({
          icon: 'error',
          text: str
        })
    });

  }
  filterDataUser(searchText: any) {
    const filterValue = (searchText.target as HTMLInputElement).value;
    if (!this.users || !filterValue) return this.users;
    searchText = filterValue.toLowerCase();
    return this.users.filter(item => {
        return item.firstName?.toLowerCase().includes(filterValue) ||
               item.lastName?.toString().includes(filterValue);
     
    });
  }
  ListphoneNumberDelete : PstnNumbers[] = [];
  checkedListNumerosForDelete(event : any,phone : any){
    var phoneDelete : PstnNumbers = new PstnNumbers();
    phoneDelete = phone
    phoneDelete.orgId = this.orgId;
    phoneDelete.entId = this.entID;
    phoneDelete.userOperation = this.userid
    if (event.target.checked) {
      this.ListphoneNumberDelete.push(phoneDelete);
     
    }
    else{
      this.ListphoneNumberDelete = this.ListphoneNumberDelete.filter(element => element !== phoneDelete);
      if(this.ListphoneNumberDelete.length == 0){
        this.selectedAllNum = false
      }
    }

  }
  selectedAllNum = false
  checkedAllListNumerosForDelete(event : any){
    if (event.target.checked) {
      this.selectedAllNum = true;
      this.ListphoneNumberDelete = []
      //this.ListphoneNumberDelete.push(phoneDelete);
      //[disabled]="num['mainNumber'] || num['state'] == 'Non applicable' || num['owner'] != null"
      this.PhoneNumbers.forEach(ph=>{
      var  pstnNum = new PstnNumbers()
      pstnNum = ph
      pstnNum.orgId = this.orgId;
      pstnNum.entId = this.entID;
      pstnNum.userOperation = this.userid
      if(ph['mainNumber'] || ph['state'] == 'Non applicable' || ph['owner'] != null){

      }
      else{
        ph.selected = event.target.checked
        this.ListphoneNumberDelete.push(pstnNum);
      }
      })
     
    }
    else{
      this.ListphoneNumberDelete = [];
      this.selectedAllNum =false
      this.PhoneNumbers.forEach(ph=>{
        if(ph['mainNumber'] || ph['state'] == 'Non applicable' || ph['owner'] != null){
  
        }
        else{
          ph.selected = event.target.checked
        }
        })
    }
  }
  
  ListUsersDelete : User[] = [];
ListIdPerson : string[] = []
  checkedListUsersForDelete(event : any,user : any){
    var userDelete : User = new User();
    userDelete.customerId = this.entID
    userDelete = user
    if (event.target.checked) {
      
      this.ListUsersDelete.push(userDelete);
      this.ListIdPerson.push(userDelete.id)
      if(this.ListUsersDelete.length == this.users.length){
        this.selectedAllUser = true
      }
     
    }
    else{
      this.ListUsersDelete = this.ListUsersDelete.filter(element => element !== userDelete);
      this.ListIdPerson = this.ListIdPerson.filter(x=>x !== userDelete.id)
      if(this.ListUsersDelete.length == 0){
        this.selectedAllUser = false
      }
      if(this.ListUsersDelete.length != this.users.length){
        this.selectedAllUser = false
      }
    }
  }

  checkedAllListUsersForDelete(event : any){
    if (event.target.checked) {
      this.selectedAllUser = true;
      this.ListUsersDelete = []
      this.ListIdPerson  = []
      this.users.forEach(us=>{
      var  user = new User()
      user = us
     user.userOpeartion = this.userid
       us.selected = event.target.checked
        this.ListUsersDelete.push(user);
        this.ListIdPerson.push(user.id);
      })
    }
    else{
      this.ListUsersDelete = [];
      this.ListIdPerson  = []
      this.selectedAllUser =false
      this.users.forEach(ph=>{
          ph.selected = event.target.checked
        })
    }
  }
  configureCallForwardingForPeople(user : User) {
    const modalRef = this.modalService.open(ConfigureCallForwardingForPeopleComponent, { size: 'lg', windowClass: "mainModal", centered: true, backdrop: "static" });
    modalRef.componentInstance.Init(this.entID, this.orgId, user, this.userid);
    modalRef.componentInstance.passEntry.subscribe((receivedEntry: any) => {
      if (receivedEntry == "Closed") {
        this.GetUsersEntreprise_withApiPeaple(this.currentPage,this.pageSize1)
      }
    })
  }
}
