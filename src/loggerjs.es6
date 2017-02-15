/**
 *Created by py on 09/02/2017
 */

"use strict";
const SERVICE_NAME = 'loggerjs';

const KAFKA_TEST = "54.154.211.165";
const KAFKA_PROD = "54.154.226.55";
const parseProcessArgs = require('./parseProcessArgs.es6');
let args = parseProcessArgs();
let kafkaHost = (function(bool){
    let result = bool ? KAFKA_PROD : KAFKA_TEST;
    console.log(result);
    return result;
})(args[0].isProd);

const EventEmitter = require('events').EventEmitter;

const kafkaBusFactory = require('my-kafka').kafkaBusFactory;
const kafkaServiceFactory = require('my-kafka').kafkaServiceFactory;

const loggerCtrlFactory = require('my-logger').loggerCtrlFactory;
const loggerAgentFactory = require('my-logger').loggerAgentFactory;

let kafkaBus;

let kafkaService;

let loggerCtrl,
    loggerAgent;

let startKafka,
    startLogic;

startKafka = () => {
    kafkaBus = kafkaBusFactory(kafkaHost, SERVICE_NAME, EventEmitter);
    kafkaService = kafkaServiceFactory(kafkaBus, EventEmitter);
    loggerAgent = loggerAgentFactory(SERVICE_NAME, kafkaService, EventEmitter);
    kafkaBus.producer.on('ready', startLogic);
};

startLogic =() => {
    loggerCtrl = loggerCtrlFactory(kafkaService, EventEmitter);
    loggerCtrl.start();
};

startKafka();


