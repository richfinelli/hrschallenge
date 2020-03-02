import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
    public apiUrl: string = 'http://localhost:4000';

    constructor(
        private http: HttpClient
    ) {}

    getAll() {
        return this.http.get<User[]>(`${this.apiUrl}/users`);
    }

    register(user: User) {
        return this.http.post(`${this.apiUrl}/users/register`, user);
    }

    delete(id: number) {
        return this.http.delete(`${this.apiUrl}/users/${id}`);
    }
    //FINELLI: added the edit service
    //Used http.post since this is an update 
    edit(id: number, user: User) {
        //only getting firstName and lastName, no ID
        return this.http.post(`${this.apiUrl}/users/${id}`, user);
    }
}
