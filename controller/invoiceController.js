const Invoice = require("../model/Invoice.js")

module.exports = {
    getAllInvoice: async function(req,res) {
         
        try {
            const result = await Invoice.get(req,res)
            res.send(result)
        } catch(err) {
            res.status(500).send(err)
        }
    },

    getInvoiceById: async function(req,res) {
         
        try {
            const result = await Invoice.getById(req,res)
            res.send(result)
        } catch(err) {
            res.status(500).send(err)
        }
    },

    addInvoice: async function(req,res) {
            try {
                const result = await Invoice.add(req,res)
                res.send(result)
            } catch(err) {
                res.status(404).send(err)
            }
    },
    
    updateInvoice: async function(req,res) {
        try {
            const result = await Invoice.update(req,res)
            res.send(result)
        } catch(err) {
            res.status(404).send(err)
        }
    },

    removeInvoiceById: async function(req,res) {
        try {
            const result = await Invoice.removeById(req,res)
            res.send(result)
        } catch(err) {
            res.status(404).send(err)
        }
    },
}