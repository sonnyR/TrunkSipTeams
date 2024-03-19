import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { identityService } from '../services/identity.service';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NotifyService } from '../services/Notify.service';
import { HttpClient } from '@angular/common/http';
import { COMMANDEPF_SDA, COMMANDEPF_TeteDeGroupement,DomainOVHDto,
   ListLigneNDISDA,
   OffreTrunkSipCanauxDto, TrunkSipTeamsDto } from '../Model/trunk-sip-teams/trunk-sip-teams-model';
import { environment } from 'src/environments/environment';
import { Observable, map, startWith } from 'rxjs';
import { DatePipe } from '@angular/common';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
 import { ConfirmationDialogService } from '../services/ConfirmeMsg/confirmation-dialog.service';
import { BreadcrumbService } from '../services/breadcrumb.service';
import { WebexService } from '../services/webex.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-trunk-sip-teams',
  templateUrl: './trunk-sip-teams.component.html',
  styleUrls: ['./trunk-sip-teams.component.css']
})
export class TrunkSipTeamsComponent implements OnInit {
  loading = false;


  constructor(private _router: Router,private confirmationDialogService: ConfirmationDialogService
    , private dataService: DataService
    , private notifyService: NotifyService
    , private identity: identityService
    , private formBuilder: FormBuilder
    , private service : WebexService,
   private datePipe: DatePipe,
    private http: HttpClient,private el: ElementRef,private renderer: Renderer2,private breadcrumbService :BreadcrumbService
  ) {
  }
  submittedVerifDomain = false
  infoClientsSDAs: FormArray;
  FilterForm: FormGroup;
  DomainForm: FormGroup
  VerifDomainForm: FormGroup;
  loadingListTrunkSip = false;
  selectedIndex: number;
  currentSelected = 1;
  submitted = false;
  isTabAddTeamsDisabled = true
  submittedNew = false;
  public errorCodeClient = false;

  public stockCannauxDisponible: bigint = BigInt(0);
  displayedColumns: string[] = ['client','nombreCanaux', 'nombreSDA', 'dateCreation', 'dateResiliation', 'actionViewTrunkSipTeams', 'actionDeleteTrunkSipTeams',];
  codeclient='';
  fieldType = "A"
  subDomain = ""
  target = ""
  ttl = ""
  typeCommande = ""
  successAddedDomain = false;
  labelDomain = "Ajout Domaine"
  DomainCreated : DomainOVHDto

  public trunkSipTeamssDTOListTemp: TrunkSipTeamsDto[];
  public _trunkSipTeamsDTOList: TrunkSipTeamsDto[];
  get TrunkSipTeamsDTOList(): TrunkSipTeamsDto[] {

    return this._trunkSipTeamsDTOList;
  }
  sousDomainAdded
  DomainComplet


  @Input() set TrunkSipTeamsDTOList(value: TrunkSipTeamsDto[]) {

    this._trunkSipTeamsDTOList = value;
    this.trunkSipTeamssDTOListTemp = value;
  }
  @Input() set SDAs(value: COMMANDEPF_SDA[]) {
    this._sdas = value;
    this.LoadSDAs();
  }
  @Input() set OffresCanaux(value: OffreTrunkSipCanauxDto[]) {
    this._offresCanaux = value;
    this.LoadOffresCanaux();
  }

  maxValue: any;
  isDisabled: boolean = true;
  ajoutTrunkSipTeamsForm: FormGroup;
  SendCrmCommandeTrunkSip: boolean = false
  dataSourceTrunkSipTeams = new MatTableDataSource();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  currentTrunkSipTeamsNDI: COMMANDEPF_TeteDeGroupement;
  filteredNDIs: Observable<COMMANDEPF_TeteDeGroupement[]>;
  public _ndis: COMMANDEPF_TeteDeGroupement[];
  public _sdas: COMMANDEPF_SDA[];
  get SDAs(): COMMANDEPF_SDA[] {
    return this._sdas;
  }
  currentTrunkSipTeamsSDA: COMMANDEPF_SDA;
  filteredSDAs: Observable<COMMANDEPF_SDA[]>;
  trunkSipTeamsofCurrentClient : TrunkSipTeamsDto[];
  public typeOffre: string = "";

  selectedOffreCanaux: OffreTrunkSipCanauxDto;
  offreCanauxControl = new FormControl();
  filteredOffresCanaux: Observable<OffreTrunkSipCanauxDto[]>;
  public _offresCanaux: OffreTrunkSipCanauxDto[];
  get OffresCanaux(): OffreTrunkSipCanauxDto[] {
    return this._offresCanaux;
  }



