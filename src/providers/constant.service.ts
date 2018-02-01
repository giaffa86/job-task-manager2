import { Injectable } from '@angular/core';

/*
  Generated class for the ConstantService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ConstantService {
  public ELASTIC_SEARCH_BASE_URL: string;
  
  public ADMIN_ROLE: string;
  public OPERATOR_ROLE: string;
  public TECHNICIAN_ROLE: string;
  
  public DRAFT: number;
  public SENT: number;
  public ONGOING: number;
  public COMPLETED: number;

  constructor() {
    //ELASTIC SEARCH SERVER BASE URL
    this.ELASTIC_SEARCH_BASE_URL = 'http://localhost:9200';
    // USERS ROLES
    this.ADMIN_ROLE = 'admin';
    this.OPERATOR_ROLE = 'operator';
    this.TECHNICIAN_ROLE = 'technician';

    // TASK STATUS
    this.DRAFT = 1;
    this.SENT = 2;
    this.ONGOING = 3;
    this.COMPLETED = 4;

  }

}
