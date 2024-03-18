import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CallQueue } from 'src/app/Model/call-queue.model';
import { WebexService } from 'src/app/services/webex.service';
import Swal from 'sweetalert2';
import { EditCallQueueComponent } from '../edit-call-queue/edit-call-queue.component';
declare var window: any;
@Component({
  selector: 'app-list-call-queue',
  templateUrl: './list-call-queue.component.html',
  styleUrls: ['./list-call-queue.component.css']
})
export class ListCallQueueComponent implements OnInit {
  @Input()
  entID: string;
  @Input()
  userid: string;
  @Input()
  orgId: string;
  @Input()
  locationId: string;
  listCallsQueue : any = [];
  formModalDeleteCallQueue: any;
  callQueue : CallQueue = new CallQueue();
  @ViewChild('closebutton') closeModalDelete: any;
  constructor(private webexServices : WebexService, private toastr: ToastrService,private modalService: NgbModal) { }
  ngOnInit(): void {
  }
  ngOnChanges() {
    this.formModalDeleteCallQueue = new window.bootstrap.Modal(
      document.getElementById('myModalDeleteCallQueue')
    );
    this.GetListCallQueues();
  }
  GetListCallQueues() {
    this.webexServices.GetCallQueues(this.orgId,this.locationId)
      .subscribe(data => {
        this.listCallsQueue = [];
        if (data["status"] == "success") {
          this.listCallsQueue = data["result"];
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
  DeleteCallQueue(callQueue: CallQueue) {
    this.callQueue = callQueue
    this.formModalDeleteCallQueue.show();
  }
  ConfirmedDeleteCallQueue() {
    this.webexServices.DeleteCallQueue(this.callQueue.locationId,this.callQueue.id,this.orgId)
      .subscribe(data => {
        if (data) {
         
          this.GetListCallQueues();
          this.closeModalDelete.nativeElement.click();
      
          this.toastr.success('le call queue ' + this.callQueue.name + ' est supprimé', '', {
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

  EditCallPark(callQueue: CallQueue) {
    const modalRef = this.modalService.open(EditCallQueueComponent, { size: 'xl', windowClass: "mainModal", centered: true, backdrop: "static" });
    modalRef.componentInstance.Init(this.orgId, this.userid,this.locationId,callQueue.id);
    modalRef.componentInstance.passEntry.subscribe((receivedEntry: any) => {
      if (receivedEntry == "Closed") {
        this.GetListCallQueues()
      }
    })
  }
}
