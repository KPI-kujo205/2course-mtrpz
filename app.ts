import { readFileSync } from "fs";
import * as process from "process";
import { TPreformattedEntry, TTagMatch } from "./types";
import minimist from "minimist";
import * as console from "console";

function main() {
	const pathToFile = getFilePath();
	const fileContent = readFileSync(pathToFile).toString();

	const html = parseMarkdown(fileContent);

	console.log(html);
}

function getFilePath() {
	const args = minimist(process.argv.slice(2));

	if (args._.length === 0) {
		throw new Error("Error: no input file specified!");
	}

	if (args._.length > 1) {
		throw new Error("Error: too many input files specified!");
	}

	return args._[0] as string;
}

function parseMarkdown(markdown: string) {
	let formattedMarkdown = markdown;
	const preformattedEntries: TPreformattedEntry[] = [];

	formattedMarkdown = replacePreformattedEntries(
		formattedMarkdown,
		preformattedEntries,
	);

	const tagMatches = getTagMatches(formattedMarkdown);

	return formattedMarkdown;
}

function replacePreformattedEntries(
	markdown: string,
	preformattedEntries: TPreformattedEntry[],
) {
	return markdown.replace(/(`+)([^`]+)\1/g, (match) => {
		preformattedEntries.push({
			index: preformattedEntries.length + 1,
			value: match,
		});
		return `@pre${preformattedEntries.length}`;
	});
}
function getTagMatches(markdown: string) {
	let match: RegExpExecArray | null;

	const matches: TTagMatch[] = [];

	const regex = /(\*\*|_|`)/g;

	while ((match = regex.exec(markdown)) !== null) {
		matches.push({ entry: match[0], index: match.index });
	}

	return matches;
}

try {
	main();
} catch (e) {
	console.error(e);
	process.exit(1);
}
