
import { ObjectId } from "mongodb"
import { dbService } from "../../services/db.service.js"
import { logger } from "../../services/logger.service.js"
import { utilService } from "../../services/util.service.js"



export const toyService = {
	remove,
	query,
	getById,
	add,
	update,
	addToyMsg,
	removeToyMsg,
}

async function query(filterBy, sortBy) {
	try {
		const criteria = _buildCriteria(filterBy)
		const collection = await dbService.getCollection('toy')
		var toys = await collection.find(criteria).sort(sortBy).toArray()
		return toys
	} catch (err) {
		logger.error('cannot find toys', err)
		throw err
	}
}
// function query(filterBy = {}, sortBy = {}, pageIdx) {
//     let filteredToys = toys
//     if (filterBy.name) {
//         const regExp = new RegExp(filterBy.name, 'i')
//         console.log('hello from quey back');
//         filteredToys = filteredToys.filter(toy => regExp.test(toy.name))
//     }
//     if (filterBy.inStock) {
//         filteredToys = filteredToys.filter(
//             toy => toy.inStock === JSON.parse(filterBy.inStock)
//         )
//     }
//     if (filterBy.labels && filterBy.labels.length) {
//         filteredToys = filteredToys.filter(toy =>
//             filterBy.labels.every(label => toy.labels.includes(label))
//         )
//     }
//     if (sortBy.type) {
//         filteredToys.sort((toy1, toy2) => {
//             const sortDirection = +sortBy.desc
//             if (sortBy.type === 'name') {
//                 return toy1.name.localeCompare(toy2.name) * sortDirection
//             } else if (sortBy.type === 'price' || sortBy.type === 'createdAt') {
//                 return (toy1[sortBy.type] - toy2[sortBy.type]) * sortDirection
//             }
//         })
//     }
//     if (pageIdx !== undefined) {
//         let startIdx = pageIdx * PAGE_SIZE
//         filteredToys = filteredToys.slice(startIdx, startIdx + PAGE_SIZE)
//     }
//     return Promise.resolve(filteredToys)
// }

async function getById(toyId) {
	try {
		const collection = await dbService.getCollection('toy')
		const toy = await collection.findOne({ _id: ObjectId.createFromHexString(toyId) })
		toy.createdAt = toy._id.getTimestamp()
		return toy
	} catch (err) {
		logger.error(`while finding toy ${toyId}`, err)
		throw err
	}
}

async function remove(toyId) {
	try {
		const collection = await dbService.getCollection('toy')
		const { deletedCount } = await collection.deleteOne({ _id: ObjectId.createFromHexString(toyId) })
		return deletedCount
	} catch (err) {
		logger.error(`cannot remove toy ${toyId}`, err)
		throw err
	}
}

async function add(toy) {
	try {
		const collection = await dbService.getCollection('toy')
		await collection.insertOne(toy)
		return toy
	} catch (err) {
		logger.error('cannot insert toy', err)
		throw err
	}
}

async function update(toy) {
	try {
		const toyToSave = {
			name: toy.name,
			price: toy.price,
		}
		const collection = await dbService.getCollection('toy')
		await collection.updateOne({ _id: ObjectId.createFromHexString(toy._id) }, { $set: toyToSave })
		return toy
	} catch (err) {
		logger.error(`cannot update toy ${toy}`, err)
		throw err
	}
}

async function addToyMsg(toyId, msg) {
	try {
		msg.id = utilService.makeId()

		const collection = await dbService.getCollection('toy')
		await collection.updateOne({ _id: ObjectId.createFromHexString(toyId) }, { $push: { msgs: msg } })
		return msg
	} catch (err) {
		logger.error(`cannot add toy msg ${toyId}`, err)
		throw err
	}
}

async function removeToyMsg(toyId, msgId) {
	try {
		const collection = await dbService.getCollection('toy')
		await collection.updateOne({ _id: ObjectId.createFromHexString(toyId) }, { $pull: { msgs: { id: msgId } } })
		return msgId
	} catch (err) {
		logger.error(`cannot remove toy msg ${toyId}`, err)
		throw err
	}
}

function _buildCriteria(filterBy) {
	console.log('filterBy:', filterBy);
	const { labels, txt, status } = filterBy

	const criteria = {}

	if (txt) {
		criteria.name = { $regex: txt, $options: "i" }
	}

	if (labels && labels.length) {
		criteria.labels = { $in: labels }
	}

	if (status) {
		criteria.inStock = status === "true" ? true : false
	}

	return criteria
}