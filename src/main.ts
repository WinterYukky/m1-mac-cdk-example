import { App, Stack, StackProps, Tags } from 'aws-cdk-lib';
import {
  CfnHost,
  Instance,
  InstanceType,
  OperatingSystemType,
  Port,
  SubnetType,
  UserData,
  Vpc,
} from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

export class M1MacStack extends Stack {
  get availabilityZones(): string[] {
    return ['us-east-1b', 'us-east-1d'];
  }
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    const vpc = new Vpc(this, 'Vpc', {
      natGateways: 0,
    });
    const m1MacHost = new CfnHost(this, 'M1MacHost', {
      availabilityZone: 'us-east-1d',
      instanceType: 'mac2.metal',
    });
    Tags.of(m1MacHost).add('Name', 'M1 Mac host');

    const macInstance = new Instance(this, 'MacInstance', {
      vpc,
      availabilityZone: 'us-east-1d',
      instanceType: new InstanceType('mac2.metal'),
      machineImage: {
        getImage: (_scope) => ({
          imageId: 'ami-01a9da8de3d589094',
          osType: OperatingSystemType.UNKNOWN,
          userData: UserData.custom(''),
        }),
      },
      vpcSubnets: {
        subnetType: SubnetType.PUBLIC,
      },
      keyName: 'macOS-for-Flutter',
    });
    macInstance.instance.tenancy = 'host';
    macInstance.instance.hostId = m1MacHost.attrHostId;
    macInstance.connections.allowFromAnyIpv4(Port.tcp(22));
  }
}

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: 'us-east-1', // process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new M1MacStack(app, 'M1MacStack', { env });

app.synth();
