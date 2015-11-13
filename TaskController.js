var fs = require('fs');
var url = require('url');

/*
    Összeállítja a paraméterül kapott url-hez tartozó oldal html tartalmát.
*/
exports.fetchHtml = function (locUrl) {
    
    var fullHtml = "";

    //  Feladatok listája
    if(locUrl == '/taskList'){
        // html kezdő tartalom
        fullHtml += fs.readFileSync('./bead_02/taskListBegin.html');
        // adattagok formázva
        fullHtml += formatTaskList(getTaskList());
        // html vége tartalom
        fullHtml += fs.readFileSync('./bead_02/taskListEnd.html');
    }
    else{
        //  index
        if(locUrl=='/'){
            locUrl = '/index';
        }
        fullHtml = fs.readFileSync('./bead_02'+locUrl+'.html');
    }
    // html tartalom
    return fullHtml.toString();
}

/*
    Betölti a létező feladatokat a tasks/ könyvtárból.
    A feladatok adatait a data objektumban adja vissza.
*/
function getTaskList(){
    var data={};
    // Könyvtár beolvasása
    var filelist = fs.readdirSync('./bead_02/tasks/');
    var i = 0;
    while(i < filelist.length)
    {
        // feladat hozzáadása a data objektumhoz
        data[i]=JSON.parse(fs.readFileSync('./bead_02/tasks/'+filelist[i]).toString());
        i++;
    }
    return data;
}

/*
    Előállítja a TODO feladatok listájának oldalát.
    A paraméterül kapott data objektum a létező feladatok adatait tartalmazza.
*/
function formatTaskList(data){
    var htmlOut = '';
    
    
    for(var feladat in data){
        htmlOut += '<div class="task" style="background:#'+data[feladat]['Color']+';">';
        htmlOut += data[feladat]['Description']+'<br>';
        
        htmlOut += '<div style="padding: 10px; display: inline-block">';
        htmlOut += '<form action="editTask" method="get">';
        htmlOut += '<input type="hidden" name="Username" value="'+ data[feladat]['User'] +'"/>';
        htmlOut += '<input type="hidden" name="Description" value="'+ data[feladat]['Description'] +'"/>';
        htmlOut += '<input type="submit" value="Edit"/>';
        htmlOut += '</form>';
        htmlOut += '</div>';
        
        htmlOut += '<div style="padding: 10px; display: inline-block">';
        htmlOut += '<form action="deleteTask" method="post">';
        htmlOut += '<input type="hidden" name="Description" value="'+ data[feladat]['Description'] +'"/>';
        htmlOut += '<input type="submit" value="Delete"/>';
        htmlOut += '</form>';
        htmlOut += '</div>';
        
        htmlOut += '</div>';
    }
    
    return htmlOut;
    
}

/*
    Új TODO feladat létrehozása
*/
exports.createTask = function (task) {
    
    var fs = require('fs');
    // segédváltozó
    var tmpTask = {
        
        'User' : task['Username'],
        'Description' : task['Description'],
        'Color' : getColor(task['Username'])
    }
    // feladat fájlba mentése
    fs.writeFileSync('bead_02/tasks/'+tmpTask['Description']+'.json', JSON.stringify(tmpTask)); 
    
}

/*
    Visszaadja a felhasználóhoz tartozó színt
*/
function getColor(usr){
    var fs = require('fs');
    // felhasználó adatok beolvasása 
    var userData = JSON.parse(fs.readFileSync('./bead_02/users/'+usr+'.json').toString());
        // színe adat
        return userData['Color'];
    }

/*
    Delete (törlés) függvény
*/
exports.deleteTask = function (task) {
    // DEV
    console.log('deleting '+task);
    var fs=require('fs');
    fs.unlinkSync('./bead_02/tasks/'+task+'.json');
    
}

/*
    Edit (szerkesztés) oldal betöltése
*/
exports.loadEdit = function (userName, description) {
    
    var fs=require('fs');
    // kezdő tartalom
    var htmlOut = fs.readFileSync('./bead_02/editTaskBegin.html','utf-8'); 
    // input adattagok
    htmlOut += description+ '"/>';
    htmlOut += '<input type="hidden" name="Username" value="'+ userName +'"/>';
    htmlOut += '<input type="text" name="Task" value="'+ description +'"/>';
    // vége tartalom
    htmlOut += fs.readFileSync('./bead_02/editTaskEnd.html','utf-8'); 
    return htmlOut;
    
}

