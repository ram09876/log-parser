const {Command, flags} = require('@oclif/command')
const {Utils, GetCodesUtils} = require('../utils')

Date.prototype.addHours = function(h) {    
  this.setTime(this.getTime() + (h*60*60*1000)); 
  return this;   
}

class GetCodesCommand extends Command {
  async run() {
    const {flags} = this.parse(GetCodesCommand)
    
    var fromDate 
    var toDate  
    
    if(flags.for) {

       if(flags.testrelative){
        toDate = new Date("2018/07/10");
        fromDate = new Date("2018/07/10");
       }else {
        toDate = new Date();
        fromDate = new Date();
       }

      
     
      var forFlag = flags.for.split(" ");
      
      if(forFlag[1].toLowerCase() === "days"){
        fromDate.setDate(toDate.getDate() - Utils.ValidateInteger(forFlag[0]));
      }else if(forFlag[1].toLowerCase() === "hours"){
        fromDate.addHours(-Utils.ValidateInteger(forFlag[0]))
      }

      // toDate = new Date();
      // fromDate = new Date();
      
    }else if(flags.from && flags.to) {
      fromDate  = Utils.ValidateDate(flags.from, "from")
      toDate    = Utils.ValidateDate(flags.to,"to" )
      toDate.setDate(toDate.getDate() + 1);
    }

    
    var max
    
    if(flags.max){
      max = Utils.ValidateInteger(flags.max)
      console.log('\x1b[33m%s\x1b[0m', `Getting Top ${max} Status Codes between dates ${fromDate.getMonth()}/${fromDate.getDate()} and ${toDate.getMonth()}/${toDate.getDate()}`);
    }else {
      console.log('\x1b[33m%s\x1b[0m', `Getting All Status Codes between dates ${fromDate.getMonth()}/${fromDate.getDate()} and ${toDate.getMonth()}/${toDate.getDate()}`);
    }
    
    // console.log("max entries" , flags.max);
    GetCodesUtils.CreateSummary(fromDate, toDate, max);
    // console.log(logEntries);





}
}

GetCodesCommand.description = `Describe the command here
...
Extra documentation goes here
`

GetCodesCommand.flags = {
  from: flags.string({char: 'f', description: 'from date for logs'}),
  to: flags.string({char: 't', description: 'to date for logs'}),
  max: flags.string({char: 'm', description: 'to max entries'}),
  for: flags.string({char: 'r', description: 'relative date logs'}),
  testrelative: flags.boolean({char: 'n', description: 'test relative logs'}),
}

module.exports = GetCodesCommand
