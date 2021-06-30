import * as core from "@actions/core";
import { getOctokit } from "@actions/github";
import { yarnUpdateBase } from "./yarn-update-base";

async function main(): Promise<void> {
  const token = core.getInput("github-token", { required: true });
  const context = core.getInput("context", { required: true });

  const github = getOctokit(token, {});

  switch (context) {
    case "yarn-update-base":
      yarnUpdateBase(
        github.rest,
        parseInt(core.getInput("issue-number", { required: true }))
      );
      break;
    default:
      return;
  }
}
