const fs = require('fs');
const path = require('path');

const directory = 'Custom Functions';
const outputPath = path.join(directory, 'README.md');
let markdown = '# Custom Function Overview\n\n';

fs.readdir(directory, (err, files) => {
	if (err) {
		console.error(err);
		return;
	}

	const fmfnFiles = files.filter(file => file.endsWith('.fmfn'));
	console.log('fmfnFiles', fmfnFiles);

	// create an index at the top of the file with links to each function overview in the same file
	fmfnFiles.forEach(file => {
		const filePath = path.join(directory, file);

		const content = fs.readFileSync(filePath, 'utf8');
		const matches = content.match(/===\n\s\*\s([^\n]+)/m);
		if (matches) {
			const functionPrototype = matches[1];
			let href = file.replace('.', '').toLowerCase();
			markdown += `- [${functionPrototype}](#${href})\n`;
		} else {
			markdown += `No function prototype found for: ${file}\n`;
		}
	});
	markdown += `\n`;

	// extract minimal script header from each function file
	fmfnFiles.forEach(file => {
		const filePath = path.join(directory, file);
		markdown += `\n## [${file}](${file})\n\n`;

		const content = fs.readFileSync(filePath, 'utf8');
		const scriptHeaderRegex = /\/\*\*(\*(?!\/)|[^*])*\*\//g;
		const matches = content.match(scriptHeaderRegex);
		if (matches) {
			const scriptHeader = matches[0];
			let minScriptHeader = scriptHeader//.replace(/ \* HISTORY\:.* \* \=/s, ' * =');
			minScriptHeader = minScriptHeader.replace(/ \* REFERENCES\:.* \* =/s, ' * =');
			minScriptHeader = minScriptHeader.replace(/ \* =+\n/g, '');
			markdown += `\`\`\`\n${minScriptHeader}\n\`\`\`\n`;
		}
	});

	fs.writeFileSync(outputPath , markdown, err => {
		if (err) console.error(err);
	});
});
