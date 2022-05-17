import { IDictionary } from "./IDictionary";
import { tachCareModel } from "./model";
import { scrapeAskContainer } from "./web-scaraper";


export class UserToMessages{

    private records:IDictionary<tachCareModel> = new IDictionary<tachCareModel>();
    
    addRecords(scrapeAskContainer:scrapeAskContainer[]){

        scrapeAskContainer.forEach((scraper:scrapeAskContainer) =>
            this.addRecord(scraper.title, scraper)
        )
           
    }

    addRecord(name:string, data:scrapeAskContainer){
        let model = new tachCareModel(name);
       
        model.title = data.title;
        model.comments = data.comments;
        model.date = data.date;
        model.url = data.url;
        model.advices = data.advices;

        this.records[name] = model;
    }

    getRecordsByUser(name:string){
        return this.records[name];
    }

    getScraperRecorsds(){
        Object.keys(this.records).forEach(key=> {
            //if(this.records[key].textComments;
        });
    }

    getAllRecords():tachCareModel[]{
        let container = new Array<tachCareModel>();

        Object.keys(this.records).forEach(key=> {
            container.push(this.records[key]);
        });

        return container;
    }
}

export const userToMesseges:UserToMessages = new UserToMessages();

