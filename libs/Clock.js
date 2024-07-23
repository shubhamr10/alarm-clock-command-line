import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { error } from 'node:console';

export default class Clock{
    // define the protected variables
    #hour = 0;
    #minute = 0;
    #second = 0;
    #day = 0;
    #days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    // interval variables
    clockSetInterval;
    clockIntervalInMilliSeconds = 1000;
    constructor(){
        this.#initiateClock();
        this.startClock();
        this.rl = readline.createInterface({ input, output});
    }
    // Private method to set the time
    #initiateClock(){
        const date = new Date();
        this.#hour = date.getHours();
        this.#minute = date.getMinutes();
        this.#second = date.getSeconds();
        this.#day = date.getDay();
    }

    // Private method to update the time
    #updateTime(){
        this.#second++;
        if(this.#second > 59){
            this.#second = 0;
            this.#minute++;
        }
        if(this.#minute > 59){
            this.#minute = 0;
            this.#hour++;
        }
        if(this.#hour > 23){
            this.#hour = 0;
            this.#day++;
        }
        if(this.#day > 6){
            this.#day = 0;
        }
    }

    getTime(){
        return {
            hour:   this.#hour,
            minute: this.#minute,
            second: this.#second,
            day:this.#day,
            dayText:this.#days[this.#day]
        }
    }

    displayTime(){
        const displayString = `-------------> Welcome to Node.js command line alarm clock <-------------
-------------------------------------------------------------------------
-------------> TIME ${this.#hour}:${this.#minute}:${this.#second} [${this.#days[this.#day]}] <-----------
-------------------------------------------------------------------------
-------------------------------------------------------------------------
        `;
        return displayString;
    }

    async displayTimeSetting(){
        try{
            const hour = await this.rl.question('Enter the hour[0-23]: ');
            const minute = await this.rl.question('Enter the minute[0-59]: ');
            const second = await this.rl.question('Enter the second[0-59]: ');
            this.#hour = parseInt(hour);
            this.#minute = parseInt(minute);
            this.#second = parseInt(second);
            console.log(`Time set to: ${this.#hour}:${this.#minute}:${this.#second}`);
        } catch (err){
            return "Error in setting the time";
        }
    }

    startClock(){
        this.clockSetInterval = setInterval(() => {
            this.#updateTime();
        }, this.clockIntervalInMilliSeconds); 
    }

    stopClock(){
        clearInterval(this.clockSetInterval);
    }

}