  ngOnInit() {

    this.loading = false
    if(environment.production){
      this.codeclient = this.getUrlParameter('codeclient');
      this.service.getUrlParameter(this.codeclient)
    }
    else{
      this.codeclient = '1819';
      this.service.getUrlParameter(this.codeclient)
    }
    this.GetListTrunkSipTeamsByCodeClient(this.codeclient);
    this.CreateFormAjoutTrunk()

    const breadcrumb = {
      items: [
        { label: 'Univers Voice', url: '/UniversVoice' },
        { label: 'TrunkSip', url: '/UniversVoiceTrunk' },
        { label: 'Configuration Trunk SIP Teams', url: '/TrunkSipTeams' },

      ],
      bgColor: '#FF9494'
    }; this.breadcrumbService.setBreadcrumb(breadcrumb)
  }

  getUrlParameter(name: any) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(window.location.href);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, ' '));
  };


  createFilterForm() {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    this.FilterForm = this.formBuilder.group({
      dateFrom: new FormControl(this.datePipe.transform(firstDayOfMonth, 'yyyy-MM-dd')),
      dateTo: new FormControl(this.datePipe.transform(today, 'yyyy-MM-dd')),
      callType: new FormControl()
    });
  }

  goToUnivers() {
    this._router.navigate(["/UniversVoice"]);
  }

  goToHome() {
    this._router.navigate(["/"]);
  }


  changeStyle(): any {

    var colorBackgroundBarreTitre = '#f46600';
    var colorBackgroundBarreTitrePartenaire = sessionStorage.getItem("colorBackgroundBarreTitre");
    var colorPoliceBarreTitre = '#000000';
    var colorPoliceBarreTitrePartenaire = sessionStorage.getItem("colorPoliceBarreTitre");
    return {
      'background-color': (colorBackgroundBarreTitrePartenaire != 'undefined' && colorBackgroundBarreTitrePartenaire != '' && colorBackgroundBarreTitrePartenaire != undefined && colorBackgroundBarreTitrePartenaire != null && colorBackgroundBarreTitrePartenaire != 'null') ? colorBackgroundBarreTitrePartenaire : colorBackgroundBarreTitre,
      'color': (colorPoliceBarreTitrePartenaire != '' && colorPoliceBarreTitrePartenaire != undefined && colorPoliceBarreTitrePartenaire != null) ? colorPoliceBarreTitrePartenaire : colorPoliceBarreTitre
    };

  }

  goToMenuTrunkSip() {
    this._router.navigate(["/MenuTrunkSipProfils"]);
  }


  goToTab0(loadData) {
    this.currentSelected = 1;
    this.submitted = false;
    this.submittedNew = false;
    this.selectedIndex = 0;
    this.currentTrunkSipTeams = new TrunkSipTeamsDto();
    this.currentTrunkSipTeamsNDI = new COMMANDEPF_TeteDeGroupement();
    this.currentTrunkSipTeamsSDA = new COMMANDEPF_SDA();
    this.dataSourceSDA = new Array<COMMANDEPF_SDA>();
    this.SendCrmCommandeTrunkSip = false;
    this.typeCommande = "Creation";

    this.selectedOffreCanaux = null;
    this.IsEditMode = false;
    this.SendCrmCommandeTrunkSip = false;
    this.isTabAddTeamsDisabled = true;
    console.log( '  this.dataSourceSDA    =   ', this.dataSourceSDA )
   if (loadData)
      this.GetListTrunkSipTeamsByCodeClient(this.codeclient);
  }


  GoToNext() {
    var currentmenuselected = document.getElementById('menu_' + this.currentSelected);
    if (currentmenuselected != null) {
      currentmenuselected.classList.remove('selected');
    }
    this.currentSelected = 1
    var newSelected = document.getElementById('menu_' + this.currentSelected);
    if (newSelected != null) {
      newSelected.classList.add('selected')
    }
  }


  OnSelectItem(target, index) {

    if(index == 2){

        if (this.ajoutTrunkSipTeamsForm.controls["offreCanauxControl"].invalid) {
          return;
        }

    }
    if(index==3){

        if ( this.ajoutTrunkSipTeamsForm.controls["offreCanauxControl"].invalid) {
          return;
        }


      if(this.domainsOVHDto.length == 0){
        this.notifyService.warning("Vous devez cliquer sur le bouton 'Suivant' pour ajouter le domaine de ce Trunk.")
        return;
      }

     }
    if(index==4){

        if (this.ajoutTrunkSipTeamsForm.controls["offreCanauxControl"].invalid) {
          return;
        }


      if(this.domainsOVHDto.length == 0){
        this.notifyService.warning("Vous devez cliquer sur le bouton 'Suivant' pour ajouter le domaine de ce Trunk.")
        return;
      }
       let verifDom = this.domainsOVHDto.find(d=>d.domain == this.subDomain);
       if(verifDom != undefined){
        if(!verifDom?.verified){
          this.notifyService.warning("Ce domaine n'est pas encore vérifié. Vous devez cliquer sur le bouton 'Suivant' pour le vérifier.")
             return
        }
       }
    }
    if (this.currentSelected != 0) {
      var currentmenuselected = document.getElementById('menu_' + this.currentSelected)
      if (currentmenuselected != null) {
        currentmenuselected.classList.remove('selected')
      }
    }

    this.currentSelected = index;
    var listClasses = target.classList as DOMTokenList
    listClasses.add('selected')
  }


  SelectedTabClick(tab) {
    if (tab.index == 0)
      this.goToTab0(true);


  }

  AddNewTeamsTrunkSip() {
    this.DeleteSDAs();
    this.maxValue = false;
    this.SetModeEdit();
    this.isTabAddTeamsDisabled = false;
    this.currentSelected = 1;
    this.submittedNew = true;
     if ( this.codeclient == undefined) {
      this.errorCodeClient = true;
      return;
    }

    this.selectedOffreCanaux = null;
    this.typeCommande = "Creation";
    this.IsEditMode = false;
    this.titre = "Créer Nouveau Teams SIP";
    this.currentTrunkSipTeamsNDI = new COMMANDEPF_TeteDeGroupement();
    let urllist = `${environment.TeamsApiUrl}/TrunkSipTeamsApi/GetListTrunkSipTeamsByCodeClient` + `?codeClient=`+this.codeclient ;

    this.dataService.get(urllist)
    .subscribe(
      data => {

        this.loading = false;
        this.trunkSipTeamsofCurrentClient = (data);

        if(this.trunkSipTeamsofCurrentClient.length == 0){
          this.DomainComplet =  this.codeclient + ".teams.extranet-it.fr"
          this.sousDomainAdded =  this.codeclient + ".teams"
        }
        else{
          this.DomainComplet =  this.codeclient + '-' + (this.trunkSipTeamsofCurrentClient.length + 1)+ ".teams.extranet-it.fr"
          this.sousDomainAdded =  this.codeclient + ".teams"
        }



      },
      errorResponse => {
        this.notifyService.error(errorResponse.message);
        this.loading = false;
      });
    this.currentTrunkSipTeamsSDA = new COMMANDEPF_SDA();
    this.subDomain = this.DomainComplet
    this.GetClientLignesNDISDA();
    this.goToTab1();
    this.isTabAddTeamsDisabled = false;

  }

  goToTab1() {

    this.selectedIndex = 1;
    this.CreateFormAjoutTrunk()
     this.getDomainsClient()

  }

  CreateFormAjoutTrunk() {
    if (this.codeclient != undefined || this.codeclient != null) {
        let urllist = `${environment.TeamsApiUrl}/TrunkSipTeamsApi/GetListTrunkSipTeamsByCodeClient` + `?codeClient=` + this.codeclient;
        this.dataService.get(urllist)
            .subscribe(
                data => {
                    this.loading = false;
                    this.trunkSipTeamsofCurrentClient = (data);
                    this.LoadOffreTrunkSip();
                    if (this.currentTrunkSipTeams.sipDomaine != undefined) {
                        this.DomainComplet = this.currentTrunkSipTeams.sipDomaine;
                    } else {
                        if (this.trunkSipTeamsofCurrentClient.length == 0) {
                            this.DomainComplet = this.codeclient + ".teams.extranet-it.fr";
                            this.sousDomainAdded = this.codeclient + ".teams";
                        } else {
                            this.DomainComplet = this.codeclient + '-' + (this.trunkSipTeamsofCurrentClient.length) + ".teams.extranet-it.fr";
                            this.sousDomainAdded = this.codeclient + ".teams";
                        }
                    }

                    this.createAjoutTrunkForm();
                },
                errorResponse => {
                    this.notifyService.error(errorResponse.message);
                    this.loading = false;
                });
    } else {
        this.DomainComplet = "default.teams.extranet-it.fr";
        this.createAjoutTrunkForm();
    }
}

