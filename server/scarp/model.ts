export class tachCareModel{
    
    constructor(userName:string) {
        this.userName = userName;    
    }

    userName:string;
    title:string;
    comments:string;
    date:string;
    url:string;
    advices:(string | null)[];
}