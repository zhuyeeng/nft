const main = require('./GetData');

async function testFunction(){
	const items_data = [];
	try{
		const result = await main();
		// console.log(result);

		for(const item of result){
			const formattedData = {
				id: item.id,
				description: item.description,
				image: item.image,
				name: item.name,
				ownerName: item.ownerAddress,
				title: 'something',
				price: 1.55,
				like: 160,
				creatorImage: item.image,
				ownerImage: item.image,
				creatorName: 'hello',
				auction_timer: '636234213',
				text: 'Lorum',
			};
			items_data.push(formattedData);
		}
		return;
	}catch(error){
		console.log('Error Message:', error.message);

	}
	// console.log(items_data);
	return items_data;
}

// export {items_data};