import fetch from 'node-fetch';

async function main() {
	const response = await fetch('https://api.github.com/users/github');
	const data = await response.json();

	console.log(data);

	return 'Return';
}

main();
