import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ActionResultObj } from '../Model/action-result-obj.model';
import { Client } from '../Model/client.model';
import { User } from '../Model/user.model';
import { CallPark } from '../Model/call-park.model';
import { CallPickup } from '../Model/call-pickup.model';
import { EntrepriseDto } from '../Model/entreprise-dto.model';
import { Location } from '../Model/location.model';
import { Site } from '../Model/site.model';
import { PstnNumbers } from '../Model/pstn-numbers.model';
import { VoicePortal } from '../Model/voice-portal.model';
import { CallingLineId } from '../Model/calling-line-id.@model';
import { UpdateMainNumber } from '../Model/update-main-number.@model';
import { CallForwardingDto } from '../Model/call-forwarding-dto.@model';
import { CallQueue } from '../Model/call-queue.model';
import { HuntGroup } from '../Model/hunt-group.model';
@Injectable({
  providedIn: 'root'
})
export class WebexService {
  codeClient : string
  constructor(private http: HttpClient) { 
  }
  private setHeaders(options: any, needId?: boolean){
    
    if(this.codeClient == "1975"){
      options["headers"] = new HttpHeaders()
      .append('X-Application', this.codeClient)
      
    }
  
}
getUrlParameter(codeClient: any) {
  this.codeClient = codeClient.toString();
};
  GetEntrepriseByCodeClient_ExternalId(codeClient : string) : Observable <ActionResultObj> 
  { 
    let options = { };  
    this.setHeaders(options);  
    return this.http.get<ActionResultObj>(`${environment.WebexApiUrl}GetEntrepriseByCodeClient_ExternalId?codeClient=${codeClient}`,options);

  }
  GetClientByCode(code_client : string): Observable <Client> 
  {       
    return this.http.get<Client>(`${environment.WebexApiUrl}GetClientByCode?codeClient=${code_client}`);
  }
  GetAllServices() : Observable <ActionResultObj> 
  {   
    return this.http.get<ActionResultObj>(`${environment.WebexApiUrl}GetAllServices`);
  }
  CreateEntreprise(entrepriseDto : EntrepriseDto)
  { 
    let options = { };  
    this.setHeaders(options);        
    return this.http.post<any>(`${environment.WebexApiUrl}CreateEntreprise`, entrepriseDto,options);
  }
  UpdateEntreprise(obj : EntrepriseDto,entID:string)
  {    
    let options = { };  
    this.setHeaders(options);     
    return this.http.put<any>(`${environment.WebexApiUrl}UpdateEntreprise?entID=${entID}`, obj,options);
  } 
  GetServicesEntreprise(entId : string) : Observable <ActionResultObj> 
  {  
    let options = { };  
    this.setHeaders(options);  
    return this.http.get<ActionResultObj>(`${environment.WebexApiUrl}GetServicesEntreprise?entId=${entId}`,options);
  }
  GetUsersEntreprise(entId : string) : Observable <ActionResultObj> 
  {   
    let options = { };  
    this.setHeaders(options); 
    return this.http.get<ActionResultObj>(`${environment.WebexApiUrl}GetUsersEntreprise?entId=${entId}`,options);
  }
  GetSitesEntreprise(entId : string) : Observable <ActionResultObj> 
  {   
    let options = { };  
    this.setHeaders(options); 
    return this.http.get<ActionResultObj>(`${environment.WebexApiUrl}GetSitesEntreprise?entId=${entId}`,options);
  }
  CreateUserWholeSale(objUser : User)
  {  
    let options = { };  
    this.setHeaders(options);  
    return this.http.post<any>(`${environment.WebexApiUrl}CreateUserWholeSale`, objUser,options);
  }
  DeleteUserByID(userID : string)
  {
    let options = { };  
    this.setHeaders(options);         
    return this.http.delete<any>(`${environment.WebexApiUrl}DeleteUserByID?userID=${userID}`,options);
  } 
  SaveHistoriquesCommande(obj : any)
  {
    return this.http.post<any>(`${environment.WebexApiUrl}SaveHistoriquesCommande`, obj);
  }

  
  CreateSite(objSite : Site,orgId:string,entId:string)
  {  
    let options = { };  
    this.setHeaders(options);       
    return this.http.post<any>(`${environment.WebexApiUrl}CreateSite?orgId=${orgId}&&entId=${entId}`, objSite,options);
  }
  UpdateSite(objSite : Site,orgId:string,id:string)
  {   
    let options = { };  
    this.setHeaders(options);     
    return this.http.put<any>(`${environment.WebexApiUrl}UpdateSite?orgId=${orgId}&&idSite=${id}`, objSite,options);
  }
  GetNumbersEntreprise(entId : string,orgId : string,start:string,max:string) : Observable <ActionResultObj> 
  {   
    let options = { };  
    this.setHeaders(options); 
    return this.http.get<ActionResultObj>(`${environment.WebexApiUrl}GetNumbersEntreprise?entId=${entId}&&orgId=${orgId}&&max=${max}&&start=${start}`,options);
  }
  DeleteNumbersEntreprise(phoneNumbers : PstnNumbers)
  {    
    let options = { };  
    this.setHeaders(options);     
    return this.http.post<any>(`${environment.WebexApiUrl}DeleteNumbersEntreprise`, phoneNumbers,options);
  }
  DeleteListNumbersEntreprise(phoneNumbers : PstnNumbers[])
  {
    let options = { };  
    this.setHeaders(options);         
    return this.http.post<any>(`${environment.WebexApiUrl}DeleteListNumbersEntreprise`, phoneNumbers,options);
  }
  CreateNumbersEntreprise(objNumber : PstnNumbers,entId:string,orgId : string,idLocation:string)
  {  
    let options = { };  
    this.setHeaders(options);    
    return this.http.post<any>(`${environment.WebexApiUrl}CreateNumbersEntreprise?entId=${entId}&&orgId=${orgId}&&idLocation=${idLocation}`, objNumber,options);
  }  
  ActivatePstnNumbers(objNumber : any,entId:string,idLocation:string)
  {
    let options = { };  
    this.setHeaders(options);         
    return this.http.put<any>(`${environment.WebexApiUrl}ActivatePstnNumbers?entId=${entId}&&idLocation=${idLocation}`, objNumber,options);
  }
  GetUsersEntreprise_withApiPeople(entId : string,orgId : string,nextUrl:string,length) : Observable <ActionResultObj> 
  { 
    let options = { }; 
    this.setHeaders(options); 
    return this.http.get<ActionResultObj>(`${environment.WebexApiUrl}GetUsersEntreprise_withApiPeople?entId=${entId}&&orgId=${orgId}&&nextUrl=${nextUrl}&&length=${length}`,options);
  }
  CreateUser_People(objUser : User,callingData:boolean,entId : string)
  {  
    let options = { };  
    this.setHeaders(options);       
    return this.http.post<any>(`${environment.WebexApiUrl}CreateUser_People?callingData=${callingData}&&entId=${entId}`, objUser,options);
  }
  GetOrgIdEntreprise(entId : string) : Observable <ActionResultObj> 
  {   
    let options = { };  
    this.setHeaders(options); 
    return this.http.get<ActionResultObj>(`${environment.WebexApiUrl}GetOrgIdEntreprise?entId=${entId}`,options);
  }
  DeleteUser(userID : string,userOperation : string)
  { let options = { };  
  this.setHeaders(options);       
    return this.http.delete<any>(`${environment.WebexApiUrl}DeleteUser?personId=${userID}&&userOperation=${userOperation}`,options);
  }
  DeleteListUser(personsId : string[],userOperation : string)
  {     
    let options = { };  
    this.setHeaders(options);   
    return this.http.post<any>(`${environment.WebexApiUrl}DeleteListUser?&userOperation=${userOperation}`,personsId,options);
  }
  GetNumbersEntrepriseLoction(entId : string,orgId : string,locationId : string) : Observable <ActionResultObj> 
  {   
    let options = { };  
    this.setHeaders(options); 
    return this.http.get<ActionResultObj>(`${environment.WebexApiUrl}GetNumbersEntrepriseLoction?entId=${entId}&orgId=${orgId}&locationId=${locationId}`,options);
  }
  DeleteEntreprise(entId : string,userOperation : string)
  {  
    let options = { };  
    this.setHeaders(options);     
    return this.http.delete<any>(`${environment.WebexApiUrl}DeleteEntreprise?entId=${entId}&&userOperation=${userOperation}`,options);
  }
  UpdateUser(user : User,callingData:boolean,entId : string,id : string)
  {
    let options = { };  
    this.setHeaders(options);  
    return this.http.put<any>(`${environment.WebexApiUrl}UpdateUser?callingData=${callingData}&&entId=${entId}&&id=${id}`, user,options);
  }
  GetNumbersByPhoneNumber(orgId : string,phoneNumber : string,entId : string) : Observable <ActionResultObj> 
  { 
    let options = { };  
    this.setHeaders(options);  
    return this.http.get<ActionResultObj>(`${environment.WebexApiUrl}GetNumbersByPhoneNumber?orgId=${orgId}&&phoneNumber=${phoneNumber}&&entId=${entId}`,options);
  }
  GetNumbersUsers(entId : string,orgId : string,ownerId : string) : Observable <ActionResultObj> 
  {  
    let options = { };  
    this.setHeaders(options); 
    return this.http.get<ActionResultObj>(`${environment.WebexApiUrl}GetNumbersUsers?entId=${entId}&&orgId=${orgId}&&ownerId=${ownerId}`,options);
  }
  GetEntrepriseById(entId : string) : Observable <ActionResultObj> 
  {   
    let options = { };  
    this.setHeaders(options); 
    return this.http.get<ActionResultObj>(`${environment.WebexApiUrl}GetEntrepriseById?entId=${entId}`,options);
  }
  GetCallParks(orgId : string,locationId: string)
  {
    let options = { };  
    this.setHeaders(options); 
    return this.http.get<ActionResultObj>(`${environment.WebexApiUrl}GetCallParks?orgId=${orgId}&&locationId=${locationId}`,options);
  }
  CreateCallPark(objCallPark : any,orgId:string,locationId:string)
  { 
    let options = { };  
    this.setHeaders(options);        
    return this.http.post<any>(`${environment.WebexApiUrl}CreateCallPark?orgId=${orgId}&&locationId=${locationId}`, objCallPark,options);
  }
  DeleteCallPark(locationId : string,idCallPark : string,orgId : string)
  {
    let options = { };  
    this.setHeaders(options);       
    return this.http.delete<any>(`${environment.WebexApiUrl}DeleteCallPark?locationId=${locationId}&&idCallPark=${idCallPark}&&orgId=${orgId}`,options);
  } 
  GetDetailsCallPark(locationId : string,idCallPark : string,orgId : string) : Observable <ActionResultObj> 
  {  
    let options = { };  
    this.setHeaders(options); 
    return this.http.get<ActionResultObj>(`${environment.WebexApiUrl}GetDetailsCallPark?locationId=${locationId}&&idCallPark=${idCallPark}&&orgId=${orgId}`,options);
  }
  UpdateCallPark(callPark : CallPark,orgId:string,locationId : string)
  {
    let options = { };  
    this.setHeaders(options);  
    return this.http.put<any>(`${environment.WebexApiUrl}UpdateCallPark?orgId=${orgId}&&locationId=${locationId}`, callPark,options);
  }
  GetCallPickups(orgId : string,locationId: string)
  {
    let options = { };  
    this.setHeaders(options); 
    return this.http.get<ActionResultObj>(`${environment.WebexApiUrl}GetCallPickups?orgId=${orgId}&&locationId=${locationId}`,options);
  }
  CreateCallPickup(objCallPickup : any,orgId:string,locationId:string)
  {
    let options = { };  
    this.setHeaders(options);         
    return this.http.post<any>(`${environment.WebexApiUrl}CreateCallPickup?orgId=${orgId}&&locationId=${locationId}`, objCallPickup,options);
  }
  DeleteCallPickup(locationId : string,idCallPark : string,orgId : string)
  {
    let options = { };  
    this.setHeaders(options);       
    return this.http.delete<any>(`${environment.WebexApiUrl}DeleteCallPickup?locationId=${locationId}&&idCallPickup=${idCallPark}&&orgId=${orgId}`,options);
  } 
  GetDetailsCallPickup(locationId : string,idCallPickup : string,orgId : string) : Observable <ActionResultObj> 
  {  
    let options = { };  
    this.setHeaders(options); 
    return this.http.get<ActionResultObj>(`${environment.WebexApiUrl}GetDetailsCallPickup?locationId=${locationId}&&idCallPickup=${idCallPickup}&&orgId=${orgId}`,options);
  }
  UpdateCallPickup(CallPickup : CallPickup,orgId:string,locationId : string)
  {
    let options = { };  
    this.setHeaders(options);  
    return this.http.put<any>(`${environment.WebexApiUrl}UpdateCallPickup?orgId=${orgId}&&locationId=${locationId}`, CallPickup,options);
  }
  ResetVoicemailPIN(personId : string,orgId:string)
  { 
    let options = { };  
    this.setHeaders(options);        
    return this.http.post<any>(`${environment.WebexApiUrl}ResetVoicemailPIN?personId=${personId}&&orgId=${orgId}`, "",options);
  }
  GetVoicePortal(locationId : string,orgId : string) : Observable <ActionResultObj> 
  {  
    let options = { };  
    this.setHeaders(options); 
    return this.http.get<ActionResultObj>(`${environment.WebexApiUrl}GetVoicePortal?locationId=${locationId}&&orgId=${orgId}`,options);
  }
  UpdateVoicePortal(voicePortal : VoicePortal,orgId:string,locationId : string)
  {
    let options = { };  
    this.setHeaders(options);  
    return this.http.put<any>(`${environment.WebexApiUrl}UpdateVoicePortal?orgId=${orgId}&&locationId=${locationId}`, voicePortal,options);
  }
  GetRoles() : Observable <ActionResultObj> 
  {  
    let options = { };  
    this.setHeaders(options); 
    return this.http.get<ActionResultObj>(`${environment.WebexApiUrl}GetRoles`,options);
  }
  UpdateNumberPhoneToMainNumber(updateMainNumber : UpdateMainNumber,orgId:string,locationId : string)
  {
    let options = { };  
    this.setHeaders(options);  
    return this.http.put<any>(`${environment.WebexApiUrl}UpdateNumberPhoneToMainNumber?orgId=${orgId}&&locationId=${locationId}`, updateMainNumber,options);
  }
  GetCallForwarding(personId : string,orgId : string) : Observable <ActionResultObj> 
  {  
    let options = { };  
    this.setHeaders(options); 
    return this.http.get<ActionResultObj>(`${environment.WebexApiUrl}GetCallForwarding?personId=${personId}&&orgId=${orgId}`,options);
  }
  ConfigureCallForwarding(callForwardingDto : CallForwardingDto,orgId:string,personId : string)
  {
    let options = { };  
    this.setHeaders(options);  
    return this.http.put<any>(`${environment.WebexApiUrl}ConfigureCallForwarding?orgId=${orgId}&&personId=${personId}`, callForwardingDto,options);
  }
  
