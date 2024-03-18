import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AutoAttendant } from 'src/app/Model/auto-attendant.@model';
import { HuntGroup } from 'src/app/Model/hunt-group.model';
import { WebexService } from 'src/app/services/webex.service';
import Swal from 'sweetalert2';
import { EditAutoAttendantComponent } from '../edit-auto-attendant/edit-auto-attendant.component';
declare var window: any;
@Component({
  selector: 'app-list-auto-attendants',
  templateUrl: './list-auto-attendants.component.html',
  styleUrls: ['./list-auto-attendants.component.css']
})
export class ListAutoAttendantsComponent implements OnInit {

  @Input()
  entID: string;
  @Input()
  userid: string;
  @Input()
  orgId: string;
  @Input()
  locationId: string;
  listAutoAttendants : any = [];
  formModalDeleteAutoAttendants: any;
  autoAttendant : AutoAttendant = new AutoAttendant();
  @ViewChild('closebutton') closeModalDelete: any;
  constructor(private webexServices : WebexService, private toastr: ToastrService,private modalService: NgbModal) { }
  ngOnInit(): void {
  }
  ngOnChanges() {
    this.formModalDeleteAutoAttendants = new window.bootstrap.Modal(
      document.getElementById('myModalDeleteCallQueue')
    );
    this.GetListAutoAttandents();
  }
  GetListAutoAttandents() {
    this.webexServices.GetAutoAttendants(this.orgId,this.locationId)
      .subscribe(data => {
        this.listAutoAttendants = [];
        if (data["status"] == "success") {
          this.listAutoAttendants = data["result"];
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
  DeleteSVI(svi: AutoAttendant) {
    this.autoAttendant = svi
    this.formModalDeleteAutoAttendants.show();
  }
  ConfirmedSvi() {
    this.webexServices.DeleteAutoattendant(this.autoAttendant.locationId,this.autoAttendant.id,this.orgId)
      .subscribe(data => {
        if (data) {
          this.GetListAutoAttandents();
          this.closeModalDelete.nativeElement.click();
      
          this.toastr.success('le standart automatique ' + this.autoAttendant.name + ' est supprimé', '', {
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
  EditAutoAttendant(autoAttendant: AutoAttendant) {
    const modalRef = this.modalService.open(EditAutoAttendantComponent, { size: 'xl', windowClass: "mainModal", centered: true, backdrop: "static" });
    modalRef.componentInstance.Init(this.orgId, this.userid,this.locationId,autoAttendant.id);
    modalRef.componentInstance.passEntry.subscribe((receivedEntry: any) => {
      if (receivedEntry == "Closed") {
        this.GetListAutoAttandents()
      }
    })
  }

}
