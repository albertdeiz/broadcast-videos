import moment from 'moment'

export const generateMessage = (from, text) => {
	return {
		from,
		text,
		createdAt: moment.valueOf()
	}
}

export const generateLocationMessage = (from, lat, long) => {
	return {
		from,
		url: `https://google.com/maps?q=${lat},${long}`,
		createdAt: moment.valueOf()
	}
}

export default {
	generateMessage,
	generateLocationMessage
}
