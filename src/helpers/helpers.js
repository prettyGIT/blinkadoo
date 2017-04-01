/*
* regex checks: must start with the beginning of a word or a left caret
* must end with either the end of a word or a right caret
* can handle example.example.com as possible domain
* email username can have + - _ and .
* not case sensitive
*/
export function testGmails(emailList) {
    var EMAIL_REGEX = /(\<|^)[\w\d._%+-]+@(?:[\w\d-]+\.)+(\w{2,})(\>|$)/i;  
    var emails = emailList.trim().split(',');  
    var validEmails = [];  
    var invalidEmails = [];  

    for (var i = 0; i < emails.length; i++) {  
        var current = emails[i].trim();
        if(current !== "") {
            //if something matching the regex can be found in the string
            if(current.search(EMAIL_REGEX) !== -1) {
                //check if it has either a front or back bracket
                if(current.indexOf("<") > -1 || current.indexOf(">") > -1) {
                    //if it has both, find the email address in the string
                    if(current.indexOf("<") > -1 && current.indexOf(">") > -1) {
                        current = current.substr(current.indexOf("<")+1, current.indexOf(">")-current.indexOf("<") -1);
                    } 
                } 
            }
            if(EMAIL_REGEX.test(current)) {
                validEmails.push(current);
            } else {
                invalidEmails.push(current);
            }
        }               
    }
}

export function testEmail(email) {
    var EMAIL_REGEX = /(\<|^)[\w\d._%+-]+@(?:[\w\d-]+\.)+(\w{2,})(\>|$)/i;

    var current = email.trim();
    if(current !== "") {
        //if something matching the regex can be found in the string
        if(current.search(EMAIL_REGEX) !== -1) {
            //check if it has either a front or back bracket
            if(current.indexOf("<") > -1 || current.indexOf(">") > -1) {
                //if it has both, find the email address in the string
                if(current.indexOf("<") > -1 && current.indexOf(">") > -1) {
                    current = current.substr(current.indexOf("<")+1, current.indexOf(">")-current.indexOf("<") -1);
                } 
            } 
        }
        if(EMAIL_REGEX.test(current)) {
            return true
        } else {
            return false
        }
    } else {
        return false
    }
}
