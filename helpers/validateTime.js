
export function validateTime(time, type){
    if(type == "HH"){
        time = time.toString();
        time = parseInt(time);
        if(time >=0 && time <=23){
            return true;
        } else {
            return false;
        }
    }

    if(type == "MM"){
        time = time.toString();
        time = parseInt(time);
        if(time >=0 && time <=59){
            return true;
        } else {
            return false;
        }
    }

    if(type == "SS"){
        time = time.toString();
        time = parseInt(time);
        if(time >=0 && time <=59){
            return true;
        } else {
            return false;
        }
    }

    if(type == "day"){
        time = time.toString();
        time = parseInt(time);
        if(time >=0 && time <=6){
            return true;
        } else {
            return false;
        }
    }
}