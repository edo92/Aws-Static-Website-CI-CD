#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { Infrastructure } from '@stack';

const app = new cdk.App();
new Infrastructure(app, 'App-Infrastrucuture');
