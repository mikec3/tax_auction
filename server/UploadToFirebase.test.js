const Firebase = require('./UploadToFirebase');

test('Upload to Firebase', async () => {

	let testParcel = {
			'Basic' : {
				'PARCEL_NUM': '0001'
			},
			'Building' : {},
			'Tax' : {},
			'Location' : {},
			'Land' : {}

		};

	let res = await Firebase.upload(testParcel);

	console.log(res);
});