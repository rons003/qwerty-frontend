import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, Event } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../authentication/auth.service';

import { User } from '../user.model';

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';

declare var $: any;

/**
 * This class represents the navigation bar component.
 */
@Component({
  moduleId: module.id,
  selector: 'cg-navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.css'],
})
export class NavbarComponent implements OnInit {

  public urlStr = '';
  public breadcrumbs$ = this.router.events
    .filter(event => event instanceof NavigationEnd)
    .distinctUntilChanged()
    .map(event => { if (event instanceof NavigationEnd) {
      this.buildBreadCrumb(event.urlAfterRedirects ? event.urlAfterRedirects : event.url);
    }});

  private user: User;
  private isOpen = true;

  constructor(
    private router: Router,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute) { }

  buildBreadCrumb(url: string = '',
    breadcrumbs: string = ''): string {
    this.urlStr = url;
    return url;
  }

  ngOnInit() {
    this.breadcrumbs$.subscribe();
  }

  closeModal() {
    this.isOpen = false;
    $('#fullHeightLeft').css('width', '59px');
    $('#fullHeightLeft').css('transition', '.5s');
    $('.spanText').css('display', 'none');
    $('.aricon').css('padding-bottom', '25px');
  }

  showMe() {
    //const url: Observable<string> = this.route.url.map(segments => segments.join(''));

     //console.log(' flag ' + this.urlStr);
  }

  showModal() {
    $('#passwordModal').modal('show');
  }

  hideModal() {
    $('#passwordModal').modal('hide');
  }

  openNav() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      $('#fullHeightLeft').css('display', 'block');
      $('.aricon').css('padding-bottom', '1px');
      $('#fullHeightLeft').css('width', '251px');
      $('.spanText').css('display', 'block');
      $('#fullHeightLeft').css('transition', '.3s');
    } else {
      $('.spanText').css('display', 'none');
      $('.aricon').css('padding-bottom', '25px');
      $('#fullHeightLeft').css('width', '59px');
      $('#fullHeightLeft').css('display', 'block');
    }
    /*$('div#fullHeightLeft').toggleClass('sidenavWidth');
    $('.menu > span').toggle();
    $('#fullHeightLeft').css('min-height', '100vh');
    $('.spanText').css('display', 'block');
    $('.aricon').css('padding-bottom', '1px');
    $('#fullHeightLeft').css('transition', '.3s');*/
  }

  getUserPhotoUrl(): string {
    if (!this.user) {
      return '';
    }

    return this.user.photoIcon;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  select(user: User) {
    this.user = user;
    this.showModal();
  }
}
