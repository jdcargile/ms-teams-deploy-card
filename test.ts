import moment from "moment-timezone";
import fetch from "node-fetch";
const { Octokit } = require("@octokit/rest");
const octokit = new Octokit({
	auth: ""
});
//const runParams = { owner: "control4", repo: "dealer-portal", ref: "develop", run_id: 95794734 };
//const workflowRun = octokit.actions.getWorkflowRun(runParams).then((data: any) => console.log(data));

let buildTime = "";
octokit.request('GET /repos/:owner/:repo/actions/runs/:runId/jobs', {
	owner: "control4",
	repo: "dealer-portal",
	runId: 96460843
}).then((response: { data: any; }) => {
	const jobSteps = response.data.jobs[0].steps
	jobSteps.forEach((job: any) => {
		if (job.name === "Build") {
			var started_at = moment(job.started_at);
			var completed_at = moment(job.completed_at);
			var diff = moment.duration(completed_at.diff(started_at));
			buildTime = `${diff.minutes()} minutes ${diff.seconds()} seconds`;
			console.log("buildtime:", buildTime);
			sendMsTeamsNotification();
		}
	});
}).catch(console.error);

const sendMsTeamsNotification = () => {
	let summary = "TESTING"
	const sections = [
		{
			facts: [
				{
					name: "Build time:",
					value: buildTime.toString()
				},
			],
		}
	];
	let webhookUri = "https://outlook.office.com/webhook/a712bd3e-0764-4a9f-b4dc-5aa69ed0ace6@4c29b3ff-01bd-4c43-a437-a704414fe19f/IncomingWebhook/ac92dd40088d458fb2fea2b04a2cac3d/0b08de95-d01e-4d96-a86f-deacf8f978e7"
	fetch(webhookUri, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ summary, sections })
	})
		.then(() => {
			if (buildTime) {
				console.log("Build time:\n" + buildTime);
			}
		})
		.catch(console.error);
}