createAjoutTrunkForm() {
  this.subDomain = this.DomainComplet;
  this.ajoutTrunkSipTeamsForm = this.formBuilder.group({
      ndiControl: new FormControl(''),
      sdaControl: new FormControl('', [RequireMatch]),
      offreCanauxControl: new FormControl('', [Validators.required]),
      sipDomaineControl: [''],
      subDomain: { value: this.DomainComplet, disabled: true },
      codeclient: { value: this.codeclient, disabled: true },
      subDomainVerif: { value: this.DomainComplet, disabled: true },
      target: new FormControl('', Validators.required),
      ndivalue: new FormControl('', Validators.required),
      sdavalue: new FormControl('', Validators.required),
  });
}


onNDISelectionChange(event: MatAutocompleteSelectedEvent): void {
  const selectedNDI = event.option.value;
  const selectedSDANumber = selectedNDI.number;
  this.ajoutTrunkSipTeamsForm.get('ndiControl').setValue(selectedSDANumber);
  this.ajoutTrunkSipTeamsForm.get('ndivalue').setValue(selectedSDANumber);
  this.currentTrunkSipTeamsNDI = selectedNDI;

}

onSDASelectionChange(event: MatAutocompleteSelectedEvent) {
  const selectedSDA = event.option.value;
  const selectedSDANumber = selectedSDA.tete_NUMBER;
  this.ajoutTrunkSipTeamsForm.get('sdaControl').setValue(selectedSDANumber);
  this.ajoutTrunkSipTeamsForm.get('sdavalue').setValue(selectedSDANumber);
  this.currentTrunkSipTeamsSDA = selectedSDA;
}

  CreateFormAjoutDomain() {

    this.DomainComplet =  this.codeclient + ".teams.extranet-it.fr"
    this.sousDomainAdded = this.codeclient + ".teams"
    this.DomainComplet =  ".teams.extranet-it.fr"
    this.sousDomainAdded =  + '-' + ".teams"
    this.subDomain = this.DomainComplet
    this.DomainForm = this.formBuilder.group({
      fieldType: new FormControl(''),
      subDomain: new FormControl({ value: this.DomainComplet, disabled: true }),
      target: new FormControl('185.164.213.68'),
      ttl: new FormControl('')
    });
  }

  getDomainsClient() {

    this.loading = true;
    let url = `${environment.TeamsApiUrl}/TrunkSipTeamsAPI/GetListDomains?codeClient=` + this.codeclient ;
    this.dataService.get(url)
      .subscribe(
        data => {
          this.domainsOVHDto = (data);
          if (this.domainsOVHDto.length == 0) {
            this.haveDomains = false
          }
          else {
            this.haveDomains = true;
            this.domainsOVHDto =  this.domainsOVHDto.filter(f=>f.domain == this.subDomain)
            this.selectDomain = this.domainsOVHDto.find(d => d.domain == this.subDomain)
            this.subDomain = this.domainsOVHDto.find(d => d.domain == this.currentTrunkSipTeams?.sipDomaine)?.domain != undefined ?this.domainsOVHDto.find(d => d.domain == this.currentTrunkSipTeams?.sipDomaine)?.domain : this.subDomain
            this.target = this.selectDomain?.targetMicrosoft

          }
          this.loading = false;
        },
        errorResponse => {
          this.loading = false;
          this.notifyService.error(errorResponse.message);
        });
  }

  public selectedSipDomaine: string = "";
  public selectDomain: DomainOVHDto = new DomainOVHDto();

  get f() { return this.ajoutTrunkSipTeamsForm.controls; }
  get fVerifDomain(){return this.VerifDomainForm.controls;}
  haveDomains = true;
  domainsOVHDto: DomainOVHDto[] = [];
  domaineClient : DomainOVHDto;
  @Input() set NDIs(value: COMMANDEPF_TeteDeGroupement[]) {

    this._ndis = value;
    this.LoadNDIs();
  }
  get NDIs(): COMMANDEPF_TeteDeGroupement[] {
    return this._ndis;
  }
  NDIObligatoire: boolean = false;
  _currentTrunkSipTeams: TrunkSipTeamsDto = new TrunkSipTeamsDto();
  currentType: any;
  @Input() set currentTrunkSipTeams(value: TrunkSipTeamsDto) {
    this._currentTrunkSipTeams = value;
  }
  get currentTrunkSipTeams(): TrunkSipTeamsDto {
    return this._currentTrunkSipTeams;
  }



  LoadNDIs() {
    this.filteredNDIs = this.ajoutTrunkSipTeamsForm?.controls['ndiControl'].valueChanges
      .pipe(
        startWith<string | COMMANDEPF_TeteDeGroupement>(''),
        map(value => typeof value === 'string' ? value : value.number),
        map(numero => numero ? this._filterNDI(numero) : this.NDIs.slice())
      );

  }


  private _filterNDI(value: string): COMMANDEPF_TeteDeGroupement[] {
    const filterValue = value.toLowerCase();
    return this.NDIs.filter(ligne => ligne.number.toLowerCase().includes(filterValue));
  }

