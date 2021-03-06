const assert = require('power-assert')
const { generateQuiz } = require('../../libs/quizUtils')

describe('/libs/quizUtils.js', () => {
  describe('generateQuiz()', () => {
    const attributes = {
      reservedQuiz: [
        'Amazon WorkSpaces',
        'Amazon WorkDocs',
        'Amazon WorkMail',
        'Amazon Elasticsearch Service',
        'Amazon Machine Learning',
        'Amazon QuickSight',
        'AWS Data Pipeline',
        'Amazon Kinesis',
        'Amazon API Gateway',
        'Amazon CloudSearch',
        'Amazon Elastic Transcoder',
        'Amazon SQS',
        'Amazon Connect',
        'Amazon Elastic MapReduce',
        'Amazon Simple Email Service (Amazon SES)',
        'Amazon SWF (Simple Workflow Service)',
        'Amazon AppStream',
        'Amazon EC2 (Elastic Compute Cloud)',
        'Amazon EC2 Container Registry (ECR)',
        'Amazon EC2 Container Service (ECS)',
        'AmazonMachine Image(AMI)',
        'AWS Elastic Beanstalk',
        'Amazon Elastic Load Balancer(ELB)',
        'AWS Lambda',
        'AWS Database Migration Service',
        'Amazon ElastiCache',
        'Amazon Relational Database Service(RDS)',
        'Amazon Redshift',
        'Amazon EBS Snapshots',
        'Amazon DynamoDB',
        'AWS CodeCommit',
        'AWS IoT',
        'AWS CloudFormation',
        'AWS CloudTrail',
        'Amazon CloudWatch',
        'AWS Config',
        'AWS OpsWorks',
        'AWS Mobile Hub',
        'AWS CodeDeploy',
        'AWS CodePipeline',
        'Amazon Cognito',
        'AWS Device Farm',
        'Amazon Mobile Analytics',
        'Amazon Simple Notification Service (SNS)',
        'AWS Direct Connect(DX)',
        'Amazon Virtual Private Cloud(VPC)',
        'Amazon Route53',
        'AWS CloudHSM',
        'AWS Directory Service',
        'AWS Identify and Access Management(IAM)',
        'AWS Key Management Service (KMS)',
        'AWS Service Catalog',
        'AWS Trusted Advisor',
        'AWS Web Application Firewall(WAF)',
        'AWS Import/Export',
        'Amazon CloudFront',
        'Amazon Glacier',
        'AWS Snowball',
        'Amazon Simple Storage Service(S3)',
        'AWS Storage Gateway',
        'Amazon Elastic File System (EFS)',
        'Amazon Inspector',
        'AWS Certificate Manager',
        'Amazon EC2 Auto Scaling',
        'Amazon EC2 Spot Instance',
        'Internet Gateway',
        'Virtua Private Gateway',
        'VPC Peering',
        'Hosted Zone',
        'Amazon S3 Bucket',
        'Amazon CloudFront Edge Locations',
        'Amazon Elastic Block Store',
        'AWS Artifact',
        'AWS Batch',
        'AWS Application Discovery Service',
        'AWS CodeBuild',
        'AWS Greengrass',
        'AWS Managed Services',
        'AWS Organizations',
        'AWS Server Migration Service',
        'AWS Shield',
        'AWS Step Functions',
        'AWS X-Ray',
        'Amazon Athena',
        'Amazon Game Lift',
        'Amazon Lex',
        'Amazon Lightsail',
        'Amazon Pinpoint',
        'Amazon Polly',
        'Amazon Rekognition',
        'Amazon Chime',
        'Amazon Macie',
        'Amazon EKS',
        'AWS Cloud9',
        'Amazon SageMaker'
      ]
    }
    it('should return Fargate when another service has been reserved.', () => {
      const result = generateQuiz(attributes)
      assert.equal(result.name, 'AWS Fargate')
    })
    it('should return empty when all service has been reserved.', () => {
      attributes.reservedQuiz.push('AWS Fargate')
      const result = generateQuiz(attributes)
      assert.equal(result.name, undefined)
    })
  })
})
