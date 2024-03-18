import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { HuntGroup } from 'src/app/Model/hunt-group.model';
import { WebexService } from 'src/app/services/webex.service';
import Swal from 'sweetalert2';
import { EditHuntGroupComponent } from '../edit-hunt-group/edit-hunt-group.component';
declare var window: any;
@Component({
  selector: 'app-list-hunt-groups',
  templateUrl: './list-hunt-groups.component.html',
  styleUrls: ['./list-hunt-groups.component.css']
})
export class ListHuntGroupsComponent implements OnInit {

  @Input()
  entID: string;
  @Input()
  userid: string;
  @Input()
  orgId: string;
  @Input()
  locationId: string;
  listHuntGroups : any = [];
  formModalDeleteHuntGroups: any;
  huntGroup : HuntGroup = new HuntGroup();
  @ViewChild('closebutton') closeModalDelete: any;
  constructor(private webexServices : WebexService, private toastr: ToastrService,private modalService: NgbModal) { }
  ngOnInit(): void {
  }
  ngOnChanges() {
    this.formModalDeleteHuntGroups = new window.bootstrap.Modal(
      document.getElementById('myModalDeleteCallQueue')
    );
    this.GetListHuntGroups();
  }
  GetListHuntGroups() {
    this.webexServices.GetHuntGroups(this.orgId,this.locationId)
      .subscribe(data => {
        this.listHuntGroups = [];
        if (data["status"] == "success") {
          this.listHuntGroups = data["result"];
        }
        else {
          var str: string = data["message"];
          if (data["erreur"] != null) { str + " " + data["erreur"] }
          alert(str);
        }
      }, error => {
        var str: string = error["error"]["message"];
        str = str + ":  " + error["error"]["erreur"]
        alert(str);
      });
  }
  getStatus(enabled : boolean){
    if(enabled) return "Activé"
    return "Non activé"
  }
  DeleteCallQueue(huntGroup: HuntGroup) {
    this.huntGroup = huntGroup
    this.formModalDeleteHuntGroups.show();
  }
  ConfirmedDeleteCallQueue() {
    this.webexServices.DeleteHuntGroup(this.huntGroup.locationId,this.huntGroup.id,this.orgId)
      .subscribe(data => {
        if (data) {
         
          this.GetListHuntGroups();
          this.closeModalDelete.nativeElement.click();
      
          this.toastr.success('le hunt group ' + this.huntGroup.name + ' est supprimé', '', {
            positionClass: 'toast-top-right'
          });
        }
        else {
          var str: string = data["message"];
          str = str + " " + data["erreur"]
          this.toastr.error("une erreur technique est survenue")

        }
      }, error => {

        var str: string = error["error"]["message"];
        str = str + " " + error["error"]["erreur"]
        this.toastr.error("une erreur technique est survenue")

      });
  }
  getDetailsHuntGroup(huntGroup: HuntGroup) {
    this.webexServices.GetDetailsHuntGroup(this.locationId, huntGroup.id, this.orgId)
      .subscribe(data => {
        if (data["status"] == "success") {
          this.huntGroup = data["result"] as HuntGroup; 
         this.EditHuntGroup(this.huntGroup)
        }
        else {
          var str: string = data["message"];
          if (data["erreur"] != null) { str + " " + data["erreur"] }
          alert(str);
        }
      }, error => {
        var str: string = error["error"]["message"];
        str = str + ":  " + error["error"]["erreur"]
      });
  }
  EditHuntGroup(huntGroup: HuntGroup) {
   // this.getDetailsHuntGroup(huntGroup.id);
   var agents = []
   if(huntGroup.agents.length != 0){
    huntGroup.agents.forEach(e=>{
       agents.push(e.id)
     })
   }
    const modalRef = this.modalService.open(EditHuntGroupComponent, { size: 'xl', windowClass: "mainModal", centered: true, backdrop: "static" });
    modalRef.componentInstance.Init(this.orgId, this.userid,this.locationId,huntGroup.id,this.huntGroup,agents);
    modalRef.componentInstance.passEntry.subscribe((receivedEntry: any) => {
      if (receivedEntry == "Closed") {
        this.GetListHuntGroups()
      }
    })
  }


}
