const getUser = async (req, res) => {
    res.status(200).send({ status: '200 Ok', message: 'Highway Line bot API' });
}

export {
    getUser
}