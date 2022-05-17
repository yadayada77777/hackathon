import { WebScraper } from "./web-scaraper";
import { userToMesseges } from "./db";

export class BuisinessLogic{

    public webScraper: WebScraper;

    init(url:string):Boolean{

        this.webScraper = new WebScraper(url); //     
        this.webScraper.scrapeAskPeople().then((scrapeAskContainer)=>{
            userToMesseges.addRecords(scrapeAskContainer);
           
        }); 

        return true;
    }
}

export const buisinessLogic:BuisinessLogic = new BuisinessLogic();