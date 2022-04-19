import { context } from "@actions/github";
import { RestEndpointMethods } from "@octokit/plugin-rest-endpoint-methods/dist-types/generated/method-types";

const labels: { [label: string]: string } = {
  support: "This is a support issue",
  hacks: "Hacks are not supported",
};

// Add a comment and close the issue when a specific label is present.
export async function labeled(
  github: RestEndpointMethods,
  issue_number: number,
  label: string
) {
  if (!labels[label]) {
    return;
  }

  const owner = context.repo.owner;
  const repo = context.repo.repo;

  await github.issues.createComment({
    owner,
    repo,
    issue_number,
    body: labels[label],
  });

  updateState(github, issue_number, "closed");
}

// Reopen a closed issue when the label is removed.
export async function unlabeled(
  github: RestEndpointMethods,
  issue_number: number,
  label: string
) {
  if (!labels[label]) {
    return;
  }

  updateState(github, issue_number, "open");
}

async function updateState(
  github: RestEndpointMethods,
  issue_number: number,
  state: "open" | "closed"
) {
  const owner = context.repo.owner;
  const repo = context.repo.repo;

  const issue = await github.issues.get({
    owner,
    repo,
    issue_number,
  });

  if (issue.data.state == state) {
    // Nothing to do.
    return;
  }

  await github.issues.update({
    owner,
    repo,
    issue_number,
    state: "open",
  });
}
