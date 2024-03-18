import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GestionClientComponent } from './gestion-client/gestion-client.component';
import { TrunkSipTeamsComponent } from './trunk-sip-teams/trunk-sip-teams.component';

const routes: Routes = [
  {path: 'GestionClient', component: GestionClientComponent },
  {path: 'TrunkSipTeams', component: TrunkSipTeamsComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
