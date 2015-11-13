
var http = require('http');

var UserController = require('./UserController');
var TaskController = require('./TaskController');

var qs = require('querystring');
var url = require('url');

// szerver létrehozása
var server = http.createServer(function(req,res){
    //  DEV
    console.log('Method = '+req.method+' URL = '+req.url);
    // disable favicon request
    if (req.url === '/favicon.ico') {
    res.writeHead(200, {'Content-Type': 'image/x-icon'} );
    res.end();
    return;
    }
    
    /*  
        GET
    */
    if(req.method == 'GET'){
        //
        res.writeHead(200);
        // login & register oldalakat a UserController kezeli
        if(req.url == '/login' || req.url == '/register')
            res.write(UserController.fetchHtml(req.url),'utf-8');
        // a többi oldalakat a TaskController kezeli
        else{
            // egyszerű GET request
            if(url.parse(req.url).query == null){
                res.write(TaskController.fetchHtml(req.url));
            }   
            // GET request adattaggal
            else{
                var userName = url.parse(req.url,true)['query']['Username'];
                var description = url.parse(req.url,true)['query']['Description'];
                res.write(TaskController.loadEdit(userName, description),'utf-8');
            }
        }
        res.end();
    }
    /*
        POST
    */
    else{
        req.on('data', function(input) {
            // beérkező adat feldolgozása (QueryString modul)
            var data = qs.parse(input.toString());
            
            // DEV
            console.log('got back : '+JSON.stringify(data));
            
            // Register
            if(req.url == '/register'){
                // Success
                if(UserController.register(data)){
                    res.writeHead(200);
                    res.write(UserController.fetchHtml('/login'));
                    res.end();   
                }
            }
            
            // Login
            if(req.url == '/login'){
                // Success
                if(UserController.auth(data)){
                    res.writeHead(200);
                    res.write(TaskController.fetchHtml('/taskList'));
                    res.end();
                }
                    
            }
            
            // Create Task
            if(req.url == '/createTask'){
                // DEV
                console.log('data : ' + data);
                    TaskController.createTask(data);
                    res.writeHead(200);
                    res.write(TaskController.fetchHtml('/taskList'));
                    res.end();
            }
            
            // Delete Task
            if(req.url == '/deleteTask'){
                    TaskController.deleteTask(data['Description']);
                    res.writeHead(200);
                    res.write(TaskController.fetchHtml('/taskList'));
                    res.end();
            }
            
            // Edit Task (A régit töröljük + Újat (módosítottat) létrehozzuk)
            if(req.url == '/editTask'){
                    // Delete
                    TaskController.deleteTask(data['originalValue'].toString('utf-8'));
                    // segédváltozó
                    var tmp = {
                        'Description' : data['Task'], 
                        'Username' : data['Username']
                        
                    };
                    // Create
                    TaskController.createTask(tmp);
                    
                    // response + html tartalom összeállítása
                    res.writeHead(200);
                    res.write(TaskController.fetchHtml('/taskList'));
                    res.end();
            }
        });
    }
});

server.listen(8080);

    