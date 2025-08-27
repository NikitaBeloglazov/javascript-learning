import fetch from 'node-fetch';

async function unix_timestamp_to_data(unix_timestamp: number) {
	// Convert UNIX timestamp to human readable format (27/08/2025, 16.00.00)
	const date = new Date(unix_timestamp);
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
	let return_text = "- = Exchange rates\n"

	const UAH_data = await make_request('UAH')

	// console.log(UAH_data)
	// console.log()
	return_text = return_text + `Server latest refresh: ${await unix_timestamp_to_data(UAH_data["date"])}\n\n`

	const EUR_data = await make_request('EUR')
	console.log(EUR_data);

	const USD_data = await make_request('USD');
	console.log(USD_data);

	return_text = return_text + "- = Exchange course for UAH = -"
	return_text = return_text + `\n\nEUR:\nBuy: ${(1 / UAH_data["rates"]["EUR"]).toFixed(2)}\nSell: ${EUR_data["rates"]["UAH"].toFixed(2)}` // TODO

	return_text = return_text + `\n\nUSD:\nBuy: ${(1 / UAH_data["rates"]["USD"]).toFixed(2)}\nSell: ${USD_data["rates"]["UAH"].toFixed(2)}` // TODO

	console.log(return_text)
	return null
}

main();
