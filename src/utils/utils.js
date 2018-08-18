const { s3Client } = require("../config/config")

const logEntry = ['type', 'timestamp', 'elb', 'client_port', 'backend_port', 'request_processing_time',
                'backend_processing_time', 'response_processing_time', 'elb_status_code', 'backend_status_code',
                'received_bytes', 'sent_bytes', 'request', 'user_agent', 'total_time', 'count',
                'target_group_arn', 'trace_id', 'ssl_cipher', 'ssl_protocol' , 'requested_resource'];

const ValidateDate = (date, place) => {
    if ((new Date(date)).toString() === 'Invalid Date') {
        throw new Error(`Date entered in "${place}" flag is not valid`)
    } else {
        return new Date(date);
    }
}

const ValidateInteger = (max) => {
    if (max != parseInt(max, 10)) {
        throw new Error(`Please enter a valid number for max, entered an invalid number of days : ${max}`)
    }
    return max
}

function listAllKeys(token,allKeys, date, callback) {
    var opts = {
        Bucket: 'techtest-alb-logs',
        Prefix: `${date}`
    }
    if (token) opts.ContinuationToken = token;

    s3Client.listObjectsV2(opts, function (err, data) {
        if (err) {
            callback(err)
        }

        allKeys = allKeys.concat(data.Contents);

        if (data.IsTruncated)
            listAllKeys(data.NextContinuationToken, allKeys);
        else
            return callback(undefined, allKeys)
    });
}

var swap = function(array, firstIndex, secondIndex) {
    var temp = array[firstIndex];
    array[firstIndex] = array[secondIndex];
    array[secondIndex] = temp;
};

var indexofMaximum = function(array, startIndex) {

    var minValue = Object.values(array[startIndex])[0];
    var minIndex = startIndex;

    for(var i = minIndex + 1; i < array.length; i++) {
        var currentValue = Object.values(array[i])[0];
        if(currentValue > minValue) {
            minIndex = i;
            minValue = currentValue;
        }
    } 
    return minIndex;
}; 

var sortDesc = function(array) {
    var i;
    for(i = 0;i< array.length; i++){
      var minIndex = indexofMaximum(array,i);
      swap(array, minIndex,i);
      
    }
  return array;
};

function groupBy(logEntryList, property) {
    var i = 0, val, index,
         entries = {};
    for (; i < logEntryList.length; i++) {
        val = logEntryList[i][property];
        if(entries[val]){
            var temp = entries[val]
            entries[val] = temp+1;
        }else {
            entries[val] = 1;
        }
    }
    var entriesList = [];
    for (let [k,v] of Object.entries(entries)) {
       var temp = {}
       temp[k] = v;
       entriesList.push(temp)
    }
    return entriesList;
}

module.exports = {
    ValidateDate,
    ValidateInteger,
    listAllKeys,
    logEntry,
    sortDesc,
    groupBy
}

