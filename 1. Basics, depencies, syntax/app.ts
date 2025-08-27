import fetch from 'node-fetch';

async function unix_timestamp_to_data(unix_timestamp: number) {
	//

	// Create a new JavaScript Date object based on the timestamp
	// multiplied by 1000 so that the argument is in milliseconds, not seconds
	var date = new Date(unix_timestamp);

	return date.toLocaleString();
}

async function make_request(currency: string) {
	var request_response = await fetch(`https://api.fxratesapi.com/latest?base=${currency}`)
	var request_data = await request_response.json()
	if (request_data["success"] == false) {
		console.log(request_data)
		throw new Error(`API service said that request for currency "${currency}" was unsucceful. Try again later`)
	}
	else {
		return request_data
	}
}

async function main() {
	// let return_text = ""

	var UAH_data = await make_request('UAH')

	console.log(UAH_data)
	console.log(`The newest courses are dated as: ${await unix_timestamp_to_data(UAH_data["date"])}`)

	// const EUR_response = await fetch('https://api.fxratesapi.com/latest?base=EUR');
	// const EUR_data = await EUR_response.json();

	// console.log(EUR_data);

	// const USD_response = await fetch('https://api.fxratesapi.com/latest?base=USD');
	// const USD_data = await USD_response.json();

	// console.log(USD_data);

	// console.log(return_text)
	return null
}

main();
