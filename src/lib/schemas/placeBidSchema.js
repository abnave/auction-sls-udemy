const schema = {
    properties: {
        body: {
            type: 'object',
            properties: {
                amount: {
                    type: 'string'
                }
            },
            required: ['amount']
        }
    },
    required: ['body']
};

export default schema;
