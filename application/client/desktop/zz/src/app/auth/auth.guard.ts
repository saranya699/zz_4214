 import { Injectable, Output, EventEmitter, Input, ElementRef } from '@angular/core';
import {
  CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, GuardsCheckStart, GuardsCheckEnd
} from '@angular/router';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BroadcastService } from './broadcast.service';
import { filter } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  @Output() getPermission = new EventEmitter();
  public jwtToken: any;
  public accessRoutes: any;
  public userRole: any;
  public viewPermission: any;
  public routeName: any;
  public checkAdmin: any;
  public landingPageObject: any;
  public projectScreen: any;
  public samplescreen: any;
  public adminscreen: any;
  public userscreen: any;
  public userId: any;
  public permissions: any[] = [];
  public user_scr_permissions: any[] = [];
  public admin_scr_permissions: any[] = [];
  public adminpermission: any = [];
  public userpermission: any = [];
  public devpermission: any = [];
  public guestpermission: any = [];
  public routearray: any[] = [];

  constructor(
    private route: Router,
    public broadcastService: BroadcastService
  ) {
    this.broadcastService.currentUserName.subscribe(authGuardValue => {
      // @ts-ignore
      this.accessRoutes = authGuardValue.Access;
      console.log('access routes', this.accessRoutes);
    });
    this.route.events.pipe(filter((value: any) => value instanceof GuardsCheckStart)).subscribe((value: GuardsCheckStart) => {
      this.routeName = value.url.split('/');
    });
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean  {
     console.log('------loggedvalue----', state.url);
     
     return this.checkLoogedIn1(state.url);
  }
  catalogscreen:any;
  searchscreen:any;
  checkLoogedIn1(url: String ) {
    this.routeName = url.split('/');
    console.log('checkLoogedIn', url);
    
    console.log('this.routeName checkLoogedIn', this.routeName);
    this.userId = sessionStorage.getItem('Id');
    if (this.userId !== null) {
      console.log("inside if user id");
      this.jwtToken = sessionStorage.getItem('JwtToken');
      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(this.jwtToken);
      console.log('decodedToken', decodedToken);
      this.userRole = decodedToken.role;
      console.log('this.userRole', this.userRole);
      this.accessRoutes = JSON.parse(sessionStorage.getItem('Access') || '{}');
      console.log('this.accessRoutes', this.accessRoutes);
    
    
      this.accessRoutes[0].access.forEach((element:any) => {
        if (this.userRole === 'User' && element['user']) {
          const User = element['user'];
          const useraccess = User['value'];
          console.log("useraccess",useraccess);
          const catalog_screen = useraccess['catalog screen'];
          const search_screen = useraccess['search screen'];
          catalog_screen.forEach((access: { access: { value: any; }; components: any; }) => {
            this.catalogscreen={
               'Components': access.components
            };
          });
          search_screen.forEach((access: { access: { value: any; }; components: any; }) => {
            this.searchscreen={
               'Components': access.components
            };
          });
          for(let i = 0; i < User['screens'].length; i++) {
            this.user_scr_permissions.push(User['screens'][i].screenname);
            this.user_scr_permissions = this.user_scr_permissions.filter((item, index) => this.user_scr_permissions.indexOf(item) === index);
          }
           this.broadcastService.sendMessage({ 'catalog_screen': this.catalogscreen, 'search_screen': this.searchscreen,'screens': this.user_scr_permissions });
        }
        if (this.userRole === 'Admin' && element['admin']) {
          const Admin = element['admin'];
          const adminaccess = Admin['value'];
          console.log("useraccess",adminaccess);
          const catalog_screen = adminaccess['catalog screen'];
          const search_screen = adminaccess['search screen'];
          catalog_screen.forEach((access: { access: { value: any; }; components: any; }) => {
            this.catalogscreen={
              'Components': access.components
            };
          });
          search_screen.forEach((access: { access: { value: any; }; components: any; }) => {
            this.searchscreen={
              'Components': access.components
            };
          });
          for(let i = 0; i < Admin['screens'].length; i++) {
            this.admin_scr_permissions.push(Admin['screens'][i].screenname);
            this.admin_scr_permissions = this.admin_scr_permissions.filter((item, index) => this.admin_scr_permissions.indexOf(item) === index);
          }
          this.broadcastService.sendMessage({ 'catalog_screen': this.catalogscreen, 'search_screen': this.searchscreen,'screens': this.admin_scr_permissions });
        }
    
    
       
       });

      
      return true;
    }
    
    else{
      if(this.accessRoutes) {
        this.permissions = []
        this.accessRoutes.forEach((route: any) => {
          console.log("kk",route);
          
          })
        
        }
    }

    return false;
  
  }
  checkLoogedIn(url: String ) {
    this.routeName = url.split('/');
    console.log('checkLoogedIn', url);
    console.log('this.routeName checkLoogedIn', this.routeName);
    this.userId = sessionStorage.getItem('Id');
    if (this.userId !== null) {
      this.jwtToken = sessionStorage.getItem('JwtToken');
      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(this.jwtToken);
      console.log('decodedToken', decodedToken);
      this.userRole = decodedToken.role;
      console.log('this.userRole', this.userRole);
      this.accessRoutes = JSON.parse(sessionStorage.getItem('Access') || '{}');
      console.log('this.accessRoutes', this.accessRoutes);
      if (this.accessRoutes) {
        if (this.routeName && this.routeName[1].includes('?')) {
          this.routeName = this.routeName[1].split('?');
          this.routeName[1] = this.routeName[0];
        }
        this.accessRoutes.forEach((element: any) => {
          this.permissions = [];
          if (this.userRole) {
            console.log('this.userRole', this.userRole);
            console.log('element', element);
            if(element.role === this.userRole) {
              console.log('You are login with role', this.userRole);
              for(let i = 0; i < element.screens.length; i++) {
                this.permissions.push(element.screens[i].screenname);
                this.routearray.push(element.screens[i].screenname);
                this.routearray = this.routearray.filter((item, index) => this.routearray.indexOf(item) === index)
                this.permissions = this.permissions.filter((item, index) => this.permissions.indexOf(item) === index)
              }
              this.broadcastService.sendMessage({ role: this.permissions })
            }
          }
        });
        if (this.routeName[1] == 'home') {
          return true
        }
        return this.routearray.filter(routevalue => routevalue === this.routeName[1]).length > 0;
      }
    } else {
      if(this.accessRoutes) {
        this.permissions = []
        this.accessRoutes.forEach((route: any) => {
          if(route.role === 'Guest') {
            for(let i = 0; i < route.screens.length; i++) {
              this.permissions.push(route.screens[i].screenname);
              this.routearray.push(route.screens[i].screenname);
              this.routearray = this.routearray.filter((item, index) => this.routearray.indexOf(item) === index)
              this.permissions = this.permissions.filter((item, index) => this.permissions.indexOf(item) === index)
            }
            this.broadcastService.sendMessage({ role: this.permissions })
          }
        })
        console.log('this.routeName', this.routeName);
        return this.routearray.filter(routevalue => routevalue === this.routeName[1]).length > 0;
      }
      else {
        this.route.navigate(['/home']);
        return false;
      }
    }
    return false;
  }
}

