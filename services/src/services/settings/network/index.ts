import dotenv from 'dotenv';
import bsc from './bsc';
import bsctest from './bsctest';
import eth from './eth';
import polygon from './polygon';

dotenv.config();

let network:any = {};

network.bsc = bsc;
network.eth = eth;
network.bsctest = bsctest;
network.polygon = polygon;

export default network;
