import moment from "moment-timezone";
const { Octokit } = require("@octokit/rest");
const octokit = new Octokit({
	auth: "<github PAT>"
});
//const runParams = { owner: "control4", repo: "dealer-portal", ref: "develop", run_id: 95794734 };
//const workflowRun = octokit.actions.getWorkflowRun(runParams).then((data: any) => console.log(data));

octokit.request('GET /repos/:owner/:repo/actions/runs/:runId/jobs', {
	owner: "control4",
	repo: "dealer-portal",
	runId: 95794734
}).then((response: { data: any; }) => {
	const jobSteps = response.data.jobs[0].steps
	jobSteps.forEach((job: any) => {
		if (job.name === "Build") {
			var started_at = moment(job.started_at);
			var completed_at = moment(job.completed_at);
			var buildTime = moment.duration(completed_at.diff(started_at));
			console.log(`${buildTime.minutes()} minutes ${buildTime.seconds()} seconds`);
		}
	});
});