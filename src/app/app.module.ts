import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GestionClientComponent } from './gestion-client/gestion-client.component';
import { ClientComponent } from './client/client.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommandesComponent } from './commandes/commandes.component';
import { AddPstnNumberComponent } from './sites/add-pstn-number/add-pstn-number.component';
import { SitesComponent } from './sites/sites.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AddSiteComponent } from './sites/add-site/add-site.component';
import { AddUserComponent } from './commandes/add-user/add-user.component';
import { ModalModule } from 'ngb-modal';
import { EditUserComponent } from './commandes/edit-user/edit-user.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoaderComponent } from './loader/loader.component';
import { ListCallsParkComponent } from './sites/list-calls-park/list-calls-park.component';
import { AddCallParkComponent } from './sites/add-call-park/add-call-park.component';
import { EditCallParkComponent } from './sites/edit-call-park/edit-call-park.component';
import { ListCallsPickupComponent } from './sites/list-calls-pickup/list-calls-pickup.component';
import { AddCallPickupComponent } from './sites/add-call-pickup/add-call-pickup.component';
import { EditVoicePortalComponent } from './sites/edit-voice-portal/edit-voice-portal.component';
import { FilterPipePipe } from './filter-pipe.pipe';
import { UpdateNumberPhoneToMainNumberComponent } from './sites/update-number-phone-to-main-number/update-number-phone-to-main-number.component';
import { ConfigureCallForwardingForPeopleComponent } from './commandes/configure-call-forwarding-for-people/configure-call-forwarding-for-people.component';
import { ListCallQueueComponent } from './sites/list-call-queue/list-call-queue.component';
import { AddCallQueueComponent } from './sites/add-call-queue/add-call-queue.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EditCallQueueComponent } from './sites/edit-call-queue/edit-call-queue.component';
import { ListHuntGroupsComponent } from './sites/list-hunt-groups/list-hunt-groups.component';
import { AddHuntGroupComponent } from './sites/add-hunt-group/add-hunt-group.component';
import { EditHuntGroupComponent } from './sites/edit-hunt-group/edit-hunt-group.component';
import { ListAutoAttendantsComponent } from './sites/list-auto-attendants/list-auto-attendants.component';
import { AddAutoAttendantComponent } from './sites/add-auto-attendant/add-auto-attendant.component';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import {MatCheckboxModule} from '@angular/material/checkbox'
import {MatTabsModule} from '@angular/material/tabs'
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { EditAutoAttendantComponent } from './sites/edit-auto-attendant/edit-auto-attendant.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatListModule } from '@angular/material/list';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { TrunkSipTeamsComponent } from './trunk-sip-teams/trunk-sip-teams.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { ConfirmationDialogService } from './services/ConfirmeMsg/confirmation-dialog.service';
import { MatIconModule } from '@angular/material/icon';
@NgModule({
  declarations: [
    AppComponent,
    GestionClientComponent,
    ClientComponent,
    CommandesComponent,
    AddPstnNumberComponent,
    SitesComponent,
    AddSiteComponent,
    AddUserComponent,
    EditUserComponent,
    LoaderComponent,
    ListCallsParkComponent,
    AddCallParkComponent,
    EditCallParkComponent,
    ListCallsPickupComponent,
    AddCallPickupComponent,
    EditVoicePortalComponent,
    FilterPipePipe,
    UpdateNumberPhoneToMainNumberComponent,
    ConfigureCallForwardingForPeopleComponent,
    ListCallQueueComponent,
    AddCallQueueComponent,
    EditCallQueueComponent,
    ListHuntGroupsComponent,
    AddHuntGroupComponent,
    EditHuntGroupComponent,
    ListAutoAttendantsComponent,
    AddAutoAttendantComponent,
    EditAutoAttendantComponent,
    TrunkSipTeamsComponent,

  ],
  imports: [


    MatIconModule,
    MatTableModule,
    MatMenuModule,
    MatInputModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    NgMultiSelectDropDownModule.forRoot(),
    ModalModule,
    NgbModule,
    NgxSpinnerModule,
    ToastrModule.forRoot(),
    TimepickerModule.forRoot(),
    MatFormFieldModule,
    MatInputModule,
    NgxMatTimepickerModule.setLocale('en-GB'),
    MatCheckboxModule,
    MatTabsModule,
    MatDatepickerModule,
    MatButtonModule,
    MatNativeDateModule,
    ScrollingModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,



  ],
  providers: [DatePipe,ConfirmationDialogService],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class AppModule { }
