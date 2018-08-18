const {listAllKeys , logEntry, sortDesc, groupBy} = require('./utils')
const { s3Client } = require("../config/config")
const Table = require("cli-table");
var clear = require('clear');
var zlib = require('zlib');
const readline = require('readline');


Date.prototype.addHours = function(h) {    
    this.setTime(this.getTime() + (h*60*60*1000)); 
    return this;   
 }



const CreateSummary = async (fromDate, toDate, max, code) => {
    // toDate.setDate(toDate.getDate() + 1);
    // toDate = toDate.addHours(1)
    var allKeys = []
    var timeDiff = Math.abs(fromDate.getTime() - toDate.getTime());
    var diffHours = Math.ceil(timeDiff / (1000 * 3600 ));
    var prefix =""
    // console.log(diffHours);
    do {
        //TODO get s3 files for today.
        //  console.log(`Getting s3 keys for date : ${fromDate.getFullYear()}/${fromDate.getMonth()}/${fromDate.getDate()}`)
        var tempKeys = []   
        var date = fromDate.getDate()+"";
        while (date.length < 2) date = "0" + date;

        var month = fromDate.getMonth()+ 1+"";
        while (month.length < 2) month = "0" + month;

        var hour = fromDate.getHours()+"";
        while (hour.length < 2) hour = "0" + hour;

        prefix = `${date}/712275310776_elasticloadbalancing_us-west-2_app.webservices.d8586e78eb2b1d8a_${fromDate.getFullYear()}${month}${date}T${hour}`
        // console.log(prefix)
        await listAllKeys(null, tempKeys, prefix, (err, data) => {
        //    console.log(data)
           allKeys.push(data)
           if(diffHours === allKeys.length){
               var logEntryObjList = [];
               var entryObj = {}
               var lastLineReader = false;
            //    console.log(allKeys.length)
               allKeys.forEach(((element) => {
                   var dayLength = element.length;
                   
                   element.forEach((innerElement) => {

                    var lastEntry = (diffHours === allKeys.indexOf(element)+1) && (dayLength === element.indexOf(innerElement)+1)
                    var params = {
                        Bucket: "techtest-alb-logs",
                        Key: innerElement.Key
                      };
                    let lineReader = readline.createInterface({
                        input:  s3Client.getObject(params).createReadStream().pipe(zlib.createGunzip())
                    });
    
                    lineReader.on('line', (line) => {
                        if(lastEntry) {
                            lastLineReader = true;
                        }
                    const ATTRIBUTES = line.match(/[^\s"']+|"([^"]*)"/gi);
                    entryObj = {}
                    for(var i=0; i< ATTRIBUTES.length; i++){
                        entryObj[logEntry[i]] = ATTRIBUTES[i]
                    }
                    logEntryObjList.push(entryObj)
                  }).on('close', ()=> {
                      if(lastLineReader){
                        var filteredEntries = logEntryObjList.filter((entry) => entry.elb_status_code === code)
                        var groupStatusCodes = groupBy(filteredEntries, "user_agent")
                        groupStatusCodes = sortDesc(groupStatusCodes);

                        if (max){
                            if(max > groupStatusCodes.length){
                                max = groupStatusCodes.length
                                console.log('\x1b[36m%s\x1b[0m', `Getting only ${max} since that is maximum distinct entries`);
                            }
                        }else {
                            max = groupStatusCodes.length
                        }
                        
                        output = groupStatusCodes.slice(0,max)
                        
                        const table = new Table({
                            head: ['User agents', 'Count']
                          , colWidths: [75, 15]
                        });
 
                        output.forEach((element) => {
                            
                            table.push(Object.entries(element)[0])
                        })
                        process.stdout.write('\033c\033[3J');
                        console.log('\x1b[36m%s\x1b[0m', `Below Table shows ${max} Status Codes for given timeframe`);
                        console.log(table.toString());

                      }
                       
                  }) 
                

                   })

                   

               }))
               
           }
        });
        fromDate = fromDate.addHours(1);
    }
    while (fromDate.getTime() != toDate.getTime());
}




module.exports  = {CreateSummary}