LoadSDAs() {
  this.filteredSDAs = this.ajoutTrunkSipTeamsForm?.controls['sdaControl'].valueChanges
    .pipe(
      startWith<string | COMMANDEPF_SDA>(''),
      map(value => typeof value === 'string' ? value : value.tete_NUMBER),
      map(numero => numero ? this._filterSDA(numero) : this.SDAs.slice())
    );
}


private _filterSDA(value: string): COMMANDEPF_SDA[] {
  const filterValue = value.toLowerCase();
  return this.SDAs.filter(sda => sda.tete_NUMBER.toLowerCase().includes(filterValue));
}


  GetClientLignesNDISDA() {
    this.loading = true;

    let url = `${environment.TeamsApiUrl}/TrunkSipTeamsAPI/GetListNDISDA?codeClient=1975` ;

    this.dataService.get(url)
      .subscribe(
        (data: any) => {
          if (data && data.lstNDI && data.lstSDA) {
            this.NDIs = data.lstNDI;
            this.SDAs = data.lstSDA;

          } else {
            console.error('La structure des données reçues ne correspond pas à celle attendue.');
          }

          this.loading = false;
        },
        errorResponse => {
          this.notifyService.error(errorResponse.message);
          this.loading = false;
        }
      );
  }

SaveDomain() {
  const regex = /^([^.]+)\.[^.]+/;
  const match = this.subDomain.match(regex);

  if (!match) {
      console.log("No match found");
      return;
  }

  const desiredSubstring = match[1];
  console.log(desiredSubstring);

  let domain = {
      fieldType: this.fieldType,
      subDomain: match[0],
      target: this.target,
      ttl: this.ttl,
      codeClient: this.codeclient
  }

  let url = `${environment.TeamsApiUrl}/TrunkSipTeamsAPI/CreateSousDomain`;

  this.dataService.post(url, domain)
      .subscribe(
          (data) => {
              if (data) {
                  this.DomainCreated = (data);
                  this.selectDomain = this.DomainCreated
                  this.notifyService.success("le sous domaine '" + this.subDomain  + "' a été enregitré avec succès")
                  this.successAddedDomain = true;
                  this.showVerifDomain = true;
                  this.labelDomain = "Vérifier Domaine"
                  this.loading = false;
                  this.getDomainsClient();
              }
          },
          (errorResponse) => {
              this.loading = false;
              this.notifyService.error(errorResponse.message);
              return
          });
}

  VerifierDomain() {
    this.submittedVerifDomain=true;
    const regex = /^([^.]+)\.[^.]+/;

    const match = this.subDomain.match(regex);

    if (match) {
      const desiredSubstring = match[1];
      console.log(desiredSubstring);
    } else {
      console.log("No match found");
    }
    let domain = {
      fieldType: this.fieldType,
      subDomain: match[0],
      targetMicrosoft: this.target,
      ttl: "3600",
      codeClient: this.codeclient
    }
    let url = `${environment.TeamsApiUrl}/TrunkSipTeamsAPI/VerifiedSousDomain`;
    this.dataService.post(url, domain)
      .subscribe(
        (data) => {
          if (data) {
            this.notifyService.success("Le domain " + this.subDomain + " a été vérifié avec succès")
            this.haveDomains = true;
            this.domainIsVerified = true
            this.loading = false;
          this.getDomainsClient();
          }
        },
        (errorResponse) => {
          this.loading = false;
          this.notifyService.error(errorResponse.message);
          return;
        });
  }

  public sDAHistories = new Array<COMMANDEPF_SDA>();
  @ViewChild(MatSort, { static: true }) sortSDA: MatSort;
  displayedColumnsSDA: string[] = ['numero',  'actionDeleteSDA'];
  dataSourceSDA;


  ajoutSDA() {
    // debugger
    if (!this.currentTrunkSipTeamsSDA || !this.currentTrunkSipTeamsSDA.tete_NUMBER) {
      return;
    }

    if (this.currentTrunkSipTeamsSDA.tete_NUMBER.includes("-")) {
      const [iFirstSDA, iLastSDA] = this.currentTrunkSipTeamsSDA.tete_NUMBER.split("-").map(Number);

      for (let i = iFirstSDA; i <= iLastSDA; i++) {
        const newSDA = new COMMANDEPF_SDA();
        newSDA.tete_NUMBER = "0" + i.toString();

        if (!this.sDAHistories) {
          this.sDAHistories = [];
        }

        newSDA.index = this.sDAHistories.length + 1;
        this.sDAHistories.push(newSDA);
      }
    } else {
      const newSDA = new COMMANDEPF_SDA();
      newSDA.tete_NUMBER = this.currentTrunkSipTeamsSDA.tete_NUMBER;
      newSDA.id = this.currentTrunkSipTeamsSDA.id;

      if (!this.sDAHistories) {
        this.sDAHistories = [];
      }

      newSDA.index = this.sDAHistories.length + 1;
      this.sDAHistories.push(newSDA);
    }

    this.dataSourceSDA = new MatTableDataSource(this.sDAHistories);
    this.dataSourceSDA.sort = this.sortSDA;
    const findIndex = this.SDAs.findIndex(sda => sda.tete_NUMBER === this.currentTrunkSipTeamsSDA.tete_NUMBER);
    if (findIndex !== -1) {
      this.SDAs.splice(findIndex, 1);
    }
    this.currentTrunkSipTeamsSDA = new COMMANDEPF_SDA();
}

  displaySipDomain(domain?: DomainOVHDto): string | undefined {
    return domain ? domain.domain : undefined;
  }

  DeleteSDA(ligneSDA) {

    let findindex = this.sDAHistories.findIndex(sda => sda.index == ligneSDA.index);
    this.sDAHistories.splice(findindex, 1);
    this.dataSourceSDA = new MatTableDataSource(this.sDAHistories);
    this.dataSourceSDA.sortPackSms = this.sortSDA;
    let newSDA = new COMMANDEPF_SDA();
    newSDA.tete_NUMBER = ligneSDA.numero;
    newSDA.ligneId = ligneSDA.id;
    this.SDAs.push(newSDA);
    this.LoadSDAs();
  }


  DeleteSDAs() {

    this.sDAHistories = [];
    this.dataSourceSDA = new MatTableDataSource<COMMANDEPF_SDA>(this.sDAHistories);
    this.dataSourceSDA.sort = this.sortSDA;
    this.LoadSDAs();
}


  saveTrunkSipTeams() {

    this.submitted = true;
    if (this.ajoutTrunkSipTeamsForm.invalid) {
      return;
    }

    const selectedNDI = this.ajoutTrunkSipTeamsForm.get('ndivalue').value;

    if (!selectedNDI) {
      this.NDIObligatoire = true;
      return;
    } else {
      this.NDIObligatoire = false;
    }

    this.currentTrunkSipTeams.codeClient = this.codeclient;
    this.currentTrunkSipTeams.numero = selectedNDI;
    this.currentTrunkSipTeams.listLigneNDISDA = new ListLigneNDISDA();
    this.currentTrunkSipTeams.listLigneNDISDA.lstNDI = [];
    this.currentTrunkSipTeams.listLigneNDISDA.lstNDI.push({ prefixe:selectedNDI, number: selectedNDI});
    this.currentTrunkSipTeams.listLigneNDISDA.lstSDA = this.sDAHistories;
    this.currentTrunkSipTeams.sipDomaine = this.selectDomain.domain;
    const selectedOffre = this.ajoutTrunkSipTeamsForm.get('offreCanauxControl').value;
    this.currentTrunkSipTeams.codeOffreCanaux = selectedOffre.codeOffre;
    this.currentTrunkSipTeams.typeOffre = selectedOffre.typeOffre;
    this.currentTrunkSipTeams.OffreTrunkSipCanaux = selectedOffre;
    this.currentTrunkSipTeams.typeCommande=this.typeCommande;
    this.loading = true;

    let url = `${environment.TeamsApiUrl}/TrunkSipTeamsAPI/SaveTrunkSipTeams`;
    this.dataService.post(url, this.currentTrunkSipTeams)
      .subscribe(
        (data: any) => {
          this.loading = false;
          console.log(data, 'Trunk Sip teams a été enregistré avec succès');
          this.notifyService.success("Trunk Sip teams a été enregistré avec succès");
          this.DeleteSDAs();
          this.goToTab0(true);
        },
        (errorResponse: any) => {
          this.loading = false;
          console.error(errorResponse.message);
          this.notifyService.error(errorResponse.message);
          this.goToTab0(true);
        });
  }





  SetModeEdit() {

    this.f['ndiControl'].enable();
    this.f['sdaControl'].enable();
    this.f['sipDomaineControl'].enable();
    this.f['offreCanauxControl'].enable();

  }

  ViewTrunkSipTeams(element: TrunkSipTeamsDto) {
    this.currentTrunkSipTeams = element;
    this.NDIObligatoire = false;
    this.loading = true;
    this.maxValue = false;
    this.SetModeEdit();
    this.GetTrunkSipTeamsById(element.id);
    this.goToTab1();
  }
  IsEditMode = false;
  public isEdit: boolean = false;
  titre: string = "";
  showVerifDomain = false;
  domainIsVerified = true




  displayNDI(ndi?: COMMANDEPF_TeteDeGroupement): string | undefined {
    return ndi ? ndi.number : undefined;
  }

  displaySDA(sda?: COMMANDEPF_SDA): string | undefined {
    return sda ? sda.tete_NUMBER : undefined;
  }

