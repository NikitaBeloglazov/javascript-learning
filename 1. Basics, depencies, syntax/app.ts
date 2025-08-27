import fetch from 'node-fetch';

async function main() {
	const UAH_response = await fetch('https://api.fxratesapi.com/latest?base=UAH');
	const UAH_data = await UAH_response.json();

	console.log(UAH_data["date"]);
	console.log(`The newest courses are dated as: ${UAH_data["date"]}`);

	// const EUR_response = await fetch('https://api.fxratesapi.com/latest?base=EUR');
	// const EUR_data = await EUR_response.json();

	// console.log(EUR_data);

	// const USD_response = await fetch('https://api.fxratesapi.com/latest?base=USD');
	// const USD_data = await USD_response.json();

	// console.log(USD_data);

	return '1';
}

main();
