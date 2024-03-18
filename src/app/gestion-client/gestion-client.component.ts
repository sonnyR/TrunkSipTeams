import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { WebexService } from '../services/webex.service';

@Component({
  selector: 'app-gestion-client',
  templateUrl: './gestion-client.component.html',
  styleUrls: ['./gestion-client.component.css']
})
export class GestionClientComponent implements OnInit {
  constructor(private service : WebexService) { }
  entID: string = "";
  code_client: Number = 0;
  userid: string = "";
  orgId: string;
  packages: any = [];
  disbaledSite = false;
  approvisionnement = false;
  statusEnt = "";
  selectedIndex: number;
  Title : string = "Ajouter Client";
  ngOnInit() {
    if(environment.production){
      this.code_client = Number.parseInt(this.getUrlParameter('codeclient'));
      this.service.getUrlParameter(this.code_client)
    }
    else{
      this.code_client = 1975;
      this.service.getUrlParameter(this.code_client)
    }
  }
  SendEntID(entID: string) {
    this.entID = entID;
  }
  SendOrgId(orgId: string) {
    this.orgId = orgId;
  }
  SendPackges(pack: any) {
    this.packages = pack;
    if (this.packages.length == 1 && this.packages.includes("webex_meetings")) {
      this.disbaledSite = true;
    }
  }
  SendStatusEnt(status: string) {
    this.statusEnt = status;
  }
  sendApprovisionnement(appro: any) {
    this.approvisionnement = appro;
  }
  ForceOpenSite() {
    var i, tabcontent: any, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    const city = document.getElementById('SITE') as HTMLElement;
    city.style.display = "block";
    (<HTMLInputElement>document.getElementById("BTNSITE")).className += " active";
  }
  ForceOpenCommande() {
    var i, tabcontent: any, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    const city = document.getElementById('COMMANDES') as HTMLElement;
    city.style.display = "block";
    (<HTMLInputElement>document.getElementById("BTNCOMMANDES")).className += " active";
  }
  getUrlParameter(name: any) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(window.location.href);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, ' '));
  };
  openMenu(evt: any, cityName: any) {
    var i, tabcontent: any, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    const city = document.getElementById(cityName) as HTMLElement;
    city.style.display = "block";

    evt.currentTarget.className += " active";
  }

}
