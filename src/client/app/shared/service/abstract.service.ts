import { HttpHeaders } from '@angular/common/http';

export class AbstractService {
    protected usersUrl = '';
    protected headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    protected options = { headers: this.headers };
}

