export class TrunkSipTeamsModel {
  id: bigint;
  codeClient: string;

}
// export class ClientDto {
//   id: bigint;
//   codeClient: string;
//   raisonSociale: string;
//   emailContact: string;
//   lstSDA: LigneDto[];
//   dataSourceSda: any;
// }
export class DomainOVHDto{
  idDomainOvh :number
   fieldType :string
   subDomain :string
   target :string
   ttl :string
   domain:string;
   verified : boolean;
   targetMicrosoft:string;
}

// export class ListLigneNDISDADto {
// lstNDI: Array<LigneDto>;
// lstSDA: Array<LigneDto>;
// }


export class ListLigneNDISDA {
  lstNDI: Array<COMMANDEPF_TeteDeGroupement>;
  lstSDA: Array<COMMANDEPF_SDA>;
  }



  export class COMMANDEPF_TeteDeGroupement {
    id?: number;
    prefixe: string;
    number: string;
    commandePortabiliteFIXEId?: number;
}

export class COMMANDEPF_SDA {
  id?: number;
  tete_NUMBER: string;
  number: string;
  firsT_NUMBER: string;
  lasT_NUMBER: string;
  commandePortabiliteFIXEId?: number;
  index: number;
  codeClient: string;
  ligneId: bigint;
}


export class TrunkSipTeamsDto {
id: bigint;
codeClient: string;
raisonSociale: string;
isActive: boolean;
listLigneNDISDA: ListLigneNDISDA;
typeCommande: string;
sipDomaine: string;
nombreSDA: number;
dateCreation: Date;
dateActivation: Date;
dateResiliation: Date;
isSaveHistorique: boolean;
nbrSDA:number;
status:string;
codeOffreCanaux:string
nombreCanaux: number;
typeOffre: string;
numero: string;
OffreTrunkSipCanaux: OffreTrunkSipCanauxDto;
}

export class OffreTrunkSipCanauxDto {
  id:string;
  libelle: string;
  codeOffre: string;
  prixMensuel: number;
  typeOffre: string;
  nombreCanaux: number;
}




