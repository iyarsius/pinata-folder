const axios = require('axios');
const fs = require('graceful-fs');
const FormData = require('form-data');
const recursive = require('recursive-fs');

module.exports.pinFolder = async (key, secret, path, options = {}) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

    //we gather the files from a local directory in this example, but a valid readStream is all that's needed for each file in the directory.
    recursive.readdirr(path, async function (err, dirs, files) {
        let data = new FormData();
        files.forEach((file) => {
            const fileName = file.split("/").pop();
            const ext = "." + fileName.split(".").pop()
            const finalName = options.removeExt ? fileName.replace(ext, "") : fileName

            //for each file stream, we need to include the correct relative file path
            data.append(`file`, fs.createReadStream(file), {
                filepath: `${dirs}/${finalName}`
            });
        });

        const metadata = JSON.stringify({
            name: options.folderName ? folderName : "folder",
        });
        data.append('pinataMetadata', metadata);

        return axios.post(url, data, {
            maxBodyLength: 'Infinity', // this is needed to prevent axios from erroring out with large directories
            headers: {
                'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                pinata_api_key: key,
                pinata_secret_api_key: secret
            }
        })
            .then(function (response) {
                return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`
            })
            .catch(function (error) {
                throw error
            });
    });
};
