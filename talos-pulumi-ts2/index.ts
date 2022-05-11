import * as pulumi from "@pulumi/pulumi";
import { local } from "@pulumi/command";
import { interpolate } from "@pulumi/pulumi";

const config = new pulumi.Config();
const stack = pulumi.getStack();
const org = config.require("org");

const stackRef = new pulumi.StackReference(`${org}/talos-pulumi-ts/${stack}`);

const LoadbalancerDNS = stackRef.getOutput("LoadbalancerDNS");


const talosuserdata = new local.Command("talosuserdata", {
    create: interpolate `talosctl gen config talos-k8s-aws-tutorial https://${LoadbalancerDNS} --with-examples=false --with-docs=false --output-dir=./talosconfig`
    });