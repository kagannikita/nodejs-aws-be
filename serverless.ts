import type { AWS } from '@serverless/typescript';
import getProducts from "@functions/getProducts";
import getProductById from "@functions/getProductById";

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '3',
  plugins: ['serverless-offline','serverless-auto-swagger','serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'us-east-1',
    stage: 'dev',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: { getProducts,getProductById },
  package: { individually: true },
  custom: {
    autoswagger:{
      generateSwaggerOnDeploy:false
    },
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;