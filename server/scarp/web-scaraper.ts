import * as puppeteer from 'puppeteer';
export class scrapeAskContainer {

    constructor(public title: string,
        public comments: string,
        public date: string,
        public url: string,
        public user: string,
        public questionContent: string,        
        public advices: (string | null)[]) {
    }
}

export class WebScraper {
    constructor(private url: string) {
        console.log('I AM Scarapping ;-)');
    }

    async scrapeAskPeople(): Promise<scrapeAskContainer[]> {

        let scrapeAskContainers: scrapeAskContainer[] = [];
        const browser = await puppeteer.launch({});
        const page = await browser.newPage();
        //  await page.setDefaultNavigationTimeout(0);
        await page.goto(this.url);

        /* await page.evaluate(() => {
             let reloadNewQuestions: any = document.querySelector('#new_q > div > div > div > div > span');
             let onclick = reloadNewQuestions.onclick;
             console.log(onclick, 'onclick--------');
         });*/
        console.log('before onclick--------');
        await page.click('#new_q > div > div > div > div > span');
        console.log('after onclick--------');

        for (let index = 1; index < 10; index++) {
            try {
                console.log(`index ${index}`);
                var elementTitle = await page.waitForSelector(`#new_qul > li:nth-child(${index}) > a > span.title`);//,{timeout: 0});
                var textTitle:string = await page.evaluate(element => element.textContent, elementTitle);
                console.log(textTitle);

                var elementComments = await page.waitForSelector(`#new_qul > li:nth-child(${index}) > a > span.comments`);
                var textComments:string = await page.evaluate(element => element.textContent, elementComments);
                console.log(textComments);

                var elementDate = await page.waitForSelector(`#new_qul > li:nth-child(${index}) > a > span.date`);
                var textDate = await page.evaluate(element => element.textContent, elementDate);
                console.log(textDate);


                var elementLink = await page.waitForSelector(`#new_qul > li:nth-child(2) > a`);
                const href = await page.evaluate(anchor => anchor.getAttribute('href'), elementLink);

                console.log(href);
                await page.goto(`${this.url}${href}`);

                
                var elementUser = await page.waitForSelector(`#div_question_content > h2`);
                var textUser = await page.evaluate(element => element.textContent, elementUser);
                console.log(textUser);

                var elementQuestionContent = await page.waitForSelector(`#div_question_content > div.content > div.question_content > p`);
                var textQuestionContent = await page.evaluate(element => element.textContent, elementQuestionContent);
                console.log(textQuestionContent);

                const container = await page.evaluate(() => {
                    var headings_elements = document.querySelectorAll("li .advice_content");
                    var headings_array = Array.from(headings_elements);
                    return headings_array.map(heading => heading.textContent);
                });
                console.log(container);
                scrapeAskContainers.push(new scrapeAskContainer(
                    textTitle.replace('//t',''),
                    textComments.replace('//t',''),
                    textDate,
                    href,
                    textUser,
                    textQuestionContent,
                    container
                )
                );
                await page.goto(`${this.url}`);
                console.log('before onclick--------');
                await page.click('#new_q > div > div > div > div > span');
                console.log('after onclick--------');
            } catch (error) {
                console.log(error);
            }
        }


        return scrapeAskContainers;
    }
}
