import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CallPickup } from 'src/app/Model/call-pickup.model';
import { WebexService } from 'src/app/services/webex.service';

@Component({
  selector: 'app-list-calls-pickup',
  templateUrl: './list-calls-pickup.component.html',
  styleUrls: ['./list-calls-pickup.component.css']
})
export class ListCallsPickupComponent implements OnInit {
  @Input()
  entID: string;
  @Input()
  userid: string;
  @Input()
  orgId: string;
  @Input()
  locationId: string;
  listCallsPickup : any = [];
  formModalDeleteCallPark: any;
  callPickup : CallPickup = new CallPickup();
  @ViewChild('closebutton') closeModalDelete: any;
  constructor(private webexServices : WebexService, private toastr: ToastrService,private modalService: NgbModal) { }

  ngOnInit(): void {
    this.GetListCallPickup();
  }
  GetListCallPickup() {
    this.webexServices.GetCallPickups(this.orgId,this.locationId)
      .subscribe(data => {
        this.listCallsPickup = [];
        if (data["status"] == "success") {
          this.listCallsPickup = data["result"];
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

}
