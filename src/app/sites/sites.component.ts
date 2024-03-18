import { Component, Input, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { CallPark } from '../Model/call-park.model';
import { SharedService } from '../services/shared.service';
import { WebexService } from '../services/webex.service';
import { AddAutoAttendantComponent } from './add-auto-attendant/add-auto-attendant.component';
import { AddCallParkComponent } from './add-call-park/add-call-park.component';
import { AddCallPickupComponent } from './add-call-pickup/add-call-pickup.component';
import { AddCallQueueComponent } from './add-call-queue/add-call-queue.component';
import { AddHuntGroupComponent } from './add-hunt-group/add-hunt-group.component';
import { AddSiteComponent } from './add-site/add-site.component';
import { EditCallParkComponent } from './edit-call-park/edit-call-park.component';
import { EditVoicePortalComponent } from './edit-voice-portal/edit-voice-portal.component';
import { ListAutoAttendantsComponent } from './list-auto-attendants/list-auto-attendants.component';
import { ListCallQueueComponent } from './list-call-queue/list-call-queue.component';
import { ListCallsParkComponent } from './list-calls-park/list-calls-park.component';
import { ListCallsPickupComponent } from './list-calls-pickup/list-calls-pickup.component';
import { ListHuntGroupsComponent } from './list-hunt-groups/list-hunt-groups.component';
import { UpdateNumberPhoneToMainNumberComponent } from './update-number-phone-to-main-number/update-number-phone-to-main-number.component';
declare var window: any;
@Component({
  selector: 'app-sites',
  templateUrl: './sites.component.html',
  styleUrls: ['./sites.component.css'],
})
export class SitesComponent implements OnInit {
  clickEventsubscription: Subscription;
  constructor(private modalService: NgbModal, private webexServices: WebexService, private formBuilder: FormBuilder,
    private sharedService: SharedService, private toastr: ToastrService) { }
  @ViewChild(AddSiteComponent) childSite: AddSiteComponent;
  @ViewChild(EditVoicePortalComponent) childEditVoicePortal: EditVoicePortalComponent;
  @ViewChild(ListCallsParkComponent)  listCallsParkComponent: ListCallsParkComponent;
  @ViewChild(ListCallsPickupComponent)  listCallsPickupComponent: ListCallsPickupComponent;
  @ViewChild(ListCallQueueComponent)   listCallQueueComponent: ListCallQueueComponent;
  @ViewChild(ListHuntGroupsComponent)   listHuntGroupsComponent: ListHuntGroupsComponent;
  @ViewChild(ListAutoAttendantsComponent)   listAutoAttendantsComponent: ListAutoAttendantsComponent;
  @Input()
  entID: string;
  @Input()
  orgId: string;
  @Input()
  userid: string;
  @Input()
  packages: any
  @Input()
  approvisionnement: boolean;
  @Input()
  statusEnt: string;
  sites: any = [];
  siteModif: any
  TextValue = "";
  loading = false;
  locationId = "";
  ShowCallsPark = false
  ShowCallsPickup = false;
  showCallsQueue = false;
  showHuntGroups = false;
  formModalDeleteCallPark: any;
  editVoicePortal : boolean = false;
  ngOnInit() {
  }
  ngOnChanges() {
    if (this.entID != "" || this.entID != null) {
      if (this.statusEnt == "provisioned" || this.statusEnt == "updating") {
        this.packages.length == 1 && this.packages.includes("webex_meetings") ? "" : this.GetSitesForEntreprise();
      }
    }
    
    
  }
  page = 1;
  pageSize = 5;
  collectionSize = 0;
  paginateData: any[] = [];
  GetSitesForEntreprise() {
    this.webexServices.GetSitesEntreprise(this.entID)
      .subscribe(data => {
        this.sites = [];
        if (data["status"] == "success") {
          this.sites = data["result"];
          this.collectionSize = this.sites.length;
          this.orgId = this.sites[0]["orgId"]
          this.getPremiumData();
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
    
    this.paginateData =  this.sites
     .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
     
   }
  numeros: string[] = [];
  numerosTest: string[] = [];
  addnum = false;
  numberControl(event: any) {
    const input = document.getElementById('message') as HTMLInputElement;
    const value = input.value;
    this.numeros = value.split(',');
    if (value.includes(",")) {
      this.addnum = true;
    }
  }
  goToSite(site: any) {
    this.siteModif = site
    this.childSite.fillingForm(site);
  }
  goToVoicePortal(locationId: string) {
    this.childEditVoicePortal.fillingFormVoicePortal(locationId,this.orgId);
    this.editVoicePortal = true;
    this.showCallsQueue = false
    this.showAutoAttendants = false
    this.showHuntGroups = false
  }
  AfficheCallParkLocation(locationId : string)
  {
    this.locationId = locationId
    this.ShowCallsPark = true
    this.ShowCallsPickup = false
  }
  AfficheCallQueuesLocation(locationId : string)
  {
    this.locationId = locationId
    this.showCallsQueue = true
    this.showAutoAttendants = false
    this.showHuntGroups = false
    this.editVoicePortal = false;
  }
  AfficheHuntGroupsLocation(locationId : string)
  {
    this.locationId = locationId
    this.showHuntGroups = true
    this.showAutoAttendants = false
    this.showCallsQueue = false
    this.editVoicePortal = false;
   
  }
  showAutoAttendants = false
  AfficheAutoAtandentsLocation(locationId : string)
  {
    this.locationId = locationId
    this.showAutoAttendants = true
    this.showCallsQueue = false
    this.showHuntGroups = false
    this.editVoicePortal = false;
    
  }
  AfficheCallPickupLocation(locationId:string){
    this.locationId = locationId
    this.ShowCallsPark = false
    this.ShowCallsPickup = true
  }
  elemineNumbe(num: string) {

    this.RemoveElementFromStringArray(num);
  }
  RemoveElementFromStringArray(element: string) {
    this.numeros.forEach((value, index) => {
      if (value == element) this.numeros.splice(index, 1);
    });
  }
  getLoading(event : any){
    this.loading = event
    this.TextValue="Enregistrement en cours"
  }
  AddCallPark() {
    const modalRef = this.modalService.open(AddCallParkComponent, { size: 'lg', windowClass: "mainModal", centered: true, backdrop: "static" });
    modalRef.componentInstance.Init(this.entID,this.orgId, this.userid,this.locationId);
    modalRef.componentInstance.passEntry.subscribe((receivedEntry: any) => {
      if (receivedEntry == "Closed") {
        this.listCallsParkComponent.GetListCallParks()
      }
    })
  }
  AddCallPickup() {
    const modalRef = this.modalService.open(AddCallPickupComponent, { size: 'lg', windowClass: "mainModal", centered: true, backdrop: "static" });
    modalRef.componentInstance.Init(this.orgId, this.userid,this.locationId);
    modalRef.componentInstance.passEntry.subscribe((receivedEntry: any) => {
      if (receivedEntry == "Closed") {
        this.listCallsPickupComponent.GetListCallPickup()
      }
    })
  }
  updateMainNumber(site : any){
    const modalRef = this.modalService.open(UpdateNumberPhoneToMainNumberComponent, { size: 'lg', windowClass: "mainModal", centered: true, backdrop: "static" });
    modalRef.componentInstance.Init(this.entID, this.userid,this.orgId,site);
    modalRef.componentInstance.passEntry.subscribe((receivedEntry: any) => {
      if (receivedEntry == "Closed") {
        this.GetSitesForEntreprise()
        this.sharedService.sendClickEvent();
        
      }
    })
  }
  AddCallQueue() {
    const modalRef = this.modalService.open(AddCallQueueComponent, { size: 'xl', windowClass: "mainModal", centered: true, backdrop: "static" });
    modalRef.componentInstance.Init(this.entID,this.orgId, this.userid,this.locationId);
    modalRef.componentInstance.passEntry.subscribe((receivedEntry: any) => {
      if (receivedEntry == "Closed") {
        this.listCallQueueComponent.GetListCallQueues()
      }
    })
  }
  AddHuntGroup() {
    const modalRef = this.modalService.open(AddHuntGroupComponent, { size: 'xl', windowClass: "mainModal", centered: true, backdrop: "static" });
    modalRef.componentInstance.Init(this.entID,this.orgId, this.userid,this.locationId);
    modalRef.componentInstance.passEntry.subscribe((receivedEntry: any) => {
      if (receivedEntry == "Closed") {
        this.listHuntGroupsComponent.GetListHuntGroups()
      }
    })
  }
  AddAutoAttendant() {
    const modalRef = this.modalService.open(AddAutoAttendantComponent, { size: 'xl', windowClass: "mainModal", centered: true, backdrop: "static" ,scrollable: true});
    modalRef.componentInstance.Init(this.entID,this.orgId, this.userid,this.locationId);
    modalRef.componentInstance.passEntry.subscribe((receivedEntry: any) => {
      if (receivedEntry == "Closed") {
        this.listAutoAttendantsComponent.GetListAutoAttandents()
      }
    })
  }

}
