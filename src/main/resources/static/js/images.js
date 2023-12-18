const uploadImages = (apiKey, valueHolder, form) => {

    // event for image upload
    const client = filestack.init(apiKey);
    const options = {
        // only allow images to be uploaded, prevent other file types like videos
        accept: 'image/*',
        maxFiles: 10,
        onUploadDone:
            function (response) {
                let listOfImages = response.filesUploaded;
                let arrayOfImages = [];
                listOfImages.forEach( (image) => {
                    arrayOfImages.push(image.url);
                })
                valueHolder.value = arrayOfImages;
                form.submit();

            }
    };
    client.picker(options).open();

}

export {
    uploadImages
}