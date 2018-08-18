Log parser for elb logs
=======================

## Requirements

Node version 8 or above required

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@oclif/example-multi-js.svg)](https://npmjs.org/package/@oclif/example-multi-js)

# npm install 
unpack & install packages with command `npm install --save`
<!-- toc -->
# Usage
`./bin/run generatereport --for '10 hours' --max 4 --testrelative`

`./bin/run geturls --code 404 --for '5 days' --max 4 --testrelative`

`./bin/run geturls --code 404 --from 2018/07/01 --to 2018/07/07 --max 10`

`./bin/run getcodes --from 2018/07/01 --to 2018/07/07 --max 10`

`./bin/run getUAs --code 404 --from 2018/07/01 --to 2018/07/07 --max 10`

# Comments

--testrelative flag is added for relative date testing. It is added to move current date to previous month. with out this flag It will query S3 with current date time. which s3 doesn't have logs. 
<!-- usage -->
<!-- commands -->