  GetCallQueues(orgId : string,locationId: string)
  {
    let options = { };  
    this.setHeaders(options); 
    return this.http.get<ActionResultObj>(`${environment.WebexApiUrl}GetCallQueues?orgId=${orgId}&&locationId=${locationId}`,options);
  }
  CreateCallQueue(objCallQueue: any,orgId:string,locationId:string)
  { 
    let options = { };  
    this.setHeaders(options);        
    return this.http.post<any>(`${environment.WebexApiUrl}CreateCallQueue?orgId=${orgId}&&locationId=${locationId}`, objCallQueue,options);
  }
  GetDetailsCallQueue(locationId : string,idCallQueue : string,orgId : string)
  {   
    let options = { };  
    this.setHeaders(options);   
    return this.http.get<ActionResultObj>(`${environment.WebexApiUrl}GetDetailsCallQueue?locationId=${locationId}&&idCallQueue=${idCallQueue}&&orgId=${orgId}`,options);
  } 
  DeleteCallQueue(locationId : string,idCallQueue : string,orgId : string)
  {   
    let options = { };  
    this.setHeaders(options);    
    return this.http.delete<any>(`${environment.WebexApiUrl}DeleteCallQueue?locationId=${locationId}&&idCallQueue=${idCallQueue}&&orgId=${orgId}`,options);
  } 
  UpdateCallQueue(callQueue : CallQueue,orgId:string,locationId : string)
  {
    let options = { };  
    this.setHeaders(options);  
    return this.http.put<any>(`${environment.WebexApiUrl}UpdateCallQueue?orgId=${orgId}&&locationId=${locationId}`, callQueue,options);
  }
  GetHuntGroups(orgId : string,locationId: string)
  {
    let options = { };  
    this.setHeaders(options); 
    return this.http.get<ActionResultObj>(`${environment.WebexApiUrl}GetHuntGroups?orgId=${orgId}&&locationId=${locationId}`,options);
  }
  CreateHuntGroup(objHuntGroup: any,orgId:string,locationId:string)
  { 
    let options = { };  
    this.setHeaders(options);        
    return this.http.post<any>(`${environment.WebexApiUrl}CreateHuntGroup?orgId=${orgId}&&locationId=${locationId}`, objHuntGroup,options);
  }
  DeleteHuntGroup(locationId : string,idHuntGroup : string,orgId : string)
  { 
    let options = { };  
    this.setHeaders(options);      
    return this.http.delete<any>(`${environment.WebexApiUrl}DeleteHuntGroup?locationId=${locationId}&&idHuntGroup=${idHuntGroup}&&orgId=${orgId}`,options);
  }
  GetDetailsHuntGroup(locationId : string,idHuntGroup : string,orgId : string)
  {
    let options = { };  
    this.setHeaders(options);      
    return this.http.get<ActionResultObj>(`${environment.WebexApiUrl}GetDetailsHuntGroup?locationId=${locationId}&&idHuntGroup=${idHuntGroup}&&orgId=${orgId}`,options);
  } 
  UpdateHuntGroup(huntGroup : HuntGroup,orgId:string,locationId : string)
  {
    let options = { };  
    this.setHeaders(options);  
    return this.http.put<any>(`${environment.WebexApiUrl}UpdateHuntGroup?orgId=${orgId}&&locationId=${locationId}`, huntGroup,options);
  } 
  GetAutoAttendants(orgId : string,locationId: string)
  {
    let options = { };  
    this.setHeaders(options); 
    return this.http.get<ActionResultObj>(`${environment.WebexApiUrl}GetAutoAttendants?orgId=${orgId}&&locationId=${locationId}`,options);
  }
  GetSchedules(orgId : string,locationId: string)
  {
    let options = { };  
    this.setHeaders(options); 
    return this.http.get<ActionResultObj>(`${environment.WebexApiUrl}GetSchedules?orgId=${orgId}&&locationId=${locationId}`,options);
  }
  GetDetailsSchedule(locationId : string,orgId : string,type:string,scheduleId:string)
  {     
    let options = { };  
    this.setHeaders(options); 
    return this.http.get<ActionResultObj>(`${environment.WebexApiUrl}GetDetailsSchedule?locationId=${locationId}&&orgId=${orgId}&&type=${type}&&scheduleId=${scheduleId}`,options);
  } 
  CreateAutoattendantAndShcedule(objAutoattendantAndShcedule: any,orgId:string,locationId:string)
  {  
    let options = { };  
    this.setHeaders(options);       
    return this.http.post<any>(`${environment.WebexApiUrl}CreateAutoattendantAndShcedule?orgId=${orgId}&&locationId=${locationId}`, objAutoattendantAndShcedule,options);
  }
  DeleteAutoattendant(locationId : string,autoAttendantId : string,orgId : string)
  { 
    let options = { };  
    this.setHeaders(options);      
    return this.http.delete<any>(`${environment.WebexApiUrl}DeleteAutoattendant?locationId=${locationId}&&autoAttendantId=${autoAttendantId}&&orgId=${orgId}`,options);
  } 
  UpdateAutoattendantAndShcedule(objAutoattendantAndShcedule: any,orgId:string,locationId:string)
  { 
    let options = { };  
    this.setHeaders(options);        
    return this.http.post<any>(`${environment.WebexApiUrl}UpdateAutoattendantAndShcedule?orgId=${orgId}&&locationId=${locationId}`, objAutoattendantAndShcedule,options);
  }
  GetDetailsAutoAttendant(orgId : string,locationId: string,autoAttendantId:string)
  {
    let options = { };  
    this.setHeaders(options); 
    return this.http.get<ActionResultObj>(`${environment.WebexApiUrl}GetDetailsAutoAttendant?orgId=${orgId}&&locationId=${locationId}&&autoAttendantId=${autoAttendantId}`,options);
  }
  GetListOfCallQueueAnnouncementFiles(orgId : string,locationId: string,idCallQueue:string)
  {
    let options = { };  
    this.setHeaders(options); 
    return this.http.get<ActionResultObj>(`${environment.WebexApiUrl}GetListOfCallQueueAnnouncementFiles?orgId=${orgId}&&locationId=${locationId}&&idCallQueue=${idCallQueue}`,options);
  }
}
