import Clock from "./Clock.js";
import { validateTime } from "../helpers/validateTime.js";

class Alarm {
    constructor(hour, minute, second, day, maxSnooze = 3, intervalSnooze = 5){
        this.hour = hour;
        this.minute = minute;
        this.second = second;
        this.day = day;
        this.maxSnooze = maxSnooze;
        this.intervalSnooze = intervalSnooze;
        this.isActive = true;
        this.snoozeCount = 0;
        this.reset = { hour, minute, second, day};
    }

    snooze(){
        if(this.snooze < this.maxSnooze){
            this.minute = this.minute + this.intervalSnooze;
            if(this.minute > 59){
                this.minute =this.minute - 59;
                this.hour++;
            }
            if(this.hour > 23){
                this.hour = 0;
                this.day++;
            }
            if(this.day > 6){
                this.day = 0;
            }

            this.snoozeCount++;
            console.log(`Alarm snoozed to ${this.hour}:${this.minute}:${this.second} [${this.day}], snooze count ${this.snoozeCount}`);
            setTimeout(() => {
                console.clear();
            }, 1000);
        } else {
            console.log(`Alarm snoozed for maximum times, alarm deactivated`);
            this.isActive = false;
            setTimeout(() => {
                console.clear();
            }, 1000);
            setTimeout(() => {
                this.reset();
            })
        }
    }

    deactivateAlarm(){
        this.isActive = false;
        console.log(`Alarm deactivated`);
        setTimeout(() => {
            console.clear();
        }, 1000);
    }

    resetAlarm(){
        this.hour = this.reset.hour;
        this.minute = this.reset.minute;
        this.second = this.reset.second;
        this.day = this.reset.day;
        this.snoozeCount = 0;
        this.isActive = true;
    }
}

class AlarmClock extends Clock{
    #alarms = [];
    constructor(){
        super();
        this.#alarms = [];
    }

    #setAlarm(time, day){
        const alarm = new Alarm(time[0], time[1], time[2], day);
        this.#alarms.push(alarm);
        console.log(`Alarm set for ${time[0]}:${time[1]}:${time[2]} on ${day}`);
    }
    #getAlarms(){
        return this.#alarms;
    }
    #editAlarm(index,time, day){
        this.#alarms[index].hour = time[0];
        this.#alarms[index].minute = time[1];
        this.#alarms[index].second = time[2];
        this.#alarms[index].day = day;
        console.log(`Alarm edited to ${time[0]}:${time[1]}:${time[2]} on ${day}`);
    }

    #deleteAlarm(index){
        this.#alarms.splice(index, 1);
        console.log(`Alarm deleted`);
    }

    async alarmPropertiesPrompts(){
        try{
            const hours = await this.rl.question("Enter the hour[0-23]: ");
            if(!validateTime(hours, "HH")){
                console.log("Invalid hour");
                return false;
            }
            const minutes = await this.rl.question("Enter the minute[0-59]: ");
            if(!validateTime(minutes, "MM")){
                console.log("Invalid minute");
                return false;
            }
            const seconds = await this.rl.question("Enter the second[0-59]: ");
            if(!validateTime(seconds, "SS")){
                console.log("Invalid second");
                return false;
            }
            const day = await this.rl.question("Enter the day[0-6]: ");
            if(!validateTime(day, "day")){
                console.log("Invalid day");
                return false;
            }

            return {
                err: null,
                hours: parseInt(hours),
                minutes: parseInt(minutes),
                seconds: parseInt(seconds),
                day: parseInt(day)
            }
        } catch (err){
            return {
                err: "Error in setting the alarm",
                hours: 0,
                minutes: 0,
                seconds: 0,
                day: 0
                
            }
        }
    }

    async addAlarm(){
        try{
            console.clear();
            console.log("Adding a new alarm here:\n");
            const {err, hours, minutes, seconds, day} = await this.alarmPropertiesPrompts();
            if(err){
                console.log(err);
                return false;
            }
            this.#setAlarm([hours, minutes, seconds], day);
            return new Promise(resolve => setTimeout(resolve, 1500));
        } catch (err){
            console.log("Error in adding alarm", err);
            return false;
        }
    }

    async fetchAllAlarms(){
        return this.#getAlarms();
    }

    async editAlarm(){
        try{
            console.clear();
            const all_alarms = await this.fetchAllAlarms();
            all_alarms.forEach((alarm, index) => {
                console.log(`Alarm ${index+1} : ${alarm.hour}:${alarm.minute}:${alarm.second} [${alarm.day}]`);
            });
            const answer = await this.rl.question("Enter the alarm number to edit: \n ");
            if(answer > all_alarms.length || answer < 1){
                console.log("Invalid alarm number");
                return false;
            }
            const alarm = all_alarms[answer-1];
            console.log(`Editing alarm ${answer} : ${alarm.hour}:${alarm.minute}:${alarm.second} [${alarm.day}] \n\n`);
            const {err, hours, minutes, seconds, day} = await this.alarmPropertiesPrompts();
            if(err){
                console.log(err);
                return false;
            }
            this.#editAlarm(answer-1, [hours, minutes, seconds], day);
            return new Promise(resolve => setTimeout(resolve, 1500));
        } catch (err){
            console.log("Error in editing alarm", err);
            return false;
        }
    }

    async deleteAlarm(){
        try{
            console.clear();
            const all_alarms = await this.fetchAllAlarms();
            all_alarms.forEach((alarm, index) => {
                console.log(`Alarm ${index+1} : ${alarm.hour}:${alarm.minute}:${alarm.second} [${alarm.day}]`);
            });
            const answer = await this.rl.question("Enter the alarm number to delete: \n ");
            if(answer > all_alarms.length || answer < 1){
                console.log("Invalid alarm number");
                return false;
            }

            const alarm = all_alarms[answer-1];
            console.log(`Deleting alarm ${answer} : ${alarm.hour}:${alarm.minute}:${alarm.second} [${alarm.day}] \n\n`);
            this.#deleteAlarm(answer-1);
            return new Promise(resolve => setTimeout(resolve, 1500));
        } catch(err){
            console.log("Error in deleting alarm", err);
            return false;
        }
    }

}

export default AlarmClock