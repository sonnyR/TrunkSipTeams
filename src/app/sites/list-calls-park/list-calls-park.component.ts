import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CallPark } from 'src/app/Model/call-park.model';
import { WebexService } from 'src/app/services/webex.service';
import Swal from 'sweetalert2';
import { EditCallParkComponent } from '../edit-call-park/edit-call-park.component';
declare var window: any;
@Component({
  selector: 'app-list-calls-park',
  templateUrl: './list-calls-park.component.html',
  styleUrls: ['./list-calls-park.component.css']
})
export class ListCallsParkComponent implements OnInit {
  @Input()
  entID: string;
  @Input()
  userid: string;
  @Input()
  orgId: string;
  @Input()
  locationId: string;
  listCallsPark : any = [];
  formModalDeleteCallPark: any;
  callPark : CallPark = new CallPark();
  @ViewChild('closebutton') closeModalDelete: any;
  constructor(private webexServices : WebexService, private toastr: ToastrService,private modalService: NgbModal) { }
  ngOnInit(): void {
    this.formModalDeleteCallPark = new window.bootstrap.Modal(
      document.getElementById('myModalDeleteCallPark')
    );
    this.GetListCallParks();
  }
  GetListCallParks() {
    this.webexServices.GetCallParks(this.orgId,this.locationId)
      .subscribe(data => {
        this.listCallsPark = [];
        if (data["status"] == "success") {
          this.listCallsPark = data["result"];
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
  DeleteCallPark(callPark: CallPark) {
    this.callPark = callPark
    this.formModalDeleteCallPark.show();
  }
  ConfirmedDeleteCallPark() {
    this.webexServices.DeleteCallPark(this.callPark.locationId,this.callPark.id,this.orgId)
      .subscribe(data => {
        if (data) {
          // var userLog = new UserLogs();
          // userLog.commentaire = "Supresssion d'utlisateur " + this.UserDelete["firstName"] + " " + this.UserDelete["lastName"];
          // userLog.entID = this.entID;
          // userLog.email = this.UserDelete["emails"][0]
          // userLog.userID = this.UserDelete["id"]
          // var historyCommande = new HistoriquesCommande();
          // historyCommande.description = "Modification";
          // historyCommande.userOperation = this.userid;
          // historyCommande.entID = this.entID;
          // historyCommande.userLogs = [];
          // historyCommande.userLogs.push(userLog);
          // this.SaveHistoriquesCommande(historyCommande, "DeleteUser");
          this.GetListCallParks();
          this.closeModalDelete.nativeElement.click();
      
          this.toastr.success('le call park ' + this.callPark.name + ' est supprimé', '', {
            positionClass: 'toast-top-right'
          });
        }
        else {
          var str: string = data["message"];
          str = str + " " + data["erreur"]
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
  EditCallPark(callPark: CallPark) {
    const modalRef = this.modalService.open(EditCallParkComponent, { size: 'lg', windowClass: "mainModal", centered: true, backdrop: "static" });
    modalRef.componentInstance.Init(this.orgId, this.userid,this.locationId,callPark);
    modalRef.componentInstance.passEntry.subscribe((receivedEntry: any) => {
      if (receivedEntry == "Closed") {
        this.GetListCallParks()
      }
    })
  }

}
