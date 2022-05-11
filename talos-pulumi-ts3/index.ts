import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { local } from "@pulumi/command";
import { interpolate } from "@pulumi/pulumi";

/** This stack is responsible for building the EC2 from the talosconfig in stack talos-pulumi-ts2 */
const config = new pulumi.Config();
const stack = pulumi.getStack();
const org = config.require("org");

const stackRef = new pulumi.StackReference(`${org}/talos-pulumi-ts/${stack}`);

const SecuritygroupID = stackRef.getOutput("SecuritygroupID");
const VPCid = stackRef.getOutput("VPCid");

const controlUD = new local.Command("controlUD", {create: `cat ../talos-pulumi-ts2/talosconfig/controlplane.yaml`})
const workerUD = new local.Command("workerUD", {create: `cat ../talos-pulumi-ts2/talosconfig/worker.yaml`})
const serverids: any[] = []
const workerids: any[] = []

for (let i = 0; i < 0; i++) {
    const server = new aws.ec2.Instance(`talos-control-${i}`, {
        instanceType: "t3.small",
        associatePublicIpAddress: true,
        securityGroups: [ interpolate `${SecuritygroupID}` ],
        ami: "ami-0c213d04c7306d550",
        subnetId: "subnet-0489e5b67a8a23a6f",
        userData: interpolate `${controlUD.stdout}`,
        tags: { "Name": `talos-controlplane-${i}` }
    });
    serverids.push(server.id)
};

for (let i = 0; i < 0; i++) {
    const server = new aws.ec2.Instance(`talos-worker-${i}`, {
        instanceType: "t3.small",
        associatePublicIpAddress: true,
        securityGroups: [ interpolate `${SecuritygroupID}` ],
        ami: "ami-0c213d04c7306d550",
        subnetId: "subnet-0489e5b67a8a23a6f",
        userData: interpolate `${workerUD.stdout}`,
        tags: { "Name": `talos-worker-${i}` }
    });
    workerids.push(server.id)
};

const lbtarget = new aws.alb.TargetGroup("lbtarget", {
    port: 6443,
    protocol: "TCP",
    vpcId: interpolate `${VPCid}`,
    targetType: "ip",
    name: "talos-targetgroup"
})

/**
const tgattachment = new aws.lb.TargetGroupAttachment("tgattachment", {
    targetGroupArn: lbtarget.arn,
    targetId: "test",
    port: 80
})
*/