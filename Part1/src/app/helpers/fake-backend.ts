import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

// array in local storage for registered users
let users = JSON.parse(localStorage.getItem('users')) || [];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;
        // wrap in delayed observable to simulate server api call
        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .pipe(delay(500))
            .pipe(dematerialize());

        function handleRoute() {
            switch (true) {
                case url.endsWith('/users/authenticate') && method === 'POST':
                    return authenticate();
                case url.endsWith('/users/register') && method === 'POST':
                    return register();
                case url.endsWith('/users') && method === 'GET':
                    return getUsers();
                case url.match(/\/users\/\d+$/) && method === 'DELETE':
                    return deleteUser();
                //FINELLI: added the editUserName function to the switch statement 
                //to call the new route function: editUserName()
                case url.match(/\/users\/\d+$/) && method === 'POST':
                    return editUserName();
                default:
                    // pass through any requests not handled above
                    return next.handle(request);
            }    
        }

        // route functions

        function authenticate() {
            const { username, password } = body;
            const user = users.find(x => x.username === username && x.password === password);
            if (!user) return error('Username or password is incorrect');
            return ok({
                id: user.id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                token: 'fake-jwt-token'
            })
        }

        function register() {
            const user = body
            
            //Prevents: if the username being registered is the same as the new username being created
            if (users.find(x => x.username === user.username)) {
                return error('Username "' + user.username + '" is already taken')
            }
            //new user.id is 1 more than total number of users
            user.id = users.length ? Math.max(...users.map(x => x.id)) + 1 : 1;
            //add new user to the users array
            users.push(user);
            //update localStorage
            localStorage.setItem('users', JSON.stringify(users));

            return ok();
        }

        function getUsers() {
            if (!isLoggedIn()) return unauthorized();
            return ok(users);
        }

        function deleteUser() {
            if (!isLoggedIn()) return unauthorized();

            users = users.filter(x => x.id !== idFromUrl());
            localStorage.setItem('users', JSON.stringify(users));
            return ok();
        }

        //FINELLI: 
        //this function updates localStorage with the new first and/or last name
        function editUserName() {
            if (!isLoggedIn()) return unauthorized();
            const user = body; //user from the POST 
            //'users' is an object of all users in localStorage
            //get the user from localStorage that matches the user from the POST
            let thisUser = users.find(x => x.id === idFromUrl());
            //update the users object with the new first and last name
            thisUser.firstName = user.firstName;
            thisUser.lastName = user.lastName;
            thisUser.edit = false; //hides the edit name inputs now that the update is completed
            //update localStorage with the new users object
            localStorage.setItem('users', JSON.stringify(users));
            return ok();
        }

        // helper functions
        function ok(body?) {
            return of(new HttpResponse({ status: 200, body }))
        }

        function error(message) {
            return throwError({ error: { message } });
        }

        function unauthorized() {
            return throwError({ status: 401, error: { message: 'Unauthorised' } });
        }

        function isLoggedIn() {
            return headers.get('Authorization') === 'Bearer fake-jwt-token';
        }

        function idFromUrl() {
            const urlParts = url.split('/');
            return parseInt(urlParts[urlParts.length - 1]);
        }
    }
}

export const fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};