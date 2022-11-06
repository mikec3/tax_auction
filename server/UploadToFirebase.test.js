const Firebase = require('./UploadToFirebase');

let testParcel = {
		'Basic' : {
			'PARCEL_NUM': '0001'
		},
		'Building' : {},
		'Tax' : {},
		'Location' : {},
		'Land' : {}

	};

test('Upload to Firebase', async () => {

	let res = await Firebase.upload('parcel_test',testParcel);

	console.log(res);
});

test('Read from Firebase', async () => {

	let res = await Firebase.read('parcel_test');

	res.forEach(doc => {
		expect(doc.data()).toStrictEqual(testParcel);
	})
});