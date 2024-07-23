
import AlarmClock from './libs/AlarmClock.js';

class MyAlarmClock extends AlarmClock{
    #alarmClockSetInterval;
    constructor(){
        super();
        this.init();
        this.isMenuActive = false;
    }

    init(){
        this.turnOnClock();
    }

    turnOnClock(){
        this.displayTime();
    }

    turnOffClock(){
        console.log("\nTurning off clock and removing all data");
        this.turnOffClockDisplay();
        process.exit(0);
    }

    turnOffClockDisplay(){
        clearInterval(this.#alarmClockSetInterval);
        console.clear();
    }


    displayTime(){
        this.#alarmClockSetInterval = setInterval(async () => {
            console.clear();
            console.log(super.displayTime());
            const active_alarm = await this.checkAlarms();
            if(active_alarm.length > 0){
                this.turnOffClockDisplay();
                console.clear();
                console.log(`Alarm triggered for ${active_alarm[0].hour}:${active_alarm[0].minute}:${active_alarm[0].second} on ${active_alarm[0].day}`);
                const answer = await this.rl.question("Press s to snooze or d to deactivate: ");
                if(answer == "s"){
                    active_alarm[0].snooze();
                }
                if(answer == "d"){
                    active_alarm[0].deactivateAlarm();
                }
                return 
            }
            const answer = await this.rl.question("Press q to quit or m to bring up menu and press enter: ");
            if(answer){
                if(answer == "q"){
                    this.turnOffClock();
                }
                if( answer == "m"){
                    this.turnOffClockDisplay();
                    this.isMenuActive = true;
                    console.clear();
                    this.alarmMenu();
                }
            }
        }, 1000);
    }

    async checkAlarms(){
        const { hour, minute, second, day } = this.getTime();
        const all_alarms = await this.fetchAllAlarms();
        const active_alarms = all_alarms.filter(alarm => alarm.isActive && alarm.hour == hour && alarm.minute == minute && alarm.second == second && alarm.day == day);
        return active_alarms;
    }

    async alarmMenu(){
        console.clear();
        console.log("Node.js Alarms Menu", "  \nCurrent time:\n",super.displayTime());
        const answer = await this.rl.question("Press the number to select an option: \n 1. Add Alarm\n 2. Edit Alarm\n 3. Delete Alarm\n 4. Back to Main Menu\n 5. Quit\n 6.Back to clock\n :  ");
        switch(answer){
            case "1":
                console.log("Adding Alarm");
                await this.addAlarm();
                this.alarmMenu();
                break;
            case "2":
                console.log("Editing Alarm");
                await this.editAlarm();
                this.alarmMenu();
                break;
            case "3":
                console.log("Deleting Alarm");
                await this.deleteAlarm();
                this.alarmMenu();
                break;
            case "4":
                console.log("Back to Main Menu");
                console.clear();
                this.alarmMenu();
                break;
            case "5":
                console.log("Quitting");
                this.turnOffClock();
                break;
            case "6":
                console.log("Back to Clock");
                this.turnOnClock();
                break;
            default:
                console.log("Invalid option");
                this.alarmMenu();
        }
    }

}


(()=>{
    new MyAlarmClock();
})();