GetTrunkSipTeamsById(id) {
  let url = `${environment.TeamsApiUrl}/TrunkSipTeamsApi/GetTrunkSipTeamsById?profilId=` + id;
  console.log( id )
  this.dataService.get(url)
    .subscribe(
      data => {
        if (data && data.id) {
          this.isTabAddTeamsDisabled = false;
          this.IsEditMode = true;
          this.currentTrunkSipTeams = data;
          this.LoadOffreTrunkSip();
          this.getDomainsClient();
          this.GetClientLignesNDISDA();
          this.subDomain = this.currentTrunkSipTeams.sipDomaine;
          this.selectedSipDomaine = this.currentTrunkSipTeams.sipDomaine;

          if (data.listLigneNDISDA && data.listLigneNDISDA.lstNDI && data.listLigneNDISDA.lstNDI.length > 0) {
            const firstNDI = data.listLigneNDISDA.lstNDI[0];
            this.currentTrunkSipTeamsNDI = {
              id: firstNDI.id,
              prefixe: firstNDI.prefixe,
              number: firstNDI.number,
            };

          }
          if (this.currentTrunkSipTeamsNDI) {
            this.ajoutTrunkSipTeamsForm.get('ndiControl').setValue(this.currentTrunkSipTeamsNDI.number);
            this.ajoutTrunkSipTeamsForm.get('ndivalue').setValue(this.currentTrunkSipTeamsNDI.number);

          }

          if (data.listLigneNDISDA && data.listLigneNDISDA.lstSDA && data.listLigneNDISDA.lstSDA.length > 0) {
            this.sDAHistories = data.listLigneNDISDA.lstSDA;

            if (this.sDAHistories.length > 1) {
              const firstSDA = this.sDAHistories[0];
              const lastSDA = this.sDAHistories[this.sDAHistories.length - 1];
              this.ajoutTrunkSipTeamsForm.get('sdavalue').setValue(`${firstSDA.tete_NUMBER}-${lastSDA.tete_NUMBER}`);
              this.ajoutTrunkSipTeamsForm.get('sdaControl').setValue(`${firstSDA.tete_NUMBER}-${lastSDA.tete_NUMBER}`);
            } else {
              this.ajoutTrunkSipTeamsForm.get('sdavalue').setValue(data.listLigneNDISDA.lstSDA[0].tete_NUMBER);
              this.ajoutTrunkSipTeamsForm.get('sdaControl').setValue(data.listLigneNDISDA.lstSDA[0].tete_NUMBER);
            }

            this.sDAHistories.forEach((currentValue, index) => {
              currentValue.index = index;
            });

            this.dataSourceSDA = new MatTableDataSource(this.sDAHistories);
            this.dataSourceSDA.sort = this.sortSDA;
          } else {
            this.sDAHistories = [];
          }




          this.isEdit = true;
          this.titre = "Editer Trunk SIP Teams";
          this.typeCommande = "Modification";
          this.SendCrmCommandeTrunkSip = false;
          this.loading = false;
        } else {
          this.notifyService.error("Données de profil Trunk SIP Teams invalides ou incomplètes");
          this.loading = false;
        }
      },
      errorResponse => {
        this.notifyService.error(errorResponse.message);
        this.loading = false;
      }
    );
}


  DeleteTrunkSipTeamsClick(id,codeClient) {
    this.confirmationDialogService.confirm('Confirmation', 'Êtes-vous sûr de bien vouloir résillier ce trunk sip? Vous allez libérer toutes les lignes fixe commandées par ce client ' + codeClient, "Valider", "Annuler", "md")
      .then((confirmed) => {
        if (confirmed) {

          this.currentTrunkSipTeams = this.trunkSipTeamssDTOListTemp.find(x => x.id == id);

          this.DeleteTrunkSipTeam(id);
        }
      });
  }


  DeleteTrunkSipTeam(id) {

    this.loading = true;
    let url = `${environment.TeamsApiUrl}/TrunkSipTeamsApi/DeleteTrunkSipTeamsById?id=` + id ;
    this.dataService.get(url)
      .subscribe(
        data => {
          this.loading = false;
          this.goToTab0(true);
          this.notifyService.success("Trunk Sip teams a été supprimée avec succès");
        },
        errorResponse => {
          this.loading = false;
          this.notifyService.error(errorResponse.message);
        }, () => {

          this.currentTrunkSipTeams = this.trunkSipTeamssDTOListTemp.find(x => x.id == id);

        });
  }


  verifDomainSelected(element) {

    if (!element.value.verified) {
      this.domainIsVerified = false
    }
    else {
      this.domainIsVerified = true;
    }
  }

  goToTab2() {

    this.selectedIndex = 2;
  }

  clickForVerifDoamin() {
    this.showVerifDomain = !this.showVerifDomain
    this.haveDomains = false
    this.labelDomain = "Vérifier Domaine"
    this.goToTab2()
  }


  LoadOffreTrunkSip() {
   this.GetListOffresCanaux();

  }

  GetListOffresCanaux() {

    this.loading = true;

    let url = `${environment.TeamsApiUrl}/TrunkSipTeamsAPI/GetOffreTrunkSipTeamsCanauxList`  ;
    this.dataService.get(url)
      .subscribe(
        data => {
          this.loading = false;

          this.OffresCanaux = (data);
          if (this.currentTrunkSipTeams.codeOffreCanaux != undefined && this.currentTrunkSipTeams.codeOffreCanaux != "")
            this.selectedOffreCanaux = this.OffresCanaux.find(offre => offre.codeOffre == this.currentTrunkSipTeams.codeOffreCanaux);


        },
        errorResponse => {
          this.notifyService.error(errorResponse.message);
          this.loading = false;
        });
  }




  GetListTrunkSipTeamsByCodeClient(codeClient){
    let url = `${environment.TeamsApiUrl}/TrunkSipTeamsApi/GetListTrunkSipTeamsByCodeClient` + `?codeClient=` + codeClient;

    this.dataService.get(url)
    .subscribe(
      data => {

        this.loading = false;
        this.TrunkSipTeamsDTOList = (data);
        this.dataSourceTrunkSipTeams = new MatTableDataSource(this.TrunkSipTeamsDTOList);
        this.dataSourceTrunkSipTeams.sort = this.sort;
        this.loading = false;
        this.loadingListTrunkSip = true;

      },
      errorResponse => {
        this.notifyService.error(errorResponse.message);
        this.loading = false;
      });
  }



  LoadOffresCanaux() {

    this.filteredOffresCanaux = this.ajoutTrunkSipTeamsForm.controls['offreCanauxControl'].valueChanges
      .pipe(
        startWith<string | OffreTrunkSipCanauxDto>(''),
        map(value => typeof value === 'string' ? value : value.libelle),
        map(libelle => libelle ? this._filterOffreCanaux(libelle) : this.OffresCanaux.slice())
      );
  }

  private _filterOffreCanaux(value: string): OffreTrunkSipCanauxDto[] {
    const filterValue = value.toLowerCase();
    return this.OffresCanaux.filter(offre => offre.libelle.toLowerCase().includes(filterValue));
  }

  displayOffreCanauxFn(offre?: OffreTrunkSipCanauxDto): string | undefined {
    return offre ? offre.libelle : undefined;
  }

  suivantEtapeSelect(index){
    if(index == 2){

        if ( this.ajoutTrunkSipTeamsForm.controls["offreCanauxControl"].invalid) {
          return;
        }
    }
    if(index==3){

      let domExist = this.domainsOVHDto.find(d=>d.domain == this.subDomain);

      if(domExist == undefined)
      {
        console.log(' undefined ')

        this.SaveDomain();
      }
      let verifDom = this.domainsOVHDto.find(d=>d.domain == this.subDomain);

      this.target = verifDom?.targetMicrosoft;
      this.ajoutTrunkSipTeamsForm.controls["target"].setValue(this.target);

    }
    if(index==4){
      // debugger

      this.submittedVerifDomain = true;
      if (this.ajoutTrunkSipTeamsForm.controls["target"].invalid) {
        return;
      }

      let verifDom = this.domainsOVHDto.find(d=>d.domain == this.subDomain);

      if(!verifDom.verified){
        this.target = this.ajoutTrunkSipTeamsForm.controls["target"].value;
        this.VerifierDomain()
      }
    }
    if (this.currentSelected != 0) {
      var currentmenuselected = document.getElementById('menu_' + this.currentSelected)
      if (currentmenuselected != null) {
        currentmenuselected.classList.remove('selected')
      }
    }

    this.currentSelected = index;
    const menu1Element = this.el.nativeElement.querySelector('#menu_'+index);
    this.renderer.addClass(menu1Element, 'selected');
  }
}
export function RequireMatch(control: AbstractControl) {
  const selection: any = control.value;
  if (typeof selection === 'string') {
    return { incorrect: true };
  }
  return null;
}


