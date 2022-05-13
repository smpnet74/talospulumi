import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import { all } from "@pulumi/pulumi";

const talos_sg = new aws.ec2.SecurityGroup("talos-sg", {
    description: "Talos SG",
    egress: [{
        cidrBlocks: ["0.0.0.0/0"],
        fromPort: 0,
        protocol: "-1",
        toPort: 0,
    }],
    ingress: [
        {
            cidrBlocks: ["10.0.0.0/16"],
            fromPort: 6443,
            protocol: "tcp",
            toPort: 6443,
        },
        {
            cidrBlocks: ["10.0.0.0/16"],
            fromPort: 50000,
            protocol: "tcp",
            toPort: 50001,
        },
        {
            fromPort: 0,
            protocol: "-1",
            self: true,
            toPort: 0,
        },
    ],
    name: "talos-sg",
    vpcId: "vpc-0428a3d5adffb9c2e",
},
);

const talos_lb = new aws.alb.LoadBalancer("talos-lb", {
    accessLogs: {
        bucket: "",
    },
    ipAddressType: "ipv4",
    loadBalancerType: "network",
    name: "talos-lb",
    subnets: ["subnet-0489e5b67a8a23a6f"],
}, );

export const LoadbalancerDNS = talos_lb.dnsName
export const LoadbalancerARN = talos_lb.arn
export const SecuritygroupID = talos_sg.id
export const SGName = talos_sg.name
export const VPCid = talos_sg.vpcId