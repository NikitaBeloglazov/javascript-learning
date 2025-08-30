import fetch from 'node-fetch';
import { setTimeout } from 'timers/promises';

class Currency {
	// unix_latest_refresh: number = 0
	// rates: Object = {} // JSON with trade rates

	constructor(
		public name: String,
		public rates: Object, // JSON with trade rates
		public unix_latest_refresh: number,
	) { }

}

class CurrencyController {
	currencies: Object = {} // JSON with currencies classes
	allowed_time_laxity: number = -120 // 120 seconds allowed, after that - refresh

	public async get_rates(currency_name: string) {
		// console.log(this.currencies)
		if (currency_name in this.currencies) { // if currency already fetched
			const data_age = this.currencies[currency_name]["unix_latest_refresh"] - unix_time.get_now()
			if (data_age < this.allowed_time_laxity) {
				console.log(`Refreshing outdated currency: ${currency_name} (Age: ${data_age})`)
				await this.__refresh_rate(currency_name)
				return this.currencies[currency_name]
			}
			else { // if up-to-date
				console.log(`Returning up-to-date currency: ${currency_name} (Age: ${data_age})`)
				return this.currencies[currency_name]
			}

		}
		else {
			console.log(`Getting new currency: ${currency_name}`)
			await this.__refresh_rate(currency_name)
			return this.currencies[currency_name]
		}
	}

	private async __refresh_rate(currency_name: string) {
		// Getting rates json
		console.log(`FETCH: ${currency_name}`)
		const request = await make_request(currency_name)
		// console.log(request)
		const rates_json = request["rates"]
		const unix_latest_refresh = request["timestamp"] // already in unixtime

		this.currencies[currency_name] = new Currency(currency_name, rates_json, unix_latest_refresh)
	}

}

class UnixTime {
	public async to_data(unix_timestamp: number) {
		// Convert UNIX timestamp to human readable format (27/08/2025, 16.00.00)
		console.log(unix_timestamp)
		const date = new Date(unix_timestamp * 1000); // cause Date() uses non-unixtime for some reason // TODO make more compact?
		return date.toLocaleString();
	}

	public get_now(): number {
		// Get current unixtime
		return Number((new Date().getTime() / 1000).toFixed()) // Converting to number because .toFixed() for rouning numbers, returns STRING. WTF.
	}
}

const unix_time = new UnixTime()

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

async function exchange_rates_UI() {
	// console.log()

	let return_text = "\n\n- = Exchange rates\n"

	const UAH_data = await currency_controller.get_rates("UAH")
	const EUR_data = await currency_controller.get_rates("EUR")
	const USD_data = await currency_controller.get_rates("USD")

	return_text = return_text + `Server latest refresh: ${await unix_time.to_data(UAH_data.unix_latest_refresh)}\n\n`

	return_text = return_text + "- = Exchange course for UAH = -"
	return_text = return_text + `\n\nEUR:\nBuy: ${(1 / UAH_data["rates"]["EUR"]).toFixed(2)}\nSell: ${EUR_data["rates"]["UAH"].toFixed(2)}` // TODO

	return_text = return_text + `\n\nUSD:\nBuy: ${(1 / UAH_data["rates"]["USD"]).toFixed(2)}\nSell: ${USD_data["rates"]["UAH"].toFixed(2)}` // TODO
	return_text = return_text + `\n\n`

	console.log(return_text)
	return null
}

const currency_controller = new CurrencyController()

async function main() {
	while (true) {

		await exchange_rates_UI()

		for (let i = 0; i < 21; i++) { // refresh every 20 secs for cache check
			process.stdout.write(`\r\rWaiting ${i}/20 secs`);
			await setTimeout(1000) // ms
		}
	}
}

main() // trough main bcoz [typescript] Top-level 'await' expressions are only allowed when the 'module' option is set to ...
