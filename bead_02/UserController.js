/*
    UserController : Kezeli a felhasználókkal kapcsolatos adatokat, 
    előállítja a bejelentkezés és regosztráció oldalak html tartalmát 
    a megfelelő fájlok és műveletek segítségével.
*/

var fs = require('fs');

/*
    Visszaadja a paraméterül kapott url-hez tartozó html tartalmat, 
    amit a böngésző megjelenít
*/
exports.fetchHtml = function (locUrl) {
    
    var fullHtml = "";

    //  index oldal
    if(locUrl=='/'){
        locUrl = '/index.html';
    }
    // login oldal
    if(locUrl == '/login'){
        var result = '';
        var legendHtml = getLegend();
        // alap html tartalom
        result = fs.readFileSync('./bead_02'+locUrl+'.html').toString(); 
        // színezett user lista beszúrása
        result = result.replace(/legend/g, legendHtml);
        return result;
    }
    // default oldalak
    else{
        return fs.readFileSync('./bead_02'+locUrl+'.html').toString();    
    }
}

/*
    Login hitelesítés függvény.
    Ellenőrzi, hogy a beírt felhasználónév + jelszó megfelelő-e
*/
exports.auth = function (user) {
    
    var fs = require('fs');
    // userfájl beolvasása 
    var userData = JSON.parse(fs.readFileSync('./bead_02/users/'+user['Username']+'.json').toString());
    // hitelesítés
    if(userData['Password'] == user['Password']){
        return true;
    }
    return false;
};

/*
    Beolvassa a regisztrált felhasználók listáját a users könyvtárból. 
    A felhasználók az oldalon a hozzájuk tartozó színnel vannak jelölve.
*/
function getLegend(){
    var data={};
    // Fájlok beolvasása
    var filelist = fs.readdirSync('./bead_02/users/');
    var i = 0;
    while(i < filelist.length)
    {
        // data = felhasználó adatokat tartalmazó objektum
        data[i]=JSON.parse(fs.readFileSync('./bead_02/users/'+filelist[i]).toString());
        i++;
    }
    // felhasználó adatok formázása
    return formatLegend(data);
}

/*
    Formázza a user fájlokat tartalmazó data paramétert.
    Html <div> objektumok listáját adja vissza, 
    amik a felhasználókhoz tartozó színnel vannak jelölve.
*/
function formatLegend(data){
    var htmlOut = '';
    
    for(var userFileData in data){
        htmlOut +=  '<div style="width: 120px; background-color: #'+ data[userFileData]['Color'] +'">' + data[userFileData]['Username']+'</div>';
    }
    return htmlOut;
}

/*
    Regisztrálja a paraméterként kapott user objektumot.
    Az adatokat menti a users könyvtárba.
*/
exports.register = function (user) {
    // változó, ami eltárolja, hogy sikerült-e menteni a felhasználót
    var success = true;
    
    // segédváltozó
    var tmpUsr = {
        'Username' : user['Username'], 
        'Password' : user['Password_1'],
        'Color' : getRandomRGB()
    };
    
    // user objektum fájlba mentése
    fs.writeFileSync('./bead_02/users/'+user['Username']+'.json', JSON.stringify(tmpUsr),'utf-8');
    
    return success;
}

/*
    Random RGB értékeket generál, majd visszaadja a színt hexadecimális formában
*/  
var getRandomRGB = function(){
        var R = (Math.random() * (255 - 128) + 128).toString(16).substr(0,2);
        var G = (Math.random() * (255 - 128) + 128).toString(16).substr(0,2);
        var B = (Math.random() * (255 - 128) + 128).toString(16).substr(0,2);
        
        console.log('User color = '+R+G+B);
        return (R+G+B);
    }


